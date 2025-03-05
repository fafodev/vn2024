import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { NotifyService } from 'src/app/services/notify.service';
import { stagger60ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from 'src/app/services/language-service';
import { dateValidator, getDateRequest } from 'src/app/custom-date-adapter';
import { DateInputDirective } from 'src/app/date-input.directive';

@Component({
    selector: 'vex-student-list',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, MatOptionModule, MatSelectModule,
        MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatDatepickerModule,
        VexSecondaryToolbarComponent, VexBreadcrumbsComponent, DateInputDirective],
    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [stagger60ms, fadeInUp400ms],
})
export class StudentListComponent implements OnInit {
    currentLanguage$: Observable<string> | undefined;
    currentLanguage: string = "";
    listFlights: any[] = [];
    listSchools: any[] = [];
    listTrainingOffices: any[] = [];
    listDormitories: any[] = [];
    listServices: any[] = [];
    listAdmissionsOffices: any[] = [];
    studentForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private store: Store,
        private readonly webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private appFunctionService: AppFunctionService,
        private notifyService: NotifyService,
        private languageService: LanguageService,
    ) {
        // Kiểm tra localStorage để set ngôn ngữ mặc định
        this.currentLanguage$ = this.languageService.currentLanguage$;
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language;
        });

        this.studentForm = this.fb.group({
            admissionsOffice: [''],
            trainingOffice: [''],
            dormitoryArea: [''],
            languageSchool: [''],
            flightRoute: [''],
            entryGroup: [''],
            departureDate: [null, [dateValidator]],
            entryDate: [null, [dateValidator]],
            registeredDormitory: [''],
            registeredService: [''],
            studentId: [''],
            studentName: ['']
        });
    }
    ngOnInit(): void {
        this.fnInit();
    }

    fnInit(): void {
        let request = {
            accessInfo: this.accessInfo.getAll()
        };

        this.webService.callWs('student-init', request,
            (response) => {
                if (response.listFlights) {
                    this.listFlights = response.listFlights;
                }
                if (response.listSchools) {
                    this.listSchools = response.listSchools;
                }
                if (response.listTrainingOffices) {
                    this.listTrainingOffices = response.listTrainingOffices;
                }
                if (response.listDormitories) {
                    this.listDormitories = response.listDormitories;
                }
                if (response.listServices) {
                    this.listServices = response.listServices;
                }
                if (response.listAdmissionsOffices) {
                    this.listAdmissionsOffices = response.listAdmissionsOffices;
                }
            },
            () => {
                console.error('Error occurred');
            }).subscribe();
    }

    search() {
        // Lấy dữ liệu từ form
        let formData = { ...this.studentForm.value };

        // Chuyển đổi ngày thành định dạng YYYY-MM-DD
        if (formData.departureDate) {
            formData.departureDate = getDateRequest(formData.departureDate);
        }
        if (formData.entryDate) {
            formData.entryDate = getDateRequest(formData.departureDate);
        }

        // Tạo request với accessInfo và dữ liệu đã chuyển đổi
        let request = {
            accessInfo: this.accessInfo.getAll(),
            searchData: formData
        };

        this.webService.callWs('student-search', request,
            (response) => {
                if (response) {
                    console.log('Search Result:', response);
                    // Xử lý kết quả tìm kiếm nếu cần
                }
            },
            () => { }).subscribe();
    }

    resetForm(): void {
        this.studentForm.reset({
            admissionsOffice: '',
            trainingOffice: '',
            dormitoryArea: '',
            languageSchool: '',
            flightRoute: '',
            entryGroup: '',
            departureDate: null,
            entryDate: null,
            registeredDormitory: '',
            registeredService: '',
            studentId: '',
            studentName: ''
        });
    }
}
