import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { Instructor } from 'src/app/common/instructor';
import { Transaction } from 'src/app/common/transaction';
import { User } from 'src/app/common/user';
import { FacilityService } from 'src/app/services/facility.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-instructors',
  templateUrl: './admin-instructors.component.html',
  styleUrls: ['./admin-instructors.component.css']
})
export class AdminInstructorsComponent implements OnInit {
  first = 0;
  rows = 10;
  loading: boolean = true;
  instructors: Instructor[] = [];
  constructor(
    private instructorService: InstructorService,
    private facilityService: FacilityService) { }

  ngOnInit(): void {
    this.listUsers();
  }
  listUsers() {
    this.instructorService.getInstructors().pipe(concatMap(
      data => {
        this.instructors = data.content;
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
      })).subscribe((value: any) => {
        this.facilityService.getFacilites().subscribe(facilities => {
          facilities.content.forEach(facility => {
            for (let i = 0; i < this.instructors.length; i++) {
              if (this.instructors[i].sportFacility === facility.id) {
                this.instructors[i].sportFacility = facility;
              }
            }
          })
          this.loading = false;
        })
      })
  }
  scrollUp() {
    window.scroll(0, 0);
  }
}
