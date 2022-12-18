import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-field-error-message',
  templateUrl: './field-error-message.component.html',
  styleUrls: ['./field-error-message.component.css']
})
export class FieldErrorMessageComponent{

  @Input() control: FormControl;

  constructor() {}

  get errorMessage(): string {
    if (this.control.touched && this.control.invalid) {

      if (this.control.errors!['required']) {
        return 'This field is required';
      }
      if (this.control.errors!['minlength']) {
        return `This field should contain at least ${this.control.errors!['minlength'].requiredLength} characters`;
      }
      if (this.control.errors!['mustMatch']){
        return `Passwords mush match`;
      }
      if(this.control.errors!['accountExists']){
        return `This account already exists!`;
      }
      if(this.control.errors!['NotANumber']){
        return `This is not a number!`;
      }
      if(this.control.errors!['incorrectPassword']){
        return `This is invalid password!`;
      }
    }
    return '';
  }

}
