import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TrainingSession } from 'src/app/common/training-session';
import { User } from 'src/app/common/user';
import { InstructorService } from 'src/app/services/instructor.service';
import { TrainingSessionService } from 'src/app/services/training-session.service';

@Component({
  selector: 'app-user-training-sessions',
  templateUrl: './user-training-sessions.component.html',
  styleUrls: ['./user-training-sessions.component.css']
})
export class UserTrainingSessionsComponent implements OnInit {

  trainingSessions: TrainingSession[];
  user: User = null;
  constructor(private trainingSessionService: TrainingSessionService,
    private instructorService: InstructorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
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

  ngOnInit(): void {
    this.getTrainingSessions();
  }

  getTrainingSessions() {
    this.authService.getUser().pipe(concatMap(user => {
      this.user = user;
      return new Promise(resolve => setTimeout(() => resolve(user), 500));
    })).subscribe(value => {
      this.trainingSessionService.getTrainingSessionByUser(+this.user.id).pipe(concatMap(
        data => {
          this.trainingSessions = data;
          return new Promise(resolve => setTimeout(() => resolve(data), 500));
        })).subscribe((value: any) => {
          this.instructorService.getInstructors().subscribe(data => {
            data.content.forEach(instructor => {
              this.trainingSessions.forEach(session => {
                if (session.instructor === instructor.id) {
                  session.instructor = instructor;
                }
              })
            })
            this.weekDays.forEach(weekday => {
              this.trainingSessions.forEach(session => {
                if (session.day === weekday.day) {
                  weekday.counter += 1;
                  weekday.value.push(session);
                }
              })
            })
            this.sortTrainingSessions();
          })
        })
    })
  }

  sortTrainingSessions() {
    this.weekDays.forEach(weekday => {
      weekday.value.sort((a, b) => (a.sessionStart > b.sessionStart) ? 1 : ((b.sessionStart > a.sessionStart) ? -1 : 0))
    })
  }

  deleteTrainingSession(trainingSession: TrainingSession) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy le szeretné mondani ezt az edzést?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainingSessionService.deleteTrainingSessionForUser(+this.user.id, trainingSession.id).subscribe(
        )
        this.trainingSessions = this.trainingSessions.filter(val => val.id !== trainingSession.id);
        this.messageService.add({ severity: 'success', summary: 'Lemondva', detail: 'Sikeresen lemondtad ezt az edzést ', life: 3000 });
        location.reload();
      }
    });
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
