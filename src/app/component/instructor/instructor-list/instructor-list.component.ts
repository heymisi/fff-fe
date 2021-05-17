import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Instructor } from 'src/app/common/instructor';
import { Sport } from 'src/app/common/sport';
import { FormService } from 'src/app/services/form.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.css']
})
export class InstructorListComponent implements OnInit {
  instructorFormGroup: FormGroup;
  progressBarVisible: boolean = false;

  searchMode: boolean = false;
  previousKeyword: string = null;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  selectedPageSize: any;

  filteredCities: Observable<String[]>;

  cities: String[] = [];
  sports: Sport[] = [];
  selectedSport: string = null;
  instructors: Instructor[] = [];

  constructor(private formBuilder: FormBuilder,
    private sportService: SportService,
    private formService: FormService,
    private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.progressBarVisible = true;
    this.instructorFormGroup = this.formBuilder.group({
      search: this.formBuilder.group({
        city: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        name: new FormControl('', Validators.required)
      })
    });

    this.listSportCategories();
    this.listCities();
    this.listInstructors();
    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }
  get city() { return this.instructorFormGroup.get('search.city'); }
  get name() { return this.instructorFormGroup.get('search.name'); }

  listSportCategories() {
    this.sportService.getSport().subscribe(
      data => {
        this.sports = data;
      }
    )
  }
  listCities() {
    this.formService.getCities().subscribe(
      data => {
        data.forEach(value => this.cities.push(value.cityName));
      }
    );
  }

  listInstructors() {
    this.instructorService.getInstructorsWithFilter(this.pageNumber - 1,
      this.pageSize,
      this.name.value,
      this.city.value,
      this.selectedSport).subscribe(
        this.proccessResult())
  }

  proccessResult() {
    return data => {
      this.instructors = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
      this.progressBarVisible = false;
    }
  }

  private _filter(value: string,): String[] {
    if (value === "") {
      return this.cities;
    }
    const filterValue = value.toLowerCase();
    return this.cities.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listInstructors();
  }

  handleSearchInstructorBySport(sport: any) {
    this.selectedSport = sport.name;
    this.listInstructors();
  }
}
