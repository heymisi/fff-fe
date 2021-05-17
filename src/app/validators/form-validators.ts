import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "../services/user.service";

@Injectable()
export class FormValidators {

    constructor(private userService: UserService) { }

    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }
    static passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
        if (formGroup.get('password').value === formGroup.get('passwordAgain').value) {
            return null;
        }
        else {
            return { passwordMismatch: true };
        }
    }
    static emailAlreadyUser(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            if (control.value !== "") {
                return userService.isEmailAlreadyUsed(control.value).pipe(
                    map((result: boolean) => result ? { notUnique: true } : null)
                );
            }
            return null;
        }
    }

    static emailIsValid(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            if (control.value !== "") {
                return userService.isEmailAlreadyUsed(control.value).pipe(
                    map((result: boolean) => result ? null : { notUnique: true })
                );
            }
            return null;
        }
    }

}

