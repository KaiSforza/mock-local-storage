// Mock localStorage 
(function (glob) {

    function createStorage() {
        var s = {},
            noopCallback = function () {},
            _itemInsertionCallback = noopCallback;

        Object.defineProperty(s, 'setItem', {
            get: function () {
                return function (k, v) {
                    k = k + '';
                    _itemInsertionCallback(this.length);
                    this[k] = v + '';
                };
            }
        });
        Object.defineProperty(s, 'getItem', {
            get: function () {
                return function (k) {
                    k = k + '';
                    if (this.hasOwnProperty(k)) {
                        return this[k];
                    } else {
                        return null;
                    }
                };
            }
        });
        Object.defineProperty(s, 'removeItem', {
            get: function () {
                return function (k) {
                    k = k + '';
                    if (this.hasOwnProperty(k)) {
                        delete this[k];
                    }
                };
            }
        });
        Object.defineProperty(s, 'clear', {
            get: function () {
                return function () {
                    for (var k in this) {
                        if (this.hasOwnProperty(k)) {
                            delete this[k];
                        }
                    }
                };
            }
        });
        Object.defineProperty(s, 'length', {
            get: function () {
                return Object.keys(this).length;
            }
        });
	Object.defineProperty(s, "key", {
	    value: function (k) {
	        var key = Object.keys(s)[k];
	        return (!key) ? null : key;
	    },
	});
        Object.defineProperty(s, 'itemInsertionCallback', {
            get: function () {
                return _itemInsertionCallback;
            },
            set: function (v) {
                if (!v || typeof v != 'function') {
                    v = noopCallback;
                }
                _itemInsertionCallback = v;
            }
        });
        return s;
    }

    glob.localStorage = createStorage();
    glob.sessionStorage = createStorage();
}(typeof window !== 'undefined' ? window : global));
