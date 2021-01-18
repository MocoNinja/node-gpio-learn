const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Gpio = require('pigpio').Gpio;
app.use(cors());

const RED_PIN = 27;
const GREEN_PIN = 17;
const BLUE_PIN = 22;

const RED_LED   = new Gpio(RED_PIN,   {mode: Gpio.OUTPUT});
const GREEN_LED = new Gpio(GREEN_PIN, {mode: Gpio.OUTPUT});
const BLUE_LED  = new Gpio(BLUE_PIN,  {mode: Gpio.OUTPUT});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/', (req, res) => {
	const {red, green, blue} = req.body;
	const color = {"value": red << 16 | green << 8 | blue};
	console.log(`He leído los valores red: ${red}, green: ${green}, blue: ${blue}`);
	RED_LED.pwmWrite(red);
	GREEN_LED.pwmWrite(green);
	BLUE_LED.pwmWrite(blue);
	res.send(JSON.stringify(color));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
	console.log(Gpio);
});
