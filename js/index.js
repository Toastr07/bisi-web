let imgElem = document.getElementById("imageSrc");
let fileElem = document.getElementById("fileInput");
let submitElem = document.getElementById("submitButton");

fileElem.addEventListener("change", async (e) => {
    imgElem.src = URL.createObjectURL(e.target.files[0]);
}, false);

submitElem.onclick = async () => {
    let img = cv.imread(imgElem);

    cv.cvtColor(img, img, cv.COLOR_RGB2GRAY);
    img = mnistify(img);

    let [digit, conf] = await predict(model, img);
    img.delete();

    let predElem = document.getElementById("pred");
    let confElem = document.getElementById("conf");
    
    predElem.textContent = "Prediction: " + digit;
    confElem.textContent = "Confience: " + conf + "%";
};

let model;
load_model().then((e) => model = e, (e) => console.error(e));
