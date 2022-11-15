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

function highlight(element, value) {
  if (value) {
    element.style.border = '1px solid green'
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
  } else {
    const index = selectedElements.indexOf(element)

    highlight(element, false)

    selectedElements.splice(index, 1)
    elementBorders.splice(index, 1)
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.recording) {
    document.addEventListener('click', onClick, true)
  } else {
    document.removeEventListener('click', onClick, true)

    selectedElements.forEach((element) => {
      highlight(element, false)
    })

    selectedElements.splice(0, selectedElements.length)
    elementBorders.splice(0, elementBorders.length)
  }
})

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkZXIuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhaXYvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFpdi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JhaXYvLi9zcmMvZW50cnkvcmVjb3JkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGdsb2JhbCBjaHJvbWUgKi9cbmNvbnN0IHNlbGVjdGVkRWxlbWVudHMgPSBbXVxuY29uc3QgZWxlbWVudEJvcmRlcnMgPSBbXVxuXG5mdW5jdGlvbiBoaWdobGlnaHQoZWxlbWVudCwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlKSB7XG4gICAgZWxlbWVudC5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIGdyZWVuJ1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpXG5cbiAgICBlbGVtZW50LnN0eWxlLmJvcmRlciA9IGVsZW1lbnRCb3JkZXJzW2luZGV4XVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIGNvbnN0IGVsZW1lbnQgPSBldmVudC50YXJnZXRcbiAgaWYgKCFzZWxlY3RlZEVsZW1lbnRzLmluY2x1ZGVzKGVsZW1lbnQpKSB7XG4gICAgc2VsZWN0ZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpXG4gICAgZWxlbWVudEJvcmRlcnMucHVzaChlbGVtZW50LnN0eWxlLmJvcmRlcilcblxuICAgIGhpZ2hsaWdodChlbGVtZW50LCB0cnVlKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpXG5cbiAgICBoaWdobGlnaHQoZWxlbWVudCwgZmFsc2UpXG5cbiAgICBzZWxlY3RlZEVsZW1lbnRzLnNwbGljZShpbmRleCwgMSlcbiAgICBlbGVtZW50Qm9yZGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gIH1cbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gIGlmIChtZXNzYWdlLnJlY29yZGluZykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgdHJ1ZSlcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIHRydWUpXG5cbiAgICBzZWxlY3RlZEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGhpZ2hsaWdodChlbGVtZW50LCBmYWxzZSlcbiAgICB9KVxuXG4gICAgc2VsZWN0ZWRFbGVtZW50cy5zcGxpY2UoMCwgc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGgpXG4gICAgZWxlbWVudEJvcmRlcnMuc3BsaWNlKDAsIGVsZW1lbnRCb3JkZXJzLmxlbmd0aClcbiAgfVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==