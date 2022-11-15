/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./src/entry/recorder.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* global chrome */

chrome.runtime.onMessage.addListener(message => {
  if (message.recording) {
    console.log('start');
  } else {
    console.log('stop');
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkZXIuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7O0FBRUFBLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxTQUFTLENBQUNDLFdBQVcsQ0FBRUMsT0FBTyxJQUFLO0VBQ2hELElBQUlBLE9BQU8sQ0FBQ0MsU0FBUyxFQUFFO0lBQ3JCQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUM7RUFDdEIsQ0FBQyxNQUFNO0lBQ0xELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztFQUNyQjtBQUNGLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcmFpdi8uL3NyYy9lbnRyeS9yZWNvcmRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBnbG9iYWwgY2hyb21lICovXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xuICBpZiAobWVzc2FnZS5yZWNvcmRpbmcpIHtcbiAgICBjb25zb2xlLmxvZygnc3RhcnQnKVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdzdG9wJylcbiAgfVxufSlcbiJdLCJuYW1lcyI6WyJjaHJvbWUiLCJydW50aW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJtZXNzYWdlIiwicmVjb3JkaW5nIiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VSb290IjoiIn0=