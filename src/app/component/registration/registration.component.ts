import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Address } from 'src/app/common/address';
import { City } from 'src/app/common/city';
import { County } from 'src/app/common/county';
import { User } from 'src/app/common/user';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Sport } from 'src/app/common/sport';
import { SportService } from 'src/app/services/sport.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccesRegistrationComponent } from '../dialogs/succes-registration/succes-registration.component';
import { ContactData } from 'src/app/common/contact-data';
import { UserRegistrationModel } from 'src/app/common/user-registration-model';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { FacilityService } from 'src/app/services/facility.service';
import { Facility } from 'src/app/common/facility';
import { InstructorRegistrationModel } from 'src/app/common/instructor-registration-model';
import { InstructorService } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userFormGroup: FormGroup;
  instructorFormGroup: FormGroup;
  hide = true;
  userFilteredShippingCounties: Observable<String[]>;
  userFilteredShippingCities: Observable<String[]>;
  userFilteredBillingCounties: Observable<String[]>;
  userFilteredBillginCities: Observable<String[]>;
  instructorFilteredCities: Observable<String[]>;
  instructorFilteredCounties: Observable<String[]>;

  counties: String[] = [];
  cities: String[] = [];
  facilities: Facility[] = [];
  countries: string[] = ['Magyarország'];


  sports: Sport[] = [];

  uploadedFiles: any[] = [];
  customUpload = true;
  selectedFile: File;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private formService: FormService,
    private userService: UserService,
    private sportService: SportService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private facilityService: FacilityService,
    private instructorService: InstructorService
  ) { }

  ngOnInit(): void {
    this.initUserFormGroup();
    this.initInstructorFormGroup();
    this.formService.getCounties().subscribe(
      data => {
        data.forEach(value => this.counties.push(value.countyName));
      }
    );
    this.formService.getCities().subscribe(
      data => {
        data.forEach(value => {
          this.cities.push(value.cityName);
        });
      }
    );
    this.sportService.getSport().subscribe(
      data => {
        data.forEach(value => this.sports.push(value));
      }
    )
    this.facilityService.getFacilites().subscribe(
      data => {
        this.facilities = data.content;
      }
    )
    this.userFilteredShippingCounties = this.userShippingCounty.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.counties))
    )
    this.userShippingCounty.setValue("");

    this.userFilteredBillingCounties = this.userBillingCounty.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.counties))
    )
    this.userBillingCounty.setValue("");

    this.instructorFilteredCounties = this.instructorShippingCounty.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.counties))
    )
    this.instructorShippingCounty.setValue("");


    this.userFilteredShippingCities = this.userShippingCity.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.cities))
    )
    this.userShippingCity.setValue("");

    this.userFilteredBillginCities = this.userBillingCity.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.cities))
    )
    this.userBillingCity.setValue("");

    this.instructorFilteredCities = this.instructorShippingCity.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.cities))
    )
    this.instructorShippingCity.setValue("");
  }

  private _valueChanges(filtered: any, formValue: any, basicValue: any) {
    filtered = formValue.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value, basicValue))
    )
    formValue.setValue("");
  }

  private _filter(value: string, basicValue: any): String[] {
    if (value === "") {
      return basicValue;
    }
    const filterValue = value.toLowerCase();
    return basicValue.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCity(value: string): String[] {
    if (value === "") {
      return this.cities;
    }
    const filterValue = value.toLowerCase();
    return this.cities.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  errors(ctrl: AbstractControl): string[] {

    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  onPasswordInput() {
    if (this.userFormGroup.get('passwordFields').hasError('passwordMismatch')) {
      this.userPasswordAgain.setErrors([{ 'passwordMismatch': true }]);
    }
    else
      this.userPasswordAgain.setErrors(null);
  }
  onPasswordInputInstructor() {
    if (this.instructorFormGroup.get('passwordFields').hasError('passwordMismatch')) {
      this.instructorPasswordAgain.setErrors([{ 'passwordMismatch': true }]);
    }
    else
      this.instructorPasswordAgain.setErrors(null);
  }


  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.userFormGroup.controls.billingAddress
        .setValue(this.userFormGroup.controls.shippingAddress.value);
    } else {
      this.userFormGroup.controls.billingAddress.reset();
    }
  }

  createUser() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      return;
    }
    let user = new UserRegistrationModel();
    user.firstName = this.userFirstName.value;
    user.lastName = this.userLastName.value;
    user.password = this.userPassword.value;

    user.email = this.userEmail.value;
    user.telNumber = this.userMobile.value;

    user.shippingCountry = this.userShippingCountry.value;
    user.shippingCounty = this.userShippingCounty.value;
    user.shippingCity = this.userShippingCity.value;
    user.shippingStreet = this.userShippingStreet.value;

    user.billingCountry = this.userBillingCountry.value;
    user.billingCounty = this.userBillingCounty.value;
    user.billingCity = this.userBillingCity.value;
    user.billingStreet = this.userBillingStreet.value;

    this.userService.createUser(user).subscribe(data => {
    });
    window.scroll(0, 0);
    this.confirmationService.confirm({
      message: 'Fiókja érvényesítés után lesz aktiválva, amelyet az email címére kiküldött email segítségével tehet meg. Köszöntjük a FitForFun-on',
      header: 'Sikeres Regisztráció',
      icon: 'pi pi-check',
      accept: () => {
        this.router.navigateByUrl("/home");
      }
    });
  }
  errorMessagesName = {
    required: 'Kérjük töltse ki a név mezőt!',
    minlength: 'Legalább 2 karakter hosszú legyen!',
  };
  errorMessagesEmail = {
    required: 'Kérjük töltse ki az email mezőt!',
    pattern: 'Helyes email formátumot adjon meg! Pl: pelda@gmail.com',
    notUnique: 'Ezzel az email címmel már regsztrált más felhasználó!'
  };
  errorMessagesMobile = {
    required: 'Kérjük töltse ki a telefonszám mezőt!',
    min: 'Egy telefonszám 9 számjegyű lehet!',
    max: 'Egy telefonszám 9 számjegyű lehet!'
  };
  errorMessagesPass = {
    required: 'Kérjük töltse ki a jelszó mezőt!',
    minlength: 'Legalább 6 karakter hosszú jelszót adjon meg!',
    passwordsAreSame: 'A jelszók nem egyeznek meg!'
  };
  errorMessagesZip = {
    required: 'Kérjük adja meg irányító számát',
    min: '4 karakter hosszú lehet egy irányító szám!',
    max: '4 karakter hosszú lehet egy irányító szám!',
  }
  get userFirstName() { return this.userFormGroup.get('customer.firstName'); }
  get userLastName() { return this.userFormGroup.get('customer.lastName'); }
  get userEmail() { return this.userFormGroup.get('customer.email'); }
  get userMobile() { return this.userFormGroup.get('customer.mobile'); }
  get userPassword() { return this.userFormGroup.get('passwordFields.password'); }
  get userPasswordAgain() { return this.userFormGroup.get('passwordFields.passwordAgain'); }
  get userShippingCountry() { return this.userFormGroup.get('shippingAddress.country'); }
  get userShippingCounty() { return this.userFormGroup.get('shippingAddress.county'); }
  get userShippingCity() { return this.userFormGroup.get('shippingAddress.city'); }
  get userShippingStreet() { return this.userFormGroup.get('shippingAddress.street'); }

  get userBillingCountry() { return this.userFormGroup.get('billingAddress.country'); }
  get userBillingCounty() { return this.userFormGroup.get('billingAddress.county'); }
  get userBillingCity() { return this.userFormGroup.get('billingAddress.city'); }
  get userBillingStreet() { return this.userFormGroup.get('billingAddress.street'); }

  initUserFormGroup() {
    this.userFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
          asyncValidators: FormValidators.emailAlreadyUser(this.userService), updateOn: 'blur'
        }
        ],
        mobile: new FormControl('', [Validators.required, Validators.min(100000000), Validators.max(999999999)])
      }),
      passwordFields: this.formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        passwordAgain: new FormControl('', [Validators.required, Validators.minLength(6)]),
      }, { validator: FormValidators.passwordMatchValidator }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        county: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required,]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        county: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
    });
  }
  get instructorFirstName() { return this.instructorFormGroup.get('customer.firstName'); }
  get instructorLastName() { return this.instructorFormGroup.get('customer.lastName'); }
  get instructorEmail() { return this.instructorFormGroup.get('customer.email'); }
  get instructorMobile() { return this.instructorFormGroup.get('customer.mobile'); }
  get instructorPassword() { return this.instructorFormGroup.get('passwordFields.password'); }
  get instructorPasswordAgain() { return this.instructorFormGroup.get('passwordFields.passwordAgain'); }
  get instructorShippingCountry() { return this.instructorFormGroup.get('shippingAddress.country'); }
  get instructorShippingCounty() { return this.instructorFormGroup.get('shippingAddress.county'); }
  get instructorShippingCity() { return this.instructorFormGroup.get('shippingAddress.city'); }
  get instructorShippingStreet() { return this.instructorFormGroup.get('shippingAddress.street'); }
  get instructorTitle() { return this.instructorFormGroup.get('activity.title'); }
  get instructorSport() { return this.instructorFormGroup.get('activity.sport'); }
  get instructorFacility() { return this.instructorFormGroup.get('activity.facility'); }
  get instructorBio() { return this.instructorFormGroup.get('activity.bio'); }

  initInstructorFormGroup() {
    this.instructorFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        email: [null, {
          validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
          asyncValidators: FormValidators.emailAlreadyUser(this.userService), updateOn: 'blur'
        }
        ],
        mobile: new FormControl('', [Validators.required, Validators.min(100000000), Validators.max(999999999)])
      }),
      passwordFields: this.formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        passwordAgain: new FormControl('', [Validators.required, Validators.minLength(6)]),
      }, { validator: FormValidators.passwordMatchValidator }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        county: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required,]),
      }),
      activity: this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        sport: new FormControl('', [Validators.required]),
        facility: new FormControl('', [Validators.required]),
        bio: new FormControl('', [Validators.required, Validators.minLength(15)]),
      })
    });
  }
  createInstructor() {
    this.submitted = true;
    if (this.instructorFormGroup.invalid) {
      this.instructorFormGroup.markAllAsTouched();
      return;
    }
    let user = new UserRegistrationModel();
    user.firstName = this.instructorFirstName.value;
    user.lastName = this.instructorLastName.value;
    user.password = this.instructorPassword.value;

    user.email = this.instructorEmail.value;
    user.telNumber = this.instructorMobile.value;

    user.shippingCountry = this.instructorShippingCountry.value;
    user.shippingCounty = this.instructorShippingCounty.value;
    user.shippingCity = this.instructorShippingCity.value;
    user.shippingStreet = this.instructorShippingStreet.value;

    user.billingCountry = this.instructorShippingCountry.value;
    user.billingCountry = this.instructorShippingCounty.value;
    user.billingCity = this.instructorShippingCity.value;
    user.billingStreet = this.instructorShippingStreet.value;

    let sportIds: number[] = [];
    this.instructorSport.value.forEach(sportId => {
      sportIds.push(sportId.id);
    });
    let instructor = new InstructorRegistrationModel(user, this.instructorTitle.value, this.instructorBio.value, sportIds, this.instructorFacility.value.id);
    this.instructorService.createInstructor(instructor).subscribe(data => {
      this.addImage(data.payload.id)
    });
    window.scroll(0, 0);
    this.confirmationService.confirm({
      message: 'Fiókja érvényesítés után lesz aktiválva, amelyet az email címére kiküldött email segítségével tehet meg. Köszöntjük a FitForFun-on',
      header: 'Sikeres Regisztráció',
      icon: 'pi pi-check',
      accept: () => {
        this.router.navigateByUrl("/home");
      }
    });
  }

  public onFileChanged(event) {
    this.selectedFile = event.files[0];
  }
  addImage(id: number) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    this.instructorService.addImage(id, uploadImageData).subscribe();
  }
}
