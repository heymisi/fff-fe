import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { concatMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { City } from 'src/app/common/city';
import { Instructor } from 'src/app/common/instructor';
import { TrainingSession } from 'src/app/common/training-session';
import { User } from 'src/app/common/user';
import { FormService } from 'src/app/services/form.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { TrainingSessionService } from 'src/app/services/training-session.service';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.css']
})
export class InstructorProfileComponent implements OnInit {
  instructor: Instructor = null;
  user: User = null;

  profileFormGroup: FormGroup;
  profilePassFormGroup: FormGroup;
  cities: City[] = [];
  filteredCities: City[];

  counties: String[] = [];
  filteredCounties: String[];

  hidePass1 = true;
  hidePass2 = true;
  hidePass3 = true;

  constructor(private instructorService: InstructorService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formService: FormService,
    private filterService: FilterService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    this.getUser();
    this.getCities();
    this.getCounties();
    this.profileFormGroup = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
      }),
      contact: this.formBuilder.group({
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        }],
        mobile: new FormControl('', [Validators.required, Validators.min(100000000), Validators.max(999999999)])
      }),
      address: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        county: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),

    })
    this.profilePassFormGroup = this.formBuilder.group({
      pass: this.formBuilder.group({
        oldPass: new FormControl('', [Validators.required, Validators.minLength(6), FormValidators.notOnlyWhitespace]),
        newPass: new FormControl('', [Validators.required, Validators.minLength(6), FormValidators.notOnlyWhitespace]),
        newPassAgain: new FormControl('', [Validators.required, Validators.minLength(6), FormValidators.notOnlyWhitespace]),
      }),
      passForDelete: this.formBuilder.group({
        pass: new FormControl('', [Validators.required, Validators.minLength(6), FormValidators.notOnlyWhitespace]),
      })
    })
  }

  get firstName() { return this.profileFormGroup.get('name.firstName'); }
  get lastName() { return this.profileFormGroup.get('name.lastName'); }
  get email() { return this.profileFormGroup.get('contact.email'); }
  get mobile() { return this.profileFormGroup.get('contact.mobile'); }
  get street() { return this.profileFormGroup.get('address.street'); }
  get city() { return this.profileFormGroup.get('address.city'); }
  get county() { return this.profileFormGroup.get('address.county'); }
  get country() { return this.profileFormGroup.get('address.country'); }
  get oldPass() { return this.profilePassFormGroup.get('pass.oldPass'); }
  get newPass() { return this.profilePassFormGroup.get('pass.newPass'); }
  get newPassAgain() { return this.profilePassFormGroup.get('pass.newPassAgain'); }
  get pass() { return this.profilePassFormGroup.get('passForDelete.pass'); }

  getUser() {
    this.authService.getUser().pipe(concatMap(user => {
      this.user = user;
      return new Promise(resolve => setTimeout(() => resolve(user), 500));
    })).subscribe((value: any) => {
      this.instructorService.getInstructorByUser(+this.user.id).subscribe(
        inst => {
          this.instructor = inst.payload;
        }
      )
    });
  }
  getCities() {
    this.formService.getCities().subscribe(
      data => {
        this.cities = data;
      }
    );
  }
  getCounties() {
    this.formService.getCounties().subscribe(
      data => {
        data.forEach(value => this.counties.push(value.countyName));
      }
    );
  }
  modifyUser() {
    if (this.profileFormGroup.invalid) {
      this.profileFormGroup.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem történt módosítás, javítsa a hibás mezőket a folytatáshoz', life: 5000 });
      return;
    }
    if (!this.profileFormGroup.touched || !this.profileFormGroup.dirty) {
      this.messageService.add({ severity: 'info', summary: 'Nem történt módosítás', detail: 'Ha változtatni szeretne adatain, írja át a kivánt mezőket!', life: 5000 });
      return;
    }
    this.instructorService.modifyInstructorUser(this.instructor.id, this.instructor.user).subscribe(
      data => {
        this.messageService.add({ severity: 'success', summary: 'Sikeres módosítás', detail: 'A megadott adatokat felülírása sikeresen megtörtént!', life: 5000 });
      }
    )
  }

  changePass() {
    if (this.profilePassFormGroup.get("pass").invalid) {
      this.profilePassFormGroup.get("pass").markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Jelszava megváltoztatásához javítsa a hibás mezőket', life: 5000 });
      return;
    }
    if (this.newPass.value != this.newPassAgain.value) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Az újonnan megadott jelszavak nem egyeznek meg', life: 5000 });

      return;
    }
    this.userService.changePassword(+this.instructor.user.id, this.oldPass.value, this.newPass.value).subscribe(
      data => {
        if (data) {
          this.messageService.add({ severity: 'success', summary: 'Sikeres művelet', detail: 'Jelszava sikeresen megváltozott!', life: 5000 });
          this.profilePassFormGroup.get("pass").reset();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Régi jelszava nem megfelelő, kérjük adja meg helyes jelszavát', life: 5000 });
        }
      }
    )
  }

  filterCity(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.cities.length; i++) {
      let city = this.cities[i].cityName;
      if (city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(this.cities[i]);
      }
    }

    this.filteredCities = filtered;
  }

  filterCounty(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.counties.length; i++) {
      let county = this.counties[i];
      if (county.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(county);
      }
    }
    this.filteredCounties = filtered;
  }

  deleteProfile() {
    if (this.profilePassFormGroup.get("passForDelete").invalid) {
      this.pass.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Kérjük adja meg jelszavát a folytatáshoz', life: 5000 });
      return;
    }
    this.instructorService.deteleInstructor(+this.instructor.id, this.pass.value).subscribe(
      data => {
        if (data) {
          this.authService.signOut();
          this.confirmationService.confirm({
            message: 'Felhasználó törlésre került, köszönjük, hogy eddig velünk volt!',
            header: 'Törlés',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              setTimeout(() => {
                this.router.navigateByUrl("/home")
                  .then(() => {
                    window.location.reload();
                  });
              }, 1000);
            }
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Jelszava nem megfelelő, kérjük adja meg helyes jelszavát', life: 5000 });
        }
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
