// Get element references
const imgElem = document.getElementById("imageSrc");
const fileElem = document.getElementById("fileInput");
const submitElem = document.getElementById("submitButton");
const clearElem = document.getElementById("clearButton");
const canvasElem = document.getElementById("canvas");
const predElem = document.getElementById("pred");
const confElem = document.getElementById("conf");

// Canvas logic
const ctx = canvasElem.getContext("2d", { willReadFrequently: true });
const canvasOffsetX = canvasElem.offsetLeft;
const canvasOffsetY = canvasElem.offsetTop;
const canvasWidth = canvasElem.width;
const canvasHeight = canvasElem.height;

const lineWidth = 20;
let isPainting = false;
let mouseDown = false;
let startX;
let startY;

ctx.lineWidth = lineWidth;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#FFFFFF";

endPaint = () => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
};

document.body.onmousedown = (e) => {mouseDown = true; isPainting=true;};
document.body.onmouseup = () => {mouseDown = false; endPaint();};

canvasElem.addEventListener("pointerleave", () => endPaint());
canvasElem.addEventListener("pointerenter", () => isPainting = mouseDown);

canvasElem.addEventListener("mousemove", (e) => {
    if (!isPainting) return;

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
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

