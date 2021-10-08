import {async, ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CoursesService} from '../services/courses.service';
import {AppModule} from '../../app.module';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {click} from '../common/test-utils';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugElement: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');


  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        AppModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });


  it('should display only beginner courses', () => {

    coursesService.findAllCourses.and.returnValue(
      of(beginnerCourses)
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    expect(tabs[0].nativeElement.textContent).toBe('Beginners');

  });


  it('should display only advanced courses', () => {

    coursesService.findAllCourses.and.returnValue(
      of(advancedCourses)
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    expect(tabs[0].nativeElement.textContent).toBe('Advanced');

  });


  it('should display both tabs', () => {

    coursesService.findAllCourses.and.returnValue(
      of(
        setupCourses()
        // TODO WHY NO WORKS?!
        // {
        //   ...beginnerCourses,
        //   ...advancedCourses
        // }
      )
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
    expect(tabs[0].nativeElement.textContent).toBe('Beginners');
    expect(tabs[1].nativeElement.textContent).toBe('Advanced');
  });


  it('should display advanced courses when tab clicked', (done) => {

    coursesService.findAllCourses.and.returnValue(
      of(
        setupCourses()
      )
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    setTimeout(() => {

      const cardTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0);
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

      done();
    }, 500);

  });


  it('should display advanced courses when tab clicked with FakeAsync', fakeAsync(() => {

    coursesService.findAllCourses.and.returnValue(
      of(
        setupCourses()
      )
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0);
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  it('should display advanced courses when tab clicked with waitForAsync', waitForAsync(() => {

    coursesService.findAllCourses.and.returnValue(
      of(
        setupCourses()
      )
    );

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const cardTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0);
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });

  }));

});


