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
            actionMap: message.actionMap,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsT0FBTyxHQUFHLEVBQUU7SUFFaEJKLElBQUksQ0FBQ0ssU0FBUyxDQUFDTixXQUFXLENBQUVPLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNILGNBQWMsRUFBRTtRQUMxQkQsYUFBYSxHQUFHLENBQUM7UUFDakJDLGNBQWMsR0FBR0csT0FBTyxDQUFDSCxjQUFjLENBQUNJLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FDakRELE9BQU8sQ0FBQ0gsY0FBYyxHQUNyQixHQUFFRyxPQUFPLENBQUNILGNBQWUsR0FBRTtRQUVoQ0ssS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1VBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1lBQ25CQyxTQUFTLEVBQUVOLE9BQU8sQ0FBQ00sU0FBUztZQUM1QlgsSUFBSSxFQUFFSyxPQUFPLENBQUNPO1VBQ2hCLENBQUMsQ0FBQztVQUNGQyxPQUFPLEVBQUU7WUFBRSxjQUFjLEVBQUU7VUFBbUIsQ0FBQztVQUMvQ0MsTUFBTSxFQUFFO1FBQ1YsQ0FBQyxDQUFDO1FBQ0Y7TUFDRixDQUFDLE1BQU0sSUFBSVQsT0FBTyxDQUFDVSxPQUFPLEVBQUU7UUFDMUJwQixNQUFNLENBQUNxQixJQUFJLENBQUNDLGlCQUFpQixDQUFDO1VBQUVDLE1BQU0sRUFBRTtRQUFNLENBQUMsQ0FBQyxDQUFDQyxJQUFJLENBQUVDLEtBQUssSUFBSztVQUMvRGIsS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1lBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO2NBQ25CVyxLQUFLLEVBQUVELEtBQUs7Y0FDWkUsUUFBUSxFQUFFckIsYUFBYTtjQUFFO2NBQ3pCc0IsS0FBSyxFQUFFcEI7WUFDVCxDQUFDLENBQUM7WUFDRlUsT0FBTyxFQUFFO2NBQUUsY0FBYyxFQUFFO1lBQW1CLENBQUM7WUFDL0NDLE1BQU0sRUFBRTtVQUNWLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztNQUNKO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7QUFDRixDQUFDLENBQUM7QUFFRm5CLE1BQU0sQ0FBQzZCLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDM0IsV0FBVyxDQUFFNEIsR0FBRyxJQUFLO0VBQzNDL0IsTUFBTSxDQUFDZ0MsU0FBUyxDQUFDQyxhQUFhLENBQUM7SUFDN0JDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUN2QkMsTUFBTSxFQUFFO01BQUVDLEtBQUssRUFBRUwsR0FBRyxDQUFDTTtJQUFHO0VBQzFCLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcmFpdi8uL3NyYy9lbnRyeS9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBnbG9iYWwgY2hyb21lICovXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoKHBvcnQpID0+IHtcbiAgaWYgKHBvcnQubmFtZSA9PT0gJ3JhaXYnKSB7XG4gICAgbGV0IGZyYW1lUG9zaXRpb24gPSAwXG4gICAgbGV0IHNlcnZlckxvY2F0aW9uID0gJydcbiAgICBsZXQgdmlkZW9JZCA9ICcnXG5cbiAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2Uuc2VydmVyTG9jYXRpb24pIHtcbiAgICAgICAgZnJhbWVQb3NpdGlvbiA9IDBcbiAgICAgICAgc2VydmVyTG9jYXRpb24gPSBtZXNzYWdlLnNlcnZlckxvY2F0aW9uLmVuZHNXaXRoKCcvJylcbiAgICAgICAgICA/IG1lc3NhZ2Uuc2VydmVyTG9jYXRpb25cbiAgICAgICAgICA6IGAke21lc3NhZ2Uuc2VydmVyTG9jYXRpb259L2BcblxuICAgICAgICBmZXRjaChgJHtzZXJ2ZXJMb2NhdGlvbn12aWRlby9gLCB7XG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgYWN0aW9uTWFwOiBtZXNzYWdlLmFjdGlvbk1hcCxcbiAgICAgICAgICAgIG5hbWU6IG1lc3NhZ2UudmlkZW9OYW1lLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB9KVxuICAgICAgICAvLyBUT0RPOiBnZXQgdGhlIHZpZGVvJ3MgcmVzb3VyY2UgVVJJIGJhY2sgZnJvbSB0aGUgc2VydmVyIGFuZCBzdG9yZSBpdCBmb3IgZnJhbWUgY2FwdHVyZXNcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS5jYXB0dXJlKSB7XG4gICAgICAgIGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHsgZm9ybWF0OiAncG5nJyB9KS50aGVuKChpbWFnZSkgPT4ge1xuICAgICAgICAgIGZldGNoKGAke3NlcnZlckxvY2F0aW9ufWZyYW1lL2AsIHtcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgZnJhbWU6IGltYWdlLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogZnJhbWVQb3NpdGlvbiwgLy8gVE9ETzogRG8gd2UgY2FyZSBhYm91dCB0aGlzPyBJZiB3ZSB3YW50IHRvIHNvcnQgdGhlIGZyYW1lcyBiZWZvcmUgZW5jb2RpbmcgdGhlbiB0aGlzIHN1cmVseSBpcyB1bmltcG9ydGFudC5cbiAgICAgICAgICAgICAgdmlkZW86IHZpZGVvSWQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59KVxuXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgZmlsZXM6IFsnL3JlY29yZGVyLmpzJ10sXG4gICAgdGFyZ2V0OiB7IHRhYklkOiB0YWIuaWQgfSxcbiAgfSlcbn0pXG4iXSwibmFtZXMiOlsiY2hyb21lIiwicnVudGltZSIsIm9uQ29ubmVjdCIsImFkZExpc3RlbmVyIiwicG9ydCIsIm5hbWUiLCJmcmFtZVBvc2l0aW9uIiwic2VydmVyTG9jYXRpb24iLCJ2aWRlb0lkIiwib25NZXNzYWdlIiwibWVzc2FnZSIsImVuZHNXaXRoIiwiZmV0Y2giLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImFjdGlvbk1hcCIsInZpZGVvTmFtZSIsImhlYWRlcnMiLCJtZXRob2QiLCJjYXB0dXJlIiwidGFicyIsImNhcHR1cmVWaXNpYmxlVGFiIiwiZm9ybWF0IiwidGhlbiIsImltYWdlIiwiZnJhbWUiLCJwb3NpdGlvbiIsInZpZGVvIiwiYWN0aW9uIiwib25DbGlja2VkIiwidGFiIiwic2NyaXB0aW5nIiwiZXhlY3V0ZVNjcmlwdCIsImZpbGVzIiwidGFyZ2V0IiwidGFiSWQiLCJpZCJdLCJzb3VyY2VSb290IjoiIn0=