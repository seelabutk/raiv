/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************************!*\
  !*** ./src/entry/background.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ServiceWorker)
/* harmony export */ });
/* global chrome */
class ServiceWorker {
  constructor() {}
  start() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      this.port = chrome.tabs.connect(tabs[0].id, {
        name: 'raiv'
      });
      this.port.postMessage({
        launch: true
      });
    });
  }
}
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ2UsTUFBTUEsYUFBYSxDQUFDO0VBQ2pDQyxXQUFXLEdBQUcsQ0FBQztFQUVmQyxLQUFLLEdBQUc7SUFDTkMsTUFBTSxDQUFDQyxJQUFJLENBQUNDLEtBQUssQ0FDZjtNQUNFQyxNQUFNLEVBQUUsSUFBSTtNQUNaQyxhQUFhLEVBQUU7SUFDakIsQ0FBQyxFQUNBSCxJQUFJLElBQUs7TUFDUixJQUFJLENBQUNJLElBQUksR0FBR0wsTUFBTSxDQUFDQyxJQUFJLENBQUNLLE9BQU8sQ0FBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDTSxFQUFFLEVBQUU7UUFBRUMsSUFBSSxFQUFFO01BQU8sQ0FBQyxDQUFDO01BQzdELElBQUksQ0FBQ0gsSUFBSSxDQUFDSSxXQUFXLENBQUM7UUFBRUMsTUFBTSxFQUFFO01BQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FDRjtFQUNIO0FBQ0YsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhaXYvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3JhaXYvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yYWl2Ly4vc3JjL2VudHJ5L2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBnbG9iYWwgY2hyb21lICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlV29ya2VyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXJ0KCkge1xuICAgIGNocm9tZS50YWJzLnF1ZXJ5KFxuICAgICAge1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXG4gICAgICB9LFxuICAgICAgKHRhYnMpID0+IHtcbiAgICAgICAgdGhpcy5wb3J0ID0gY2hyb21lLnRhYnMuY29ubmVjdCh0YWJzWzBdLmlkLCB7IG5hbWU6ICdyYWl2JyB9KVxuICAgICAgICB0aGlzLnBvcnQucG9zdE1lc3NhZ2UoeyBsYXVuY2g6IHRydWUgfSlcbiAgICAgIH1cbiAgICApXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJTZXJ2aWNlV29ya2VyIiwiY29uc3RydWN0b3IiLCJzdGFydCIsImNocm9tZSIsInRhYnMiLCJxdWVyeSIsImFjdGl2ZSIsImN1cnJlbnRXaW5kb3ciLCJwb3J0IiwiY29ubmVjdCIsImlkIiwibmFtZSIsInBvc3RNZXNzYWdlIiwibGF1bmNoIl0sInNvdXJjZVJvb3QiOiIifQ==