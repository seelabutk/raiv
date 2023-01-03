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
        }).then(response => response.json()).then(data => {
          videoId = data;
          port.postMessage({
            ready: true
          });
        });
      } else if (message.capture) {
        chrome.tabs.captureVisibleTab({
          format: 'png'
        }).then(image => {
          fetch(`${serverLocation}frame/`, {
            body: JSON.stringify({
              frame: image,
              position: framePosition++,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsYUFBYSxHQUFHLENBQUM7SUFDckIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsT0FBTyxHQUFHLEVBQUU7SUFFaEJKLElBQUksQ0FBQ0ssU0FBUyxDQUFDTixXQUFXLENBQUVPLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNILGNBQWMsRUFBRTtRQUMxQkQsYUFBYSxHQUFHLENBQUM7UUFDakJDLGNBQWMsR0FBR0csT0FBTyxDQUFDSCxjQUFjLENBQUNJLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FDakRELE9BQU8sQ0FBQ0gsY0FBYyxHQUNyQixHQUFFRyxPQUFPLENBQUNILGNBQWUsR0FBRTtRQUVoQ0ssS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1VBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1lBQ25CQyxTQUFTLEVBQUVOLE9BQU8sQ0FBQ00sU0FBUztZQUM1QlgsSUFBSSxFQUFFSyxPQUFPLENBQUNPO1VBQ2hCLENBQUMsQ0FBQztVQUNGQyxPQUFPLEVBQUU7WUFBRSxjQUFjLEVBQUU7VUFBbUIsQ0FBQztVQUMvQ0MsTUFBTSxFQUFFO1FBQ1YsQ0FBQyxDQUFDLENBQ0NDLElBQUksQ0FBRUMsUUFBUSxJQUFLQSxRQUFRLENBQUNDLElBQUksRUFBRSxDQUFDLENBQ25DRixJQUFJLENBQUVHLElBQUksSUFBSztVQUNkZixPQUFPLEdBQUdlLElBQUk7VUFDZG5CLElBQUksQ0FBQ29CLFdBQVcsQ0FBQztZQUFFQyxLQUFLLEVBQUU7VUFBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO01BQ04sQ0FBQyxNQUFNLElBQUlmLE9BQU8sQ0FBQ2dCLE9BQU8sRUFBRTtRQUMxQjFCLE1BQU0sQ0FBQzJCLElBQUksQ0FBQ0MsaUJBQWlCLENBQUM7VUFBRUMsTUFBTSxFQUFFO1FBQU0sQ0FBQyxDQUFDLENBQUNULElBQUksQ0FBRVUsS0FBSyxJQUFLO1VBQy9EbEIsS0FBSyxDQUFFLEdBQUVMLGNBQWUsUUFBTyxFQUFFO1lBQy9CTSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO2NBQ25CZ0IsS0FBSyxFQUFFRCxLQUFLO2NBQ1pFLFFBQVEsRUFBRTFCLGFBQWEsRUFBRTtjQUN6QjJCLEtBQUssRUFBRXpCO1lBQ1QsQ0FBQyxDQUFDO1lBQ0ZVLE9BQU8sRUFBRTtjQUFFLGNBQWMsRUFBRTtZQUFtQixDQUFDO1lBQy9DQyxNQUFNLEVBQUU7VUFDVixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7TUFDSjtJQUNGLENBQUMsQ0FBQztFQUNKO0FBQ0YsQ0FBQyxDQUFDO0FBRUZuQixNQUFNLENBQUNrQyxNQUFNLENBQUNDLFNBQVMsQ0FBQ2hDLFdBQVcsQ0FBRWlDLEdBQUcsSUFBSztFQUMzQ3BDLE1BQU0sQ0FBQ3FDLFNBQVMsQ0FBQ0MsYUFBYSxDQUFDO0lBQzdCQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDdkJDLE1BQU0sRUFBRTtNQUFFQyxLQUFLLEVBQUVMLEdBQUcsQ0FBQ007SUFBRztFQUMxQixDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhaXYvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JhaXYvLi9zcmMvZW50cnkvYmFja2dyb3VuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZ2xvYmFsIGNocm9tZSAqL1xuY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKChwb3J0KSA9PiB7XG4gIGlmIChwb3J0Lm5hbWUgPT09ICdyYWl2Jykge1xuICAgIGxldCBmcmFtZVBvc2l0aW9uID0gMFxuICAgIGxldCBzZXJ2ZXJMb2NhdGlvbiA9ICcnXG4gICAgbGV0IHZpZGVvSWQgPSAnJ1xuXG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnNlcnZlckxvY2F0aW9uKSB7XG4gICAgICAgIGZyYW1lUG9zaXRpb24gPSAwXG4gICAgICAgIHNlcnZlckxvY2F0aW9uID0gbWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbi5lbmRzV2l0aCgnLycpXG4gICAgICAgICAgPyBtZXNzYWdlLnNlcnZlckxvY2F0aW9uXG4gICAgICAgICAgOiBgJHttZXNzYWdlLnNlcnZlckxvY2F0aW9ufS9gXG5cbiAgICAgICAgZmV0Y2goYCR7c2VydmVyTG9jYXRpb259dmlkZW8vYCwge1xuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFjdGlvbk1hcDogbWVzc2FnZS5hY3Rpb25NYXAsXG4gICAgICAgICAgICBuYW1lOiBtZXNzYWdlLnZpZGVvTmFtZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdmlkZW9JZCA9IGRhdGFcbiAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UoeyByZWFkeTogdHJ1ZSB9KVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY2FwdHVyZSkge1xuICAgICAgICBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih7IGZvcm1hdDogJ3BuZycgfSkudGhlbigoaW1hZ2UpID0+IHtcbiAgICAgICAgICBmZXRjaChgJHtzZXJ2ZXJMb2NhdGlvbn1mcmFtZS9gLCB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIGZyYW1lOiBpbWFnZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGZyYW1lUG9zaXRpb24rKyxcbiAgICAgICAgICAgICAgdmlkZW86IHZpZGVvSWQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59KVxuXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigodGFiKSA9PiB7XG4gIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgZmlsZXM6IFsnL3JlY29yZGVyLmpzJ10sXG4gICAgdGFyZ2V0OiB7IHRhYklkOiB0YWIuaWQgfSxcbiAgfSlcbn0pXG4iXSwibmFtZXMiOlsiY2hyb21lIiwicnVudGltZSIsIm9uQ29ubmVjdCIsImFkZExpc3RlbmVyIiwicG9ydCIsIm5hbWUiLCJmcmFtZVBvc2l0aW9uIiwic2VydmVyTG9jYXRpb24iLCJ2aWRlb0lkIiwib25NZXNzYWdlIiwibWVzc2FnZSIsImVuZHNXaXRoIiwiZmV0Y2giLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImFjdGlvbk1hcCIsInZpZGVvTmFtZSIsImhlYWRlcnMiLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsInBvc3RNZXNzYWdlIiwicmVhZHkiLCJjYXB0dXJlIiwidGFicyIsImNhcHR1cmVWaXNpYmxlVGFiIiwiZm9ybWF0IiwiaW1hZ2UiLCJmcmFtZSIsInBvc2l0aW9uIiwidmlkZW8iLCJhY3Rpb24iLCJvbkNsaWNrZWQiLCJ0YWIiLCJzY3JpcHRpbmciLCJleGVjdXRlU2NyaXB0IiwiZmlsZXMiLCJ0YXJnZXQiLCJ0YWJJZCIsImlkIl0sInNvdXJjZVJvb3QiOiIifQ==