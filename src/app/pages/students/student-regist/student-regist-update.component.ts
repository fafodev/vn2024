import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { NotifyService } from 'src/app/services/notify.service';
import { stagger60ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from 'src/app/services/language-service';
import { CustomDateAdapter, getDateForDatepicker, getDateRequest } from 'src/app/custom-date-adapter';
import { DateInputDirective } from 'src/app/date-input.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { defaultItemName } from 'src/app/app.default-itemnm'
import * as Const from 'src/app/app.const';
import { MessageService } from 'src/app/services/messages.service';

@Component({
    selector: 'vex-student-regist',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, MatOptionModule, MatSelectModule,
        MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatDatepickerModule,
        DateInputDirective,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule
    ],
    templateUrl: './student-regist-update.component.html',
    styleUrl: './student-regist-update.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [stagger60ms, fadeInUp400ms],
})
export class StudentRegistUpdateComponent implements OnInit, AfterViewInit {
    @ViewChild('studentIdInput') studentIdInput!: ElementRef;
    @ViewChild('studentNameInput') studentNameInput!: ElementRef;
    currentLanguage$: Observable<string> | undefined;
    currentLanguage: string = "";
    listFlights: any[] = [];
    listSchools: any[] = [];
    listTrainingOffices: any[] = [];
    listDormitories: any[] = [];
    listServices: any[] = [];
    listAdmissionsOffices: any[] = [];
    studentForm: FormGroup;
    mode: typeof Const.MODE_INS | typeof Const.MODE_UPD = Const.MODE_INS;
    defaultItemName = defaultItemName;
    formItemName: any[] = [];
    currentDateFormat: string;
    dateMessage: string;


    constructor(
        private fb: FormBuilder,
        private readonly webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private notifyService: NotifyService,
        private languageService: LanguageService,
        @Inject(MAT_DIALOG_DATA) public studentParams: any | undefined,
        private dialogRef: MatDialogRef<StudentRegistUpdateComponent>,
        private cd: ChangeDetectorRef,
        private dateAdapter: CustomDateAdapter,
        private messageService: MessageService
    ) {
        // Kiểm tra localStorage để set ngôn ngữ mặc định
        this.currentLanguage$ = this.languageService.currentLanguage$;
        this.currentLanguage$.subscribe(language => {
            this.accessInfo.language = language;
            this.currentLanguage = language;
            this.fnGetFormItemName();
        });

        this.studentForm = this.fb.group({
            admissionsOffice: [''],
            trainingOffice: [''],
            dormitoryArea: [''],
            languageSchool: [''],
            flightRoute: [''],
            entryGroup: [''],
            departureDate: [null],
            entryDate: [null],
            registeredDormitory: [''],
            registeredService: [[]],
            studentId: [{ value: null, disabled: true }],
            studentName: ['']
        });

        this.currentDateFormat = this.dateAdapter.getCurrentDateFormat();
        this.dateMessage = this.messageService.getMessage("NOR_ERR_003");
    }

    fnGetFormItemName(): void {
        let request = {
            accessInfo: this.accessInfo.getAll(),
            screenId: 'STUDENT_ADD'
        };

        this.webService.callWs('getFormItemNm', request,
            (response) => {
                this.formItemName = response.listFormItemName;
                this.cd.markForCheck();
            },
            (error) => {
                console.error(error);
            }).subscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.studentNameInput.nativeElement.focus();
        }, 300);
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
                if (this.studentParams && this.studentParams.STUDENT_ID) {
                    this.mode = Const.MODE_UPD;
                    this.studentForm.patchValue({
                        admissionsOffice: this.studentParams.ADMISSIONS_OFFICE_ID,
                        trainingOffice: this.studentParams.TRAINING_OFFICE_ID,
                        dormitoryArea: this.studentParams.DORMITORY_ADDRESS,
                        languageSchool: this.studentParams.SCHOOL_ID,
                        flightRoute: this.studentParams.FLIGHT_ID,
                        entryGroup: this.studentParams.ENTRY_GROUP,
                        departureDate: getDateForDatepicker(this.studentParams.DEPARTURE_DATE),
                        entryDate: getDateForDatepicker(this.studentParams.ARRIVAL_DATE),
                        registeredDormitory: this.studentParams.DORMITORY_ID,
                        registeredService: this.studentParams.SERVICES_ID?.split(','),
                        studentId: this.studentParams.STUDENT_ID,
                        studentName: this.studentParams.FULL_NAME
                    });

                } else {
                    this.mode = Const.MODE_INS;
                    this.studentParams = {} as any;
                }
            },
            (error: any) => {
                console.error(error);
            }).subscribe();
    }

    resetForm(): void {
        this.mode = Const.MODE_INS;
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
            registeredService: [],
            studentId: { value: null, disabled: true },
            studentName: ''
        });
        this.studentForm.get('studentId')?.disable();
    }

    save() {
        if (this.studentForm.invalid) {
            this.studentForm.markAllAsTouched();

            // Tự động scroll đến field bị lỗi đầu tiên
            const firstInvalidControl = document.querySelector('.ng-invalid');
            if (firstInvalidControl) {
                firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Lấy dữ liệu từ form
        let formData = { ...this.studentForm.value };

        // Chuyển đổi ngày thành định dạng YYYY-MM-DD
        if (formData.departureDate) {
            formData.departureDate = getDateRequest(formData.departureDate);
        }
        if (formData.entryDate) {
            formData.entryDate = getDateRequest(formData.entryDate);
        }

        // Tạo request với accessInfo và dữ liệu đã chuyển đổi
        let request = {
            accessInfo: this.accessInfo.getAll(),
            ...formData,
            mode: this.mode,
            studentId: this.studentParams.STUDENT_ID
        };

        this.webService.callWs('student-regist-update', request,
            (response) => {
                if (response) {
                    if (this.mode === Const.MODE_INS) {
                        if (response.regCnt > 0) {
                            this.dialogRef.close({ "isSuccessfull": true });
                        } else {
                            this.dialogRef.close({ "isSuccessfull": false });
                        }
                    } else {
                        if (response.updCnt > 0) {
                            this.dialogRef.close({ "isSuccessfull": true });
                        } else {
                            this.dialogRef.close({ "isSuccessfull": false });
                        }
                    }
                }
            },
            () => { }).subscribe();
    }

    isCreateMode(): boolean {
        return this.mode === Const.MODE_INS;
    }

    isUpdateMode(): boolean {
        return this.mode === Const.MODE_UPD;
    }


}