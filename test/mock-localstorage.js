import chai from 'chai';
import storage from '../src/mock-localstorage';

let should = chai.should();

describe('# localStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    afterEach(() => {
        localStorage.clear();
        localStorage.itemInsertionCallback = null;
    });
    it('len', () => {
        localStorage.length.should.equal(0);
        localStorage.setItem(42, 42);
        localStorage.length.should.equal(1);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        localStorage.length.should.equal(100);
    });
    it('get and set', () => {
        localStorage.length.should.equal(0);
        should.equal(localStorage.getItem(42), null);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        localStorage.getItem(42).should.equal('42');
        chai.expect(function () {
            localStorage.setItem('setItem', 42);
        }).to.throw(TypeError);
        chai.expect(function () {
            localStorage.setItem('length', 42);
        }).to.throw(TypeError);
    });
    it('[]', () => {
        localStorage.length.should.equal(0);
        //don't know how to implement:
        //should.equal(localStorage['42'], null);
        should.not.exist(localStorage['42']);
        for (let i = 0; i < 100; ++i) {
            localStorage[i + ''] = i + '';
        }
        localStorage.length.should.equal(100);
        localStorage[42].should.equal('42');
        chai.expect(function () {
            localStorage['setItem'] = '42';
        }).to.throw(TypeError);
        chai.expect(function () {
            localStorage['length'] = 42;
        }).to.throw(TypeError);
        chai.expect(function () {
            localStorage.setItem = '42';
        }).to.throw(TypeError);
        chai.expect(function () {
            localStorage.length = 42;
        }).to.throw(TypeError);
        //don't know how to implement:
        //localStorage[17] = 77;
        //localStorage[17].should.equal('77');
        localStorage[15] = '55';
        localStorage[15].should.equal('55');
        localStorage['15'].should.equal('55');
        localStorage.length.should.equal(100);
    });
    it('iterate', () => {
        localStorage.length.should.equal(0);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        let i = 0;
        for (let k in localStorage) {
            localStorage.getItem(localStorage.key(k)).should.equal(i + '');
            ++i;
        }
    });
    it('remove and clear', () => {
        localStorage.length.should.equal(0);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        localStorage.length.should.equal(100);
        localStorage.removeItem(42);
        should.equal(localStorage.getItem(42), null);
        localStorage.length.should.equal(99);
        for (let i = 0; i < 10;) {
            let k = Math.trunc(Math.random() * 100);
            if (localStorage.getItem(k)) {
                ++i;
            }
            localStorage.removeItem(k);
        }
        localStorage.length.should.equal(89);
        localStorage.clear();
        localStorage.length.should.equal(0);
    });
    it('insertion callback', () => {
        localStorage.length.should.equal(0);
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
