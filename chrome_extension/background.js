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
    let videoResourceUri = '';
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
          fetch(`${serverLocation}/frame`, {
            body: JSON.stringify({
              frame: image,
              position: framePosition,
              // TODO: Do we care about this? If we want to sort the frames before encoding then this surely is unimportant.
              video: videoResourceUri
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsZ0JBQWdCLEdBQUcsRUFBRTtJQUV6QkosSUFBSSxDQUFDSyxTQUFTLENBQUNOLFdBQVcsQ0FBRU8sT0FBTyxJQUFLO01BQ3RDLElBQUlBLE9BQU8sQ0FBQ0gsY0FBYyxFQUFFO1FBQzFCRCxhQUFhLEdBQUcsQ0FBQztRQUNqQkMsY0FBYyxHQUFHRyxPQUFPLENBQUNILGNBQWMsQ0FBQ0ksUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUNqREQsT0FBTyxDQUFDSCxjQUFjLEdBQ3JCLEdBQUVHLE9BQU8sQ0FBQ0gsY0FBZSxHQUFFO1FBRWhDSyxLQUFLLENBQUUsR0FBRUwsY0FBZSxRQUFPLEVBQUU7VUFDL0JNLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7WUFDbkJWLElBQUksRUFBRUssT0FBTyxDQUFDTTtVQUNoQixDQUFDLENBQUM7VUFDRkMsT0FBTyxFQUFFO1lBQUUsY0FBYyxFQUFFO1VBQW1CLENBQUM7VUFDL0NDLE1BQU0sRUFBRTtRQUNWLENBQUMsQ0FBQztRQUNGO01BQ0YsQ0FBQyxNQUFNLElBQUlSLE9BQU8sQ0FBQ1MsT0FBTyxFQUFFO1FBQzFCbkIsTUFBTSxDQUFDb0IsSUFBSSxDQUFDQyxpQkFBaUIsQ0FBQztVQUFFQyxNQUFNLEVBQUU7UUFBTSxDQUFDLENBQUMsQ0FBQ0MsSUFBSSxDQUFFQyxLQUFLLElBQUs7VUFDL0RaLEtBQUssQ0FBRSxHQUFFTCxjQUFlLFFBQU8sRUFBRTtZQUMvQk0sSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQVMsQ0FBQztjQUNuQlUsS0FBSyxFQUFFRCxLQUFLO2NBQ1pFLFFBQVEsRUFBRXBCLGFBQWE7Y0FBRTtjQUN6QnFCLEtBQUssRUFBRW5CO1lBQ1QsQ0FBQyxDQUFDO1lBQ0ZTLE9BQU8sRUFBRTtjQUFFLGNBQWMsRUFBRTtZQUFtQixDQUFDO1lBQy9DQyxNQUFNLEVBQUU7VUFDVixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7TUFDSjtJQUNGLENBQUMsQ0FBQztFQUNKO0FBQ0YsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JhaXYvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yYWl2Ly4vc3JjL2VudHJ5L2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcigocG9ydCkgPT4ge1xuICBpZiAocG9ydC5uYW1lID09PSAncmFpdicpIHtcbiAgICBsZXQgZnJhbWVQb3NpdGlvbiA9IDBcbiAgICBsZXQgc2VydmVyTG9jYXRpb24gPSAnJ1xuICAgIGxldCB2aWRlb1Jlc291cmNlVXJpID0gJydcblxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbikge1xuICAgICAgICBmcmFtZVBvc2l0aW9uID0gMFxuICAgICAgICBzZXJ2ZXJMb2NhdGlvbiA9IG1lc3NhZ2Uuc2VydmVyTG9jYXRpb24uZW5kc1dpdGgoJy8nKVxuICAgICAgICAgID8gbWVzc2FnZS5zZXJ2ZXJMb2NhdGlvblxuICAgICAgICAgIDogYCR7bWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbn0vYFxuXG4gICAgICAgIGZldGNoKGAke3NlcnZlckxvY2F0aW9ufXZpZGVvL2AsIHtcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBtZXNzYWdlLnZpZGVvTmFtZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgfSlcbiAgICAgICAgLy8gVE9ETzogZ2V0IHRoZSB2aWRlbydzIHJlc291cmNlIFVSSSBiYWNrIGZyb20gdGhlIHNlcnZlciBhbmQgc3RvcmUgaXQgZm9yIGZyYW1lIGNhcHR1cmVzXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY2FwdHVyZSkge1xuICAgICAgICBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih7IGZvcm1hdDogJ3BuZycgfSkudGhlbigoaW1hZ2UpID0+IHtcbiAgICAgICAgICBmZXRjaChgJHtzZXJ2ZXJMb2NhdGlvbn0vZnJhbWVgLCB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIGZyYW1lOiBpbWFnZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGZyYW1lUG9zaXRpb24sIC8vIFRPRE86IERvIHdlIGNhcmUgYWJvdXQgdGhpcz8gSWYgd2Ugd2FudCB0byBzb3J0IHRoZSBmcmFtZXMgYmVmb3JlIGVuY29kaW5nIHRoZW4gdGhpcyBzdXJlbHkgaXMgdW5pbXBvcnRhbnQuXG4gICAgICAgICAgICAgIHZpZGVvOiB2aWRlb1Jlc291cmNlVXJpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxufSlcbiJdLCJuYW1lcyI6WyJjaHJvbWUiLCJydW50aW1lIiwib25Db25uZWN0IiwiYWRkTGlzdGVuZXIiLCJwb3J0IiwibmFtZSIsImZyYW1lUG9zaXRpb24iLCJzZXJ2ZXJMb2NhdGlvbiIsInZpZGVvUmVzb3VyY2VVcmkiLCJvbk1lc3NhZ2UiLCJtZXNzYWdlIiwiZW5kc1dpdGgiLCJmZXRjaCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwidmlkZW9OYW1lIiwiaGVhZGVycyIsIm1ldGhvZCIsImNhcHR1cmUiLCJ0YWJzIiwiY2FwdHVyZVZpc2libGVUYWIiLCJmb3JtYXQiLCJ0aGVuIiwiaW1hZ2UiLCJmcmFtZSIsInBvc2l0aW9uIiwidmlkZW8iXSwic291cmNlUm9vdCI6IiJ9