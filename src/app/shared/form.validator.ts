import { FormGroup } from '@angular/forms';
import { User } from '../models/user';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
// export function AccountAlreadyExists(controlName: string, userAccounts: User[]) {
//     return (formGroup: FormGroup) => {
//         const control = formGroup.controls[controlName];
//         let value = control.value as string;
//         if(!userAccounts) {
//             return;
//         }
//         for(var acc of userAccounts){
//             if(acc.name === value){
//                 control.setErrors({ accountExists: true });
//                 return;
//             }
//         }
//         control.setErrors(null);
//         return;
//     }
// }

export function NotANumberInsert(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        let value = control.value as string;
        if(isNaN(parseInt(value))){
            control.setErrors({ NotANumber: true });
            return;
        }
        control.setErrors(null);
        return;
    }
}