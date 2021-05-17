import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Instructor } from 'src/app/common/instructor';
import { TrainingSession } from 'src/app/common/training-session';
import { User } from 'src/app/common/user';
import { InstructorService } from 'src/app/services/instructor.service';
import { TrainingSessionService } from 'src/app/services/training-session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-instructor-profile-sessions',
  templateUrl: './instructor-profile-sessions.component.html',
  styleUrls: ['./instructor-profile-sessions.component.css']
})
export class InstructorProfileSessionsComponent implements OnInit {
  sessionFormGroup: FormGroup;
  addDialog: boolean;
  instructor: Instructor;
  trainingSessions: TrainingSession[];
  user: User = null;
  constructor(private trainingSessionService: TrainingSessionService,
    private instructorService: InstructorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  weekDays: any[] = [
    { "day": "Hétfő", "counter": 0, "value": [] },
    { "day": "Kedd", "counter": 0, "value": [] },
    { "day": "Szerda", "counter": 0, "value": [] },
    { "day": "Csütörtök", "counter": 0, "value": [] },
    { "day": "Péntek", "counter": 0, "value": [] },
    { "day": "Szombat", "counter": 0, "value": [] },
    { "day": "Vasárnap", "counter": 0, "value": [] }
  ]
  sessionTypes: String[] = [
    "Személyi edzés", "Csoportos edzés"
  ]
  ngOnInit(): void {
    this.getUser();
    this.sessionFormGroup = this.formBuilder.group({
      weekDay: new FormControl('', [Validators.required]),
      sessionStart: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
      sessionEnd: new FormControl('', [Validators.required, Validators.min(0), Validators.max(23)]),
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      type: new FormControl('', [Validators.required]),
      clientNumber: new FormControl('', [Validators.required, Validators.min(1)]),
      occasionPrice: new FormControl('', [Validators.required, Validators.min(1)]),
      monthlyPrice: new FormControl('', [Validators.required, Validators.min(1)]),
    })
  }

  get weekDay() { return this.sessionFormGroup.get('weekDay'); }
  get sessionStart() { return this.sessionFormGroup.get('sessionStart'); }
  get sessionEnd() { return this.sessionFormGroup.get('sessionEnd'); }
  get name() { return this.sessionFormGroup.get('name'); }
  get type() { return this.sessionFormGroup.get('type'); }
  get clientNumber() { return this.sessionFormGroup.get('clientNumber'); }
  get occasionPrice() { return this.sessionFormGroup.get('occasionPrice'); }
  get monthlyPrice() { return this.sessionFormGroup.get('monthlyPrice'); }

  getUser() {
    this.authService.getUser().pipe(concatMap(user => {
      this.user = user;
      return new Promise(resolve => setTimeout(() => resolve(user), 500));
    })).subscribe((value: any) => {
      this.instructorService.getInstructorByUser(+this.user.id).subscribe(
        inst => {
          this.instructor = inst.payload;
          this.getTrainingSessions();
        }
      )
    });
  }

  getTrainingSessions() {
    this.trainingSessionService.getTrainingSessionByInstructor(this.instructor.id).pipe(concatMap(
      data => {
        this.trainingSessions = data;
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      })).subscribe((value: any) => {
        this.userService.getUsers().subscribe(data => {
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.trainingSessions.length; j++) {
              for (let k = 0; k < this.trainingSessions[j].client.length; k++) {
                if (this.trainingSessions[j].client[k] === data[i].id) {
                  this.trainingSessions[j].client[k] = data[i];
                }
              }
            }
          }
        })
        this.weekDays.forEach(weekday => {
          this.trainingSessions.forEach(session => {
            if (session.day === weekday.day) {
              weekday.counter += 1;
              weekday.value.push(session);
            }
          })
        }
        )
        this.sortTrainingSessions();
      })
  }

  sortTrainingSessions() {
    this.weekDays.forEach(weekday => {
      weekday.value.sort((a, b) => (a.sessionStart > b.sessionStart) ? 1 : ((b.sessionStart > a.sessionStart) ? -1 : 0))
    })
  }
  
  deleteTrainingSession(trainingSession: TrainingSession) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy törölni szeretné ezt az edzést?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainingSessionService.deleteTrainingSession(trainingSession.id).subscribe()
        this.trainingSessions = this.trainingSessions.filter(val => val.id !== trainingSession.id);
        this.weekDays.forEach(weekDay => {
          if (weekDay.day === trainingSession.day) {
            weekDay.value = weekDay.value.filter(val => val.id !== trainingSession.id);
          }
        })
        this.messageService.add({ severity: 'success', summary: 'Törölve', detail: 'Sikeresen törölted ezt az edzést ', life: 3000 });
      }
    });
  }

  addSessionDialogOpen() {
    this.addDialog = true;
  }

  addSession() {
    if (this.sessionFormGroup.invalid) {
      this.sessionFormGroup.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Kérjük töltse ki a piros mezőket!', life: 5000 });
      return;
    }
    if (this.type.value === "Csoportos edzés") {
      if (this.clientNumber.value === 1) {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Csoportos edzés esetén legalább 2 kell legyen a résztevők száma!', life: 5000 });
        return;
      }
    }
    let sessionToSave: TrainingSession = new TrainingSession(this.name.value, this.type.value, this.weekDay.value, this.sessionStart.value, this.sessionEnd.value
      , this.monthlyPrice.value, this.occasionPrice.value, this.clientNumber.value
    );
    this.trainingSessionService.saveTrainingSession(this.instructor.id, sessionToSave).subscribe(
      data => {
        if (data.payload === "SESSION_TIME_ALREADY_OCCUPIED") {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Erre az időpontra van már edzése regisztrálva!', life: 5000 });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Sikeresen hozzá lett ez az edzés időpnt adva!', life: 5000 });
          this.trainingSessions.push(data.payload)
          this.weekDays.forEach(weekday => {
            if (weekday.day === data.payload.day) {
              weekday.counter += 1;
              weekday.value.push(data.payload);
            }
          })
          this.sortTrainingSessions();
          this.sessionFormGroup.reset();
          this.hideDialog();
        }
      }
    )
  }

  hideDialog() {
    this.addDialog = false;
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy ki szeretne lépni?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.signOut();
        this.messageService.add({ severity: 'success', summary: 'Kijelentkezve', detail: `Várjuk vissza`, life: 1000 });
        setTimeout(() => {
          this.router.navigateByUrl("/home")
            .then(() => {
              window.location.reload();
            });
        }, 1000);
      },
      key: "logoutDialog"
    });
  }

}
