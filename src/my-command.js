import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  sketch.UI.message("indexing start! 🧹")
  
  var doc = context.document, pages = doc.pages(), targetInstance = context.selection.firstObject();
  var indexString = ''; //index 목차 작성되는 곳
  var pageNumber = 0; //page number ++ 되는 곳
  var tabSpace = '    ', bigSapce = '            ';
  
  var targetSymbolMaster = null;
  var symbolMasterInfo = null;
  var indexTextfiled = null;
  if(targetInstance != null){
    if(targetInstance.isKindOfClass(MSSymbolInstance) ) {
      targetSymbolMaster = targetInstance.symbolMaster(); 
      symbolMasterInfo = findInstanceFromSymbolMaster(targetSymbolMaster);
    }else if(targetInstance.isKindOfClass(MSTextLayer)) {
      indexTextfiled = targetInstance;
    }
  }
  
  for (var i = 0; i < pages.count(); i++) {
    var currentPage = pages.objectAtIndex(i);
    var title = currentPage.name();
    if (title.match(/Symbols/)) continue; //Symbols 이라는 문자열이 들어가있으면 제거. 
    
    var pageIndexNumber = i+1;
    if (title.match(/\[(.*?)\]/) == null){ //[idx] 값이 없으면
      currentPage.setName(  '[' + pageIndexNumber + '] ' + title  ); // console.log('[' + pageIndexNumber + '] ' + title);
    }else{
      if( title.match(/\[(.*?)\]/)[0] == ('[' + pageIndexNumber + ']') ){ //[idx] 값이 같으면 
        //console.log('got idx');
      }else{
        currentPage.setName(  title.replace( /\[(.+?)\]/g, '['+ pageIndexNumber +']' )  ); //[idx] 값이 다를경우 업데이트
      }
    }

    var pageTitleWithIndex = currentPage.name().replace(/\[/g, '').replace(/]/g, '.'); //[abc] 를 .으로 교체
    var pageTitleWithoutIndex = currentPage.name().replace(/\[[^}]*\] /,''); //'[abc] '제거 
    
    indexString += '\n' + 'p.' + pageNumber + tabSpace + pageTitleWithIndex + tabSpace + '\n';
    
    var currentLayers = currentPage.layers(); // console.log(currentLayers.class()); //현 페이지의 모든 레이어
     
    var artboards = filterArtboard(currentLayers); //artboard 만 걸러내는 과정
    artboards.sort(function(a, b){return a.frame().x() - b.frame().x()}); //artboard 좌표 중 가장 작은 x값을 가진 녀석을 찾기 위해 재정렬
    
    var minX = artboards[0].frame().x();  //가장 작은 Artboard의 x값 도출. 
    var leftLines = filterByPosition(artboards, minX, 'x', 1); // 가장 작은 x 값 기준 +-1 에 속하는 artboard들 모음 

    leftLines.sort(function(a, b){return a.frame().y() - b.frame().y()}); // y값 기준으로 다시 정렬
    var minY = leftLines[0].frame().y();  // console.log('    ' + leftLines[0].name() ); // 왼쪽 줄 가장 위에 있는 아트보드의 y값 도출
    
    var topLines = filterByPosition(artboards, minY, 'y', 1); //가장 윗줄에 있는 아트보드 구함
    var verticalArtboardLines = NSMutableArray.array(); // column 을 위한 배열 생성

    var hasTitleArtboard = false;

    for (var k = 0; k < topLines.count(); k++) { //가장 윗줄의 art보드 개수 기준
      var basisX = topLines[k].frame().x(); //각 column의 x값 구함
      var verticalArtboardLine = filterByPosition(artboards, basisX, 'x', 1); // x값 근처에 있는 세로축 라인 구함
      verticalArtboardLine.sort(function(a, b){return a.frame().y() - b.frame().y()}); //y값 기준으로 다시 정렬
      verticalArtboardLines.addObject(verticalArtboardLine);

      var columnIndexNumber;
      var columnHasChildren = false;
      var columnParentTitle = '';
      var verticalArtboardLineCount = verticalArtboardLine.count();
      for (var x = 0; x < verticalArtboardLineCount; x++)
      {
        var artboardNameWithoutIndex = verticalArtboardLine[x].name().replace(/\[[^}]*\] /,''); //만약 '[abc] '가 있으면 제거한 값
        
        if(pageTitleWithoutIndex == artboardNameWithoutIndex && k == 0) hasTitleArtboard = true;
        columnIndexNumber = hasTitleArtboard == true ? k : k+1;

        columnHasChildren = verticalArtboardLineCount == 1 ? false : true;

        var rowIndexNumber = x;
        var idxNumStr;
        var navigatorStr = '';
        var artboardNameWithFullIndex = '';
        if(!columnHasChildren){//컬럼에 자식이 없을 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + "]";
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' >';
          if(columnIndexNumber == 0){ //페이지 커버인 경우
            artboardNameWithFullIndex = pageIndexNumber + '. ' + artboardNameWithoutIndex;
          }else{//페이지 커버가 아닌경우
            artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '. ' + artboardNameWithoutIndex;
          }
          
        }else if(rowIndexNumber == 0){//컬럼에 자식이 있는데 첫번째인 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + '_' + rowIndexNumber + "]";
          columnParentTitle = artboardNameWithoutIndex;
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' >';
          artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '. ' + artboardNameWithoutIndex;
        }else{//컬럼에 자식인 경우
          idxNumStr = '[' + pageIndexNumber + "_" + columnIndexNumber + '_' + rowIndexNumber + "]";
          navigatorStr = pageIndexNumber + '. ' + pageTitleWithoutIndex + ' > ' + columnIndexNumber + '. ' + columnParentTitle;
          artboardNameWithFullIndex = pageIndexNumber + '.' + columnIndexNumber + '.' + rowIndexNumber + '. ' + artboardNameWithoutIndex;
        }
        
        var idxTitle = verticalArtboardLine[x].name();
        
        if (idxTitle.match(/\[(.*?)\]/) == null){ //[idx] 값이 없으면
          verticalArtboardLine[x].setName(  idxNumStr + " " + idxTitle  ); // console.log('    ' + idxNumStr + ' ' + idxTitle);
        }else{
          if( idxTitle.match(/\[(.*?)\]/)[x] == idxNumStr ){ //[idx] 값이 같으면 
            // console.log('got idx');
          }else{
            verticalArtboardLine[x].setName(  idxTitle.replace( /\[(.+?)\]/, idxNumStr )  ); //[idx] 값이 다를경우 업데이트
          }
        }

        if (columnIndexNumber != 0) {
          if (rowIndexNumber == 0) {
            indexString += 'p.' + pageNumber +  tabSpace + tabSpace + columnIndexNumber + '. ' +  artboardNameWithoutIndex + '\n';
          }else{
            indexString += 'p.' + pageNumber +  tabSpace + tabSpace + tabSpace + rowIndexNumber + '. ' +  artboardNameWithoutIndex + '\n';
          }
        }
        
        pageNumber++;
        // console.log(navigatorStr);
        if ( symbolMasterInfo != null){
            findInstanceAndAddInfo(verticalArtboardLine[x], symbolMasterInfo, artboardNameWithoutIndex, navigatorStr, pageNumber, artboardNameWithFullIndex);
        } 
        // else console.log("not selected");
        
      }

    }
  }
  // log(indexString);

  if(indexTextfiled != null){
    indexTextfiled.setStringValue(indexString);
  }
  
   sketch.UI.message("indexing Finish! 🧹 wow");
}

function findInstanceAndAddInfo(targetArtboard, symbolMasterInfo, artboardName, navigatorStr, pageNumber, artboardNameWithFullIndex){

  for (var i = 0; i < targetArtboard.layers().count(); i++) {
    var currentLayer = targetArtboard.layers().objectAtIndex(i);
    if(!currentLayer.isKindOfClass(MSSymbolInstance)) continue;
    if( currentLayer.symbolMaster().objectID() == symbolMasterInfo.masterSymbolID ){
      //console.log( 'match : ' + currentLayer.overrides());
      var existingOverrides = currentLayer.overrides() || NSDictionary.dictionary();
      var overrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);
      if(symbolMasterInfo.titleID != null) overrides[symbolMasterInfo.titleID] = artboardName;
      if(symbolMasterInfo.navigatorID != null) overrides[symbolMasterInfo.navigatorID] = navigatorStr;
      if(symbolMasterInfo.pageNumberID != null) overrides[symbolMasterInfo.pageNumberID] = String(pageNumber);
      if(symbolMasterInfo.TitleWithIndexID != null) overrides[symbolMasterInfo.TitleWithIndexID] = String(artboardNameWithFullIndex);
      currentLayer.overrides = overrides;
    }
  }
}

function findInstanceFromSymbolMaster(symbolM){
  var result = {
    'masterSymbolID' : null,
    'titleID' : null,
    'navigatorID' : null,
    'pageNumberID' : null,
    'TitleWithIndexID' : null
  }

  result.masterSymbolID = symbolM.objectID();

  for(var i = 0; i < symbolM.layers().count(); i++){
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
}

//axis 는 'x', 'y' 만 다룸
function filterByPosition(layers, basis, axis, range = 1){
  var filteredLayers = NSMutableArray.array();
  for (var i = 0; i < layers.count(); i++) { 
    var currentLayer = layers[i];
    var targetAxis = axis == 'y' ? currentLayer.frame().y() : currentLayer.frame().x();
    if ( targetAxis > (basis - range) && targetAxis < (basis + range) ) filteredLayers.addObject(currentLayer);
  }
  return filteredLayers;
}

//배열에서 artboard 만 골라서 반환
function filterArtboard(layers){
  var artboardLayers = NSMutableArray.array();
  for (var i = 0; i < layers.count(); i++) { 
    var currentLayer = layers[i];
    if (currentLayer.isKindOfClass(MSArtboardGroup)) artboardLayers.addObject(currentLayer);
  }
  return artboardLayers;
}