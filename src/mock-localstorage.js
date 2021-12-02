// Mock localStorage
(function () {

    function createStorage() {
        let UNSET = Symbol();
        let s = {};
        let noopCallback = () => {};
        let _itemInsertionCallback = noopCallback;

        Object.defineProperty(s, 'setItem', {
            get: () => {
                return (k, v = UNSET) => {
                    if (v === UNSET) {
                        throw new TypeError(`Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.`);
                    }
                    if (!s.hasOwnProperty(String(k))) {
                        _itemInsertionCallback(s.length);
                    }
                    s[String(k)] = String(v);
                };
            }
        });

        Object.defineProperty(s, 'getItem', {
            get: () => {
                return k => {
                    if (s.hasOwnProperty(String(k))) {
                        return s[String(k)];
                    } else {
                        return null;
                    }
                };
            }
        });

        Object.defineProperty(s, 'removeItem', {
            get: () => {
                return k => {
                    if (s.hasOwnProperty(String(k))) {
                        delete s[String(k)];
                    }
                };
            }
        });

        Object.defineProperty(s, 'clear', {
            get: () => {
                return () => {
                    for (let k in s) {
                        delete s[String(k)];
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
                let key = Object.keys(s)[String(k)];
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

    Object.defineProperty(global, 'Storage', {
      value: createStorage,
    });
    Object.defineProperty(window, 'Storage', {
      value: createStorage,
    });

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
