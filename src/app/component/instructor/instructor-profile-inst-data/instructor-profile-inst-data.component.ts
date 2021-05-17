import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { City } from 'src/app/common/city';
import { Facility } from 'src/app/common/facility';
import { Instructor } from 'src/app/common/instructor';
import { InstructorRequest } from 'src/app/common/instructor-request';
import { InstructorResponse } from 'src/app/common/instructor-response';
import { Sport } from 'src/app/common/sport';
import { User } from 'src/app/common/user';
import { FacilityService } from 'src/app/services/facility.service';
import { FormService } from 'src/app/services/form.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { SportService } from 'src/app/services/sport.service';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-instructor-profile-inst-data',
  templateUrl: './instructor-profile-inst-data.component.html',
  styleUrls: ['./instructor-profile-inst-data.component.css']
})
export class InstructorProfileInstDataComponent implements OnInit {
  user: User = null;
  instructor: Instructor = null;
  sports: Sport[];
  facilities: Facility[];

  constructor(private instructorService: InstructorService,
    private sportService: SportService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private facilityService: FacilityService,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getSports();
    this.getFacilities();

  }

  getUser() {
    this.authService.getUser().pipe(concatMap(user => {
      this.user = user;
      return new Promise(resolve => setTimeout(() => resolve(user), 500));
    })).subscribe((value: any) => {
      this.instructorService.getInstructorByUser(+this.user.id).pipe(concatMap(
        data => {
          this.instructor = data.payload;
          return new Promise(resolve => setTimeout(() => resolve(data), 500));
        })).subscribe((value: any) => {
          this.facilityService.getFacilites().subscribe(facilityData => {
            facilityData.content.forEach(facility => {
              if (this.instructor.sportFacility === facility.id) {
                this.instructor.sportFacility = facility;
              }
            })
          })
        })
    })
  }



  getSports() {
    this.sportService.getSport().subscribe(
      data => {
        this.sports = data;
      }
    )
  }
  
  getFacilities() {
    this.facilityService.getFacilites().subscribe(
      data => {
        this.facilities = data.content;
      }
    )
  }

  modifyInstructor() {
    let instructorRespone = new InstructorResponse();
    instructorRespone.bio = this.instructor.bio;
    instructorRespone.title = this.instructor.title;
    instructorRespone.sportFacility = +this.instructor.sportFacility.id;
    this.instructor.knownSports.forEach(sport => {
      instructorRespone.knownSports.push(sport.id);
    })

    this.instructorService.modifyInstructor(this.instructor.id, instructorRespone).subscribe(
      data => {
        this.messageService.add({ severity: 'success', summary: 'Sikeres módosítás', detail: 'A megadott adatokat felülírása sikeresen megtörtént!', life: 5000 });
      }
    )
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
