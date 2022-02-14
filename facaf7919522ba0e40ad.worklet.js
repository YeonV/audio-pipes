!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/audio-pipes/",n(n.s=0)}([function(t,e,n){"use strict";function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function u(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function c(t,e){return c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},c(t,e)}function f(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&c(t,e)}function l(t){return l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},l(t)}function a(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function p(t){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(t)}function s(t,e){if(e&&("object"===p(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function y(t){var e=a();return function(){var n,r=l(t);if(e){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function d(t,e,n){return d=a()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&c(o,n.prototype),o},d.apply(null,arguments)}function b(t){var e="function"===typeof Map?new Map:void 0;return b=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!==typeof t)throw new TypeError("Super expression must either be null or a function");if("undefined"!==typeof e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return d(t,arguments,l(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),c(r,t)},b(t)}n.r(e);var v,h,g=function(t){f(n,t);var e=y(n);function n(t){var r,i;return o(this,n),(i=e.call(this,t)).running=!0,i.id=void 0,i.id=null===t||void 0===t||null===(r=t.processorOptions)||void 0===r?void 0:r.id,console.log(i.id,"worklet created"),i.port.onmessage=function(t){"stop"===t.data&&(console.log("stopping worklet",i.id),i.stop())},i}return u(n,[{key:"stop",value:function(){this.running=!1}}]),n}(b(AudioWorkletProcessor));!function(t){t.Brown="Brown",t.Pink="Pink",t.White="White"}(v||(v={}));var m=function(t){f(n,t);var e=y(n);function n(t){var r,i;o(this,n),(i=e.call(this,t)).fillWithNoise=void 0;var u=null!==(r=null===t||void 0===t?void 0:t.processorOptions.type)&&void 0!==r?r:v.White;return i.fillWithNoise=O[u],i}return u(n,[{key:"process",value:function(t,e){for(var n=e[0],r=0;r<n.length;++r)this.fillWithNoise(n[r]);return this.running}}]),n}(g),O=(r(h={},v.Brown,(function(t){for(var e=t.length,n=0,r=0;r<e;r++){var o=2*Math.random()-1;t[r]=(n+.02*o)/1.02,n=t[r],t[r]*=3.5}})),r(h,v.Pink,(function(t){for(var e=t.length,n=0,r=0,o=0,i=0,u=0,c=0,f=0,l=0;l<e;l++){var a=2*Math.random()-1;n=.99886*n+.0555179*a,r=.99332*r+.0750759*a,o=.969*o+.153852*a,i=.8665*i+.3104856*a,u=.55*u+.5329522*a,c=-.7616*c-.016898*a,t[l]=n+r+o+i+u+c+f+.5362*a,t[l]*=.11,f=.115926*a}})),r(h,v.White,(function(t){for(var e=t.length,n=0;n<e;n++)t[n]=2*Math.random()-1})),h);registerProcessor("noise-processor",m)}]);
//# sourceMappingURL=facaf7919522ba0e40ad.worklet.js.map