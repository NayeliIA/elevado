//nombre de la imagen
let sample = "1"
let serialvalidation
//let serial = "soy serial"
let serialv = document.getElementById('myInput').value
let serial
let ubicacionv = document.getElementById('ubicacion').value
let ubicacion
let statusf = 0
let statusp = 0
let statusfinal = 1
let statusfinal1 = 1
let resulstatus

let coord1 = []
let coord2 = []
let coord3 = []
let coord4 = []

selectedOption = document.getElementById("opciones").value;
//let selectedOption = document.getElementById("lang").value;
//const Option = lang.options[lang.selectedIndex].value;
let selectedNuevo = document.getElementById("agregar").value;
let selectedPassword = document.getElementById("contraseña").value;
//Variable camid para las camaras
let camid
var contenido
var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/************************************************ canva de la imagen a guardar */
let fullimage = document.getElementById('CanvasFHD')
let fullimagectx = fullimage.getContext('2d')
/************************************************ canva de la imagen colocada*/
let Captura = document.getElementById('Captura')
let Capturactx = Captura.getContext('2d')
Captura.width = 1450;
Captura.height = 650;

let Captura1 = document.getElementById('Captura1')
let Captura1ctx = Captura1.getContext('2d')
Captura1.width = 168;
Captura1.height = 168;

let Captura2 = document.getElementById('Captura2')
let Captura2ctx = Captura2.getContext('2d')
Captura2.width = 168;
Captura2.height = 168;

let Captura3 = document.getElementById('Captura3')
let Captura3ctx = Captura3.getContext('2d')
Captura3.width = 168;
Captura3.height = 168;

let Captura4 = document.getElementById('Captura4')
let Captura4ctx = Captura4.getContext('2d')
Captura4.width = 168;
Captura4.height = 168;
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

function captura_datosNuevo() {
    console.log("hola estoy en captura de datos nuevo")
    let serial = document.getElementById('nuevo').value
    sn9 = serial //aqui se guarda el serial en una variable
    //cutsn = sn.substring(0, 12)

    if (sn9.length > 1) { //si el input ya tiene informacion, que se limpie
        document.getElementById('nuevo').onlyRead = true
        document.getElementById('nuevo').disabled = true
        document.getElementById('nuevo').style.background = "#E6F9FF"
        document.getElementById('nuevo').style.textAlign = "center"


    } else {
        serial.focus() //si no, que siga el focus hasta que haya informacion
    }

}
function captura_datos1() {
    console.log("hola estoy en captura de datos")
    serial = document.getElementById('myInput').value
    sn1 = serial //aqui se guarda el serial en una variable
    //cutsn = sn.substring(0, 12)

    if (sn1.length > 1) { //si el input ya tiene informacion, que se limpie
        document.getElementById('myInput').onlyRead = true
        document.getElementById('myInput').disabled = true
        document.getElementById('myInput').style.background = "#E6F9FF"
        document.getElementById('myInput').style.textAlign = "center"
        serial = document.getElementById('ubicacion')
        serial.focus()

    } else {
        serial.focus() //si no, que siga el focus hasta que haya informacion
    }

}

//funcion para el ingreso de informacion al segundo input 
function captura_datos2() {
    ubicacion = document.getElementById('ubicacion').value
    sn2 = ubicacion //aqui se guarda el serial en una variable
    if (sn2.length > 1) { //si el input ya tiene informacion, que se limpie
        document.getElementById('ubicacion').style.background = "#E6F9FF"
        document.getElementById('ubicacion').style.textAlign = "center"
        document.getElementById('ubicacion').disabled = true
        document.getElementById('ubicacion').onlyRead = true
        ubicacion = document.getElementById('nuevo')
        ubicacion.focus()
    } else {
        ubicacion.focus() //si no, que siga el focus hasta que haya informacion
    }

}

//funcion para el ingreso de informacion al segundo input 
function captura_datos3() {
    defecto = document.getElementById('lang').value

    sn3 = defecto //aqui se guarda el serial en una variable
    if (sn3.length > 1) { //si el input ya tiene informacion, que se limpie
        document.getElementById('lang').style.background = "#E6F9FF"
        document.getElementById('lang').style.textAlign = "center"
        document.getElementById('lang').disabled = true
        document.getElementById('lang').onlyRead = true
    } else {
        serial.focus() //si no, que siga el focus hasta que haya informacion
    }

}

/************************************************ llamada de las funciones de forma asincrona */
async function Sequence() {
    //const selectedOption = document.getElementById("lang").value;
    for (let point = 0; point < 4; point++) {
        await open_cam(point)
        await captureimage(point)
        await snapshot(fullimage,1,point) 
        await predict()
        await guardarrecortes(point)
        await plcelevado()
        await stopcam()
        await removeHighlights()
    }
   

}

async function guardarrecortes(point) {
    return new Promise(async resolve => {
    if (point == 0) {
        Captura1ctx.drawImage(fullimage, coord1[0], coord1[1], coord1[2], coord1[3], 0, 0, Captura1ctx.canvas.width, Captura1ctx.canvas.height) // coordenada y tamaño de recorte en el canvas
        console.log("contenido de captura1ctx: "+Captura1.toDataURL())
        await sleep(1000)
       // console.log("contenido visible antes de snapshot " + Captura1.toDataURL())
        await snapshot(Captura1, 0,0)
        await loadmodelCla(Captura1)
    }
    if (point == 1) {
        Captura2ctx.drawImage(fullimage, coord1[0], coord1[1], coord1[2], coord1[3], 0, 0, Captura2ctx.canvas.width, Captura2ctx.canvas.height) 
        await snapshot(Captura2, 0,1)// coordenada y tamaño de recorte en el canvas
        await loadmodelCla(Captura2)
    }
    if (point == 2) {
        Captura3ctx.drawImage(fullimage, coord1[0], coord1[1], coord1[2], coord1[3], 0, 0, Captura3ctx.canvas.width, Captura3ctx.canvas.height) // coordenada y tamaño de recorte en el canvas
        await snapshot(Captura3, 0,2)
        await loadmodelCla(Captura3)
    }
    if (point == 3) {
        Captura4ctx.drawImage(fullimage, coord1[0], coord1[1], coord1[2], coord1[3], 0, 0, Captura4ctx.canvas.width, Captura4ctx.canvas.height) // coordenada y tamaño de recorte en el canvas
        await snapshot(Captura4, 0,3)
        await loadmodelCla(Captura4)
    }
    resolve('resolved')
})
}

//  await resultado()
//setTimeout(function fire() { location.reload() }, 2000);//reiniciamos la pagina despues de 2 segundos

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
function open_cam(point) {
    return new Promise(async resolve => {
        if (point == 1) { camid = "0d4ef669c86943cf67333c67e090812f1261ef5f2ba5d0470516193d0c66b1a5" }
        if (point == 2) { camid = "b3cc0e2eaafdd99e26e48ebd07fbd6d9bfa524e087a03179f346abcb403278b5" }
        if (point == 3) { camid = "b3cc0e2eaafdd99e26e48ebd07fbd6d9bfa524e087a03179f346abcb403278b5" }
        if (point == 4) { camid = "b3cc0e2eaafdd99e26e48ebd07fbd6d9bfa524e087a03179f346abcb403278b5" }
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
        setTimeout(function fire() { resolve('resolved') }, 2000)
    })
}
/************************************************ Tomar la foto */
async function captureimage(point) {
    return new Promise(resolve => {
       // fullimage = document.getElementById("CanvasFHD")
        const video = document.getElementById("video");
       // let context = video.getContext('2d')
        console.log("Estoy en el punto " + point);
       
        Capturactx.drawImage(video, 0, 0, Capturactx.canvas.width, Capturactx.canvas.height);
        console.log("soy captura "+Capturactx)
        setTimeout(function () {
            console.log("FHD Image captured");
            resolve('resolved');
        }, 2000); // Tiempo para el opencam
    });
}


function mapcams() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === 'videoinput');
            console.log('Cameras found', filtered);
        });
}
/************************************************ Guardado de imagen */

function snapshot(imagenr, folder,point) {
    
    return new Promise(async resolve => {
        let carpeta = document.getElementById("myInput").value; //serial
        let ubicacion = document.getElementById("ubicacion").value; //ubicacion
        let selectedOption = document.getElementById("opciones").value; //defectos
        //fullimage = document.getElementById("CanvasFHD")
        console.log("antes de guardar la imagen snapshot")
        var dataURI = imagenr.toDataURL('image/jpeg');
        console.log(imagenr)
        savepic(dataURI, carpeta, ubicacion, selectedOption, folder,point); //Socket que guarda la imagen depende la ubicacion y el defecto
       
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

async function loadmodelCla(imagenr) {
    let model2 = new cvstfjs.ClassificationModel();
    await model2.loadModelAsync('modelmcla/model.json');
    console.log(model2)

    result = await model2.executeAsync(imagenr)
    console.log(result)
    pasa = result[0][0]
    falla = result[0][1]
    if (pasa >= falla) { //Evalua el valor en la posicion 0 que da la redneuronal
        statusfinal = 1;
        console.log(statusfinal)
    }
    else {
        statusfinal = 0;
        console.log(statusfinal)
    }
}
//analiza la imagen full 
async function predict(fullimage) {

    fullimage = document.getElementById('CanvasFHD')
    let input_size = model.input_size

    // Take & Pre-process the image
    let image = tf.browser.fromPixels(fullimage, 3)
    image = tf.image.resizeBilinear(image.expandDims(), [input_size, input_size]) //  
    let predictions = await model.executeAsync(image)
    await highlightResults(predictions) //espera a esta funcion para verificar si tiene corto o no
    sleep(1000);

}
loadmodel()



//************************************************************************************** Funciones de recuadros ubica */
var children = []
let criterio = 0.00003
//esta funcion es para verificar el corto de l primer punto
async function highlightResults(predictions, point) {

    for (let n = 0; n < predictions[0].length; n++) {
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

            if (point == 0) {
                coord1.push(bboxLeft)
                coord1.push(bboxTop)
                coord1.push(bboxWidth)
                coord1.push(bboxHeight)
            }
            else if (point == 1) {
                coord2.push(bboxLeft)
                coord2.push(bboxTop)
                coord2.push(bboxWidth)
                coord2.push(bboxHeight)
            }
            else if (point == 2) {
                coord3.push(bboxLeft)
                coord3.push(bboxTop)
                coord3.push(bboxWidth)
                coord3.push(bboxHeight)
            } else {
                coord4.push(bboxLeft)
                coord4.push(bboxTop)
                coord4.push(bboxWidth)
                coord4.push(bboxHeight)
            }
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
            console.log("pasé: " + predictions[1][n])
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

async function removeHighlights() {
    for (let i = 0; i < children.length; i++) {
        imageOverlay.removeChild(children[i])
    }
    children = []
}
/************************************************ Conexion socket */

function NuevoDefecto() {
    document.getElementById('nuevo').style.display = 'block'; // Mostrar el input de nuevo defecto
    document.getElementById('agregar').style.display = 'block'; // Mostrar el botón de agregar
    document.getElementById('myInput').style.display = 'none';
    document.getElementById('ubicacion').style.display = 'none';
    document.getElementById('enviar').style.display = 'none';
}

function handleOptionChange() {
    selectedOption = document.getElementById("opciones").value;
    if (selectedOption === "Nuevo Defecto") {
        var password = prompt("Por favor, ingresa la contraseña:", "", { mask: "*{4}" });

        if (password === "IALAB") {
            NuevoDefecto();
        } else {
            alert("Contraseña incorrecta. Inténtalo de nuevo.");
        }
    } else {
        Sequence();
    }
}
//document.getElementById("lang").addEventListener("change", handleOptionChange);
function mostrarElementos() {
    const elementosContainer = document.getElementById("elementosContainer");
    // Mostrar o ocultar el contenedor de elementos
    elementosContainer.style.display = "block";
    document.getElementById("agregarDefectoBtn").style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
    // Inicialmente, ocultar todos los elementos y mostrar solo el botón "Agregar Defecto"
    const elementosContainer = document.getElementById("elementosContainer");
    elementosContainer.style.display = "none";
    document.getElementById("agregarDefectoBtn").style.display = "block";
});
// Escuchar el evento de cambio del elemento de entrada
document.getElementById('nuevo').addEventListener('change', function () {
    // Obtener el texto del nuevo defecto
    var nuevoDefecto = document.getElementById('nuevo').value;

    // Agregar el nuevo defecto al menú desplegable
    AgregarNuevoDefecto(nuevoDefecto);
});

// DOMContentLoaded event listener
function inicializarDefectosSelect() {
    document.addEventListener("DOMContentLoaded", function () {
        // Obtener defectos del almacenamiento local
        let defectos = JSON.parse(localStorage.getItem("defectos"));
        // Almacena los cambios en el almacenamiento local
        localStorage.setItem("defectos", JSON.stringify(defectos));
        if (!defectos) {
            defectos = [
                "",
                "Componente Elevado",
                "Daño fisico",
                "Exceso de soldadura",
                "Insuficiencia de soldadura",
                "Delaminacion",
                "Bolitas de soldadura",
                "Pin sin soldadura",
                "Cobre expuesto",
                "Nuevo Defecto",
                "Defecto prueba"
            ];
            localStorage.setItem("defectos", JSON.stringify(defectos));
        }

        // Crear elemento select
        const selectElement = document.getElementById("opciones");
        // Llenar select con defectos
        defectos.forEach(function (opcion) {
            const option = document.createElement("option");
            option.value = opcion;
            option.text = opcion;
            selectElement.appendChild(option);
        });

        // Escuchar el evento de cambio del elemento select
        selectElement.addEventListener("change", function () {
            ubicacion = document.getElementById('ubicacion')
            ubicacionE = document.getElementById('ubicacionE')
            let serial = document.getElementById('serial')
            const seleccion = selectElement.value;
            if (seleccion === "Nuevo Defecto") {
                handleOptionChange();
                myInput.style.display = "none"
                serial.style.display = "none"
                ubicacionE.style.display = "none"
                ubicacion.disabled = true
                opciones.style.display = "none"
                agregar.style.display = "block"
            } else {
                agregar.style.display = "none";
                nuevo.style.display = "none";
            }
        });

        // Escuchar el evento de clic del botón "Agregar"
        const agregar = document.getElementById("agregar");
        agregar.addEventListener("click", function () {
            const nuevaOpcion = nuevo.value;

            if (nuevaOpcion.trim() !== "") {
                defectos.push(nuevaOpcion);
                localStorage.setItem("defectos", JSON.stringify(defectos));

                // Redirigir a la página principal
                window.location.href = "elevado.html";
            }
        });
    });
}

// Llamada a la función al cargar la página
inicializarDefectosSelect();


// Función para agregar un nuevo defecto
function agregar() {
    const nuevaOpcion = nuevo.value;

    if (nuevaOpcion.trim() !== "") {
        defectos.push(nuevaOpcion);
        localStorage.setItem("defectos", JSON.stringify(defectos));

        // Redirigir a la página principal
        window.location.href = "elevado.html";
    }
}



function savepic(uri, carpeta, ubicacion, selectedOption, folder,point) {

    const socket = io();
    socket.emit('picsaving', uri, carpeta, ubicacion, selectedOption, folder,point)
}

