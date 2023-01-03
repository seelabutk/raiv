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
chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    files: ['/recorder.js'],
    target: {
      tabId: tab.id
    }
  });
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsT0FBTyxHQUFHLEVBQUU7SUFFaEJKLElBQUksQ0FBQ0ssU0FBUyxDQUFDTixXQUFXLENBQUVPLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNILGNBQWMsRUFBRTtRQUMxQkQsYUFBYSxHQUFHLENBQUM7UUFDakJDLGNBQWMsR0FBR0csT0FBTyxDQUFDSCxjQUFjLENBQUNJLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FDakRELE9BQU8sQ0FBQ0gsY0FBYyxHQUNyQixHQUFFRyxPQUFPLENBQUNILGNBQWUsR0FBRTtRQUVoQ0ssS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1VBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1lBQ25CVixJQUFJLEVBQUVLLE9BQU8sQ0FBQ007VUFDaEIsQ0FBQyxDQUFDO1VBQ0ZDLE9BQU8sRUFBRTtZQUFFLGNBQWMsRUFBRTtVQUFtQixDQUFDO1VBQy9DQyxNQUFNLEVBQUU7UUFDVixDQUFDLENBQUM7UUFDRjtNQUNGLENBQUMsTUFBTSxJQUFJUixPQUFPLENBQUNTLE9BQU8sRUFBRTtRQUMxQm5CLE1BQU0sQ0FBQ29CLElBQUksQ0FBQ0MsaUJBQWlCLENBQUM7VUFBRUMsTUFBTSxFQUFFO1FBQU0sQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBRUMsS0FBSyxJQUFLO1VBQy9EWixLQUFLLENBQUUsR0FBRUwsY0FBZSxRQUFPLEVBQUU7WUFDL0JNLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7Y0FDbkJVLEtBQUssRUFBRUQsS0FBSztjQUNaRSxRQUFRLEVBQUVwQixhQUFhO2NBQUU7Y0FDekJxQixLQUFLLEVBQUVuQjtZQUNULENBQUMsQ0FBQztZQUNGUyxPQUFPLEVBQUU7Y0FBRSxjQUFjLEVBQUU7WUFBbUIsQ0FBQztZQUMvQ0MsTUFBTSxFQUFFO1VBQ1YsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO01BQ0o7SUFDRixDQUFDLENBQUM7RUFDSjtBQUNGLENBQUMsQ0FBQztBQUVGbEIsTUFBTSxDQUFDNEIsTUFBTSxDQUFDQyxTQUFTLENBQUMxQixXQUFXLENBQUUyQixHQUFHLElBQUs7RUFDM0M5QixNQUFNLENBQUMrQixTQUFTLENBQUNDLGFBQWEsQ0FBQztJQUM3QkMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ3ZCQyxNQUFNLEVBQUU7TUFBRUMsS0FBSyxFQUFFTCxHQUFHLENBQUNNO0lBQUc7RUFDMUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JhaXYvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yYWl2Ly4vc3JjL2VudHJ5L2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcigocG9ydCkgPT4ge1xuICBpZiAocG9ydC5uYW1lID09PSAncmFpdicpIHtcbiAgICBsZXQgZnJhbWVQb3NpdGlvbiA9IDBcbiAgICBsZXQgc2VydmVyTG9jYXRpb24gPSAnJ1xuICAgIGxldCB2aWRlb0lkID0gJydcblxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbikge1xuICAgICAgICBmcmFtZVBvc2l0aW9uID0gMFxuICAgICAgICBzZXJ2ZXJMb2NhdGlvbiA9IG1lc3NhZ2Uuc2VydmVyTG9jYXRpb24uZW5kc1dpdGgoJy8nKVxuICAgICAgICAgID8gbWVzc2FnZS5zZXJ2ZXJMb2NhdGlvblxuICAgICAgICAgIDogYCR7bWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbn0vYFxuXG4gICAgICAgIGZldGNoKGAke3NlcnZlckxvY2F0aW9ufXZpZGVvL2AsIHtcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBtZXNzYWdlLnZpZGVvTmFtZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgfSlcbiAgICAgICAgLy8gVE9ETzogZ2V0IHRoZSB2aWRlbydzIHJlc291cmNlIFVSSSBiYWNrIGZyb20gdGhlIHNlcnZlciBhbmQgc3RvcmUgaXQgZm9yIGZyYW1lIGNhcHR1cmVzXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY2FwdHVyZSkge1xuICAgICAgICBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih7IGZvcm1hdDogJ3BuZycgfSkudGhlbigoaW1hZ2UpID0+IHtcbiAgICAgICAgICBmZXRjaChgJHtzZXJ2ZXJMb2NhdGlvbn1mcmFtZS9gLCB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIGZyYW1lOiBpbWFnZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGZyYW1lUG9zaXRpb24sIC8vIFRPRE86IERvIHdlIGNhcmUgYWJvdXQgdGhpcz8gSWYgd2Ugd2FudCB0byBzb3J0IHRoZSBmcmFtZXMgYmVmb3JlIGVuY29kaW5nIHRoZW4gdGhpcyBzdXJlbHkgaXMgdW5pbXBvcnRhbnQuXG4gICAgICAgICAgICAgIHZpZGVvOiB2aWRlb0lkLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxufSlcblxuY2hyb21lLmFjdGlvbi5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIGZpbGVzOiBbJy9yZWNvcmRlci5qcyddLFxuICAgIHRhcmdldDogeyB0YWJJZDogdGFiLmlkIH0sXG4gIH0pXG59KVxuIl0sIm5hbWVzIjpbImNocm9tZSIsInJ1bnRpbWUiLCJvbkNvbm5lY3QiLCJhZGRMaXN0ZW5lciIsInBvcnQiLCJuYW1lIiwiZnJhbWVQb3NpdGlvbiIsInNlcnZlckxvY2F0aW9uIiwidmlkZW9JZCIsIm9uTWVzc2FnZSIsIm1lc3NhZ2UiLCJlbmRzV2l0aCIsImZldGNoIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ2aWRlb05hbWUiLCJoZWFkZXJzIiwibWV0aG9kIiwiY2FwdHVyZSIsInRhYnMiLCJjYXB0dXJlVmlzaWJsZVRhYiIsImZvcm1hdCIsInRoZW4iLCJpbWFnZSIsImZyYW1lIiwicG9zaXRpb24iLCJ2aWRlbyIsImFjdGlvbiIsIm9uQ2xpY2tlZCIsInRhYiIsInNjcmlwdGluZyIsImV4ZWN1dGVTY3JpcHQiLCJmaWxlcyIsInRhcmdldCIsInRhYklkIiwiaWQiXSwic291cmNlUm9vdCI6IiJ9