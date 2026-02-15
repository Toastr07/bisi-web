async function load_model() {
    tf.setBackend("cpu");
    return await tf.loadLayersModel("model/model.json");
}

async function predict(model, img) {
    cv.cvtColor(img, img, cv.COLOR_GRAY2BGRA);

    let imgSize = img.size();
    let imgData = new ImageData(new Uint8ClampedArray(img.data), imgSize.width, imgSize.height);

    pred = model.predict(tf.browser.fromPixels(imgData, 1).reshape([1, 28, 28])).dataSync();
    digit = argMax(pred);
    conf = pred[digit] * 100;
    return [digit, conf];
}

