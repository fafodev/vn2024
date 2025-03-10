import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LanguageService } from './app/services/language-service';
import { defaultItemName } from './app/app.default-itemnm';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
    constructor(private languageService: LanguageService) {
        super();
        this.getAndInitTranslations();
    }

    getAndInitTranslations() {
        this.languageService.currentLanguage$.subscribe(() => {
            let currentLanguage = this.languageService.getLanguage();
            this.itemsPerPageLabel = defaultItemName[currentLanguage].paginationLabel;
            this.getRangeLabel = this.getRangeLabelFn();
            this.changes.next();
        });


    }

    getRangeLabelFn() {
        return (page: number, pageSize: number, length: number): string => {
            if (length === 0 || pageSize === 0) {
                return `0 / ${length}`;
            }
            const startIndex = page * pageSize;
            const endIndex = Math.min(startIndex + pageSize, length);
            return `( ${startIndex + 1} - ${endIndex} ) / ${length}`;
        };
    }
}