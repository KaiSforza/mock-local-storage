// Mock localStorage
(function () {

    function createStorage() {
        let s = {},
            noopCallback = () => {},
            _itemInsertionCallback = noopCallback;

        Object.defineProperty(s, 'setItem', {
            get: () => {
                return (k, v) => {
                    k = k + '';
                    if (!s.hasOwnProperty(k)) {
                        _itemInsertionCallback(s.length);
                    }
                    s[k] = v + '';
                };
            }
        });
        Object.defineProperty(s, 'getItem', {
            get: () => {
                return k => {
                    k = k + '';
                    if (s.hasOwnProperty(k)) {
                        return s[k];
                    } else {
                        return null;
                    }
                };
            }
        });
        Object.defineProperty(s, 'removeItem', {
            get: () => {
                return k => {
                    k = k + '';
                    if (s.hasOwnProperty(k)) {
                        delete s[k];
                    }
                };
            }
        });
        Object.defineProperty(s, 'clear', {
            get: () => {
                return () => {
                    for (let k in s) {
                        if (s.hasOwnProperty(k)) {
                            delete s[k];
                        }
                    }
                };
            }
        });
        Object.defineProperty(s, 'length', {
            get: () => {
                return Object.keys(s).length;
            }
        });
        Object.defineProperty(s, "key", {
            value: k => {
                let key = Object.keys(s)[k];
                return (!key) ? null : key;
            },
        });
        Object.defineProperty(s, 'itemInsertionCallback', {
            get: () => {
                return _itemInsertionCallback;
            },
            set: v => {
                if (!v || typeof v != 'function') {
                    v = noopCallback;
                }
                _itemInsertionCallback = v;
            }
        });
        return s;
    }
    
    const global = require("global")
    const window = require("global/window")
    
    Object.defineProperty(global, 'localStorage', {
      value: createStorage(),
    });
    Object.defineProperty(window, 'localStorage', {
      value: global.localStorage,
    });

    Object.defineProperty(global, 'sessionStorage', {
      value: createStorage(),
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: global.sessionStorage,
    });
}());
