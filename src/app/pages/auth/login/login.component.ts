import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { defaultItemName } from 'src/app/app.default-itemnm'
import { IObjectString } from 'src/app/app.interface';
import { setLanguage } from 'src/app/state/language/language.actions';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigPanelComponent } from 'src/app/layouts/components/config-panel/config-panel.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { ConfigPanelToggleComponent } from 'src/app/layouts/components/config-panel/config-panel-toggle/config-panel-toggle.component';

@Component({
    selector: 'vex-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUp400ms],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        NgIf,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatCheckboxModule,
        RouterLink,
        MatSnackBarModule,
        ConfigPanelComponent,
        VexSidebarComponent,
        ConfigPanelToggleComponent,
        AsyncPipe
    ]
})
export class LoginComponent {
    configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
    currentLanguage$: Observable<string>;

    defaultItemName: IObjectString = defaultItemName;
    currentLanguage: string = "";

    form = this.fb.group({
        customerId: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    inputType = 'password';
    visible = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private snackbar: MatSnackBar,
        private store: Store,
        private readonly layoutService: VexLayoutService,
        private readonly configService: VexConfigService
    ) {
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language;
        });
    }
    
    onLanguageMenuChange(language: string) {
        this.currentLanguage = language;
        this.store.dispatch(setLanguage({ language }));
    }

    send() {
        if (this.form.valid) {
            this.router.navigate(['/business-selection']);
            // this.snackbar.open(
            //     "Lucky you! Looks like you didn't need a password or username address! For a real application we provide validators to prevent this. ;)",
            //     'THANKS',
            //     {
            //         duration: 10000
            //     }
            // );
        } else {
            console.log(this.form.valid)
        }

    }

    toggleVisibility() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
            this.cd.markForCheck();
        } else {
            this.inputType = 'text';
            this.visible = true;
            this.cd.markForCheck();
        }
    }
}
