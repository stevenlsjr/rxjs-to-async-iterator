'use strict';

require('co-mocha');
const Rx = require('rx');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const toAsyncIterator = require('../index');

//------------------------------------------------------------------------------

describe("rx-to-async-iterator", function () {

  it("should be defined as a function", function () {
    expect(toAsyncIterator).to.be.a('function');
      // WARNING: We don't test this API independently. It might go away.
  });

  it("should patch Rx.Observable to add toAsyncIterator operator", function () {
    expect(Rx.Observable.prototype.toAsyncIterator).to.be.a('function');
  });

  //----------------------------------------------------------------------------

  it("can convert an empty Observable into an async iterator", function* () {

    const iter = Rx.Observable.empty().toAsyncIterator();

    yield iter.shouldComplete();

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends a single immediate value into an async iterator", function* () {

    const iter = Rx.Observable.just("blah").toAsyncIterator();

    expect(yield iter.nextValue()).to.equal("blah");
    yield iter.shouldComplete();

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends a single deferred value into an async iterator", function* () {

    const iter = Rx.Observable.timer(200).take(1).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal(0);
    yield iter.shouldComplete();

  });

  //----------------------------------------------------------------------------

  it("should throw if onCompleted is sent when onNext was expected", function* () {

    const iter = Rx.Observable.just("blah").toAsyncIterator();

    expect(yield iter.nextValue()).to.equal("blah");

    let didThrow = false;
    try {
      yield iter.nextValue();
        // NOTE: We can't use the typical expect(fn).to.throw() notation
        // because yield wouldn't be available to that inner function.
    }
    catch (err) {
      expect(err.message).to.equal("Expected onNext notification, got onCompleted instead");
      didThrow = true;
    }
    expect(didThrow).to.equal(true);

  });

  //----------------------------------------------------------------------------

  it("should throw if onError is sent when onNext was expected", function* () {

    const iter = Rx.Observable.concat(
      Rx.Observable.just("blah"),
      Rx.Observable.throw(new Error("whoops"))).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal("blah");

    let didThrow = false;
    try {
      yield iter.nextValue();
        // NOTE: We can't use the typical expect(fn).to.throw() notation
        // because yield wouldn't be available to that inner function.
    }
    catch (err) {
      expect(err.message).to.equal("whoops");
      didThrow = true;
    }
    expect(didThrow).to.equal(true);

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends several immediate values into an async iterator", function* () {

    const iter = Rx.Observable.from([0, 1, 2]).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal(0);
    expect(yield iter.nextValue()).to.equal(1);
    expect(yield iter.nextValue()).to.equal(2);
    yield iter.shouldComplete();

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends several deferred values into an async iterator", function* () {

    const iter = Rx.Observable.timer(200, 100).take(3).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal(0);
    expect(yield iter.nextValue()).to.equal(1);
    expect(yield iter.nextValue()).to.equal(2);
    yield iter.shouldComplete();

  });

  //----------------------------------------------------------------------------

  it("should throw if onNext is sent when onCompleted is expected", function* () {

    const iter = Rx.Observable.just(99).toAsyncIterator();

    let didThrow = false;
    try {
      yield iter.shouldComplete();
        // NOTE: We can't use the typical expect(fn).to.throw() notation
        // because yield wouldn't be available to that inner function.
    }
    catch (err) {
      expect(err.message).to.equal("Expected onCompleted notification, got onNext(99) instead");
      didThrow = true;
    }

    expect(didThrow).to.equal(true);

  });

  //----------------------------------------------------------------------------

  it("should throw if onError is sent when onCompleted was expected", function* () {

    const iter = Rx.Observable.concat(
      Rx.Observable.just("blah"),
      Rx.Observable.throw(new Error("whoops"))).toAsyncIterator();

    expect(yield iter.nextValue()).to.equal("blah");

    let didThrow = false;
    try {
      yield iter.shouldComplete();
        // NOTE: We can't use the typical expect(fn).to.throw() notation
        // because yield wouldn't be available to that inner function.
    }
    catch (err) {
      expect(err.message).to.equal("whoops");
      didThrow = true;
    }
    expect(didThrow).to.equal(true);

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends an error immediately into an async iterator", function* () {

    const iter = Rx.Observable.throw(new Error("expected failure")).toAsyncIterator();

    expect(yield iter.shouldThrow()).to.equal("expected failure");

  });

  //----------------------------------------------------------------------------

  it("can convert an Observable that sends a deferred error into an async iterator", function* () {

    const iter = Rx.Observable.concat(
      Rx.Observable.timer(200).take(1).filter(() => false),
      Rx.Observable.throw(new Error("deferred error"))).toAsyncIterator();

    expect(yield iter.shouldThrow()).to.equal("deferred error");

  });

});
