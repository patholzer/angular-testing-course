import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';


describe('CalculatorService With DependencyInjection', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    console.log('Calling beforeEach');
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    // define the dependency injection for the test environment
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        // replace loggerService instance with loggerSpy object
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });

    calculator = TestBed.inject(CalculatorService);
  });

  // fit('should add two numbers', () => {    --> Nur dieser Test wird ausgeführt weil 'fit'
  it('should add two numbers', () => {
    console.log('Add test');

    let result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);

  });

  it('should subtract two numbers', () => {
    console.log('Subtract beforeEach');

    let result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected subtraction result');

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });


});
