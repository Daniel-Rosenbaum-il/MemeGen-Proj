'use strict'
var gCanvas;
var gCtx;




function onInit() {
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    renderKeyWords();
    renderImgs();
    renderSavedMems();
    setLinesPos(gCanvas.width, gCanvas.height);
}

function renderImgs(keyWord) {
    const imgs = getImgs(keyWord);
    let strHtmls = imgs.map(img => {
        return `<img src="img/meme-imgs (square)/${img.id}.jpg" alt="img-1" onclick="onSelectedImg(${img.id})" class="img-gallery">`
    })
    document.querySelector('.images-container').innerHTML = strHtmls.join('');
}
function onSelectedImg(elImgIdx) {
    setImgIdx(+elImgIdx);
    openMemeGenSection();
    renderCanvas();
}
function openMemeGenSection(){
    document.querySelector('.meme-container').style.display = 'flex'
    document.querySelector('.images-container').style.display = 'none'
    document.querySelector('.search-container').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'none';
}
function renderCanvas(isShareAction) {
    let meme = getMeme();
    const image = new Image();
    image.src = `./img/meme-imgs (square)/${meme.selectedImgId}.jpg`;
    drawImageProp(gCtx, image, 0, 0, gCanvas.width, gCanvas.height,);
    meme.lines.forEach(line => {
        if (isShareAction) line.highLight = 0;
        drawText(line.txt, line.lineX, line.lineY, line.size, line.stroke, line.fill, line.highLight, line.align, line.fontSize, line.fontFamily)
    });
}
function renderSavedMems() {
    let savedMemes = getSavedMemes()
    if (!savedMemes) return;
    let strHtml = '';
    for (var i = 0 ; i <savedMemes.length; i++ ){
        strHtml+=`<img src="${savedMemes[i].img}" width="150px" height="150px" onclick="onSelectedMeme(${i})">`
    }
    document.querySelector('.saved-memes-container').innerHTML = strHtml
}
function renderKeyWords() {
    let keyWords = getKeyWords()
    let strHtmlDataList = '';
    let strHtmlTagList = '';
    for (var key in keyWords) {
        strHtmlDataList += `<option value="${key}">`;
        // i dont know why when i use "" before the dolar sign i get an index error, used '' insted.
        strHtmlTagList += `<li class="keyword-tag" style="font-size:${keyWords[key]}px" onclick="onSetSearchTag('${key}')">${key}</li>`
    }
    document.getElementById('search-filter').innerHTML = strHtmlDataList;
    document.querySelector('.keywords-list').innerHTML = strHtmlTagList;
}
function drawText(text, x, y, size, stroke, fill, highLight, align, fontSize, fontFamily) {
    gCtx.lineWidth = size
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${fontSize}px ${fontFamily}`
    gCtx.textAlign = align
    gCtx.shadowColor = 'black'
    gCtx.shadowBlur = highLight
    gCtx.strokeText(text, x, y)
    gCtx.fillText(text, x, y)

}
// fix on selected meme
function onSelectedMeme(memeIdx){
    setMeme(memeIdx);
    openMemeGenSection();
    renderCanvas();
}
function setSearchFilter(keyWord) {
    (keyWord === 'reset')? renderImgs() : renderImgs(keyWord);
}
function onSetSearchTag(tag) {
    if (tag === 'reset'){
        renderImgs()
    }else {
        setSearchTagSize(tag)
        renderKeyWords()
        setSearchFilter(tag);
    }

}
function onEnterText(txt) {
    enterText(txt);
    renderCanvas();

}
function onChangePosUp() {
    changePosUp();
    renderCanvas();
}
function onChangePosDown() {
    changePosDown();
    renderCanvas();
}
function onCreateLine() {
    createLine();
    document.querySelector('.txt-line').value = '';
    renderCanvas();
}
function onChangeStroke(color) {
    changeStroke(color);
    renderCanvas();
}
function onChangeFill(color) {
    changeFill(color);
    renderCanvas();
}
function onSetTextAlign(str) {
    textAlign(str);
    renderCanvas();
}
function onSetFontSizeUp() {
    fontSizeUp();
    renderCanvas();
}
function onSetFontSizeDown() {
    fontSizeDown();
    renderCanvas();
}
function onSetFontFamily(str) {
    fontFamily(str);
    renderCanvas();
}
function setSelectedLine() {
    selectLine();
    let meme = getMeme();
    document.querySelector('.txt-line').value = meme.lines[meme.selectedLineIdx].txt;
    renderCanvas();
}
// check why download dosent get input from prompt
function onRemoveLine() {
    removeLine();
    document.querySelector('.txt-line').value = '';
    renderCanvas();
}
function downloadMeme(elLink) {
    renderCanvas(true);
    const data = gCanvas.toDataURL();
    elLink.Download = prompt('Meme name?');
    elLink.href = data;
}
function onSaveMeme() {
    renderCanvas(true);
    const data = gCanvas.toDataURL();
    saveMeme(data);
    renderSavedMems();
    alert('Your meme has been saved')
}
function backToGallery() {
    document.querySelector('.meme-container').style.display = 'none';
    document.querySelector('.images-container').style.display = 'flex';
    document.querySelector('.search-container').style.display = 'flex';
    document.querySelector('.saved-memes-container').style.display = 'none';

}
function openSavedMeme(){
    document.querySelector('.meme-container').style.display = 'none';
    document.querySelector('.images-container').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
    document.querySelector('.saved-memes-container').style.display = 'flex';
}
function onToggleMenu(elMenu) {
    elMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}