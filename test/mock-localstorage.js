import { expect } from 'chai';
import storage from '../src/mock-localstorage';

describe('# localStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    afterEach(() => {
        localStorage.clear();
        localStorage.itemInsertionCallback = null;
    });
    it('len', () => {
        expect(localStorage.length).to.equal(0);
        localStorage.setItem(42, 42);
        expect(localStorage.length).to.equal(1);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        expect(localStorage.length).to.equal(100);
    });
    it('get and set', () => {
        expect(localStorage.length).to.equal(0);
        expect(localStorage.getItem(42)).to.be.null;
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        expect(localStorage.getItem(42)).to.equal('42');
        expect(function () {
            localStorage.setItem('setItem', 42);
        }).to.throw(TypeError);
        expect(function () {
            localStorage.setItem('length', 42);
        }).to.throw(TypeError);
    });
    it('get and set fail', () => {
        expect(function() {localStorage.setItem('setItem');})
            .to.throw(TypeError)
    });
    it('[]', () => {
        expect(localStorage.length).to.equal(0);
        //don't know how to implement:
        //should.equal(localStorage['42'], null);
        expect(localStorage['42']).to.not.exist;
        for (let i = 0; i < 100; ++i) {
            localStorage[i + ''] = i + '';
        }
        expect(localStorage.length).to.equal(100);
        expect(localStorage[42]).to.equal('42');
        expect(function () {
            localStorage['setItem'] = '42';
        }).to.throw(TypeError);
        expect(function () {
            localStorage['length'] = 42;
        }).to.throw(TypeError);
        expect(function () {
            localStorage.setItem = '42';
        }).to.throw(TypeError);
        expect(function () {
            localStorage.length = 42;
        }).to.throw(TypeError);
        //don't know how to implement:
        //localStorage[17] = 77;
        //localStorage[17].should.equal('77');
        localStorage[15] = '55';
        expect(localStorage[15]).to.equal('55');
        expect(localStorage['15']).to.equal('55');
        expect(localStorage.length).to.equal(100);
    });
    it('iterate', () => {
        expect(localStorage.length).to.equal(0);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        let i = 0;
        for (let k in localStorage) {
            expect(localStorage.getItem(localStorage.key(k))).to.equal(i + '');
            ++i;
        }
    });
    it('remove and clear', () => {
        expect(localStorage.length).to.equal(0);
        localStorage.removeItem(0); // Test removing nonexistent
        expect(localStorage.length).to.equal(0);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        localStorage.removeItem('a'); // Test removing nonexistent
        expect(localStorage.length).to.equal(100);
        localStorage.removeItem(42);
        expect(localStorage.getItem(42)).to.be.null;
        expect(localStorage.length).to.equal(99);
        for (let i = 0; i < 10;) {
            let k = Math.trunc(Math.random() * 100);
            if (localStorage.getItem(k)) {
                ++i;
            }
            localStorage.removeItem(k);
        }
        expect(localStorage.length).to.equal(89);
        localStorage.clear();
        expect(localStorage.length).to.equal(0);
    });
    it('insertion callback', () => {
        expect(localStorage.length).to.equal(0);
        let f = (len) => {
            if (len >= 5) {
                let err = new Error('Mock localStorage quota exceeded');
                err.code = 22;
                throw err;
            }
        }
        localStorage.itemInsertionCallback = f
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
        expect(handled).to.be.true;
        expect(localStorage.length).to.equal(5);
        expect(localStorage.itemInsertionCallback).to.equal(f);
    });
    it('key', () => {
        expect(localStorage.length).to.equal(0);
        for (let i = 0; i < 100; ++i) {
            localStorage.setItem(i, i);
        }
        expect(localStorage.key(0)).to.equal('0');
        expect(localStorage.key('a')).to.be.null;
    })
});
