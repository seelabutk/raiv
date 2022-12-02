/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/* global chrome */
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'raiv') {
    let framePosition = 0;
    port.onMessage.addListener(message => {
      if (message.capture) {
        chrome.tabs.captureVisibleTab({
          format: 'png'
        }).then(image => {
          chrome.downloads.download({
            filename: `download${framePosition++}.png`,
            url: image
          });
        });
      }
    });
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckJGLElBQUksQ0FBQ0csU0FBUyxDQUFDSixXQUFXLENBQUVLLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNDLE9BQU8sRUFBRTtRQUNuQlQsTUFBTSxDQUFDVSxJQUFJLENBQUNDLGlCQUFpQixDQUFDO1VBQUVDLE1BQU0sRUFBRTtRQUFNLENBQUMsQ0FBQyxDQUFDQyxJQUFJLENBQUVDLEtBQUssSUFBSztVQUMvRGQsTUFBTSxDQUFDZSxTQUFTLENBQUNDLFFBQVEsQ0FBQztZQUN4QkMsUUFBUSxFQUFHLFdBQVVYLGFBQWEsRUFBRyxNQUFLO1lBQzFDWSxHQUFHLEVBQUVKO1VBQ1AsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO01BQ0o7SUFDRixDQUFDLENBQUM7RUFDSjtBQUNGLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcmFpdi8uL3NyYy9lbnRyeS9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBnbG9iYWwgY2hyb21lICovXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoKHBvcnQpID0+IHtcbiAgaWYgKHBvcnQubmFtZSA9PT0gJ3JhaXYnKSB7XG4gICAgbGV0IGZyYW1lUG9zaXRpb24gPSAwXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmNhcHR1cmUpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIoeyBmb3JtYXQ6ICdwbmcnIH0pLnRoZW4oKGltYWdlKSA9PiB7XG4gICAgICAgICAgY2hyb21lLmRvd25sb2Fkcy5kb3dubG9hZCh7XG4gICAgICAgICAgICBmaWxlbmFtZTogYGRvd25sb2FkJHtmcmFtZVBvc2l0aW9uKyt9LnBuZ2AsXG4gICAgICAgICAgICB1cmw6IGltYWdlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxufSlcbiJdLCJuYW1lcyI6WyJjaHJvbWUiLCJydW50aW1lIiwib25Db25uZWN0IiwiYWRkTGlzdGVuZXIiLCJwb3J0IiwibmFtZSIsImZyYW1lUG9zaXRpb24iLCJvbk1lc3NhZ2UiLCJtZXNzYWdlIiwiY2FwdHVyZSIsInRhYnMiLCJjYXB0dXJlVmlzaWJsZVRhYiIsImZvcm1hdCIsInRoZW4iLCJpbWFnZSIsImRvd25sb2FkcyIsImRvd25sb2FkIiwiZmlsZW5hbWUiLCJ1cmwiXSwic291cmNlUm9vdCI6IiJ9