const express = require('express');
const https = require('https');

const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(__dirname));

let plc_endresponse = 0
/*const key = fs.readFileSync('C:/Users/nayeli_garcia/Desktop/projects/elevado/encryption/server.key');
const cert = fs.readFileSync('C:/Users/nayeli_garcia/Desktop/projects/elevado/encryption/server.cert');
const httpsOptions = { key: key, cert: cert };*/

const server = app.listen(8181, function () {
	console.log('Server ready...');

});

//*--------------------------------TCP/IP PLC --------------------------------------------*/

var io = require('socket.io')(server); //Bind socket.io to our express server.


io.on('connection', (socket) => {//Un Socket para todos los requerimientos a postgres

	socket.on('picsaving', async function (datauri, contenido, sample) { // Funcion de ejemplo borrar no importante
		console.log("recibe", contenido);
		await savingpic(datauri, contenido, sample)

	});

	socket.on('plc_response', function (resultstatus) {
		console.log(resultstatus)
		plcdatasender(resultstatus)
	});

});//Close io.on

//************************************************************** Server, espera algun dato de plc para arranque de secuencia  */

var net = require('net')
var tcpipserver = net.createServer(function (connection) {
	console.log('TCP client connected');
	connection.write('Handshake ok!\n'); //cuando se conecte el server, manda este mensaje 
	connection.on('data', function (data) {
		io.emit('Sequence_start', data.toString()); console.log("Analisis in process...");

		//Responde a PLC cuando termine inspeccion
		setTimeout(function respuesta() {
			estadoconexion = connection.readyState
			console.log("Comunicacion con el plc :" + connection.readyState)

			if (estadoconexion == 'closed') {
				console.log("Puerto de PLC cerrado reintento en 1min...")
			}
			if (estadoconexion == 'open') {
				connection.write(plc_endresponse)
			}

		}, 15000)
	})
})

function plcdatasender(resultstatus) {
	matrixtostring = resultstatus.toString()
	plc_endresponse = resultstatus
}


tcpipserver.listen(40000, function () {
	console.log('PLC Port 40000 listening...');
})


//-----* Guarda imagen desde URI
async function savingpic(datauri, serial, nmuestras) {
	//serial = serial_escaneado
	let filePath;
	const ImageDataURI = require('image-data-uri')
	return new Promise(async resolve => {

		nmuestras = 1
		let filePath = 'C:/Users/nayeli_garcia/Desktop/projects/elevado/samples/' + serial + '';//Ruta de las carpetas por serial
		let filevalidation = fs.existsSync(filePath)

		if (filevalidation) {

			filePath = '' + filePath + '/' + nmuestras + '';
			console.log("hola soy samples " + nmuestras)
			ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res))
		}
		else {
			fs.mkdir(filePath, (error) => {
				if (error) {
					console.log(error.message);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
				}
				filePath = '' + filePath + '/' + nmuestras + '';
				//filePath=''+filePath+'';		
				ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
				console.log("Directorio creado")
			});
		}
	});//Cierra Promise
}
