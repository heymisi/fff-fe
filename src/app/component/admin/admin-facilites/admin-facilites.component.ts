import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { City } from 'src/app/common/city';
import { Facility } from 'src/app/common/facility';
import { FacilityRequestModel } from 'src/app/common/facility-request-model';
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
  progressBarVisible: boolean = false;

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
      return new Promise(resolve => setTimeout(() => resolve(value), 100));
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
          this.facilityService.deleteFacility(+data.id).subscribe(
            data=>{
              this.facilites = this.facilites.filter(val => !this.selectedFacility.includes(val));
              this.selectedFacility = null;
              this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Sikeres törlés', life: 3000 });
              location.reload();
            }
          );
        })
      }
    });
  }

  deleteFacility(facility: Facility) {
    this.confirmationService.confirm({
      message: 'Biztos benne, hogy tölörni szeretné az alábbi létesítményt: ' + facility.name + '?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.facilityService.deleteFacility(+facility.id).subscribe(
          data => {
            this.facilites = this.facilites.filter(val => val.id !== facility.id);
            this.facility = {};
            this.messageService.add({ severity: 'success', summary: '', detail: 'Létesítmény törlésre került', life: 3000 })
            location.reload();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: '', detail: 'Hiba a létesítmény törlése közben', life: 3000 })

          }
        );

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
      if (!this.facility.name || !this.facility.contactData.email || !this.facility.contactData.telNumber ||
        !this.facility.address.city || !this.facility.address.street ||
        !this.facility.availableSports || !this.facility.description
        ) {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Töltsd ki az összes mezőt', life: 3000 });
      } else {
        this.progressBarVisible = true;
        let tempInst: number[] = [];
        this.instructorsForSearch.forEach(allInstr => {
          for (let facInstr of this.facility.instructors) {
            if (facInstr === allInstr.id) {
              tempInst.push(allInstr.id);
            }
          }
        })
        let facilityToModify = new FacilityRequestModel(
          this.facility.name, this.facility.contactData.email, this.facility.contactData.telNumber,
          this.facility.address.city.cityName, this.facility.address.street, this.facility.openingHours,
          this.facility.availableSports, tempInst, this.facility.pricing, this.facility.description,
          this.facility.profileImage, this.facility.mapImage);
        if (this.facility.id) {
          this.facilityService.modifyFacility(+this.facility.id, facilityToModify).subscribe(
            data => {
              if (this.selectedFile !== null) {
                this.addImage(data.payload.id, "profile", this.selectedFile);
              }
              this.facilites[this.findIndexById(this.facility.id)] = this.facility;
              this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'A létesítmény adatainak módosítás megtörtént', life: 3000 });
              this.clearUpInstructorLabelAfterEditDialog();
              this.afterSaveFacility();
            },
            error => {
              this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a létesítmény módosításában, probálkozzon újra', life: 3000 });
              return;
            }
          );

        }
        else {
          facilityToModify.openingHours = this.weekdays;
          facilityToModify.pricing = this.pricing;
          this.facilityService.saveFacility(facilityToModify).subscribe(
            data => {
              this.addImage(data.payload.id, "profile", this.selectedFile);
              this.facilites.push(data.payload);
              this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Az új létesítmény létrehozása megtörtént', life: 3000 });
              this.afterSaveFacility();
            },
            error => {
              this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a létesítmény létrehozásában, probálkozzon újra', life: 3000 });
              return;
            }
          )
        }
      }
    }
  }

  afterSaveFacility() {
    location.reload();
    this.facilityDialog = false;
    this.facility = {};
    this.setUpPricing();
    this.setUpWeekdays();
    this.progressBarVisible = false;
  }

  addImage(id: number, type: string, file: File) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', file, file.name);
    this.facilityService.addImage(id, uploadImageData, type).subscribe(
      data=>{
        if(this.selectedMapFile){
          const uploadImageData = new FormData();
          uploadImageData.append('imageFile',  this.selectedMapFile,  this.selectedMapFile.name);
          this.facilityService.addImage(id, uploadImageData, "map").subscribe();
        }
      }
    );
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
    this.weekdays = [{
      day: "Hétfő", openTime: "0", closeTime: "0"
    },
    { day: "Kedd", openTime: "0", closeTime: "0" },
    { day: "Szerda", openTime: "0", closeTime: "0" },
    { day: "Csütörtök", openTime: "0", closeTime: "0" },
    { day: "Péntek", openTime: "0", closeTime: "0" },
    { day: "Szombat", openTime: "0", closeTime: "0" },
    { day: "Vasárnap", openTime: "0", closeTime: "0" },]
  }

  setUpPricing() {
    this.pricing = [
      { ageGroup: "Diák", sessionTicketPrice: "0", singleTicketPrice: "0" },
      { ageGroup: "Felnőtt", sessionTicketPrice: "0", singleTicketPrice: "0" },
      { ageGroup: "Nyugdíjas", sessionTicketPrice: "0", singleTicketPrice: "0" },
    ]
  }
}

