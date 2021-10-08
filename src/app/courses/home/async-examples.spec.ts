import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

describe('Async Testing Examples', () => {


  it('Async test examples with Jasmine done()', (done) => {

    let test = false;

    setTimeout(() => {

      console.log('running assertions');

      test = true;

      expect(test).toBeTruthy();

      done();

    }, 1000);
  });

  it('Async test examples - setTimeout()', fakeAsync(() => {

    let test = false;

    setTimeout(() => {
    });

    setTimeout(() => {

      console.log('running assertions setTimeout()');

      test = true;

      // expect(test).toBeTruthy();

    }, 1000);

    // tick dreht die Uhr nach vorne

    // tick(1000);


    // flush wartet ab bis alles asynchronses vorbei ist
    flush();

    expect(test).toBeTruthy();


  }));


  it('Async Test examples - plain promise', fakeAsync(() => {

    let test = false;

    console.log('Creating promise');

    // promise = micro task - wird bevorzugt behandelt
    // setTimeout = task -> wird nach micro tasks gestellt

    // setTimeout(() => {
    //   console.log('setTimeout() first callback triggered');
    // });
    // setTimeout(() => {
    //   console.log('setTimeout() second callback triggered');
    // });

    Promise.resolve().then(() => {
      console.log('Promise first then');

      test = true;

      return Promise.resolve();
    }).then(() => {
      console.log('Promise second then');
    });

    flushMicrotasks();

    console.log('Running test assertions');


    expect(test).toBeTruthy();

  }));


  it('promises + setTimeout()', fakeAsync(() => {

    let counter = 0;

    Promise.resolve()
      .then(() => {

        counter += 10;

        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    flush(); // oder use tick(1000);
    expect(counter).toBe(11);
  }));

  it('Observables', fakeAsync(() => {

    let test = false;

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    expect(test).toBe(true);

  }));

});
