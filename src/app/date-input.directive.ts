import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

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
        const errors = control.errors;

        if (!value) {
            // Nếu input rỗng, xóa lỗi invalidDate
            if (errors && errors['invalidDate']) {
                delete errors['invalidDate'];
                control.setErrors(Object.keys(errors).length ? errors : null);
            }
        }
    }
}
