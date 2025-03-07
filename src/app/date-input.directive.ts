import { Directive, HostListener } from '@angular/core';
import { NgControl, ValidationErrors, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

@Directive({
    selector: '[appDateInput]',
    standalone: true,
})
export class DateInputDirective {
    constructor(private ngControl: NgControl) { }

    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
        this.checkAndClearErrors(event);
    }

    @HostListener('focusout', ['$event'])
    onInputBlur(event: Event) {
        this.checkAndClearErrors(event);
    }

    private checkAndClearErrors(event: Event) {
        const control = this.ngControl.control;
        if (!control) return;

        const inputElement = event.target as HTMLInputElement;
        const value = inputElement?.value?.trim(); // Lấy giá trị trực tiếp từ input

        // Sử dụng hàm dateValidator để kiểm tra giá trị
        const errors = this.dateValidator(control);

        if (!value) {
            // Nếu input rỗng, xóa lỗi invalidDate
            if (errors && errors['invalidDate']) {
                delete errors['invalidDate'];
                control.setErrors(Object.keys(errors).length ? errors : null);
            }
        } else {
            // Nếu có lỗi, thiết lập lỗi cho control
            control.setErrors(errors);
        }
    }

    private dateValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return { invalidDate: true }; // Cho phép bỏ trống

        // Nếu không phải Moment hoặc không phải ngày hợp lệ
        if (!moment.isMoment(value) || !value.isValid()) {
            return { invalidDate: true };
        }

        return null;
    }
}