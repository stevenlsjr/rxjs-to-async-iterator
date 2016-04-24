# rxjs-to-async-iterator [![Build Status](https://travis-ci.org/tangledfruit/rxjs-to-async-iterator.svg?branch=master)](https://travis-ci.org/tangledfruit/rxjs-to-async-iterator) [![Coverage Status](https://coveralls.io/repos/tangledfruit/rxjs-to-async-iterator/badge.svg?branch=master&service=github)](https://coveralls.io/github/tangledfruit/rxjs-to-async-iterator?branch=master) [![Docs](https://inch-ci.org/github/tangledfruit/rxjs-to-async-iterator.svg?branch=master)](https://inch-ci.org/github/tangledfruit/rxjs-to-async-iterator)

Convert RxJS Observable streams to async iterators (for RxJS 5.0+)

This module is primarily intended for use in testing more complex RxJS-based async sequences, though that doesn't preclude other use cases.

It is intended for use with [mocha](https://www.npmjs.com/package/mocha) for testing as modified by [co-mocha](https://www.npmjs.com/package/co-mocha) for coroutine/generator support.

A comparable library exists for RxJS 4.x at [rx-to-async-iterator](https://github.com/tangledfruit/rx-to-async-iterator). (Same name minus the 'js'.)


## Installation

### NPM

```sh
npm install --save rxjs-to-async-iterator
```

## Usage

```js
require('co-mocha');
const Rx = require('rx');
const chai = require('chai');
const expect = chai.expect;
require ('to-async-iterator');
  // Side effect: Adds methods to Rx.Observable prototype.

describe("some examples", function() {

  it("can verify that an Observable generates a predetermined sequence of values", function* () {

    const iter = Rx.Observable.of([42, 45]).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal(42);
      // Will throw if error or complete are produced.
    expect(yield iter.nextValue()).to.equal(45);

    yield iter.shouldComplete();
      // Will throw if next or error are produced.

  });

  it("has a shortcut form for an Observable that produces a single value", function* () {

    expect(yield Rx.Observable.of(47).shouldGenerateOneValue()).to.equal(47);
      // Will throw if any sequence other than next(47), complete() is produced.

  });

  it("has a shortcut form for an Observable that produces no values", function* () {

    expect(yield Rx.Observable.empty(47).shouldBeEmpty();
      // Will throw if next or error are produced.

  });

    it("can verify that an Observable generates an error", function* () {

    const iter = Rx.Observable.throw(new Error("expected failure")).toAsyncIterator();

    expect((yield iter.shouldThrow()).message).to.equal("expected failure");

  });

  it("has a shortcut form for an Observable that only generates an Error", function* () {

    const obs = Rx.Observable.throw(new Error("expect this fail"));
    expect((yield obs.shouldThrow()).message).to.equal("expect this fail");

  });

});
```


## License

MIT
