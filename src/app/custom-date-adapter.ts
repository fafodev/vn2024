import { inject, Injectable } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LanguageService } from './services/language-service';

export const CUSTOM_DATE_FORMATS = {
    parse: { dateInput: 'DD/MM/YYYY' },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Injectable({
    providedIn: 'root',
})
export class CustomDateAdapter extends MomentDateAdapter {
    private dateFormat = 'DD/MM/YYYY'; // Mặc định là tiếng Anh

    constructor(@Inject(MAT_DATE_LOCALE) dateLocale: string) {
        super(dateLocale);
        this.setLocale(dateLocale);
    }

    override setLocale(locale: string): void {
        super.setLocale(locale);
        this.dateFormat = locale === 'JP' ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
    }

    override format(date: moment.Moment, displayFormat: string): string {
        return date ? date.format(this.dateFormat) : '';
    }

    override parse(value: any, parseFormat: string | string[]): moment.Moment | null {
        if (!value) return null;
        return moment(value, this.dateFormat, true).isValid() ? moment(value, this.dateFormat) : null;
    }
}

/**
 * Chuyển đổi ngày về định dạng YYYY-MM-DD để gửi request
 * @param date - Giá trị ngày cần chuyển đổi
 * @returns string | null
 */
export function getDateRequest(date: any): string | null {
    if (!date) return null;
    const momentDate = moment(date, ['YYYY/MM/DD', 'DD/MM/YYYY'], true);
    return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : null;
}

/**
 * Chuyển đổi ngày từ định dạng YYYY-MM-DD về định dạng đúng để set vào datepicker
 * @param date - Giá trị ngày cần chuyển đổi
 * @returns moment.Moment | null
 */
export function getDateForDatepicker(date: string): moment.Moment | null {
    if (!date) return null;
    const momentDate = moment(date, 'YYYY-MM-DD', true);
    return momentDate.isValid() ? momentDate : null;
}