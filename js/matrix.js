
//----------------------matrix데이터 처리 함수

// matrix data is [[,,]] data

//정렬
function matrixOrder(arr, colNum=0, sortType='ASC'){
    // console.log(arr[0])
    if(typeof arr[0] !== 'undefined' && colNum >= arr[0].length ) return;
    if(sortType.toUpperCase() == 'DESC'){ var r1=1, r2=-1;}
    else{ var r1=-1, r2=1; }
    arr = arr.sort(function customSort(a, b) {
        let s1= a[colNum], s2 = b[colNum];
        if(typeof s1 == 'string' && isNumber(s1)){
            let temp1 = s1.match(/\d+/g);
            if(temp1 !== null && temp1.length == 1) s1 = parseInt(s1);
        }
        if(typeof s2 == 'string' && isNumber(s2)){
            let temp2 = s2.match(/\d+/g);
            if(temp2 !== null &&  temp2.length == 1) s2 = parseInt(s2);
        }
        if (s1 < s2) return r1;
        else if (s1 > s2) return r2;
        else return 0;
    });
    return arr;
    // arr.reverse()
}

        function isNumber(data) {//string number => '12' true , 'aa12' false
            return !isNaN(data);
        }


//그룹화
function matrixGroup(arr, groupCol=0){
    let rs={};
    for(let i=0; i< arr.length; i++){
        let colVal = arr[i][groupCol];
        if(typeof rs[colVal] == 'undefined') rs[colVal] = [];
        rs[colVal].push(arr[i]);
    }
    return rs;
}




//테이블에서 데이터 추출
// function tabel2matrix(tableDom='#table_id'){
//     // console.log(typeof tableDom)
//     let trDom = null;
//     if(typeof tableDom == 'string') trDom = document.querySelectorAll(tableDom +' tr');
//     else if(typeof tableDom == 'object'){
//         if(typeof tableDom.querySelectorAll == 'undefined') trDom = tableDom[0].querySelectorAll(' tr');
//         else trDom = tableDom.querySelectorAll(' tr');
//     }else return;
//     console.log(trDom)
//     if(trDom != null){
//         let rs = Array.prototype.map.call(trDom, function(tr){
//             return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
//                 return td.innerHTML;
//             });
//         });
//         return rs;
//     }
// }

//tabel2matrix   //获取table内容并转成二维数组（支持colspan和rowspan）
function table2matrix(dom, type=0) {//type:0일때 병합열에 처음 한번만 값 넣기, 1일때 병합열에 똑같은 값넣기
    $trs = $(dom).find('tr');
    let trlength = $trs.length;
    let arr = [];
    for (let i = 0; i < trlength; i++) {
        arr[i] = [];
    }
    $trs.each(function(trindex, tritem) {
        $(tritem).children('th').each(function(thindex, thitem) {
            let rowspanCount = $(thitem).attr('rowspan');
            let colspanCount = $(thitem).attr('colspan');
            let value = $(thitem).text();
            let colIndex = thindex;
            while (arr[trindex][colIndex] !== undefined) {
                colIndex++;
            }
            if (rowspanCount > 1 && colspanCount > 1) {
                for (let i = 0; i < rowspanCount; i++) {
                    for (let j = 0; j < colspanCount; j++) {
                        arr[trindex + i][colIndex + j] = value;
                    }
                }
            } else if (rowspanCount > 1) {
                for (let i = 0; i < rowspanCount; i++) {
                    //个别对应  rowspan定义错误的话，超过最大行数直接忽略。
                    if (trindex + i > arr.length - 1) {
                        break;
                    }
                    arr[trindex + i][colIndex] = value;
                }
            } else if (colspanCount > 1) {
                for (let i = 0; i < colspanCount; i++) {
                    arr[trindex][colIndex + i] = value;
                }
            } else {
                arr[trindex][colIndex] = value;
            }
        });
        $(tritem).children('td').each(function(tdindex, tditem) {
            let rowspanCount = $(tditem).attr('rowspan');
            let colspanCount = $(tditem).attr('colspan');
            let value = $(tditem).text();
            let colIndex = tdindex;
            while (arr[trindex][colIndex] !== undefined) {
                colIndex++;
            }
            isFrist = true;
            if (rowspanCount > 1 && colspanCount > 1) {
                for (let i = 0; i < rowspanCount; i++) {
                    for (let j = 0; j < colspanCount; j++) {
                        if(isFrist){
                            arr[trindex + i][colIndex + j] = value;
                            if(type===0) isFrist = false;
                        }else arr[trindex + i][colIndex + j] = '';
                    }
                }
                
            } else if (rowspanCount > 1) {
                for (let i = 0; i < rowspanCount; i++) {
                    //个别对应  rowspan定义错误的话，超过最大行数直接忽略。
                    if (trindex + i > arr.length - 1) {
                        break;
                    }
                    if(isFrist){
                        arr[trindex + i][colIndex] = value;
                        if(type===0) isFrist = false;
                    }else arr[trindex + i][colIndex] = '';
                }
            } else if (colspanCount > 1) {
                for (let i = 0; i < colspanCount; i++) {
                    if(isFrist){
                        arr[trindex][colIndex + i] = value;
                        if(type===0) isFrist = false;
                    }else arr[trindex][colIndex + i] = '';
                }
            } else {
                arr[trindex][colIndex] = value;
            }
        });
    });
    return arr;
};



//테이블_(무조건 header가 있어야 함)
//header있는 수열을 넣는다. table>thead,tbody
function matrix2table(arr, header=''){
    let rs = '', startNum = 0;
    if(typeof arr[0] != 'undefined'){//데이터가 있어야 함.
        // console.log(typeof arr[0])
        rs = '<table border="1" cellspacing="0">\n';
        if(typeof arr[0] == 'string') {
            rs += '\t<tbody>\n';
            for(let i=startNum; i < arr.length; i++){
                rs += '\t\t<tr><td>'+ arr[i] +'</td></tr>\n';
            }
            rs += '\t</tbody>\n</table>\n';
        }else{
            if(!Array.isArray(arr[0])) arr = list_kv2int(arr);
            if(header.trim().length > 0){
                rs += '\t<thead>\n';
                if(header.indexOf(',') > -1 ){
                    let headers = header.split(',')
                    rs += '\t\t<tr><th>'+ headers.join('</th><th>') +'</th></tr>\n';
                }else{
                    rs += '\t\t<tr><th>'+ (arr[0].join('</th><th>')) +'</th></tr>\n';
                }
                rs += '\t</thead>\n';
                startNum = 1;
            }
            // let startNum = (header.trim().length > 0) ? 0 : 1;
            rs += '\t<tbody>\n';
            for(let i=startNum; i < arr.length; i++){
                rs += '\t\t<tr><td>'+ arr[i].join('</td><td>') +'</td></tr>\n';
            }
            rs += '\t</tbody>\n</table>\n';
        }
    }
    return rs;
}

//검색
function matrixSearch(arr, findCol, findName, callback=null){
    if(typeof findCol == 'string') findCol = matrixIndex(arr, findCol);
//     console.log(findCol)
    if(callback == null){
        callback = function(row){
            return row[findCol] == findName;
        }
    }
    return arr.filter(function(row){
        return callback(row);
    })
}

    //인덱스      (array중에서 해당이름에 속한 열번호 찾기)
    function matrixIndex(matrixArr, findNames='', findRowNum = 0){
        let headerRow = matrixArr[findRowNum];
        if(typeof headerRow != 'undefined'){
            if(findNames.indexOf('|') > -1){
                let names = findNames.split('|');
                for (let i = 0; i < names.length; i++) {
                    for (let colNum = 0; colNum < headerRow.length; colNum++) {//열데이터
                        if(names[i].trim() == headerRow[colNum].trim()) return colNum;
                    }
                }
            }else{
                for (let colNum = 0; colNum < headerRow.length; colNum++) {//열데이터
                    if(findNames.trim() == headerRow[colNum].trim()) return colNum
                }
            }
        }
        return -1;
    }



    

    //A데이터를 기준으로 B데이터를 바꾼다. 예) A의 [1]열과 B의 [1]열이 같을때 찾은 B의 [3]번째 열의 데이터를 A의 [2]번째 열 데이터로 바꾼다.
    function changeTableDataA2BForCol(dataA, dataB, indexA1, indexB1, indexA2, indexB2){//두개 데이터중에서 (처음꺼 기준데이터로 다음꺼 수정), 
        if(indexA1 == -1 || indexA2 == -1 || indexB1 == -1 || indexB2 == -1) return null;
        let modifyNum = 0;
        let header = dataB.shift();
        for (let i = 0; i < dataB.length; i++) {
            let findRowData = matrixFindRowInCol(dataA, dataB[i][indexB1], indexA1);
            if(findRowData != null) {
                dataB[i][indexB2] = findRowData[indexA2];
                modifyNum++;
            } 
        }
        dataB.unshift(header);
        if(modifyNum > 0) return dataB;
        else return null;
    }


        //지정 열에서 찾은 행데이터를 반환 
        function matrixFindRowInCol(arr, search, findCol=0){
            if(arr.length > 0 ){
                for (let i in arr) {
                    if(arr[i][findCol] == search) return arr[i];
                }
            }
            return null; 
        }



//-----
// var testArray = [
//     [3,10,'BBB'],[3,20,'AAA'], [1,9,'CCC'], [1,1,'DDD'], [1,22,'EEE'],['aa','',''],['','',''], [NaN,22,'EEE']
// ];
// testArray.unshift(['aaa','bbb','eee'])

// // matrixOrder(testArray,2);//3번째 열 정렬
// matrixOrder(testArray,0, 'DESC');//1번째 열 정렬
// console.log('data', testArray)

// console.log('group', matrixGroup(testArray, 2));//그룹화
// console.log('table', matrix2table(testArray))
// console.log('search', matrixSearch(testArray, 'bbb', 1))



//선택한 열만 획득
function matrixColum(arr, cols, isUnique=false){
    let rs = [];
    if(typeof cols != 'undefined' ){
        if(typeof cols == 'number') cols += '';
        if(cols.trim().length > 0){
            cols = cols.toString()
            if(cols.indexOf(',') > -1){
                // console.log(111)
                let col = cols.split(',');
                for(let i=0; i<arr.length; i++){
                    let row = []
                    for(let k=0; k<col.length; k++){
                        let key=col[k];
                        if(typeof arr[i][key] != 'undefined') row.push(arr[i][key]) 
                    }
                    if(row.length > 0) rs.push(row);
                }
            } else {
               let col = cols;
               for(let i=0; i<arr.length; i++){
                    for(let j=0; j<arr[i].length; j++){
                        if(j == col) rs.push( arr[i][col] ) 
                    }
                }
                if(isUnique) rs = [[...new Set(rs)]];
            }
        }
    }
    return array2rowArray(rs); 
}
// console.log(matrixColum(testArray,'0', 1))

        function array2rowArray(arr){
            if(typeof arr[0] != 'object'){
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = [arr[i]]
                }
            }
            return arr;
        }



//빈 데이터 행 개수가 몇개 이상 인것 만 추출 (필드에 대해 처리)
function matrixRemoveEmptyRow(arr, eq=0, type='val'){//공백행 삭제
    let rs = []; 
    for(let i = 0; i < arr.length; i++){
        let emptyLength = 0; 
        let dataLength = 0; 
        for(let j = 0; j < arr[i].length; j++){
            if(arr[i][j] == '') emptyLength++;
            else dataLength++;
        }
        if(emptyLength > 0 ){
            if(type == 'val' ){
                if(dataLength > eq) rs.push(arr[i]);
            }else{
                if(dataLength > 0){
                    if(type == '>'){
                        if(!(emptyLength > eq)) rs.push(arr[i])
                    }else if(type == '='){
                        if(!(emptyLength == eq && emptyLength !=0) ) rs.push(arr[i])
                    }else if(type == '<'){
                        if(!(emptyLength == eq)) rs.push(arr[i])
                    }
                }

            }
        }else{
            rs.push(arr[i])
        }

    }
    return rs; 
}
// console.log(matrixRemoveEmptyRow(testArray));
// console.log(matrixRemoveEmptyRow(testArray,1,'>'));



// //조건에 맞족된것만 삭제 
// function clearEmptyRowColForIf(arr, num=0, ){
//     let rs = []; 
//     for(let i = 0; i < arr.length; i++){
//         let emptyLength = 0; 
//         let dataLength = 0; 
//         for(let j = 0; j < arr[i].length; j++){
//             if(arr[i][j] == '') emptyLength++;
//             else dataLength++;
//         }
//         console.log(i, dataLength, emptyLength)
        

//     }
//     return rs; 
// }

// //빈행 빈열 삭제
// function clearEmptyRowCol(arr, type='RC'){//R 빈행삭제,  C 빈열삭제 
//     let tempArr = [];
//     if(arr.length > 0 ){
//         for (let i = 0; i < arr.length; i++) {
//             if(typeof tempArr[i] == 'undefined') tempArr[i] = [];
//             for (let j = 0; j < arr[i].length; j++) {
//                 let val = (arr[i][j]  =='') ? 0 : 1
//                 tempArr[i].push( val ) ;
//             }
//         }
//         console.log(tempArr)
//         let rowCount = arr.length;
//         let colCount = arr[0].length;
//         for (let i = 0; i < rowCount; i++) {
//             for (let j = 0; j < colCount; j++) {
//                 //
//                 for (let k = 0; k < rowCount; k++) {
//                     tempArr[][]
                    
//                 }
//                 for (let k = 0; k < colCount; k++) {
                    
                    
//                 }




                
//             }
            
//         }



//         if(type == 'RC'){//빈행 빈열 모두 삭제

//         }else if(type == 'R'){//빈행 삭제

//         }else if(type == 'C'){//빈열 삭제
            
//         }
//     }
// }


// function getColDataForArr(arr, num=null){
//     if(arr.length > 0){
//         let rs = [];
//         //몇번쨰 열 데이터를 모두 뽑기
//         if(typeof arr[i] != 'undefined'){
//             for (let i = 0; i < arr.length; i++) {
//                 rs[i] = arr[i][num];
//             }
//         }
//         return rs;
//     }
// }
// function getRowDataForArr(arr, num=null){
//     if(arr.length > 0){
//         let rs = [];
//         //몇번쨰 행 데이터 모두 뽑기
//         if(typeof arr[num] != 'undefined') rs =  arr[num];
//         return rs;
//     }
// }





//리스트데이터 2차수열을 kv방식으로 전환(선택 열 추출 가능) //[[],[]] ===> [{},{}]
function list_int2kv(arr, header=''){
    let rs = [], keys;
    if(arr.length > 1){
        if(header.trim() == '') keys = arr[0];
        else if(header.indexOf(',') > -1) keys = header.split(',');
        else keys = [header];
        for(let i=1; i < arr.length; i++){
            let rowIndex = i-1;
            if(typeof rs[rowIndex] == 'undefined') rs[rowIndex] = {};
            for(let j=0; j < keys.length; j++){
                let key = String(keys[j]);
                rs[rowIndex][key] = arr[i][j]
            }
        }
    }
    return rs;
}

//리스트데이터 kv방식을 2차수열로 전환(선택 열 추출 가능) //[{},{}] ===> [[],[]]
function list_kv2int(data, header='', headerRow=0){ //열순서가 있음
    let rs =[], keys;
    if(header.trim() == '') keys = Object.keys(data[headerRow]);
    else if(header.indexOf(',') > -1) keys = header.split(',');
    else keys = [header];
    for (let i = 0; i < data.length; i++) {
        if(typeof rs[i] == 'undefined') rs[i] = [];
        for(let j = 0; j <keys.length; j++) {
            let key = keys[j];
            rs[i][j] = (typeof data[i][key] == 'undefined') ? '' : data[i][key]
        }
    }
    rs.unshift(keys)
    return rs;
}
// console.log(testArray)
// arr1 = list_int2kv(testArray,'aaa,eee');
// console.log(arr1, list_kv2int(arr1, 'eee,aaa,bb'))
// console.log(arr1, list_kv2int(arr1))



//------TODO
//열 범위로 추출 (열번호인것을 처리/추출)
//행 범위로 추출 (행번호인것을 처리/추출)(우수행/기수행 인것에 처리)
//조건에 의한 변경
function matrixChange(arr, colNum=0, callback){
    for(let i = 0; i < arr.length; i++){
        arr[i][colNum] = callback(arr[i][colNum], i, arr[i]);
        if(typeof arr[i][colNum] == 'undefined') arr[i][colNum] = '';
    }
    return arr;
}
// console.log('callback', matrixChange(testArray, 0, function(colVal,i,row){
// //     if(i==5) return  row[2]
// //     else return colVal
//     return  row[2]
// }));






//------------------------

//범위 만큼의 행 데이터 추출
function rangeRowData(arr, startNum=1, endNum='' ,headerNum=0){
    let rs = [];
    if(endNum == '') endNum = arr.length;
    if(typeof startNum == 'string') startNum = parseInt(startNum);
    if(typeof endNum == 'string') endNum = parseInt(endNum);
    if(endNum < 0){
        endNum = $('#grid tr').length + endNum -1
    }else if(startNum > endNum ){
        let temp = endNum;
        endNum = startNum;
        startNum = temp;
    }
    // console.log(startNum, endNum)
    if(headerNum > -1) rs.push(arr[headerNum])
    for (let i = startNum; i <= endNum; i++) {
        if(typeof arr[i] != 'undefined') rs.push(arr[i])
    }
    return rs;
}



//범위만큼 수열을 만듬
function makeRangeArray(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}
// console.log(makeRangeArray(5, 30));// 5~30인 수 즉 [5,6,7,8,...29,30]


// 행렬의 행 (전치)으로 행 교체
function transpose(a) {
    var w = a.length || 0;
    var h = a[0] instanceof Array ? a[0].length : 0;
    if(h === 0 || w === 0) { return []; }
    var i, j, t = [];
    for(i=0; i<h; i++) {
      t[i] = [];
      for(j=0; j<w; j++) {
        t[i][j] = a[j][i];
      }
    }
    return t;
  }
//   console.log(transpose([[1,2,3],[4,5,6],[7,8,9]]));





//----------------------sum

//가로 합계
function sumRow(arr){
    rs = [];
    for(let r=0; r < arr.length; r++){
        rs[r] = arr[r].reduce((a, b) => a + b, 0)
    }
    return rs;
}

//세로 합계
function sumCol(arr){
    rs = [];
    for(let c=0; c < arr[0].length; c++){
        if(typeof rs[c] == 'undefined') rs[c] = 0;
        for(let r=0; r < arr.length; r++){
            rs[c] = rs[c] + arr[r][c]
        }
    }
    return rs;
}

// arr = [
//     [47,42,49,38,21,65,38,48,44,42,17,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [39,51,35,50,35,39,46,43,55,42,17,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [60,41,44,42,42,46,45,26,63,32,44,0,0,0,0,0,0,0,0,0,0,0,0,0]
// ];
// console.log('가로합계: ', sumRow(arr))
// console.log('세로합계: ', sumCol(arr))
