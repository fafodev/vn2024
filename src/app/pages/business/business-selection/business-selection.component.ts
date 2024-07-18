import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IObjectString } from 'src/app/app.interface';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigPanelComponent } from 'src/app/layouts/components/config-panel/config-panel.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { ConfigPanelToggleComponent } from 'src/app/layouts/components/config-panel/config-panel-toggle/config-panel-toggle.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';
import { VexConfig } from '@vex/config/vex-config.interface';
import { BaseLayoutComponent } from 'src/app/layouts/base-layout/base-layout.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { ToolbarComponent } from 'src/app/layouts/components/toolbar/toolbar.component';
import { setLanguage } from 'src/app/state/language/language.actions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { SidenavUserMenuComponent } from 'src/app/layouts/components/sidenav/sidenav-user-menu/sidenav-user-menu.component';
import { SidenavItemComponent } from 'src/app/layouts/components/sidenav/sidenav-item/sidenav-item.component';
const businessList: IObjectString[] = [
    {
        "businessId": 1,
        "businessName": "請求明細",
        "businessDetail": "",
        "bgColor": "bg-sky-600"
    },
    {
        "businessId": 2,
        "businessName": "返金明細",
        "businessDetail": "",
        "bgColor": "bg-sky-600"
    },
    {
        "businessId": 3,
        "businessName": "契約時請求書確認",
        "businessDetail": "",
        "bgColor": "bg-sky-600"
    },
    {
        "businessId": 4,
        "businessName": "解約申入<br>解約清算明細",
        "businessDetail": "",
        "bgColor": "bg-amber-500"
    },
    {
        "businessId": 5,
        "businessName": "入居者情報",
        "businessDetail": "",
        "bgColor": "bg-amber-500"
    },
    {
        "businessId": 6,
        "businessName": "返金口座確認",
        "businessDetail": "",
        "bgColor": "bg-sky-400"
    },
    {
        "businessId": 7,
        "businessName": "法人会員情報変更",
        "businessDetail": "bg-sky-400",
        "bgColor": "bg-sky-400"
    },
    {
        "businessId": 8,
        "businessName": "担当者情報変更",
        "businessDetail": "",
        "bgColor": "bg-sky-400"
    },
    {
        "businessId": 9,
        "businessName": "パスワード変更",
        "businessDetail": "",
        "bgColor": "bg-sky-400"
    },
    {
        "businessId": 10,
        "businessName": "電子契約の<br>お手続き",
        "businessDetail": "",
        "bgColor": "bg-sky-400"
    }
]
    ;


@Component({
    selector: 'vex-business-selection',
    standalone: true,
    templateUrl: './business-selection.component.html',
    styleUrl: './business-selection.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        scaleFadeIn400ms
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        NgIf,
        MatIconModule,
        RouterLink,
        ConfigPanelComponent,
        VexSidebarComponent,
        ConfigPanelToggleComponent,
        FooterComponent,
        AsyncPipe,
        BaseLayoutComponent,
        MatRippleModule,
        VexProgressBarComponent,
        ToolbarComponent,
        MatTooltipModule,
        SidenavItemComponent
    ]
})
export class BusinessSelectionComponent {
    userMenuOpen$: Observable<boolean> = of(false);
    config$: Observable<VexConfig> = this.configService.config$;
    configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
    currentLanguage$: Observable<string>;
    currentLanguage: string = "";
    businessList: IObjectString[] = [];
    userVisible$ = this.configService.config$.pipe(
        map((config) => config.sidenav.user.visible)
    );

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private snackbar: MatSnackBar,
        private store: Store,
        private readonly layoutService: VexLayoutService,
        private readonly configService: VexConfigService,
        private readonly popoverService: VexPopoverService,
    ) {
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language;
        });
        this.businessList = businessList;
    }

    onLanguageMenuChange(language: string) {
        this.currentLanguage = language;
        this.store.dispatch(setLanguage({ language }));
    }

    businessClick (business: IObjectString) {
        console.log(business);
        this.router.navigate(['/dashboards/top']);
    }

    logout () {
        this.router.navigate(['/login']);
    }
}
