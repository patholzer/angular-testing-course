import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';


// use 'spyOn(logger)' to create a java spy on a object
// createSpyObj creates a mock in the java world


describe('CalculatorService', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    console.log('Calling beforeEach');
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    calculator = new CalculatorService(loggerSpy);
  });

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
