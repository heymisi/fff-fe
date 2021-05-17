import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CommentRequestModel } from 'src/app/common/comment-request-model';
import { Facility } from 'src/app/common/facility';
import { Instructor } from 'src/app/common/instructor';
import { Sport } from 'src/app/common/sport';
import { TrainingSessionDetails } from 'src/app/common/training-session-details';
import { User } from 'src/app/common/user';
import { FacilityService } from 'src/app/services/facility.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-instructor-details',
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.css']
})
export class InstructorDetailsComponent implements OnInit {
  instructor: Instructor = null;
  facility: Facility = null;
  sports: Sport[] = [];
  commentForm: FormGroup;
  submitted: Boolean = false;
  isLoggedIn: Boolean = false;
  user: User = null;
  constructor(private route: ActivatedRoute,
    private instructorService: InstructorService,
    private utilService: UtilService,
    private facilityService: FacilityService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoggedInCheck();
    this.getUser();
    this.createForm();
    this.getInstructor();
  }

  getInstructor() {
    const instructorId: number = +this.route.snapshot.paramMap.get('id');
    this.instructorService.getInstructor(instructorId).pipe(concatMap(
      data => {
        this.instructor = data.payload;
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      }
    )).subscribe((value: any) => {
      this.userService.getUsers().subscribe(data => {
        data.forEach(user => {
          for (let i = 0; i < this.instructor.comments.length; i++) {
            if (this.instructor.comments[i].commenter === user.id) {
              this.instructor.comments[i].commenter = user;
            }
          }
        })
      })
      if (value.payload.sportFacility) {
        this.facilityService.getFacility(value.payload.sportFacility).subscribe(
          data => {
            this.facility = data.payload;
          }

        )
      }
    })
  }

  onFacilityClick() {
    window.scroll(0, 0);
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
      this.instructorService.addComment(+this.instructor.id, comment).subscribe(data => {
        if (data.payload === "ALREADY_COMMENTED") {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Ezt az oktatót egyszer már értékelted!', life: 5000 });
        } else {

          this.messageService.add({ severity: 'success', summary: 'Értékelés hozzá lett adva', detail: 'Köszönjük értékelését', life: 5000 });
          this.route.paramMap.subscribe(() => {
            this.getInstructor();
          })
        }
        this.commentForm.reset();
        this.message.setErrors(null);
        this.rate.setErrors(null);
      });
    }
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
}
