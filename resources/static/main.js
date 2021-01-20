const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

const red_range = document.getElementById('red_range');
const green_range = document.getElementById('green_range');
const blue_range = document.getElementById('blue_range');

const updateInputs = (r, g, b) => {
    red.value = r;
    red_range.value = r;
    green.value = g;
    green_range.value = g;
    blue.value = b;
    blue_range.value = b;
}

const update = () => {
    const red = red_range.value;
    const green = green_range.value;
    const blue = blue_range.value;

    updateInputs(red, green, blue);
    performHttpRequest(red, green, blue);
}

const performHttpRequest = (red, green, blue) => {
    const payload = { "red": red, "green": green, "blue": blue };
    const config = { method: "POST", body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } };
    const hex = hexString(red, green, blue);
    console.log(hex);
    document.getElementById('hex').innerText = hex;
    fetch("http://192.168.1.33:3000", config)
        .then(data => data.json())
        .then(data => { console.log(data); console.log(hexStringVal(data.value)); })
        .catch(err => console.error(err));
}

function hexString(r, g, b) {
    return `0x${Number(r).toString(16)}${Number(g).toString(16)}${Number(b).toString(16)}`;
}

function hexStringVal(val) {
    return `0x${Number(val).toString(16)}`;
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
};

const performImageRequest = () => {
    document.querySelector('img').src = "./img/fetching.gif";
    document.getElementById('text').innerText = "Esto tarda un rato, espera mientras fetcheo...";
    fetch("http://192.168.1.33:3000/photo", { method: "POST" }).then(response => {
        console.log("Llega response")
        console.log(`Status: ${response.status}`)
        response.arrayBuffer().then((buffer) => {
            var base64Flag = 'data:image/jpeg;base64,';
            var imageStr = arrayBufferToBase64(buffer);
            document.getElementById('text').innerText = "";
            document.querySelector('img').src = base64Flag + imageStr;

        }).catch(error => console.log(error));
    });
}

document.getElementById('img').addEventListener('click', performImageRequest);

Array.from(document.querySelectorAll(".lbl")).forEach(e => e.addEventListener('click', (event) => {
    const id_to_grab = event.target.id.split("_")[0] + "_" + event.target.id.split("_")[1];
    document.getElementById(id_to_grab).value = 0;
    update();
}));

Array.from(document.querySelectorAll(".lbl")).forEach(e => e.addEventListener('dblclick', (event) => {
    const id_to_grab = event.target.id.split("_")[0] + "_" + event.target.id.split("_")[1];
    document.getElementById(id_to_grab).value = 255;
    update();
}));

red_range.addEventListener('change', update);
green_range.addEventListener('change', update);
blue_range.addEventListener('change', update);

const btn = document.getElementById('pintar');
btn.addEventListener('click', () => {
    performHttpRequest(red.value, green.value, blue.value);
});
