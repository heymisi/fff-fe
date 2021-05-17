import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { City } from 'src/app/common/city';
import { Facility } from 'src/app/common/facility';
import { FilterEvent } from 'src/app/common/filter-event';
import { Sport } from 'src/app/common/sport';
import { FacilityService } from 'src/app/services/facility.service';
import { FormService } from 'src/app/services/form.service';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.css']
})
export class FacilityListComponent implements OnInit {
  facilityFormGroup: FormGroup;
  progressBarVisible: boolean = false;

  //search
  searchMode: boolean = false;
  previousKeyword: string = null;

  //pagination
  pageNumber: number = 1;
  pageSize: number = 9;
  totalElements: number = 0;
  selectedPageSize: any;

  cities: String[] = [];
  sports: Sport[] = [];
  facilites: Facility[] = [];
  selectedSport: string = null;

  weekDaysNameAndNumber: any[] = [
    { "day": "Hétfő", "number": 1 },
    { "day": "Kedd", "number": 2 },
    { "day": "Szerda", "number": 3 },
    { "day": "Csütörtök", "number": 4 },
    { "day": "Péntek", "number": 5 },
    { "day": "Szombat", "number": 6 },
    { "day": "Vasárnap", "number": 0 }
  ]

  //autocomplete 
  filteredCities: Observable<String[]>;
  constructor(private formBuilder: FormBuilder,
    private sportService: SportService,
    private formService: FormService,
    private facilityService: FacilityService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.progressBarVisible = true;
    this.facilityFormGroup = this.formBuilder.group({
      search: this.formBuilder.group({
        city: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        name: new FormControl('')
      })
    });
    this.listSportCategories();
    this.listCities();
    this.listFacilites();

    this.filteredCities = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }
  get city() { return this.facilityFormGroup.get('search.city'); }
  get name() { return this.facilityFormGroup.get('search.name'); }


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

  listFacilites() {
    this.facilityService.getFacilitiesWithFilter(this.pageNumber - 1,
      this.pageSize,
      this.name.value,
      this.city.value,
      this.selectedSport
    ).subscribe(
      this.proccessResult())
  }

  handleFacilitySportFilter(sport: any) {
    this.selectedSport = sport.name;
    this.listFacilites();
  }

  proccessResult() {
    return data => {
      this.facilites = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
      data.content.forEach(facility => {
        facility.openingHours.forEach(openingHour => {
          this.weekDaysNameAndNumber.forEach(day => {
            if (openingHour.day === day.day) {
              if ((day.number === (new Date()).getDay()) &&
                (openingHour.openTime <= (new Date()).getHours()) &&
                ((new Date()).getHours() <= openingHour.closeTime)) {
                facility.isOpenNow = true;
              }
            }
          })
        })
      })
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
    this.listFacilites();
  }
}
