'use strict'
const IMGSKEY = 'imgsDB'
const KEYWORDSKEY = 'keyWordsDB'
const MEMESKEY = 'memesDB'


var gKeyWords = getKeyWords();
var gImgs;
var gCanvasWidth;
var gCanvasHeight;
var gMemes = getSavedMemes();
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}
createImgs()
// fix the loadFromStorage and decide when/if to use
function createImgs() {
    let imgs = loadFromStorage(IMGSKEY);
    if (!imgs || imgs.length === 0) {
        imgs = [
            createImg(1, ['politics', 'actors']),
            createImg(2, ['animals', 'cute']),
            createImg(3, ['animals', 'cute', 'babys']),
            createImg(4, ['animals', 'cute']),
            createImg(5, ['babys', 'cute']),
            createImg(6, ['actors', 'happy']),
            createImg(7, ['funny', 'babys']),
            createImg(8, ['happy', 'actors']),
            createImg(9, ['babys', 'funny']),
            createImg(10, ['politics', 'happy']),
            createImg(11, ['happy', 'gay']),
            createImg(12, ['actors']),
            createImg(13, ['happy', 'actors']),
            createImg(14, ['gay', 'actors']),
            createImg(19, ['gay', 'babys']),

        ]
    };
    gImgs = imgs;
    _saveImgsToStorage();
}

function createImg(id, keywords) {
    return {
        id,
        url: `meme-imgs (square)/${id}.jpg`,
        keywords: keywords
    }
}
function setImgIdx(id) {
    gMeme.selectedImgId = id;
}

function setLinesPos(canWidth, canHeight) {
    gCanvasWidth = canWidth;
    gCanvasHeight = canHeight;
    createLine();
}
function getImgs(keyWord) {
    if (keyWord){
        var searchedImgs = gImgs.filter(img => {
            return img.keywords.find(key =>{
                return key.includes(keyWord);
            })
        })
        return searchedImgs;
    }else {
        return gImgs;
    }
}
function getKeyWords(){
    let keyWords = loadFromStorage(KEYWORDSKEY);
    if (!keyWords || keyWords.length === 0){
        keyWords = {'reset': 16, 'happy': 12, 'actors': 12, 'animals': 12, 'politics': 12, 'cute': 12, 'babys': 12, 'funny': 12}
        gKeyWords = keyWords;
        _saveKeyWordsToStorage();
    }
    return keyWords;
}
function getSavedMemes(){
    let savedMemes = loadFromStorage(MEMESKEY);
    return savedMemes;
}
function setMeme(idx){
    console.log(gMemes);
    gMeme = loadFromStorage(MEMESKEY)[idx].meme;
    console.log(gMemes[idx].meme);
}
function getMeme() {
    return gMeme;
}
function setSearchTagSize(tag){
   if (gKeyWords[tag] > 28) return ; gKeyWords[tag] += 2;
   _saveKeyWordsToStorage();
}
function enterText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}
function changePosUp() {
    gMeme.lines[gMeme.selectedLineIdx].lineY -= 10;
}
function changePosDown() {
    gMeme.lines[gMeme.selectedLineIdx].lineY += 10;
}
function createLine() {
    const memeLine = {
        txt: '',
        size: 3,
        align: 'center',
        stroke: 'blue',
        fill: 'black',
        fontSize: 30,
        fontFamily: 'Impact',
        lineX: gCanvasWidth / 2,
        lineY: 50,
        highLight: 30,
    }
    if (!gMeme.lines || gMeme.lines.length === 0) {
        gMeme.lines.push(memeLine);
    } else if (gMeme.lines.length === 1) {
        gMeme.lines.push(memeLine);
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
        gMeme.lines[gMeme.selectedLineIdx].lineY = gCanvasHeight - 50;
        gMeme.lines[gMeme.selectedLineIdx - 1].highLight = 0;
        gMeme.lines[gMeme.selectedLineIdx].highLight = 30;
    } else {
        gMeme.lines.push(memeLine);
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
        gMeme.lines[gMeme.selectedLineIdx].lineY = gCanvasHeight / 2;
        gMeme.lines[gMeme.selectedLineIdx - 1].highLight = 0;
        gMeme.lines[gMeme.selectedLineIdx].highLight = 30;
    }
}
function selectLine() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = 0;
        gMeme.lines[gMeme.lines.length - 1].highLight = 0;

    }
    if (gMeme.selectedLineIdx === 0){
        gMeme.lines[gMeme.selectedLineIdx].highLight = 30;
    }else{
        gMeme.lines[gMeme.selectedLineIdx - 1].highLight = 0;
        gMeme.lines[gMeme.selectedLineIdx].highLight = 30;
    }
}
function removeLine(){
    gMeme.lines.splice(gMeme.selectedLineIdx,1);
    console.log(gMeme);
}

function changeStroke(color) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = color;
}
function changeFill(color) {
    gMeme.lines[gMeme.selectedLineIdx].fill = color;
}
function textAlign(str) {
    gMeme.lines[gMeme.selectedLineIdx].align = str;
    if (str === 'start') {
        gMeme.lines[gMeme.selectedLineIdx].lineX = 0;
    } else if (str === 'end') {
        gMeme.lines[gMeme.selectedLineIdx].lineX = gCanvasWidth;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].lineX = gCanvasWidth / 2;

    }
}
function fontSizeUp() {
    gMeme.lines[gMeme.selectedLineIdx].fontSize += 5;
}
function fontSizeDown() {
    gMeme.lines[gMeme.selectedLineIdx].fontSize -= 5;
}
function fontFamily(str) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = str;
}
function saveMeme(memeImgData){
    gMemes = loadFromStorage(MEMESKEY);
    if (!gMemes || gMemes === 0) gMemes = [];
    gMemes.push({meme:gMeme, img:memeImgData})
    console.log(gMemes);
    _saveMemsToStorage()
}
function _saveImgsToStorage() {
    saveToStorage(IMGSKEY, gImgs);
}
function _saveMemsToStorage() {
    saveToStorage(MEMESKEY, gMemes);
}
function _saveKeyWordsToStorage(){
    saveToStorage(KEYWORDSKEY, gKeyWords);
}
