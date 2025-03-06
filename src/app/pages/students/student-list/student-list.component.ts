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
import { dateValidator, getDateRequest } from 'src/app/custom-date-adapter';
import { DateInputDirective } from 'src/app/date-input.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { NotifyModalComponent } from 'src/app/layouts/components/notify-modal/notify-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { pageSize, pageSizeOptions } from 'src/app/app.const';

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
export class StudentListComponent implements OnInit, AfterViewInit {
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
        private dialog: MatDialog
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

    /**
         * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
         * We are simulating this request here.
         */
    getData() {
        return of(aioTableData.map((customer) => new Customer(customer)));
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
        this.pageEvent = e;
        this.recordsTotal = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.search();
    }

    search() {
        if (this.studentForm.invalid) {
            this.studentForm.markAllAsTouched();
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
            pageInfo: {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            }
        };

        this.webService.callWs('student-search', request,
            (response) => {
                if (response) {
                    console.log('Search Result:', response);
                    if (response.recordsTotal > 0 && response.listStudents) {
                        this.recordsTotal = response.recordsTotal;
                        this.listStudents = response.listStudents;
                    } else {
                        this.notifyService.info('No data found', null);
                    }
                }
            },
            () => { }).subscribe();
    }


    subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
    data$: Observable<Customer[]> = this.subject$.asObservable();
    customers: Customer[] = [];

    ngAfterViewInit() {
        this.getData().subscribe((customers) => {
            this.subject$.next(customers);
        });

        this.dataSource = new MatTableDataSource();

        this.data$.pipe(filter<Customer[]>(Boolean)).subscribe((customers) => {
            this.customers = customers;
            this.dataSource.data = customers;
        });

        this.searchCtrl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => this.onFilterChange(value));

        // Khởi tạo phân trang và sắp xếp cho bảng
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    createCustomer() {
        this.dialog
            .open(NotifyModalComponent)
            .afterClosed()
            .subscribe((customer: Customer) => {
                /**
                 * Customer is the updated customer (if the user pressed Save - otherwise it's null)
                 */
                if (customer) {
                    /**
                     * Here we are updating our local array.
                     * You would probably make an HTTP request here.
                     */
                    this.customers.unshift(new Customer(customer));
                    this.subject$.next(this.customers);
                }
            });
    }

    updateCustomer(customer: Customer) {
        this.dialog
            .open(NotifyModalComponent, {
                data: customer
            })
            .afterClosed()
            .subscribe((updatedCustomer) => {
                /**
                 * Customer is the updated customer (if the user pressed Save - otherwise it's null)
                 */
                if (updatedCustomer) {
                    /**
                     * Here we are updating our local array.
                     * You would probably make an HTTP request here.
                     */
                    const index = this.customers.findIndex(
                        (existingCustomer) => existingCustomer.id === updatedCustomer.id
                    );
                    this.customers[index] = new Customer(updatedCustomer);
                    this.subject$.next(this.customers);
                }
            });
    }

    deleteCustomer(customer: Customer) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.customers.splice(
            this.customers.findIndex(
                (existingCustomer) => existingCustomer.id === customer.id
            ),
            1
        );
        this.selection.deselect(customer);
        this.subject$.next(this.customers);
    }

    deleteCustomers(customers: Customer[]) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        customers.forEach((c) => this.deleteCustomer(c));
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
            return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column: TableColumn<Customer>, event: Event) {
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

    onLabelChange(change: MatSelectChange, row: Customer) {
        const index = this.customers.findIndex((c) => c === row);
        this.customers[index].labels = change.value;
        this.subject$.next(this.customers);
    }

    @Input()
    columns: TableColumn<Customer>[] = [
        {
            label: 'Checkbox',
            property: 'checkbox',
            type: 'checkbox',
            visible: true
        },
        { label: 'Image', property: 'image', type: 'image', visible: true },
        {
            label: 'Name',
            property: 'name',
            type: 'text',
            visible: true,
            cssClasses: ['font-medium']
        },
        {
            label: 'First Name',
            property: 'firstName',
            type: 'text',
            visible: false
        },
        { label: 'Last Name', property: 'lastName', type: 'text', visible: false },
        { label: 'Contact', property: 'contact', type: 'button', visible: true },
        {
            label: 'Address',
            property: 'address',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'Street',
            property: 'street',
            type: 'text',
            visible: false,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'Zipcode',
            property: 'zipcode',
            type: 'text',
            visible: false,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'City',
            property: 'city',
            type: 'text',
            visible: false,
            cssClasses: ['text-secondary', 'font-medium']
        },
        {
            label: 'Phone',
            property: 'phoneNumber',
            type: 'text',
            visible: true,
            cssClasses: ['text-secondary', 'font-medium']
        },
        { label: 'Labels', property: 'labels', type: 'button', visible: true },
        { label: 'Actions', property: 'actions', type: 'button', visible: true }
    ];
    dataSource!: MatTableDataSource<Customer>;
    selection = new SelectionModel<Customer>(true, []);
    searchCtrl = new UntypedFormControl();

    labels = "labels";

    @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    get visibleColumns() {
        return this.columns
            .filter((column) => column.visible)
            .map((column) => column.property);
    }
}

export class Customer {
    id: number;
    imageSrc: string;
    firstName: string;
    lastName: string;
    street: string;
    zipcode: number;
    city: string;
    phoneNumber: string;
    mail: string;
    labels: any;
    notes: string;

    constructor(customer: any) {
        this.id = customer.id;
        this.imageSrc = customer.imageSrc;
        this.firstName = customer.firstName;
        this.lastName = customer.lastName;
        this.street = customer.street;
        this.zipcode = customer.zipcode;
        this.city = customer.city;
        this.phoneNumber = customer.phoneNumber;
        this.mail = customer.mail;
        this.labels = customer.labels;
        this.notes = customer.notes;
    }

    get name() {
        let name = '';

        if (this.firstName && this.lastName) {
            name = this.firstName + ' ' + this.lastName;
        } else if (this.firstName) {
            name = this.firstName;
        } else if (this.lastName) {
            name = this.lastName;
        }

        return name;
    }

    set name(value) { }

    get address() {
        return `${this.street}, ${this.zipcode} ${this.city}`;
    }

    set address(value) { }
}
export const aioTableLabels = [
    {
        text: 'New',
        textClass: 'text-green-600',
        bgClass: 'bg-green-600/10',
        previewClass: 'bg-green-600'
    },
    {
        text: 'Lead',
        textClass: 'text-cyan-600',
        bgClass: 'bg-cyan-600/10',
        previewClass: 'bg-cyan-600'
    },
    {
        text: 'In Progress',
        textClass: 'text-teal-600',
        bgClass: 'bg-teal-600/10',
        previewClass: 'bg-teal-600'
    },
    {
        text: 'Completed',
        textClass: 'text-purple-600',
        bgClass: 'bg-purple-600/10',
        previewClass: 'bg-purple-600'
    }
];

export const aioTableData = [
    {
        id: 0,
        imageSrc: 'assets/img/avatars/20.jpg',
        firstName: 'Dejesus',
        lastName: 'Chang',
        street: '899 Raleigh Place',
        zipcode: 8057,
        city: 'Munjor',
        phoneNumber: '+32 (818) 580-3557',
        mail: 'dejesus.chang@yourcompany.biz',
        labels: [aioTableLabels[0], aioTableLabels[1]]
    },
    {
        id: 1,
        imageSrc: 'assets/img/avatars/1.jpg',
        firstName: 'Short',
        lastName: 'Lowe',
        street: '548 Cypress Avenue',
        zipcode: 5943,
        city: 'Temperanceville',
        phoneNumber: '+11 (977) 574-3636',
        mail: 'short.lowe@yourcompany.ca',
        labels: [aioTableLabels[1]]
    },
    {
        id: 2,
        imageSrc: 'assets/img/avatars/2.jpg',
        firstName: 'Antoinette',
        lastName: 'Carson',
        street: '299 Roder Avenue',
        zipcode: 7894,
        city: 'Crayne',
        phoneNumber: '+49 (969) 505-3323',
        mail: 'antoinette.carson@yourcompany.net',
        labels: [aioTableLabels[3]]
    },
    {
        id: 3,
        imageSrc: 'assets/img/avatars/3.jpg',
        firstName: 'Lynnette',
        lastName: 'Adkins',
        street: '158 Cyrus Avenue',
        zipcode: 4831,
        city: 'Coyote',
        phoneNumber: '+48 (836) 545-3237',
        mail: 'lynnette.adkins@yourcompany.info',
        labels: [aioTableLabels[3]]
    },
    {
        id: 4,
        imageSrc: 'assets/img/avatars/4.jpg',
        firstName: 'Patrica',
        lastName: 'Good',
        street: '995 Kansas Place',
        zipcode: 4679,
        city: 'Whitmer',
        phoneNumber: '+36 (955) 485-3652',
        mail: 'patrica.good@yourcompany.me',
        labels: [aioTableLabels[0]]
    },
    {
        id: 5,
        imageSrc: 'assets/img/avatars/5.jpg',
        firstName: 'Kane',
        lastName: 'Koch',
        street: '779 Lynch Street',
        zipcode: 6178,
        city: 'Newcastle',
        phoneNumber: '+35 (983) 587-3423',
        mail: 'kane.koch@yourcompany.org',
        labels: [aioTableLabels[1]]
    },
    {
        id: 6,
        imageSrc: 'assets/img/avatars/6.jpg',
        firstName: 'Donovan',
        lastName: 'Gonzalez',
        street: '781 Knickerbocker Avenue',
        zipcode: 532,
        city: 'Frizzleburg',
        phoneNumber: '+47 (914) 469-3270',
        mail: 'donovan.gonzalez@yourcompany.tv',
        labels: [aioTableLabels[2]]
    },
    {
        id: 7,
        imageSrc: 'assets/img/avatars/7.jpg',
        firstName: 'Sabrina',
        lastName: 'Logan',
        street: '112 Glen Street',
        zipcode: 4763,
        city: 'Frystown',
        phoneNumber: '+37 (896) 474-3143',
        mail: 'sabrina.logan@yourcompany.co.uk',
        labels: [aioTableLabels[0], aioTableLabels[1]]
    },
    {
        id: 8,
        imageSrc: 'assets/img/avatars/8.jpg',
        firstName: 'Estela',
        lastName: 'Jordan',
        street: '626 Stryker Court',
        zipcode: 9966,
        city: 'Blende',
        phoneNumber: '+2 (993) 445-3626',
        mail: 'estela.jordan@yourcompany.name',
        labels: [aioTableLabels[0]]
    },
    {
        id: 9,
        imageSrc: 'assets/img/avatars/9.jpg',
        firstName: 'Rosanna',
        lastName: 'Cross',
        street: '540 Fiske Place',
        zipcode: 4204,
        city: 'Bellfountain',
        phoneNumber: '+12 (877) 563-2737',
        mail: 'rosanna.cross@yourcompany.biz',
        labels: [aioTableLabels[2]]
    },
    {
        id: 10,
        imageSrc: 'assets/img/avatars/10.jpg',
        firstName: 'Mary',
        lastName: 'Jane',
        street: '233 Glen Place',
        zipcode: 4221,
        city: 'Louisville',
        phoneNumber: '+15 (877) 334-2231',
        mail: 'Mary.jane@yourcompany.biz',
        labels: [aioTableLabels[1]]
    },
    {
        id: 11,
        imageSrc: 'assets/img/avatars/11.jpg',
        firstName: 'Lane',
        lastName: 'Delaney',
        street: 'Langham Street',
        zipcode: 6411,
        city: 'Avoca',
        phoneNumber: '+1 (969) 570-2843',
        mail: 'lane.delaney@yourcompany.ca',
        labels: [aioTableLabels[3]]
    },
    {
        id: 12,
        imageSrc: 'assets/img/avatars/12.jpg',
        firstName: 'Cooper',
        lastName: 'Odom',
        street: 'Shale Street',
        zipcode: 5286,
        city: 'Joes',
        phoneNumber: '+1 (812) 535-2368',
        mail: 'cooper.odom@yourcompany.info',
        labels: [aioTableLabels[3]]
    },
    {
        id: 13,
        imageSrc: 'assets/img/avatars/13.jpg',
        firstName: 'Kirby',
        lastName: 'Hardin',
        street: 'Rodney Street',
        zipcode: 4864,
        city: 'Finzel',
        phoneNumber: '+1 (838) 519-3416',
        mail: 'kirby.hardin@yourcompany.us',
        labels: [aioTableLabels[3]]
    },
    {
        id: 14,
        imageSrc: 'assets/img/avatars/14.jpg',
        firstName: 'Marquita',
        lastName: 'Haynes',
        street: 'Townsend Street',
        zipcode: 9000,
        city: 'Walland',
        phoneNumber: '+1 (965) 482-2100',
        mail: 'marquita.haynes@yourcompany.me',
        labels: [aioTableLabels[2]]
    },
    {
        id: 15,
        imageSrc: 'assets/img/avatars/15.jpg',
        firstName: 'Horton',
        lastName: 'Townsend',
        street: 'Gunnison Court',
        zipcode: 9519,
        city: 'Nettie',
        phoneNumber: '+1 (941) 434-2481',
        mail: 'horton.townsend@yourcompany.biz',
        labels: [aioTableLabels[0]]
    },
    {
        id: 16,
        imageSrc: 'assets/img/avatars/16.jpg',
        firstName: 'Carrie',
        lastName: 'Bond',
        street: 'Bushwick Court',
        zipcode: 4345,
        city: 'Colton',
        phoneNumber: '+1 (854) 556-2844',
        mail: 'carrie.bond@yourcompany.biz',
        labels: [aioTableLabels[0]]
    },
    {
        id: 17,
        imageSrc: 'assets/img/avatars/17.jpg',
        firstName: 'Carroll',
        lastName: 'Pugh',
        street: 'Baltic Street',
        zipcode: 8174,
        city: 'Innsbrook',
        phoneNumber: '+1 (989) 561-2440',
        mail: 'carroll.pugh@yourcompany.tv',
        labels: [aioTableLabels[0]]
    },
    {
        id: 18,
        imageSrc: 'assets/img/avatars/18.jpg',
        firstName: 'Fuller',
        lastName: 'Espinoza',
        street: 'Dooley Street',
        zipcode: 9034,
        city: 'Maybell',
        phoneNumber: '+1 (807) 417-3508',
        mail: 'fuller.espinoza@yourcompany.name',
        labels: [aioTableLabels[1]]
    },
    {
        id: 19,
        imageSrc: 'assets/img/avatars/19.jpg',
        firstName: 'Lamb',
        lastName: 'Herring',
        street: 'Exeter Street',
        zipcode: 2246,
        city: 'Fowlerville',
        phoneNumber: '+1 (950) 429-3240',
        mail: 'lamb.herring@yourcompany.com',
        labels: [aioTableLabels[2]]
    },
    {
        id: 20,
        imageSrc: 'assets/img/avatars/20.jpg',
        firstName: 'Liza',
        lastName: 'Price',
        street: 'Homecrest Avenue',
        zipcode: 8843,
        city: 'Idledale',
        phoneNumber: '+1 (989) 483-2305',
        mail: 'liza.price@yourcompany.net',
        labels: [aioTableLabels[1]]
    },
    {
        id: 21,
        imageSrc: 'assets/img/avatars/1.jpg',
        firstName: 'Monroe',
        lastName: 'Head',
        street: 'Arlington Avenue',
        zipcode: 2792,
        city: 'Garberville',
        phoneNumber: '+1 (921) 598-2475',
        mail: 'monroe.head@yourcompany.io',
        labels: [aioTableLabels[1]]
    },
    {
        id: 22,
        imageSrc: 'assets/img/avatars/2.jpg',
        firstName: 'Lucile',
        lastName: 'Harding',
        street: 'Division Place',
        zipcode: 8572,
        city: 'Celeryville',
        phoneNumber: '+1 (823) 429-3500',
        mail: 'lucile.harding@yourcompany.org',
        labels: [aioTableLabels[0]]
    },
    {
        id: 23,
        imageSrc: 'assets/img/avatars/3.jpg',
        firstName: 'Edna',
        lastName: 'Richard',
        street: 'Harbor Lane',
        zipcode: 8323,
        city: 'Lindisfarne',
        phoneNumber: '+1 (970) 580-3162',
        mail: 'edna.richard@yourcompany.ca',
        labels: [aioTableLabels[0]]
    },
    {
        id: 24,
        imageSrc: 'assets/img/avatars/4.jpg',
        firstName: 'Avila',
        lastName: 'Lancaster',
        street: 'Kay Court',
        zipcode: 9294,
        city: 'Welch',
        phoneNumber: '+1 (817) 412-3752',
        mail: 'avila.lancaster@yourcompany.info',
        labels: [aioTableLabels[0]]
    },
    {
        id: 25,
        imageSrc: 'assets/img/avatars/5.jpg',
        firstName: 'Carlene',
        lastName: 'Newman',
        street: 'Atlantic Avenue',
        zipcode: 2230,
        city: 'Eagleville',
        phoneNumber: '+1 (953) 483-3110',
        mail: 'carlene.newman@yourcompany.us',
        labels: [aioTableLabels[3]]
    },
    {
        id: 26,
        imageSrc: 'assets/img/avatars/6.jpg',
        firstName: 'Griffith',
        lastName: 'Wise',
        street: 'Perry Terrace',
        zipcode: 9564,
        city: 'Iola',
        phoneNumber: '+1 (992) 447-3392',
        mail: 'griffith.wise@yourcompany.me',
        labels: [aioTableLabels[0]]
    },
    {
        id: 27,
        imageSrc: 'assets/img/avatars/7.jpg',
        firstName: 'Schwartz',
        lastName: 'Dodson',
        street: 'Dorset Street',
        zipcode: 4425,
        city: 'Dexter',
        phoneNumber: '+1 (923) 504-2799',
        mail: 'schwartz.dodson@yourcompany.biz',
        labels: [aioTableLabels[1]]
    },
    {
        id: 28,
        imageSrc: 'assets/img/avatars/8.jpg',
        firstName: 'Susanna',
        lastName: 'Kidd',
        street: 'Loring Avenue',
        zipcode: 6432,
        city: 'Cascades',
        phoneNumber: '+1 (854) 456-2734',
        mail: 'susanna.kidd@yourcompany.biz',
        labels: [aioTableLabels[1]]
    },
    {
        id: 29,
        imageSrc: 'assets/img/avatars/9.jpg',
        firstName: 'Deborah',
        lastName: 'Weiss',
        street: 'Haring Street',
        zipcode: 2989,
        city: 'Barstow',
        phoneNumber: '+1 (833) 465-3036',
        mail: 'deborah.weiss@yourcompany.tv',
        labels: [aioTableLabels[2]]
    }
];
