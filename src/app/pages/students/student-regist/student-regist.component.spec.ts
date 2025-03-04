import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegistComponent } from './student-regist.component';

describe('StudentRegistComponent', () => {
  let component: StudentRegistComponent;
  let fixture: ComponentFixture<StudentRegistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRegistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentRegistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
