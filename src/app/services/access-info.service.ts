import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from '../state/language/language.selectors';

@Injectable({
    providedIn: 'root'
})
export class AccessInfoService {

    private _username: string | null = null;
    private _token: string | null = "";
    private _customerId: string | null = null;
    private _language: string | "" = "";
    private _name: string | null = null;

    constructor(
        private readonly store: Store
    ) {
        this.store.select(selectCurrentLanguage)
            .subscribe(language => {
                this._language = language;
            });
    }

    // Getters and Setters
    get username(): string | null {
        return this._username;
    }

    set username(value: string | null) {
        this._username = value;
    }

    get token(): string | null {
        return this._token;
    }

    set token(value: string | null) {
        this._token = value;
    }

    get customerId(): string | null {
        return this._customerId;
    }

    set customerId(value: string | null) {
        this._customerId = value;
    }

    get language(): string | "" {
        return this._language;
    }

    set language(value: string | "") {
        this._language = value;
    }

    get name(): string | null {
        return this._name;
    }

    set name(value: string | null) {
        this._name = value;
    }

    getAll() {
        return {
            username: this._username,
            token: this._token,
            customerId: this._customerId,
            language: this._language,
            name: this._name,
        };
    }

    // Clear all information
    clear() {
        this._username = null;
        this._token = null;
        this._customerId = null;
        this._language = "";
        this._name = null;
    }
}
