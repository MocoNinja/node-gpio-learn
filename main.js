const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Gpio = require('pigpio').Gpio;
const PiCamera = require('pi-camera');
const fs = require("fs");

app.use(cors());

const RED_PIN = 27;
const GREEN_PIN = 17;
const BLUE_PIN = 22;

const RED_LED = new Gpio(RED_PIN, { mode: Gpio.OUTPUT });
const GREEN_LED = new Gpio(GREEN_PIN, { mode: Gpio.OUTPUT });
const BLUE_LED = new Gpio(BLUE_PIN, { mode: Gpio.OUTPUT });

app.use(express.json());

const myCamera = new PiCamera({
	mode: 'photo',
	output: `${__dirname}/test.jpg`,
	width: 640,
	height: 480,
	nopreview: true
});

app.get('/', (req, res) => {
	res.send('Hello World!')
});

app.post('/photo', (req, res) => {
	console.log("POST A PHOTO")
	myCamera.snap().then(_ => {
	}).then(_ => {
		readPhoto().then(data => {
			console.log(data);
			res.writeHead(200, {
				'Content-Type': 'image/png'
			});
			res.end(data, 'binary');
		}).catch(err => console.error(`El error en el read photo es:\n${err}`));
	}).catch(err => console.error(`El error en el take photo es:\n${err}`));
});

app.get('/photo', (req, res) => {
	readPhoto()
		.then(data => {
			console.log(data);
			res.writeHead(200, {
				'Content-Type': 'image/png'
			});
			res.end(data, 'binary');
		})
		.catch(error => console.log(error));;
});


app.post('/', (req, res) => {
	const { red, green, blue } = req.body;
	const color = { "value": red << 16 | green << 8 | blue };
	console.log(`He leído los valores red: ${red}, green: ${green}, blue: ${blue}`);
	RED_LED.pwmWrite(red);
	GREEN_LED.pwmWrite(green);
	BLUE_LED.pwmWrite(blue);
	res.send(JSON.stringify(color));
});

const takePhoto = async () => {
	console.log("LLamando al metodo de tomar foto");
	myCamera.snap()
		.then(result => {
			console.log(result);
			console.log("Foto tomada...");
			return result;
		})
		.catch(error => {
			console.log(`Error al tomar la foto: ${error}`);
		});
	console.log("??");
};

const readPhoto = async () => {
	const photo = await fs.readFileSync("test.jpg");
	return photo;
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	console.log(Gpio);
});
