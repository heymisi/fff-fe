import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { City } from 'src/app/common/city';
import { Facility } from 'src/app/common/facility';
import { Instructor } from 'src/app/common/instructor';
import { OpeningHours } from 'src/app/common/opening-hours';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSave } from 'src/app/common/product-save';
import { Sport } from 'src/app/common/sport';
import { FacilityService } from 'src/app/services/facility.service';
import { FormService } from 'src/app/services/form.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { ProductService } from 'src/app/services/product.service';
import { SportService } from 'src/app/services/sport.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-admin-facilites',
  templateUrl: './admin-facilites.component.html',
  styleUrls: ['./admin-facilites.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AdminFacilitesComponent implements OnInit {
  facilites: Facility[] = [];
  facilityDialog: boolean;
  facility: Facility;
  selectedFacility: Facility[];
  submitted: boolean;
  first = 0;
  rows = 10;
  loading: boolean = true;
  uploadedFiles: any[] = [];
  customUpload = true;
  selectedFile: File = null;
  selectedMapFile: File = null;
  sports: Sport[] = [];
  instructors: Instructor[] = [];
  instructorsForSearch: Instructor[] = [];
  instructorsLabel: any[] = [];
  instructorsLabelCounterForDelete: number = 0;
  selectedSports: string[];
  openingHours: OpeningHours[];
  cities: City[];

  weekdays: any[] = [];
  pricing: any[] = [

  ]
  constructor(private facilityService: FacilityService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sportService: SportService,
    private instructrService: InstructorService,
    private formService: FormService) { }

  ngOnInit(): void {
    this.setUpPricing();
    this.setUpWeekdays();
    this.listInstructors();
    this.listSportCategories();
    this.listCities();
  }

  listFacilites() {
    this.facilityService.getFacilites().subscribe(
      data => {
        this.facilites = data.content;
        this.instructorsForSearch.forEach(instructor => {
          this.facilites.forEach(facility => {
            facility.instructors.forEach(facilityInstructor => {
              if (facilityInstructor === instructor.id) {
                facility.instructors.push(instructor);
              }
            })
          })
        })
        this.loading = false;
      })
  }

  listSportCategories() {
    this.sportService.getSport().subscribe(
      data => {
        this.sports = data;
      }
    )
  }

  listInstructors() {
    this.instructrService.getInstructors().pipe(concatMap(value => {
      this.instructorsForSearch = value.content;
      return new Promise(resolve => setTimeout(() => resolve(value), 1000));
    }))
      .subscribe((value: any) => {
        this.listFacilites();
      }
      );
    this.instructrService.getInstructorsByAvailableFacility().subscribe(
      data => {
        this.instructors = data;
        data.forEach(element => {

          this.instructorsLabel.push({
            name: element.user.firstName + " " + element.user.lastName, id: element.id
          })
        });
      }
    )
  }

  listCities() {
    this.formService.getCities().subscribe(
      data => {
        this.cities = data;
      }
    )
  }

  openNew() {
    this.facility = {};
    this.facility.address = {};
    this.facility.address.city = {};
    this.facility.contactData = {};
    this.facility.instructors = [];
    this.facility.availableSports = [];
    this.facility.openingHours = [];
    this.selectedFile = null;
    this.selectedMapFile = null;
    this.submitted = false;
    this.facilityDialog = true;
  }

  deleteSelectedFacility() {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy törölni szeretné a kiválasztott Létesítmény(eke)t?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedFacility.forEach(data => {
          this.facilityService.deleteFacility(+data.id).subscribe();
        })
        this.facilites = this.facilites.filter(val => !this.selectedFacility.includes(val));
        this.selectedFacility = null;
        this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Sikeres törlés', life: 3000 });
        location.reload();
      }
    });
  }

  deleteFacility(facility: Facility) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy tölörni szeretné az alábbi létesítményt: ' + facility.name + '?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.facilityService.deleteFacility(+facility.id).subscribe();
        this.facilites = this.facilites.filter(val => val.id !== facility.id);
        this.facility = {};
        this.messageService.add({ severity: 'success', summary: '', detail: 'Létesítmény törlésre került', life: 3000 })
        location.reload();
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.facilites.length; i++) {
      if (this.facilites[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  editFacility(facility: Facility) {
    this.facility = { ...facility };
    this.facility.instructors.forEach(instructor => {
      if (instructor.user != null) {
        this.instructorsLabelCounterForDelete += 1;
        this.instructorsLabel.push({
          name: instructor.user?.firstName + " " + instructor.user?.lastName, id: instructor.id
        })
      }
    })
    this.facilityDialog = true;
  }

  hideDialog() {
    this.facilityDialog = false;
    this.submitted = false;
    this.clearUpInstructorLabelAfterEditDialog();
  }

  clearUpInstructorLabelAfterEditDialog() {
    for (let i = 0; i < this.instructorsLabelCounterForDelete; i++) {
      this.instructorsLabel.pop();
    }
    this.instructorsLabelCounterForDelete = 0;
  }

  saveFacility() {
    this.submitted = true;
    if (this.facility.name.trim()) {

      let tempInst: Instructor[] = [];
      this.instructorsForSearch.forEach(allInstr => {
        for (let facInstr of this.facility.instructors) {
          if (facInstr === allInstr.id) {
            tempInst.push(allInstr);
            allInstr.user.transactions = [];
            allInstr.trainingSessions = [];
          }
        }
      })
      if (this.facility.id) {
        this.facility.instructors = tempInst;
        this.facilityService.modifyFacility(+this.facility.id, this.facility).subscribe(
          data => {
            if (this.selectedFile !== null) {
              this.addImage(data.payload.id, "profile", this.selectedFile);
            }
            if (this.selectedMapFile !== null) {
              this.addImage(data.payload.id, "map", this.selectedMapFile);
            }
            this.facilites[this.findIndexById(this.facility.id)] = this.facility;
            this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'A létesítmény adatainak módosítás megtörtént', life: 3000 });
            this.facilityDialog = false;
            location.reload();
            this.facility = {};
            this.setUpPricing();
            this.setUpWeekdays();
            this.clearUpInstructorLabelAfterEditDialog();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a létesítmény módosításában, probálkozzon újra', life: 3000 });
            return;
          }
        );

      }
      else {
        this.facility.instructors = tempInst;
        this.facility.openingHours = this.weekdays;
        this.facility.pricing = this.pricing;
        this.facilityService.saveFacility(this.facility).subscribe(
          data => {
            this.addImage(data.payload.id, "profile", this.selectedFile);
            this.addImage(data.payload.id, "map", this.selectedMapFile);
            this.facilites.push(data.payload);
            this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Az új létesítmény létrehozása megtörtént', life: 3000 });
            location.reload();
            this.facilityDialog = false;
            this.facility = {};
            this.setUpPricing();
            this.setUpWeekdays();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a létesítmény létrehozásában, probálkozzon újra', life: 3000 });
            return;
          }
        )
      }

    }
  }

  addImage(id: number, type: string, file: File) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', file, file.name);
    this.facilityService.addImage(id, uploadImageData, type).subscribe();
  }
  scrollUp() {
    window.scroll(0, 0);
  }

  public onFileChanged(event) {
    this.selectedFile = event.files[0];
  }
  
  public onMapUpload(event) {
    this.selectedMapFile = event.files[0];
  }

  setUpWeekdays() {
    this.weekdays = [{ day: "Hétfő", openTime: "", closeTime: "" },
    { day: "Kedd", openTime: "", closeTime: "" },
    { day: "Szerda", openTime: "", closeTime: "" },
    { day: "Csütörtök", openTime: "", closeTime: "" },
    { day: "Péntek", openTime: "", closeTime: "" },
    { day: "Szombat", openTime: "", closeTime: "" },
    { day: "Vasárnap", openTime: "", closeTime: "" },]
  }

  setUpPricing() {
    this.pricing = [
      { ageGroup: "Diák", sessionTicketPrice: "", singleTicketPrice: "" },
      { ageGroup: "Felnőtt", sessionTicketPrice: "", singleTicketPrice: "" },
      { ageGroup: "Nyugdíjas", sessionTicketPrice: "", singleTicketPrice: "" },
    ]
  }
}

