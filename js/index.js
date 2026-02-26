// Get element references
const imgElem = document.getElementById("imageSrc");
const fileElem = document.getElementById("fileInput");
const submitElem = document.getElementById("submitButton");
const clearElem = document.getElementById("clearButton");
const canvasElem = document.getElementById("canvas");
const predElem = document.getElementById("pred");
const confElem = document.getElementById("conf");

// Canvas logic
canvasElem.width = canvasElem.clientWidth;
canvasElem.height = canvasElem.width;

const ctx = canvasElem.getContext("2d", { willReadFrequently: true });
const canvasOffsetX = canvasElem.offsetLeft;
const canvasOffsetY = canvasElem.offsetTop;
const canvasWidth = canvasElem.width;
const canvasHeight = canvasElem.height;

const lineWidth = Math.round(canvasWidth / 25);
let isPainting = false;
let mouseDown = false;
let startX;
let startY;

ctx.lineWidth = lineWidth;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#FFFFFF";

window.addEventListener('resize', () => location.reload());

endPaint = () => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
};

document.body.addEventListener("mousedown", () => {mouseDown = true; isPainting=true;});
document.body.addEventListener("mouseup", () => {mouseDown = false; endPaint();});

canvasElem.addEventListener("pointerleave", () => endPaint());
canvasElem.addEventListener("pointerenter", () => isPainting = mouseDown);

canvasElem.addEventListener("mousemove", (e) => {
    if (!isPainting) return;

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
});

canvasElem.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    let event = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
    canvas.dispatchEvent(event);
    e.preventDefault();
}, { passive: false });

document.body.addEventListener("touchstart", () => {
    let event = new MouseEvent("mousedown", {});
    document.body.dispatchEvent(event);
});

document.body.addEventListener("touchend", () => {
    let event = new MouseEvent("mouseup", {});
    document.body.dispatchEvent(event);
});

// Clear button
clearElem.onclick = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    predElem.textContent = "None";
    confElem.textContent = "None";
};

// Submit button
submitElem.onclick = async () => {
    let data = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let img = cv.matFromImageData(data);

    if (!Array.from(img.data).some(Boolean)) return;


    cv.cvtColor(img, img, cv.COLOR_RGB2GRAY);
    img = mnistify(img);

    let [digit, conf] = await predict(model, img);
    img.delete();
    
    predElem.textContent = digit;
    confElem.textContent = conf.toFixed(2) + "%";
};

// Load model
let model;
load_model("model/model.json").then((e) => model = e, (e) => console.error(e));


