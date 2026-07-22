/**
 * Phigros History - Legacy Browser Compatibility Polyfills
 * Target: IE 9+, Classic Android WebViews, Older iOS Safari, Older Chrome/Firefox
 */
(function () {
  'use strict';

  // 1. Element.prototype.matches
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.oMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
  }

  // 2. Element.prototype.closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      do {
        if (el.nodeType === 1 && el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // 3. NodeList.prototype.forEach & HTMLCollection.prototype.forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }

  // 4. Object.assign
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var key in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, key)) {
              to[key] = nextSource[key];
            }
          }
        }
      }
      return to;
    };
  }

  // 5. Object.keys / Object.entries / Object.values
  if (!Object.keys) {
    Object.keys = function (obj) {
      var keys = [];
      for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          keys.push(k);
        }
      }
      return keys;
    };
  }
  if (!Object.entries) {
    Object.entries = function (obj) {
      var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }
      return resArray;
    };
  }
  if (!Object.values) {
    Object.values = function (obj) {
      var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);
      while (i--) {
        resArray[i] = obj[ownProps[i]];
      }
      return resArray;
    };
  }

  // 6. Array.from & Array.prototype.includes
  if (!Array.from) {
    Array.from = function (object) {
      return [].slice.call(object);
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
      if (this == null) throw new TypeError('"this" is null or not defined');
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) return false;
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (o[k] === searchElement || o[k] !== o[k] && searchElement !== searchElement) {
          return true;
        }
        k++;
      }
      return false;
    };
  }

  // 7. String.prototype.includes & String.prototype.padStart
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== 'number') start = 0;
      if (start + search.length > this.length) return false;
      return this.indexOf(search, start) !== -1;
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function targetLength(targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(typeof padString !== 'undefined' ? padString : ' ');
      if (this.length >= targetLength) return String(this);
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(this);
    };
  }

  // 8. Simple Promise polyfill (for XHR fetch wrapper if native Promise missing)
  if (typeof window.Promise !== 'function') {
    window.Promise = function (executor) {
      var callbacks = [];
      var state = 'pending';
      var value = null;
      function resolve(newValue) {
        if (state !== 'pending') return;
        state = 'fulfilled';
        value = newValue;
        setTimeout(function () {
          callbacks.forEach(function (cb) {
            if (cb.onFulfilled) cb.onFulfilled(value);
          });
        }, 0);
      }
      function reject(newError) {
        if (state !== 'pending') return;
        state = 'rejected';
        value = newError;
        setTimeout(function () {
          callbacks.forEach(function (cb) {
            if (cb.onRejected) cb.onRejected(value);
          });
        }, 0);
      }
      this.then = function (onFulfilled, onRejected) {
        return new window.Promise(function (res, rej) {
          var handle = function handle() {
            try {
              if (state === 'fulfilled') {
                var ret = onFulfilled ? onFulfilled(value) : value;
                res(ret);
              } else if (state === 'rejected') {
                if (onRejected) {
                  var retErr = onRejected(value);
                  res(retErr);
                } else {
                  rej(value);
                }
              }
            } catch (e) {
              rej(e);
            }
          };
          if (state === 'pending') {
            callbacks.push({
              onFulfilled: function onFulfilled() {
                handle();
              },
              onRejected: function onRejected() {
                handle();
              }
            });
          } else {
            setTimeout(handle, 0);
          }
        });
      };
      this.catch = function (onRejected) {
        return this.then(null, onRejected);
      };
      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    };
    window.Promise.resolve = function (val) {
      return new window.Promise(function (res) {
        res(val);
      });
    };
    window.Promise.reject = function (err) {
      return new window.Promise(function (res, rej) {
        rej(err);
      });
    };
  }

  // 9. Fetch polyfill via XMLHttpRequest
  if (!window.fetch) {
    window.fetch = function (url, options) {
      options = options || {};
      return new window.Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(options.method || 'GET', url, true);
        if (options.headers) {
          for (var header in options.headers) {
            if (Object.prototype.hasOwnProperty.call(options.headers, header)) {
              request.setRequestHeader(header, options.headers[header]);
            }
          }
        }
        request.onload = function () {
          var response = {
            ok: request.status >= 200 && request.status < 300,
            status: request.status,
            statusText: request.statusText,
            url: request.responseURL || url,
            text: function text() {
              return window.Promise.resolve(request.responseText);
            },
            json: function json() {
              return window.Promise.resolve(JSON.parse(request.responseText));
            }
          };
          resolve(response);
        };
        request.onerror = function () {
          reject(new TypeError('Network request failed'));
        };
        request.ontimeout = function () {
          reject(new TypeError('Network request timed out'));
        };
        request.send(options.body || null);
      });
    };
  }

  // 10. URLSearchParams fallback
  if (!window.URLSearchParams) {
    window.URLSearchParams = function (search) {
      search = search || '';
      if (search.indexOf('?') === 0) search = search.substring(1);
      this.params = {};
      if (search) {
        var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          var key = decodeURIComponent(pair[0] || '');
          var val = decodeURIComponent(pair[1] || '');
          if (key) this.params[key] = val;
        }
      }
    };
    window.URLSearchParams.prototype.get = function (name) {
      return Object.prototype.hasOwnProperty.call(this.params, name) ? this.params[name] : null;
    };
  }
})();
