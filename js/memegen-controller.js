'use strict'
var gCanvas;
var gCtx;
var gStroke;
var gFill;



function onInit() {
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    setLinesPos(gCanvas.width, gCanvas.height);
}

function renderImgs() {
    const imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img src="img/meme-imgs (square)/${img.id}.jpg" alt="img-1" onclick="onSelectedImg(${img.id})" class="img-gallery">`
    })
    document.querySelector('.images-container').innerHTML = strHtmls.join('');
}
function onSelectedImg(elImgIdx) {
    setImgIdx(+elImgIdx);
    document.querySelector('.meme-container').style.display = 'flex'
    document.querySelector('.images-container').style.display = 'none'
    renderCanvas();
}
function renderCanvas() {
    let meme = getMeme();
    const image = new Image();
    image.src = `./img/meme-imgs (square)/${meme.selectedImgId}.jpg`;
    drawImageProp(gCtx, image, 0, 0, gCanvas.width, gCanvas.height,);
    meme.lines.forEach(line => {
        drawText(line.txt, line.lineX, line.lineY, line.size, line.stroke, line.fill, line.highLight, line.align, line.fontSize, line.fontFamily)
    });
    
}
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}
function onEnterText(txt) {
    enterText(txt);
    renderCanvas();
    
}

function drawText(text, x, y, size, stroke, fill, highLight, align, fontSize, fontFamily) {
    gCtx.lineWidth = size
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = fill
    gCtx.font = `${fontSize}px ${fontFamily}`
    gCtx.textAlign = align
    gCtx.shadowColor = 'white'
    gCtx.shadowBlur = highLight
    gCtx.strokeText(text, x, y)
    gCtx.fillText(text, x, y)
    
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
function SetTextAlign(str) {
    textAlign(str);
    renderCanvas();
}
function SetFontSizeUp() {
    fontSizeUp();
    renderCanvas();
}
function SetFontSizeDown() {
    fontSizeDown();
    renderCanvas();
}
function SetFontFamily(str) {
    fontFamily(str);
    renderCanvas();
}
function setSelectedLine() {
    selectLine();
    let meme = getMeme();
    document.querySelector('.txt-line').value = meme.lines[meme.selectedLineIdx].txt;
    renderCanvas();
}
function downloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.Download = prompt('Meme name?');
}
function onRemoveLine() {
    removeLine();
    document.querySelector('.txt-line').value = '';
    renderCanvas();
}
function backToGallery(){
    document.querySelector('.meme-container').style.display = 'none'
    document.querySelector('.images-container').style.display = 'flex'
}