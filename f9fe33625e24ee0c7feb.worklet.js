!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/audio-pipes/",n(n.s=0)}([function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function u(t,e){return u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},u(t,e)}function c(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&u(t,e)}function l(t){return l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},l(t)}function f(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function s(t,e){if(e&&("object"===a(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function p(t){var e=f();return function(){var n,r=l(t);if(e){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function y(t,e,n){return y=f()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&u(o,n.prototype),o},y.apply(null,arguments)}function d(t){var e="function"===typeof Map?new Map:void 0;return d=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!==typeof t)throw new TypeError("Super expression must either be null or a function");if("undefined"!==typeof e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return y(t,arguments,l(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),u(r,t)},d(t)}n.r(e);var v=function(t){c(n,t);var e=p(n);function n(t){var o,i;return r(this,n),(i=e.call(this,t)).running=!0,i.id=void 0,i.id=null===t||void 0===t||null===(o=t.processorOptions)||void 0===o?void 0:o.id,console.log(i.id,"worklet created"),i.port.onmessage=function(t){"stop"===t.data&&(console.log("stopping worklet",i.id),i.stop())},i}return i(n,[{key:"stop",value:function(){this.running=!1}}]),n}(d(AudioWorkletProcessor));function b(t,e,n,r){if(r<=t)return t;if(r>=e)return e;var o=(e-t)/n;return o?r-r%o:0}registerProcessor("quantizer-processor",function(t){c(n,t);var e=p(n);function n(t){var o,i,u,c;return r(this,n),(c=e.call(this,t)).levels=void 0,c.max=void 0,c.min=void 0,c.levels=null!==(o=null===t||void 0===t?void 0:t.processorOptions.levels)&&void 0!==o?o:256,c.max=null!==(i=null===t||void 0===t?void 0:t.processorOptions.max)&&void 0!==i?i:1,c.min=null!==(u=null===t||void 0===t?void 0:t.processorOptions.min)&&void 0!==u?u:-1,c}return i(n,[{key:"process",value:function(t,e){for(var n=t[0],r=e[0],o=0;o<n.length;++o)for(var i=n[o].length,u=0;u<i;u++)r[o][u]=b(this.min,this.max,this.levels,n[o][u]);return this.running}}]),n}(v))}]);
//# sourceMappingURL=f9fe33625e24ee0c7feb.worklet.js.map