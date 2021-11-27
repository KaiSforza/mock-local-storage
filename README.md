[![Build Status](https://travis-ci.com/letsrock-today/mock-local-storage.svg?branch=master)](https://travis-ci.com/letsrock-today/mock-local-storage)

# mock-local-storage

Mock `localStorage` for headless unit tests

Inspired by StackOverflow answers and wrapped into npm package.

## Deprecation notice

I'm archiving this repository because I have no time to support it myself.

There is a Travic CI script in the repo, which used to work - build
tags and releases when I reviewed and merged PRs, but I've just noticed
that it stopped to work.

Travis now urges me to choose a payment plan and provide a credit card
info to continue builds even for open-source project, which I'm not ready to do.

If anyone wants to maintain this project, you are welcome - you should be able
to make a fork of archived project.

## Motivation

Used to mock `localStorage` to run headless tests of cache implementation in terminal (ie. without browser).

## Installation

    npm install mock-local-storage --save-dev

## Usage

### Mocha

Require in Mocha, which will replace `localStorage` and `sessionStorage` on the `global` and `window` objects:

    mocha --require mock-local-storage

If you are using `jsdom-global`, make sure it is required before `mock-local-storage`:  

    mocha --require jsdom-global --require mock-local-storage

### Other testing frameworks

In a node environment you can mock the `window.localStorage` as follows:

```js
global.window = {}
import 'mock-local-storage'
window.localStorage = global.localStorage
```

This is very useful when you want to run headless tests on code meant for the browser that use `localStorage`

You can even store this in a file that is reused across tests:

`mock-localstorage.js`

```js
global.window = {}
import 'mock-local-storage'
window.localStorage = global.localStorage
```

`using-localstorage.test.js`

```js
import './mock-localstorage'

// unit tests follow here
```

### Extra

Besides mocking of conventional `localStorage` interface, this implementation provides
a way for test code to register a callback to be invoked on item insertion.
Mock implementation will invoke it when `localStorage.setItem()` is called
(but not with `localStorage[key]` notation).

It can be used to emulate allocation errors, like this:
```js
describe('test with mock localStorage', () => {
    afterEach(() => {
	localStorage.clear();
		// remove callback
	localStorage.itemInsertionCallback = null;
    });
    it('emulate quota exceeded error', () => {
	localStorage.length.should.equal(0);
		// register callback
	localStorage.itemInsertionCallback = (len) => {
	    if (len >= 5) {
		let err = new Error('Mock localStorage quota exceeded');
		err.code = 22;
		throw err;
	    }
	};
	let handled = false;
	try {
	    for (let i = 0; i < 10; ++i) {
		localStorage.setItem(i, i);
	    }
	} catch (e) {
	    if (e.code == 22) {
		// handle quota exceeded error
		handled = true;
	    }
	}
	handled.should.be.true;
	localStorage.length.should.equal(5);
    });
});
```

### Caveats

There are some caveats with using `index` operator. Browser's `localStorage`
works with strings and stringifyes objects stored via `localStorage[key]` notation,
but this implementation does not.

`localStorage.itemInsertionCallback` won't be invoked with  `localStorage[key]` notation.

## Tests

    npm install
    npm test
    
## Bugs, issues, PRs, participation, contribution

Please feel free to send us occusionall PRs along with unit tests,
we'll merge them if they successfully build and pass unit tests.
Consider to always provide unit tests, illustrating your problem, along with PR to avoid future regression.

Note, that we currently do not use this project ourselves and cannot afford to invest much time into it.
Please serve yourself.

## License

[MIT](https://github.com/letsrock-today/mock-local-storage/blob/master/LICENSE)
