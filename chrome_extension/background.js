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
    let serverLocation = '';
    let videoId = '';
    port.onMessage.addListener(message => {
      if (message.serverLocation) {
        framePosition = 0;
        serverLocation = message.serverLocation.endsWith('/') ? message.serverLocation : `${message.serverLocation}/`;
        fetch(`${serverLocation}video/`, {
          body: JSON.stringify({
            name: message.videoName
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });
        // TODO: get the video's resource URI back from the server and store it for frame captures
      } else if (message.capture) {
        chrome.tabs.captureVisibleTab({
          format: 'png'
        }).then(image => {
          fetch(`${serverLocation}frame/`, {
            body: JSON.stringify({
              frame: image,
              position: framePosition,
              // TODO: Do we care about this? If we want to sort the frames before encoding then this surely is unimportant.
              video: videoId
            }),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          });
        });
      }
    });
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsT0FBTyxHQUFHLEVBQUU7SUFFaEJKLElBQUksQ0FBQ0ssU0FBUyxDQUFDTixXQUFXLENBQUVPLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNILGNBQWMsRUFBRTtRQUMxQkQsYUFBYSxHQUFHLENBQUM7UUFDakJDLGNBQWMsR0FBR0csT0FBTyxDQUFDSCxjQUFjLENBQUNJLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FDakRELE9BQU8sQ0FBQ0gsY0FBYyxHQUNyQixHQUFFRyxPQUFPLENBQUNILGNBQWUsR0FBRTtRQUVoQ0ssS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1VBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1lBQ25CVixJQUFJLEVBQUVLLE9BQU8sQ0FBQ007VUFDaEIsQ0FBQyxDQUFDO1VBQ0ZDLE9BQU8sRUFBRTtZQUFFLGNBQWMsRUFBRTtVQUFtQixDQUFDO1VBQy9DQyxNQUFNLEVBQUU7UUFDVixDQUFDLENBQUM7UUFDRjtNQUNGLENBQUMsTUFBTSxJQUFJUixPQUFPLENBQUNTLE9BQU8sRUFBRTtRQUMxQm5CLE1BQU0sQ0FBQ29CLElBQUksQ0FBQ0MsaUJBQWlCLENBQUM7VUFBRUMsTUFBTSxFQUFFO1FBQU0sQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBRUMsS0FBSyxJQUFLO1VBQy9EWixLQUFLLENBQUUsR0FBRUwsY0FBZSxRQUFPLEVBQUU7WUFDL0JNLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7Y0FDbkJVLEtBQUssRUFBRUQsS0FBSztjQUNaRSxRQUFRLEVBQUVwQixhQUFhO2NBQUU7Y0FDekJxQixLQUFLLEVBQUVuQjtZQUNULENBQUMsQ0FBQztZQUNGUyxPQUFPLEVBQUU7Y0FBRSxjQUFjLEVBQUU7WUFBbUIsQ0FBQztZQUMvQ0MsTUFBTSxFQUFFO1VBQ1YsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO01BQ0o7SUFDRixDQUFDLENBQUM7RUFDSjtBQUNGLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcmFpdi8uL3NyYy9lbnRyeS9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBnbG9iYWwgY2hyb21lICovXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoKHBvcnQpID0+IHtcbiAgaWYgKHBvcnQubmFtZSA9PT0gJ3JhaXYnKSB7XG4gICAgbGV0IGZyYW1lUG9zaXRpb24gPSAwXG4gICAgbGV0IHNlcnZlckxvY2F0aW9uID0gJydcbiAgICBsZXQgdmlkZW9JZCA9ICcnXG5cbiAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2Uuc2VydmVyTG9jYXRpb24pIHtcbiAgICAgICAgZnJhbWVQb3NpdGlvbiA9IDBcbiAgICAgICAgc2VydmVyTG9jYXRpb24gPSBtZXNzYWdlLnNlcnZlckxvY2F0aW9uLmVuZHNXaXRoKCcvJylcbiAgICAgICAgICA/IG1lc3NhZ2Uuc2VydmVyTG9jYXRpb25cbiAgICAgICAgICA6IGAke21lc3NhZ2Uuc2VydmVyTG9jYXRpb259L2BcblxuICAgICAgICBmZXRjaChgJHtzZXJ2ZXJMb2NhdGlvbn12aWRlby9gLCB7XG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogbWVzc2FnZS52aWRlb05hbWUsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIH0pXG4gICAgICAgIC8vIFRPRE86IGdldCB0aGUgdmlkZW8ncyByZXNvdXJjZSBVUkkgYmFjayBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHN0b3JlIGl0IGZvciBmcmFtZSBjYXB0dXJlc1xuICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLmNhcHR1cmUpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIoeyBmb3JtYXQ6ICdwbmcnIH0pLnRoZW4oKGltYWdlKSA9PiB7XG4gICAgICAgICAgZmV0Y2goYCR7c2VydmVyTG9jYXRpb259ZnJhbWUvYCwge1xuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBmcmFtZTogaW1hZ2UsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBmcmFtZVBvc2l0aW9uLCAvLyBUT0RPOiBEbyB3ZSBjYXJlIGFib3V0IHRoaXM/IElmIHdlIHdhbnQgdG8gc29ydCB0aGUgZnJhbWVzIGJlZm9yZSBlbmNvZGluZyB0aGVuIHRoaXMgc3VyZWx5IGlzIHVuaW1wb3J0YW50LlxuICAgICAgICAgICAgICB2aWRlbzogdmlkZW9JZCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG4iXSwibmFtZXMiOlsiY2hyb21lIiwicnVudGltZSIsIm9uQ29ubmVjdCIsImFkZExpc3RlbmVyIiwicG9ydCIsIm5hbWUiLCJmcmFtZVBvc2l0aW9uIiwic2VydmVyTG9jYXRpb24iLCJ2aWRlb0lkIiwib25NZXNzYWdlIiwibWVzc2FnZSIsImVuZHNXaXRoIiwiZmV0Y2giLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInZpZGVvTmFtZSIsImhlYWRlcnMiLCJtZXRob2QiLCJjYXB0dXJlIiwidGFicyIsImNhcHR1cmVWaXNpYmxlVGFiIiwiZm9ybWF0IiwidGhlbiIsImltYWdlIiwiZnJhbWUiLCJwb3NpdGlvbiIsInZpZGVvIl0sInNvdXJjZVJvb3QiOiIifQ==