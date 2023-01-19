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
    let serverLocation = '';
    let videoId = '';
    port.onMessage.addListener(message => {
      if (message.serverLocation) {
        serverLocation = message.serverLocation.endsWith('/') ? message.serverLocation : `${message.serverLocation}/`;
        fetch(`${serverLocation}video/`, {
          body: JSON.stringify({
            actionMap: Object.assign({
              name: message.videoName
            }, message.actionMap)
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
              position: message.position,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBQSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDQyxXQUFXLENBQUVDLElBQUksSUFBSztFQUM3QyxJQUFJQSxJQUFJLENBQUNDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDeEIsSUFBSUMsY0FBYyxHQUFHLEVBQUU7SUFDdkIsSUFBSUMsT0FBTyxHQUFHLEVBQUU7SUFFaEJILElBQUksQ0FBQ0ksU0FBUyxDQUFDTCxXQUFXLENBQUVNLE9BQU8sSUFBSztNQUN0QyxJQUFJQSxPQUFPLENBQUNILGNBQWMsRUFBRTtRQUMxQkEsY0FBYyxHQUFHRyxPQUFPLENBQUNILGNBQWMsQ0FBQ0ksUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUNqREQsT0FBTyxDQUFDSCxjQUFjLEdBQ3JCLEdBQUVHLE9BQU8sQ0FBQ0gsY0FBZSxHQUFFO1FBRWhDSyxLQUFLLENBQUUsR0FBRUwsY0FBZSxRQUFPLEVBQUU7VUFDL0JNLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7WUFDbkJDLFNBQVMsRUFBRUMsTUFBTSxDQUFDQyxNQUFNLENBQ3RCO2NBQ0VaLElBQUksRUFBRUksT0FBTyxDQUFDUztZQUNoQixDQUFDLEVBQ0RULE9BQU8sQ0FBQ00sU0FBUztVQUVyQixDQUFDLENBQUM7VUFDRkksT0FBTyxFQUFFO1lBQUUsY0FBYyxFQUFFO1VBQW1CLENBQUM7VUFDL0NDLE1BQU0sRUFBRTtRQUNWLENBQUMsQ0FBQyxDQUNDQyxJQUFJLENBQUVDLFFBQVEsSUFBS0EsUUFBUSxDQUFDQyxJQUFJLEVBQUUsQ0FBQyxDQUNuQ0YsSUFBSSxDQUFFRyxJQUFJLElBQUs7VUFDZGpCLE9BQU8sR0FBR2lCLElBQUk7VUFDZHBCLElBQUksQ0FBQ3FCLFdBQVcsQ0FBQztZQUFFQyxLQUFLLEVBQUU7VUFBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO01BQ04sQ0FBQyxNQUFNLElBQUlqQixPQUFPLENBQUNrQixPQUFPLEVBQUU7UUFDMUIzQixNQUFNLENBQUM0QixJQUFJLENBQUNDLGlCQUFpQixDQUFDO1VBQUVDLE1BQU0sRUFBRTtRQUFNLENBQUMsQ0FBQyxDQUFDVCxJQUFJLENBQUVVLEtBQUssSUFBSztVQUMvRHBCLEtBQUssQ0FBRSxHQUFFTCxjQUFlLFFBQU8sRUFBRTtZQUMvQk0sSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQVMsQ0FBQztjQUNuQmtCLEtBQUssRUFBRUQsS0FBSztjQUNaRSxRQUFRLEVBQUV4QixPQUFPLENBQUN3QixRQUFRO2NBQzFCQyxLQUFLLEVBQUUzQjtZQUNULENBQUMsQ0FBQztZQUNGWSxPQUFPLEVBQUU7Y0FBRSxjQUFjLEVBQUU7WUFBbUIsQ0FBQztZQUMvQ0MsTUFBTSxFQUFFO1VBQ1YsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO01BQ0o7SUFDRixDQUFDLENBQUM7RUFDSjtBQUNGLENBQUMsQ0FBQztBQUVGcEIsTUFBTSxDQUFDbUMsTUFBTSxDQUFDQyxTQUFTLENBQUNqQyxXQUFXLENBQUVrQyxHQUFHLElBQUs7RUFDM0NyQyxNQUFNLENBQUNzQyxTQUFTLENBQUNDLGFBQWEsQ0FBQztJQUM3QkMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ3ZCQyxNQUFNLEVBQUU7TUFBRUMsS0FBSyxFQUFFTCxHQUFHLENBQUNNO0lBQUc7RUFDMUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWl2L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JhaXYvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yYWl2Ly4vc3JjL2VudHJ5L2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcigocG9ydCkgPT4ge1xuICBpZiAocG9ydC5uYW1lID09PSAncmFpdicpIHtcbiAgICBsZXQgc2VydmVyTG9jYXRpb24gPSAnJ1xuICAgIGxldCB2aWRlb0lkID0gJydcblxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbikge1xuICAgICAgICBzZXJ2ZXJMb2NhdGlvbiA9IG1lc3NhZ2Uuc2VydmVyTG9jYXRpb24uZW5kc1dpdGgoJy8nKVxuICAgICAgICAgID8gbWVzc2FnZS5zZXJ2ZXJMb2NhdGlvblxuICAgICAgICAgIDogYCR7bWVzc2FnZS5zZXJ2ZXJMb2NhdGlvbn0vYFxuXG4gICAgICAgIGZldGNoKGAke3NlcnZlckxvY2F0aW9ufXZpZGVvL2AsIHtcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBhY3Rpb25NYXA6IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBtZXNzYWdlLnZpZGVvTmFtZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZS5hY3Rpb25NYXBcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSksXG4gICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHZpZGVvSWQgPSBkYXRhXG4gICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHsgcmVhZHk6IHRydWUgfSlcbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLmNhcHR1cmUpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIoeyBmb3JtYXQ6ICdwbmcnIH0pLnRoZW4oKGltYWdlKSA9PiB7XG4gICAgICAgICAgZmV0Y2goYCR7c2VydmVyTG9jYXRpb259ZnJhbWUvYCwge1xuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBmcmFtZTogaW1hZ2UsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlLnBvc2l0aW9uLFxuICAgICAgICAgICAgICB2aWRlbzogdmlkZW9JZCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG5cbmNocm9tZS5hY3Rpb24ub25DbGlja2VkLmFkZExpc3RlbmVyKCh0YWIpID0+IHtcbiAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICBmaWxlczogWycvcmVjb3JkZXIuanMnXSxcbiAgICB0YXJnZXQ6IHsgdGFiSWQ6IHRhYi5pZCB9LFxuICB9KVxufSlcbiJdLCJuYW1lcyI6WyJjaHJvbWUiLCJydW50aW1lIiwib25Db25uZWN0IiwiYWRkTGlzdGVuZXIiLCJwb3J0IiwibmFtZSIsInNlcnZlckxvY2F0aW9uIiwidmlkZW9JZCIsIm9uTWVzc2FnZSIsIm1lc3NhZ2UiLCJlbmRzV2l0aCIsImZldGNoIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJhY3Rpb25NYXAiLCJPYmplY3QiLCJhc3NpZ24iLCJ2aWRlb05hbWUiLCJoZWFkZXJzIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJwb3N0TWVzc2FnZSIsInJlYWR5IiwiY2FwdHVyZSIsInRhYnMiLCJjYXB0dXJlVmlzaWJsZVRhYiIsImZvcm1hdCIsImltYWdlIiwiZnJhbWUiLCJwb3NpdGlvbiIsInZpZGVvIiwiYWN0aW9uIiwib25DbGlja2VkIiwidGFiIiwic2NyaXB0aW5nIiwiZXhlY3V0ZVNjcmlwdCIsImZpbGVzIiwidGFyZ2V0IiwidGFiSWQiLCJpZCJdLCJzb3VyY2VSb290IjoiIn0=