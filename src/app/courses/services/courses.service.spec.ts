import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({

      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ]

    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {

    // Verify, that no other http requests apart from the specified are executed
    httpTestingController.verify();

  });

  it('should retrieve all courses', () => {


    coursesService.findAllCourses()
      .subscribe(courses => {

        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12);

        const course = courses.find(course => course.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');

      });

    let req = httpTestingController.expectOne('/api/courses');

    expect(req.request.method).toEqual('GET');

    req.flush({payload: Object.values(COURSES)});
  });

  it('should find a course by id', () => {


    // console.log('test start');

    coursesService.findCourseById(12)
      .subscribe(course => {

        // console.log(course);

        expect(course).toBeTruthy();
        expect(course.id).toBe(12);

      });

    let req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[12]);
  });

  it('should save the course data', () => {

    let changes: Partial<Course> = {
      titles: {
        description: 'Testing Course',
      }
    };

    coursesService.saveCourse(12,
      changes)
      .subscribe(course => {
        expect(course.id).toBe(12);
        expect(course.titles.description).toBe('Testing Course');
        // expect(course.titles.longDescription).toBe('In-depth guide to Unit Testing and E2E Testing of Angular Applications');
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush({
      ...COURSES[12],
      ...changes,
    });

  });

  it('should give an error if save course fails', () => {
    let changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');

    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {

    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });


  });

});
