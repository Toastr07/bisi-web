function argMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
        
    var max = arr[0];
    var maxIndex = 0;
        
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
        
    return maxIndex;
}

function chunk(arr, size) {
    let chunks= [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i+size));
    return chunks;
}

function unchunk(chunks) {
    let arr = [];
    chunks.forEach(e => {
        arr = arr.concat(e);
    });
    return arr;
}

function collapse(img) {
    if (img.length != img[0].length) return;
    let size = img.length;

    let [t, l, b, r] = Array(4).fill(size);
    let [tf, lf, bf, rf] = Array(4).fill(false);

    let getCol = (arr, n) => arr.map(e => e[n]);

    for (let i = 0; i < size; i++) {
        if (!tf && img[i].includes(255)) {
            tf = true;
            t = i;
        }
        if (!lf && getCol(img, i).includes(255)) {
            lf = true;
            l = i;
        }
        if (!bf && img[size-1-i].includes(255)) {
            bf = true;
            b = i+1;
        }
        if (!rf && getCol(img, size-1-i).includes(255)) {
            rf = true;
            r = i+1;
        }
        if (tf && lf && bf && rf) break;
    }
    b = size - b;
    r = size - r;

    return [t, l, b, r];
}

function cutout(img) {
    img = chunk(Array.from(img.data), img.size().width);
    let [t, l, b, r] = collapse(img);

    img = img.slice(t, b+1);
    img = img.map((e) => e.slice(l, r+1));

    img = unchunk(img);
    img = cv.matFromArray(b-t+1, r-l+1, 0, img);

    return img;
}

function square(img) {
    let shape = img.size();
    size = Math.max(shape.width, shape.height);

    row_c = size-shape.height;
    col_c = size-shape.width

    let top = Math.floor(row_c / 2);
    let bottom = top + (row_c % 2);
    let left = Math.floor(col_c / 2);
    let right = left + col_c % 2;

    top = new Array(top*shape.width).fill(0);
    bottom = new Array(bottom*shape.width).fill(0);
    left = new Array(left).fill(0);
    right = new Array(right).fill(0);

    img = cv.matFromArray(size, size, 0, unchunk(chunk(top.concat(Array.from(img.data)).concat(bottom), shape.width).map((e) => left.concat(e).concat(right))));

    return img;
}

function mnistify(img) {
    img = cutout(img);
    img = square(img);
    cv.resize(img, img, new cv.Size(20, 20));
    cv.copyMakeBorder(img, img, 4, 4, 4, 4, cv.BORDER_CONSTANT, new cv.Scalar(0, 0, 0, 255));

    return img;
}
