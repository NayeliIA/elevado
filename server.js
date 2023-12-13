const express = require('express');
const https = require('https');

const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(__dirname));

/*const key = fs.readFileSync('C:/Users/nayeli_garcia/Desktop/recortador/encryption/server.key');
const cert = fs.readFileSync('C:/Users/nayeli_garcia/Desktop/recortador/encryption/server.cert');
const httpsOptions = { key: key, cert: cert };*/

const server = app.listen(8181, function () {
    console.log('Server ready...');

});

var io = require('socket.io')(server);

io.on('connection', (socket)  => {

//conexion para guardar imagenes
socket.on('picsaving', async function (datauri,contenido,sample){ // Funcion de ejemplo borrar no importante
	console.log("recibe",contenido);
    await savingpic(datauri,contenido,sample)
	
	});
})//close io.on

//-----* Guarda imagen desde URI
async function savingpic(datauri,serial,nmuestras){
	//serial = serial_escaneado
	let filePath;
	const ImageDataURI = require('image-data-uri')
	return new Promise(async resolve =>{ 	
        
        nmuestras = 1
	let filePath='C:/Users/nayeli_garcia/Desktop/projects/elevado/samples/'+serial+'';//Ruta de las carpetas por serial
	let filevalidation=fs.existsSync(filePath)
	
	if (filevalidation){ 

		filePath=''+filePath+'/'+nmuestras+'';	
        console.log("hola soy nsamples "+ nmuestras)	
		ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res))	
	}
	else{		
		fs.mkdir(filePath,(error)=>{		
			if (error){
				console.log(error.message);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
				}
				filePath=''+filePath+'/'+nmuestras+'';	
				//filePath=''+filePath+'';		
				ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
				console.log("Directorio creado")
			});
		}
	});//Cierra Promise
}

var net = require('net')
var tcpipserver = net.createServer(function (connection) {
    console.log('TCP client connected');

    connection.on('data', function (data) { console.log(data.toString()) });

})
tcpipserver.listen(7777, function () {
    console.log(' Server Port 80 listening...');
});