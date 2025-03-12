import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild, Input } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { filter, Observable, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
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
import { CustomDateAdapter, getDateRequest } from 'src/app/custom-date-adapter';
import { DateInputDirective } from 'src/app/date-input.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { pageSize, pageSizeOptions } from 'src/app/app.const';
import { StudentRegistUpdateComponent } from '../student-regist/student-regist-update.component';
import { MessageService } from 'src/app/services/messages.service';
import { th } from 'date-fns/locale';

@Component({
    selector: 'vex-student-list',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, MatOptionModule, MatSelectModule,
        MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatDatepickerModule,
        VexSecondaryToolbarComponent, VexBreadcrumbsComponent, DateInputDirective,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        NgClass,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ],
    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [stagger60ms, fadeInUp400ms],
})
export class StudentListComponent implements OnInit {
    currentLanguage$: Observable<string> | undefined;
    currentLanguage: string = "";
    currentDateFormat: string = "";
    listFlights: any[] = [];
    listSchools: any[] = [];
    listTrainingOffices: any[] = [];
    listDormitories: any[] = [];
    listServices: any[] = [];
    listAdmissionsOffices: any[] = [];
    formItemName: any[] = [];
    studentForm: FormGroup;
    crumbs: any[] = [];
    dateMessage = "";

    columns: TableColumn<any>[] = [];
    dataSource!: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);
    searchCtrl = new UntypedFormControl();

    @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private store: Store,
        private webService: WebServiceService,
        private accessInfo: AccessInfoService,
        private notifyService: NotifyService,
        private languageService: LanguageService,
        private messageService: MessageService,
        private dialog: MatDialog,
        private dateAdapter: CustomDateAdapter
    ) {
        // Kiểm tra localStorage để set ngôn ngữ mặc định
        this.currentLanguage$ = this.languageService.currentLanguage$;
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language;
            this.accessInfo.language = language;
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
            studentId: [''],
            studentName: ['']
        });

        this.currentDateFormat = this.dateAdapter.getCurrentDateFormat();
        this.dateMessage = this.messageService.getMessage("NOR_ERR_003");
    }

    fnGetFormItemName(): void {
        let request = {
            accessInfo: this.accessInfo.getAll(),
            screenId: 'STUDENT_LIST'
        };

        this.webService.callWs('getFormItemNm', request,
            (response) => {
                this.formItemName = response.listFormItemName;
                this.crumbs = [];
                this.crumbs.push(response.listFormItemName[1]?.FORMITEMNAME);
                this.crumbs.push(response.listFormItemName[2]?.FORMITEMNAME);

                this.fnInitTable();

                this.cd.markForCheck();
            },
            (error) => {
                console.error(error);
            }).subscribe();
    }

    ngOnInit(): void {
        this.fnInit();
    }

    fnInit(): void {
        //this.fnGetFormItemName();

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
            (error) => {
                console.error(error);
            }).subscribe();
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
            registeredService: [],
            studentId: '',
            studentName: ''
        });
    }

    listStudents: any[] = [];
    pageSizeOptions = pageSizeOptions;
    pageSize = pageSize;
    pageIndex = 0;
    recordsTotal = 0;

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;

    pageEvent: PageEvent | undefined;
    /**
     * Xử lý sự kiện phân trang
     * @param e 
     */
    handlePageEvent(e: PageEvent) {
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.search();
    }

    search() {
        if (this.studentForm.invalid) {
            this.studentForm.markAllAsTouched();
            return;
        }

        let formData = { ...this.studentForm.value };

        if (formData.departureDate) {
            formData.departureDate = getDateRequest(formData.departureDate);
        }
        if (formData.entryDate) {
            formData.entryDate = getDateRequest(formData.entryDate);
        }

        let request = {
            accessInfo: this.accessInfo.getAll(),
            ...formData,
            pageInfo: {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            }
        };

        this.webService.callWs('student-search', request,
            (response) => {
                if (response) {
                    console.log('Total records:', response.recordsTotal); // Debug

                    if (response.recordsTotal > 0 && response.listStudents) {
                        console.log(this.paginator);
                        this.recordsTotal = response.recordsTotal; // Cập nhật tổng số bản ghi
                        this.listStudents = response.listStudents;
                        this.dataSource.data = this.listStudents;
                        console.log(this.paginator);
                    } else {
                        this.listStudents = [];
                        this.dataSource.data = [];
                        this.recordsTotal = 0;
                        this.notifyService.error(response.fatalError[0]?.errMsg, null);
                    }
                }
            },
            (error) => {
                console.error(error);
            }).subscribe();
    }


    subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    data$: Observable<any[]> = this.subject$.asObservable();

    fnInitTable() {
        this.getColumnConfig();

        this.dataSource = new MatTableDataSource();

        this.data$.pipe(filter<any[]>(Boolean)).subscribe((listStudents) => {
            this.listStudents = listStudents;
            this.dataSource.data = listStudents;
        });

        this.searchCtrl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => this.onFilterChange(value));


        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    downloadExcel() {
        this.executeDownloadXls([]);
    }

    selectedFile: File | null = null;
    onFileSelected(event: any) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            console.log('File Name:', this.selectedFile.name);
            console.log('File Size:', this.selectedFile.size);
            console.log('File:', this.selectedFile);

            let messageConfirm = this.messageService.getMessage("NOR_INF_006");
            messageConfirm = messageConfirm.replace("%1", this.selectedFile.name);
            messageConfirm = messageConfirm.replace("%2", this.convertBytes(this.selectedFile.size));

            this.notifyService.confirm(messageConfirm,
                () => {
                    this.uploadFile();
                }, () => {
                    this.selectedFile = null;
                    this.cd.markForCheck();
                });
        }
    }

    uploadFile() {
        if (!this.selectedFile) {
            return;
        }

        let formData = new FormData();
        formData.append('file', this.selectedFile);

        // Chuyển accessInfo thành JSON và append vào FormData
        formData.append('accessInfo', JSON.stringify(this.accessInfo.getAll()));

        this.webService.callWebServiceForFileUpload('student-import-xlsx', formData,
            (response) => {
                if (response) {
                    let message = this.messageService.getMessage("NOR_INF_005");
                    message = message.replace("%1", response.numberOfRows);
                    message = message.replace("%2", response.numberOfRowSuccess);
                    message = message.replace("%3", response.numberOfRowError);
                    this.notifyService.info(message, null);
                    this.selectedFile = null;
                    this.cd.markForCheck();
                    this.search();
                }
            },
            (error) => {
                console.error(error);
            }).subscribe();
    }

    createStudent() {
        this.dialog
            .open(StudentRegistUpdateComponent, {
                disableClose: true, // Prevent closing the modal when clicking outside
                width: '80%'
            })
            .afterClosed()
            .subscribe((result: any) => {
                if (result && result.isSuccessfull) {
                    this.notifyService.info(this.messageService.getMessage("NOR_INF_001"), null);
                    this.search();
                }
            });
    }

    updateStudent(student: any) {
        this.dialog
            .open(StudentRegistUpdateComponent, {
                data: student,
                disableClose: true, // Prevent closing the modal when clicking outside
                width: '80%'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.isSuccessfull) {
                    this.notifyService.info(this.messageService.getMessage("NOR_INF_002"), null);
                    this.search();
                }
            });
    }

    deleteStudent(student: any) {
        this.executeDeleteStudent([...student]);
    }

    deleteStudents(listStudents: any[]) {
        this.executeDeleteStudent(listStudents);
    }

    executeDeleteStudent(listStudents: any[]) {
        // Tạo request với accessInfo và dữ liệu đã chuyển đổi
        let request = {
            accessInfo: this.accessInfo.getAll(),
            listStudents: listStudents
        };

        this.webService.callWs('student-delete', request,
            (response) => {
                if (response && response.delCnt > 0) {
                    this.notifyService.info(this.messageService.getMessage("NOR_INF_003"), null);
                    this.selection.clear();
                    this.search();
                }
            },
            (error) => {
                console.error(error);
            }).subscribe();
    }

    downloadXls(listStudents: any[]) {
        this.executeDownloadXls([...listStudents]);
    }

    executeDownloadXls(listStudents: any[]) {
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
            listStudents: listStudents,
            ...formData,
        };

        this.webService.callDownloadWs('student-export-xlsx', request,
            (response) => {
                this.notifyService.info(this.messageService.getMessage("NOR_INF_004"), null);
            },
            (error) => { console.log(error) }).subscribe();
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
            return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column: TableColumn<any>, event: Event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        column.visible = !column.visible;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    trackByProperty<T>(index: number, column: TableColumn<T>) {
        return column.property;
    }

    onLabelChange(change: MatSelectChange, row: any) {
        const index = this.listStudents.findIndex((c) => c === row);
        this.listStudents[index].labels = change.value;
        this.subject$.next(this.listStudents);
    }

    getColumnConfig() {
        let columnsConfig: TableColumn<any>[] = [
            {
                label: 'Checkbox',
                property: 'checkbox',
                type: 'checkbox',
                visible: true
            },
            { label: 'Actions', property: 'actions', type: 'button', visible: true },
            {
                label: this.formItemName[14]?.FORMITEMNAME,
                property: 'STUDENT_ID',
                type: 'text',
                visible: true
            }, {
                label: this.formItemName[15]?.FORMHINT,
                property: 'FULL_NAME',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[7]?.FORMITEMNAME,
                property: 'SCHOOL_NAME',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[4]?.FORMHINT,
                property: 'ADMISSIONS_OFFICE_NAME',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[5]?.FORMHINT,
                property: 'TRAINING_OFFICE_NAME',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[29]?.FORMITEMNAME,
                property: 'DORMITORY_TYPE_NAME',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[30]?.FORMITEMNAME,
                property: 'DORMITORY_ADDRESS',
                type: 'text',
                visible: true,
                cssClasses: ['font-medium']
            },
            {
                label: this.formItemName[13]?.FORMITEMNAME,
                property: 'SERVICES_NAME',
                type: 'labels',
                visible: true,
                cssClasses: ['font-medium']
            }
        ];

        this.columns = columnsConfig;
    }


    get visibleColumns() {
        return this.columns
            .filter((column) => column.visible)
            .map((column) => column.property);
    }

    // Hàm để chuyển đổi dung lượng từ byte sang KB hoặc MB
    convertBytes(bytes: number): string {
        if (bytes < 1024 * 1024) {
            const kb = bytes / 1024;
            return `${kb.toFixed(2)} KB`;
        } else {
            const mb = bytes / (1024 * 1024);
            return `${mb.toFixed(2)} MB`;
        }
    }
}