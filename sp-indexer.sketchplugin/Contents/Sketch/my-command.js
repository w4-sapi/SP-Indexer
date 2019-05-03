var globalThis = this;
function __skpm_run (key, context) {
  globalThis.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);
 // documentation: https://developer.sketchapp.com/reference/api/

/* harmony default export */ __webpack_exports__["default"] = (function () {
  sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("indexing start! 🧹");
  var doc = context.document,
      pages = doc.pages(),
      targetInstance = context.selection.firstObject();
  var indexString = ''; //index 목차 작성되는 곳

  var pageNumber = 0; //page number ++ 되는 곳

  var tabSpace = '    ',
      bigSapce = '            ';
  var targetSymbolMaster = null;
  var symbolMasterInfo = null;
  var indexTextfiled = null;

  if (targetInstance != null) {
    if (targetInstance.isKindOfClass(MSSymbolInstance)) {
      targetSymbolMaster = targetInstance.symbolMaster();
      symbolMasterInfo = findInstanceFromSymbolMaster(targetSymbolMaster);
    } else if (targetInstance.isKindOfClass(MSTextLayer)) {
      indexTextfiled = targetInstance;
    }
  }

  for (var i = 0; i < pages.count(); i++) {
    var currentPage = pages.objectAtIndex(i);
    var title = currentPage.name();
    if (title.match(/Symbols/)) continue; //Symbols 이라는 문자열이 들어가있으면 제거. 

    var pageIndexNumber = i + 1;

    if (title.match(/\[(.*?)\]/) == null) {
      //[idx] 값이 없으면
      currentPage.setName('[' + pageIndexNumber + '] ' + title); // console.log('[' + pageIndexNumber + '] ' + title);
    } else {
      if (title.match(/\[(.*?)\]/)[0] == '[' + pageIndexNumber + ']') {//[idx] 값이 같으면 
        //console.log('got idx');
      } else {
        currentPage.setName(title.replace(/\[(.+?)\]/g, '[' + pageIndexNumber + ']')); //[idx] 값이 다를경우 업데이트
      }
    }

    var pageTitleWithIndex = currentPage.name().replace(/\[/g, '').replace(/]/g, '.'); //[abc] 를 .으로 교체

    var pageTitleWithoutIndex = currentPage.name().replace(/\[[^}]*\] /, ''); //'[abc] '제거 

    indexString += '\n' + 'p.' + pageNumber + tabSpace + pageTitleWithIndex + tabSpace + '\n';
    var currentLayers = currentPage.layers(); // console.log(currentLayers.class()); //현 페이지의 모든 레이어

    var artboards = filterArtboard(currentLayers); //artboard 만 걸러내는 과정

    artboards.sort(function (a, b) {
      return a.frame().x() - b.frame().x();
    }); //artboard 좌표 중 가장 작은 x값을 가진 녀석을 찾기 위해 재정렬

    var minX = artboards[0].frame().x(); //가장 작은 Artboard의 x값 도출. 

    var leftLines = filterByPosition(artboards, minX, 'x', 1); // 가장 작은 x 값 기준 +-1 에 속하는 artboard들 모음 

    leftLines.sort(function (a, b) {
      return a.frame().y() - b.frame().y();
    }); // y값 기준으로 다시 정렬

    var minY = leftLines[0].frame().y(); // console.log('    ' + leftLines[0].name() ); // 왼쪽 줄 가장 위에 있는 아트보드의 y값 도출

    var topLines = filterByPosition(artboards, minY, 'y', 1); //가장 윗줄에 있는 아트보드 구함

    var verticalArtboardLines = NSMutableArray.array(); // column 을 위한 배열 생성

    var hasTitleArtboard = false;

    for (var k = 0; k < topLines.count(); k++) {
      //가장 윗줄의 art보드 개수 기준
      var basisX = topLines[k].frame().x(); //각 column의 x값 구함

      var verticalArtboardLine = filterByPosition(artboards, basisX, 'x', 1); // x값 근처에 있는 세로축 라인 구함

      verticalArtboardLine.sort(function (a, b) {
        return a.frame().y() - b.frame().y();
      }); //y값 기준으로 다시 정렬

      verticalArtboardLines.addObject(verticalArtboardLine);
      var columnIndexNumber;
      var columnHasChildren = false;
      var columnParentTitle = '';
      var verticalArtboardLineCount = verticalArtboardLine.count();

      for (var x = 0; x < verticalArtboardLineCount; x++) {
        var artboardNameWithoutIndex = verticalArtboardLine[x].name().replace(/\[[^}]*\] /, ''); //만약 '[abc] '가 있으면 제거한 값

        if (pageTitleWithoutIndex == artboardNameWithoutIndex && k == 0) hasTitleArtboard = true;
        columnIndexNumber = hasTitleArtboard == true ? k : k + 1;
        columnHasChildren = verticalArtboardLineCount == 1 ? false : true;
        var rowIndexNumber = x;
        var idxNumStr;
        var navigatorStr = '';
        var artboardNameWithFullIndex = '';

        if (!columnHasChildren) {
          //컬럼에 자식이 없을 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + "]";
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' >';

          if (columnIndexNumber == 0) {
            //페이지 커버인 경우
            artboardNameWithFullIndex = pageIndexNumber + '. ' + artboardNameWithoutIndex;
          } else {
            //페이지 커버가 아닌경우
            artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '. ' + artboardNameWithoutIndex;
          }
        } else if (rowIndexNumber == 0) {
          //컬럼에 자식이 있는데 첫번째인 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + '_' + rowIndexNumber + "]";
          columnParentTitle = artboardNameWithoutIndex;
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' >';
          artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '. ' + artboardNameWithoutIndex;
        } else {
          //컬럼에 자식인 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + '_' + rowIndexNumber + "]";
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' > ' + columnIndexNumber + '. ' + columnParentTitle;
          artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '.' + rowIndexNumber + '. ' + artboardNameWithoutIndex;
        }

        var idxTitle = verticalArtboardLine[x].name();

        if (idxTitle.match(/\[(.*?)\]/) == null) {
          //[idx] 값이 없으면
          verticalArtboardLine[x].setName(idxNumStr + " " + idxTitle); // console.log('    ' + idxNumStr + ' ' + idxTitle);
        } else {
          if (idxTitle.match(/\[(.*?)\]/)[x] == idxNumStr) {//[idx] 값이 같으면 
            // console.log('got idx');
          } else {
            verticalArtboardLine[x].setName(idxTitle.replace(/\[(.+?)\]/, idxNumStr)); //[idx] 값이 다를경우 업데이트
          }
        }

        if (columnIndexNumber != 0) {
          if (rowIndexNumber == 0) {
            indexString += 'p.' + pageNumber + tabSpace + tabSpace + columnIndexNumber + '. ' + artboardNameWithoutIndex + '\n';
          } else {
            indexString += 'p.' + pageNumber + tabSpace + tabSpace + tabSpace + rowIndexNumber + '. ' + artboardNameWithoutIndex + '\n';
          }
        }

        pageNumber++; // console.log(navigatorStr);

        if (symbolMasterInfo != null) {
          findInstanceAndAddInfo(verticalArtboardLine[x], symbolMasterInfo, artboardNameWithoutIndex, navigatorStr, pageNumber, artboardNameWithFullIndex);
        } // else console.log("not selected");

      }
    }
  } // log(indexString);


  if (indexTextfiled != null) {
    indexTextfiled.setStringValue(indexString);
  }

  sketch__WEBPACK_IMPORTED_MODULE_0___default.a.UI.message("indexing Finish! 🧹 wow");
});

function findInstanceAndAddInfo(targetArtboard, symbolMasterInfo, artboardName, navigatorStr, pageNumber, artboardNameWithFullIndex) {
  for (var i = 0; i < targetArtboard.layers().count(); i++) {
    var currentLayer = targetArtboard.layers().objectAtIndex(i);
    if (!currentLayer.isKindOfClass(MSSymbolInstance)) continue;

    if (currentLayer.symbolMaster().objectID() == symbolMasterInfo.masterSymbolID) {
      //console.log( 'match : ' + currentLayer.overrides());
      var existingOverrides = currentLayer.overrides() || NSDictionary.dictionary();
      var overrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);
      if (symbolMasterInfo.titleID != null) overrides[symbolMasterInfo.titleID] = artboardName;
      if (symbolMasterInfo.navigatorID != null) overrides[symbolMasterInfo.navigatorID] = navigatorStr;
      if (symbolMasterInfo.pageNumberID != null) overrides[symbolMasterInfo.pageNumberID] = String(pageNumber);
      if (symbolMasterInfo.TitleWithIndexID != null) overrides[symbolMasterInfo.TitleWithIndexID] = String(artboardNameWithFullIndex);
      currentLayer.overrides = overrides;
    }
  }
}

function findInstanceFromSymbolMaster(symbolM) {
  var result = {
    'masterSymbolID': null,
    'titleID': null,
    'navigatorID': null,
    'pageNumberID': null,
    'TitleWithIndexID': null
  };
  result.masterSymbolID = symbolM.objectID();

  for (var i = 0; i < symbolM.layers().count(); i++) {
    if (symbolM.layers()[i].name() == 'doc_Title') {
      result.titleID = symbolM.layers()[i].objectID();
    }

    if (symbolM.layers()[i].name() == 'doc_Path') {
      result.navigatorID = symbolM.layers()[i].objectID();
    }

    if (symbolM.layers()[i].name() == 'doc_PageNumber') {
      result.pageNumberID = symbolM.layers()[i].objectID();
    }

    if (symbolM.layers()[i].name() == 'doc_TitleWithIndex') {
      result.TitleWithIndexID = symbolM.layers()[i].objectID();
    }
  }

  return result;
} //axis 는 'x', 'y' 만 다룸


function filterByPosition(layers, basis, axis) {
  var range = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var filteredLayers = NSMutableArray.array();

  for (var i = 0; i < layers.count(); i++) {
    var currentLayer = layers[i];
    var targetAxis = axis == 'y' ? currentLayer.frame().y() : currentLayer.frame().x();
    if (targetAxis > basis - range && targetAxis < basis + range) filteredLayers.addObject(currentLayer);
  }

  return filteredLayers;
} //배열에서 artboard 만 골라서 반환


function filterArtboard(layers) {
  var artboardLayers = NSMutableArray.array();

  for (var i = 0; i < layers.count(); i++) {
    var currentLayer = layers[i];
    if (currentLayer.isKindOfClass(MSArtboardGroup)) artboardLayers.addObject(currentLayer);
  }

  return artboardLayers;
}

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=my-command.js.map