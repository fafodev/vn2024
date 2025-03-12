import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    provideHttpClient,
    withInterceptors,
    withInterceptorsFromDi
} from '@angular/common/http';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { provideIcons } from './core/icons/icons.provider';
import { provideLuxon } from './core/luxon/luxon.provider';
import { provideVex } from '@vex/vex.provider';
import { provideNavigation } from './core/navigation/navigation.provider';
import { vexConfigs } from '@vex/config/vex-configs';
import { provideQuillConfig } from 'ngx-quill';
import { provideState, provideStore } from '@ngrx/store';
import { languageReducer } from './state/language/language.reducer';
import { AuthInterceptor } from './auth.interceptor';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from './custom-date-adapter';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from 'src/custom-pagination';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';



export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule, MatDialogModule, MatBottomSheetModule, MatNativeDateModule),
        provideRouter(appRoutes,
            // TODO: Add preloading withPreloading(),
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withHashLocation()
        ),

        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideVex({
            /**
             * The config that will be used by default.
             * This can be changed at runtime via the config panel or using the VexConfigService.
             */
            config: vexConfigs.apollo,
            /**
             * Only themes that are available in the config in tailwind.config.ts should be listed here.
             * Any theme not listed here will not be available in the config panel.
             */
            availableThemes: [
                {
                    name: 'Default',
                    className: 'vex-theme-default'
                },
                {
                    name: 'Teal',
                    className: 'vex-theme-teal'
                },
                {
                    name: 'Green',
                    className: 'vex-theme-green'
                },
                {
                    name: 'Purple',
                    className: 'vex-theme-purple'
                },
                {
                    name: 'Red',
                    className: 'vex-theme-red'
                },
                {
                    name: 'Orange',
                    className: 'vex-theme-orange'
                }
            ]
        }),
        provideNavigation(),
        provideIcons(),
        provideLuxon(),
        provideQuillConfig({
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['clean'],
                    ['link', 'image']
                ]
            }
        }),
        provideStore(),
        provideState({ name: 'language', reducer: languageReducer }),
        provideHttpClient(withInterceptors([AuthInterceptor])), // Đăng ký Interceptor
        // 🔥 Đăng ký CustomDateAdapter
        { provide: MAT_DATE_LOCALE, useValue: 'EN' }, // Mặc định là English
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
        { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
    ]
};
