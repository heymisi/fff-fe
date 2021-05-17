import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentRequestModel } from 'src/app/common/comment-request-model';
import { Facility } from 'src/app/common/facility';
import { FacilityPricing } from 'src/app/common/facility-pricing';
import { Instructor } from 'src/app/common/instructor';
import { OpeningHours } from 'src/app/common/opening-hours';
import { Sport } from 'src/app/common/sport';
import { User } from 'src/app/common/user';
import { FacilityService } from 'src/app/services/facility.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.css']
})
export class FacilityDetailsComponent implements OnInit {
  facility: Facility = null;
  openingHours: OpeningHours[] = [];
  sports: Sport[] = [];
  instructors: Instructor[] = [];
  pricings: FacilityPricing[] = [];
  now: string;
  isOpen: boolean;
  commentForm: FormGroup;
  submitted: Boolean = false;
  isLoggedIn: Boolean = false;
  user: User = null;
  
  weekDaysNameAndNumber: any[] = [
    { "day": "Hétfő", "number": 1 },
    { "day": "Kedd", "number": 2 },
    { "day": "Szerda", "number": 3 },
    { "day": "Csütörtök", "number": 4 },
    { "day": "Péntek", "number": 5 },
    { "day": "Szombat", "number": 6 },
    { "day": "Vasárnap", "number": 0 }
  ]
  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private instructorService: InstructorService,
    private authService: AuthService
  ) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1)

  }

  ngOnInit(): void {
    this.isLoggedInCheck();
    this.getUser();
    this.getFacility();
    this.createForm();
    var today = (new Date()).getDay();
    var hour = (new Date()).getHours();
  }

  isLoggedInCheck() {
    if (this.authService.isLoggedIn()) this.isLoggedIn = true;
  }

  getUser() {
    if (this.isLoggedIn) {
      this.authService.getUser().subscribe(data => {
        this.user = data;
      })
    }
  }

  getFacility() {
    const facilityId: number = +this.route.snapshot.paramMap.get('id');
    this.facilityService.getFacility(facilityId).pipe(concatMap(
      data => {
        this.facility = data.payload;
        this.openingHours = data.payload.openingHours
        this.sports = data.payload.availableSports;
        this.instructors = data.payload.instructors;
        this.pricings = data.payload.pricing;
        this.isOpen = this.isOpenRightNow();
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      }
    )).subscribe((value: any) => {
      this.userService.getUsers().subscribe(data => {
        data.forEach(user => {
          for (let i = 0; i < this.facility.comments.length; i++) {
            if (this.facility.comments[i].commenter === user.id) {
              this.facility.comments[i].commenter = user;
            }
          }
        })
      })
      this.instructorService.getInstructors().subscribe(data => {
        data.content.forEach(inst => {
          for (let i = 0; i < this.facility.instructors.length; i++) {
            if (this.facility.instructors[i] === inst.id) {
              this.facility.instructors[i] = inst;
            }
          }
        })
      })
    })
  }
  isOpenRightNow(): boolean {
    for (let day = 0; day < this.facility.openingHours.length; day++) {
      for (let dayHelper = 0; dayHelper < this.weekDaysNameAndNumber.length; dayHelper++) {
        if (this.facility.openingHours[day].day === this.weekDaysNameAndNumber[dayHelper].day) {
          if ((this.weekDaysNameAndNumber[dayHelper].number === (new Date()).getDay()) &&
            (this.facility.openingHours[day].openTime <= (new Date()).getHours()) &&
            ((new Date()).getHours() <= this.facility.openingHours[day].closeTime)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      rate: ['', [Validators.required]]
    });
  }

  get message() { return this.commentForm.get('message'); }
  get rate() { return this.commentForm.get('rate'); }

  onComment() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      return false;
    } else {
      let comment = new CommentRequestModel(this.message.value, this.rate.value, +this.user.id)
      this.facilityService.addComment(+this.facility.id, comment).subscribe(data => {
        if (data.payload === "ALREADY_COMMENTED") {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Ezt a sportlétesítményt egyszer már értékelted!', life: 5000 });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Értékelés hozzá lett adva', detail: 'Köszönjük értékelését', life: 5000 });
          this.getFacility();
        }
        this.commentForm.reset();
        this.message.setErrors(null);
        this.rate.setErrors(null);
      });

    }
  }
}
