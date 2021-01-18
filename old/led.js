const Gpio = require('onoff').Gpio;
// PINOUT -> https://www.hwlibre.com/wp-content/uploads/2020/03/gpio-raspberry-pi-4-3.png.webp
// Son los nombres de GPIO XX
const RED = new Gpio(27, 'out');
const GREEN = new Gpio(17, 'out');
const BLUE = new Gpio(22, 'out');

let LED = RED;

const blinkInterval = setInterval(blinkLED, 250);

function blinkLED() {
  if (LED.readSync() === 0) {
    LED.writeSync(1);
  } else {
    LED.writeSync(0);
  }
}

function endBlink() {
  clearInterval(blinkInterval);
  LED.writeSync(0);
  LED.unexport();
}

setTimeout(endBlink, 5000);
