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
/*!*******************************!*\
  !*** ./src/entry/recorder.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* global chrome */
const selectedElements = []
const elementBorders = []
let port = null

chrome.runtime.onConnect.addListener((_port) => {
  port = _port

  if (port.name === 'raiv') {
    port.onMessage.addListener((message) => {
      if ('recording' in message) {
        if (message.recording) {
          document.addEventListener('click', onClick, true)
        } else {
          document.removeEventListener('click', onClick, true)
        }

        clearElements()
      }

      if ('clear' in message && message.clear) {
        clearElements()
      }
    })
  }
})

function clearElements() {
  selectedElements.forEach((element) => {
    highlight(element, false)
  })

  selectedElements.splice(0, selectedElements.length)
  elementBorders.splice(0, elementBorders.length)
}

function sendMessage(obj) {
  if (port !== null) {
    port.postMessage(obj)
  }
}

function highlight(element, value) {
  if (value) {
    element.style.border = '4px solid green'
  } else {
    const index = selectedElements.indexOf(element)

    element.style.border = elementBorders[index]
  }
}

function onClick(event) {
  event.preventDefault()

  const element = event.target
  if (!selectedElements.includes(element)) {
    selectedElements.push(element)
    elementBorders.push(element.style.border)

    highlight(element, true)

    sendMessage({
      action: 'click',
      target: element,
    })
  } else {
    const index = selectedElements.indexOf(element)

    highlight(element, false)

    selectedElements.splice(index, 1)
    elementBorders.splice(index, 1)

    sendMessage({
      delete: true,
      target: element,
    })
  }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkZXIuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3JhaXYvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JhaXYvLi9zcmMvZW50cnkvcmVjb3JkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSBbXVxuY29uc3QgZWxlbWVudEJvcmRlcnMgPSBbXVxubGV0IHBvcnQgPSBudWxsXG5cbmNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcigoX3BvcnQpID0+IHtcbiAgcG9ydCA9IF9wb3J0XG5cbiAgaWYgKHBvcnQubmFtZSA9PT0gJ3JhaXYnKSB7XG4gICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmICgncmVjb3JkaW5nJyBpbiBtZXNzYWdlKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLnJlY29yZGluZykge1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgdHJ1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICBjbGVhckVsZW1lbnRzKClcbiAgICAgIH1cblxuICAgICAgaWYgKCdjbGVhcicgaW4gbWVzc2FnZSAmJiBtZXNzYWdlLmNsZWFyKSB7XG4gICAgICAgIGNsZWFyRWxlbWVudHMoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNsZWFyRWxlbWVudHMoKSB7XG4gIHNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGhpZ2hsaWdodChlbGVtZW50LCBmYWxzZSlcbiAgfSlcblxuICBzZWxlY3RlZEVsZW1lbnRzLnNwbGljZSgwLCBzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aClcbiAgZWxlbWVudEJvcmRlcnMuc3BsaWNlKDAsIGVsZW1lbnRCb3JkZXJzLmxlbmd0aClcbn1cblxuZnVuY3Rpb24gc2VuZE1lc3NhZ2Uob2JqKSB7XG4gIGlmIChwb3J0ICE9PSBudWxsKSB7XG4gICAgcG9ydC5wb3N0TWVzc2FnZShvYmopXG4gIH1cbn1cblxuZnVuY3Rpb24gaGlnaGxpZ2h0KGVsZW1lbnQsIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gJzRweCBzb2xpZCBncmVlbidcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpbmRleCA9IHNlbGVjdGVkRWxlbWVudHMuaW5kZXhPZihlbGVtZW50KVxuXG4gICAgZWxlbWVudC5zdHlsZS5ib3JkZXIgPSBlbGVtZW50Qm9yZGVyc1tpbmRleF1cbiAgfVxufVxuXG5mdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0XG4gIGlmICghc2VsZWN0ZWRFbGVtZW50cy5pbmNsdWRlcyhlbGVtZW50KSkge1xuICAgIHNlbGVjdGVkRWxlbWVudHMucHVzaChlbGVtZW50KVxuICAgIGVsZW1lbnRCb3JkZXJzLnB1c2goZWxlbWVudC5zdHlsZS5ib3JkZXIpXG5cbiAgICBoaWdobGlnaHQoZWxlbWVudCwgdHJ1ZSlcblxuICAgIHNlbmRNZXNzYWdlKHtcbiAgICAgIGFjdGlvbjogJ2NsaWNrJyxcbiAgICAgIHRhcmdldDogZWxlbWVudCxcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpXG5cbiAgICBoaWdobGlnaHQoZWxlbWVudCwgZmFsc2UpXG5cbiAgICBzZWxlY3RlZEVsZW1lbnRzLnNwbGljZShpbmRleCwgMSlcbiAgICBlbGVtZW50Qm9yZGVycy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICBzZW5kTWVzc2FnZSh7XG4gICAgICBkZWxldGU6IHRydWUsXG4gICAgICB0YXJnZXQ6IGVsZW1lbnQsXG4gICAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9