const charts = document.querySelector('.charts');

document.addEventListener('DOMContentLoaded', function() {
    //nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add chart form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
})

// render sheet music card
const renderCard = (data, id) => {

    const html = `
        <div class="card-panel chart white row" data-id="${id}">
            <img id="bigChart" src="${data.sheet}" />
            <div class="chart-top">
                <div class="chart-title">${data.title}</div>
                <div class="chart-details">${data.description}</div>
            </div>
            <button class="waves-effect waves-light btn modal-trigger" data-sheet="${data.sheet}">Open</button>
            <div class="chart-delete">
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
        
        <div id="myModal" class="modal">
            <span class="close">&times;</span>
            <canvas id="fullScreen" class="modal-content"></canvas>
        </div>
        
            
    `;
    
    charts.innerHTML += html;
}

const removeCard = (id) => {
    const score = document.querySelector(`.chart[data-id=${id}]`);
    score.remove();
}

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
*/
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

const displayFull = (dataSheet) => {
    
    let fullImage = document.getElementById('fullScreen'),
        contex = fullImage.getContext('2d'),
        img = new Image();
    img.src = dataSheet;
    
    fullImage.width = window.innerWidth;
    fullImage.height = window.innerHeight;
    //contex.drawImage(img, 0, 0);
    drawImageProp(contex, img, 0, 0, fullImage.width, fullImage.height);
    
    var modal = document.getElementById("myModal");
    modal.style.display = "flex";

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

}

