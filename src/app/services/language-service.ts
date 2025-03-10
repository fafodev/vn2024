import { inject, Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { setLanguage } from '../state/language/language.actions';
import { selectCurrentLanguage } from '../state/language/language.selectors';
import { Language_EN } from '../app.const';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLanguageSubject = new BehaviorSubject<string>(Language_EN);
    currentLanguage$ = this.currentLanguageSubject.asObservable();

    constructor(private dateAdapter: DateAdapter<any>, private store: Store) {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.setLanguage(savedLanguage);
        } else {
            this.store.select(selectCurrentLanguage).subscribe(language => {
                this.setLanguage(language);
            });
        }
    }

    setLanguage(language: string): void {
        this.dateAdapter.setLocale(language);
        this.currentLanguageSubject.next(language);
        this.store.dispatch(setLanguage({ language }));
        localStorage.setItem('language', language);
    }

    getLanguage(): string {
        return this.currentLanguageSubject.value;
    }
}
