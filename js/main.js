//nombre de la imagen
let sample = "1"
let serialvalidation
let serial = "soy serial"
let statusf = 0
let statusp = 0
let statusfinal = 1
let statusfinal1 = 1
let resulstatus
//Variable camid para las camaras
let camid
var contenido
/************************************************ canva de la imagen a guardar */
let fullimage = document.getElementById('CanvasFHD')
let fullimagectx = fullimage.getContext('2d')
/************************************************ canva de la imagen colocada*/
let Captura = document.getElementById('Captura')
let Capturactx = Captura.getContext('2d')
Captura.width = 1450;
Captura.height = 650;

//*************************Socket block */
const socket = io();

socket.on('Sequence_start', function (infoplc) {//pg migrated

    if (infoplc != 0) {
        cadenadedatos = infoplc.toString()

        Sequence()//Activa bandera para continuar

        console.log("Start test sequence");
        // console.log(typeof(data))
        //console.log(infoplc)
        //console.log(pn)
    }
    else {
        console.log("Algo salio mal en el backend");
    }
});

/************************************************ llamada de las funciones de forma asincrona */
async function Sequence() {


    await open_cam()
    await captureimage()
    await snapshot()
    await predict()
    await plcelevado()
    await stopcam()
    //  await resultado()
    //setTimeout(function fire() { location.reload() }, 2000);//reiniciamos la pagina despues de 2 segundos

}

//****************************************** Backend call functions

async function plcelevado() {
    const socket = io();
    socket.emit('plc_response', resulstatus);
}
function resultado() {
    return new Promise(async resolve => {
        if (statusfinal == 1) { await pass() }
        else {
            await fail()
        }
        resolve('resolved')
    })

}
function open_cam() {
    return new Promise(async resolve => {
        //if (point == 1) { camid = "0d4ef669c86943cf67333c67e090812f1261ef5f2ba5d0470516193d0c66b1a5"}
        //if (point == 2) { camid = "b3cc0e2eaafdd99e26e48ebd07fbd6d9bfa524e087a03179f346abcb403278b5"}
        const video = document.querySelector('video')
        const vgaConstraints = {
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                "frameRate": 30,
                "resizeMode": "crop-and-scale",
                deviceId: camid
            }//llave video
        }

        await navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => { video.srcObject = stream }).catch(function (err) { console.log(err.name) })
        /*let objetomedia=  navigator.mediaDevices.getUserMedia(vgaConstraints)
         objetomedia.then((stream) => {video.srcObject = stream})*/
        setTimeout(function fire() { resolve('resolved') }, 1000)
    })
}
/************************************************ Tomar la foto */
function captureimage() {
    return new Promise(async resolve => {

        const video = document.getElementById("video")

        fullimagectx.drawImage(video, 0, 0, fullimage.width, fullimage.height) // Dibuja en el fullimage la captura de la imagen 1
        console.log("estoy en el canvas")
        Capturactx.drawImage(fullimage, 0, 0, Captura.width, Captura.height)
        setTimeout(function fire() { resolve('resolved'); }, 1000) //tiempo para el opencam
        //setTimeout(function fire() { resolve('resolved'); }, 2000);//Temporal para programacion de secuencia
        console.log("FHD Image captured")
        resolve('resolved')
    })

}
function mapcams() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === 'videoinput');
            console.log('Cameras found', filtered);
        });
}
/************************************************ Guardado de imagen */
function snapshot() {
    return new Promise(async resolve => {
        var dataURI = fullimage.toDataURL('image/jpeg');
        let serial = "1234"
        savepic(dataURI, serial, contenido); //savepic(dataURI,point);
        resolve('resolved')
    })
}
function stopcam() {
    return new Promise(async resolve => {
        const video = document.querySelector('video');
        // A video's MediaStream object is available through its srcObject attribute
        const mediaStream = video.srcObject;
        // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => { track.stop() })//;console.log(track);
        setTimeout(function fire() { resolve('resolved'); }, 1000);
    });//Cierra Promise principal
}
let model = new cvstfjs.ObjectDetectionModel()
//**************************************************Modelo cargado de la IA***************************************************************** */
async function loadmodel() {

    await model.loadModelAsync('modelm/model.json')
    console.log(model)

}

//analiza la imagen full 
async function predict(fullimage) {
    fullimage = document.getElementById('CanvasFHD')
    let input_size = model.input_size

    // Take & Pre-process the image
    let image = tf.browser.fromPixels(fullimage, 3)
    image = tf.image.resizeBilinear(image.expandDims(), [input_size, input_size]) //  
    let predictions = await model.executeAsync(image)

    // console.log(predictions)

    //console.log(input_size)
    await highlightResults(predictions) //espera a esta funcion para verificar si tiene corto o no

}

loadmodel()

//************************************************************************************** Funciones de recuadros ubica */
var children = []
let criterio = 0.10
let criterio2 = 0.30
//esta funcion es para verificar el corto de l primer punto
async function highlightResults(predictions) {

    for (let n = 0; n < predictions[0].length && statusfinal == 1; n++) {
        // Check scores
        if (predictions[1][n] > criterio) {
            console.log("fallé: " + predictions[1][n])
            statusf = "0"
            statusfinal = "0"
            console.log("statusfinalf" + statusfinal)
            const p = document.createElement('p')
            p.innerText = TARGET_CLASSES[predictions[2][n]] + ': '
                + Math.round(parseFloat(predictions[1][n]) * 100)
                + '%';

            console.log(p.innerText)
            bboxLeft = (predictions[0][n][0] * 1450) //900 es el Width de la imagen y hace match con el with del overlay
            bboxTop = (predictions[0][n][1] * 650) //540 es el Height de la imagen y hace match con el with del overlay
            bboxWidth = (predictions[0][n][2] * 1450) - bboxLeft//800 en vez del video.width
            bboxHeight = (predictions[0][n][3] * 650) - bboxTop//448 en vez del video.width
            console.log("X1:" + bboxLeft, "Y1:" + bboxTop, "W:" + bboxWidth, "H:" + bboxHeight)
            p.style = 'margin-left: ' + bboxLeft + 'px; margin-top: '
                + (bboxTop - 22) + 'px; width: '
                + (bboxWidth - 8) + 'px; top: 0; left: 0;'

            console.log(p.style)
            const highlighter = document.createElement('div')
            highlighter.setAttribute('class', 'highlighter')
            highlighter.style = 'left: ' + bboxLeft + 'px; top: '
                + bboxTop + 'px; width: '
                + bboxWidth + 'px; height: '
                + bboxHeight + 'px;'
            imageOverlay.appendChild(highlighter)
            imageOverlay.appendChild(p)
            children.push(highlighter)
            children.push(p)
            //statusf = 0
            console.log("FALLEEEEEE 1")
            statusfinal = 0
            await fail()
        }
        else {
            // console.log("pasé: " + predictions[1][n])
            statusp = "1"
            // console.log("PASEEEE 1")
            statusfinal = 1
            // console.log("status final " + statusfinal)
            await pass()


        }
        console.log("este es el:" + statusfinal)

    }
}

async function pass() {
    document.getElementById('tarjeta2').style.background = '#00ff40'
    resulstatus = "Pass"
}
async function fail() {
    document.getElementById('tarjeta2').style.background = '#cf010b'
    resulstatus = "Fail"
}

function removeHighlights() {
    for (let i = 0; i < children.length; i++) {
        imageOverlay.removeChild(children[i])
    }
    children = []
}
/************************************************ Conexion socket */
function savepic(uri, serial, contenido) {

    const socket = io();
    socket.emit('picsaving', uri, serial, contenido)
}