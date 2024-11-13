// AR Project - (C) 2024 Laura Nurit Davidowicz, Roman Schuller
// Import Three.js library
import * as THREE from 'three';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js'; // Ensure correct path
import { VRButton } from './three.js-master/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from './three.js-master/examples/jsm/webxr/XRControllerModelFactory.js';



// Create the Scene
const scene = new THREE.Scene();

// Paintings

let paintings = '{ "paintings" : [' +
    '{ "no": "0", "path": "assets/paintings/1.jpg", "description":" \'Mona Lisa ist ein weltberühmtes Ölgemälde von Leonardo da Vinci aus der Hochphase der italienischen Renaissance Anfang des 16. Jahrhunderts. Das auf Italienisch als La Gioconda (‚die Heitere‘) – davon abgeleitet ihr französischer Name La Joconde – bekannte Bild wurde vermutlich nach der Florentinerin Lisa del Giocondo benannt. Der unter anderem im deutschsprachigen Raum gebräuchliche Titel Mona Lisa beruht auf einem Rechtschreibfehler, denn Mona leitet sich von der italienischen Kurzform Monna (für Madonna ‚Frau‘) ab, und ist demnach also kein Vorname, sondern der Titel, mit dem Lisa als Ehefrau (madonna) von Francesco del Giocondo angeredet wurde."},' +
    '{ "no": "1", "path": "assets/paintings/2.jpg", "description":" \'Der Schrei (norwegisch Skrik, deutsch ursprünglich auch Geschrei) ist der Titel von vier Gemälden und einer Lithografie des norwegischen Malers Edvard Munch mit weitgehend identischem Motiv, die zwischen 1893 und 1910 entstanden sind. Sie zeigen eine menschliche Figur unter einem roten Himmel, die ihre Hände gegen die Ohren presst, während sie Mund und Augen angstvoll aufreißt. Munch verarbeitete in dem Motiv eine eigene Angstattacke während eines abendlichen Spaziergangs, bei der er einen Schrei zu vernehmen meinte, der durch die Natur ging."},'+
    '{ "no": "2", "path": "assets/paintings/3.jpg", "description":" \'Junge mit Pfeife (Originaltitel: Garçon à la pipe) ist ein 1905 entstandenes Ölgemälde von Pablo Picasso, das den Übergang von der Blauen Periode zur Rosa Periode von Picasso markiert, indem er rosafarbene zu den blauen Farbtönen einfügte. Die Maße des Gemäldes betragen 100 × 81,3 cm."},'+
    '{ "no": "3", "path": "assets/paintings/4.jpg", "description":" \'Sternennacht (französisch La nuit étoilée, niederländisch De sterrennacht) ist eines der bekanntesten Gemälde des niederländischen Künstlers Vincent van Gogh. Er malte das 73,7 × 92,1 cm große Bild im Juni 1889 in der südfranzösischen Kleinstadt Saint-Rémy-de-Provence im Stil des Post-Impressionismus bzw. frühen Expressionismus mit Ölfarben auf Leinwand. Das Bild ist seit 1941 im Besitz des Museum of Modern Art in New York City und wird dort unter dem Titel The Starry Night gezeigt. "},'+
    '{ "no": "4", "path": "assets/paintings/5.jpg", "description":" \'Der Feldhase, auch Hase oder junger Hase genannt, ist der Titel eines Aquarells von Albrecht Dürer und die wohl bekannteste aller Naturstudien Dürers, Entstehungsjahr 1502. Der Feldhase ist auf dem annähernd quadratischen Papier in der fallenden Blattdiagonale von links oben nach rechts unten in hockender Position dargestellt. Der Hase blickt, dieser Diagonale folgend, in den Raum außerhalb der Bildfläche. Daraus ergibt sich die Ansicht im Dreiviertelprofil. Der Kopf, die Ohren und die Brustpartie sind in Untersicht, der Rücken und das Hinterbein in Aufsicht dargestellt. Dadurch wird alles Wesentliche der Komplexität des Hasen gezeigt. Die Grundierung ist aquarelliert mit verschiedenen Brauntönen bis zum getrübten Weiß. Auf diese Grundierung sind die rhythmisch strukturierten Haarlagen gesetzt. Die Zeichnung der Haare veranschaulicht die Felldehnung in der Hockstellung und ebenso die weiche, glänzende Haptik des Fells. Die Darstellung des Hasen ist naturnah und detailliert. "}]}';

const obj = JSON.parse(paintings)

//

// Load textures
const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load('assets/wall.jpg') //Wall Texture

// Create the Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5); // Set camera lower for a more realistic viewpoint

// Create the Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.xr.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows
document.getElementById('canvas-container').appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Resize the renderer on window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
scene.add(ambientLight);

// Room Dimensions
const roomWidth = 20;
const roomHeight = 8;
const roomDepth = 20;

// Create the Room (Cube)
const roomMaterial = new THREE.MeshBasicMaterial({ map: wallTexture /*color: 0xadd8e6*/, side: THREE.BackSide }); // Light blue color for walls
const room = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth),
  roomMaterial
);
scene.add(room);

// Floor
const floorColor = new THREE.Color(0x8B4513); // Brown color for the floor
const floorMaterial = new THREE.MeshStandardMaterial({ color: floorColor });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
floor.position.y = -roomHeight / 2 + 0.01; // Position it at the bottom of the room
floor.receiveShadow = true; // Enable shadow receiving
scene.add(floor);

// Ceiling
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xd1bc8a }); // Light blue for the ceiling
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), ceilingMaterial);
ceiling.rotation.x = Math.PI / 2; // Rotate to lay flat
ceiling.position.y = roomHeight / 2 - 0.01; // Position it at the top of the room
scene.add(ceiling);


////////////////////// PAINTINGS! ///////////


// Anzahl der Bilder und Fenster entlang einer Wand
const numberOfPaintings =  obj.paintings.length; // Anzahl der Bilder entlang einer Wand
const numberOfWindows = 3;
const paintingSpacing = 2; // Abstand zwischen den Bildern und Fenstern
const wallZPosition = -roomDepth / 2 + 0.1; // Leichte Entfernung von der Wand für alle Objekte

// Textur für die Bilder und Fenster laden
//const paintingTexture = textureLoader.load('assets/paintings/ai_painting.webp');
const paintingTexture = textureLoader.load(obj.paintings[0].path);

const windowTexture = textureLoader.load('assets/window_texture1.webp');
const windowMaterial = new THREE.MeshStandardMaterial({ map: windowTexture });
var spotlightItem = null;

var images = [5]
for (let i = 0; i <numberOfPaintings; i++) {
  images[i] = obj.paintings[i]
  images[i].texture = textureLoader.load(obj.paintings[i].path);
  console.log(images[i])
}
images.forEach((image) => {
  //image.description = "new";
})


// Erstellen von Bildern und Fenstern entlang der Wand
for (let i = 0; i < numberOfPaintings; i++) {
  // Bestimmen der x-Position für das Objekt
  const xPosition = -roomWidth / 2 + paintingSpacing + i * paintingSpacing * 2;

  // Geometrie und Material auswählen
  const geometry = new THREE.PlaneGeometry(2, 3); // Standardgröße für Bilder und Fenster

  const texture = new THREE.TextureLoader().load(images[i].path )
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // Neues Mesh erstellen
  const item = new THREE.Mesh(geometry, material);
  item.isImage = true;
  item.isActive = false;

  item.no = images[i].no;
  console.log(item.no)
  item.position.set(xPosition, 1, wallZPosition); // Position des Objekts anpassen
  item.castShadow = true;

  spotlightItem = item;
  // Objekt zur Szene hinzufügen
  scene.add(item);
}

// Spotlight for painting illumination
const spotlight = new THREE.SpotLight(0xffffff, 2); // Spotlight focused on the painting
spotlight.position.set(0, 3, -roomDepth / 2 + 0.1); // Position it above the painting
spotlight.angle = Math.PI / 4; // Spotlight angle
spotlight.penumbra = 0.2; // Soft edge
spotlight.decay = 2; // Decay of light
spotlight.target = spotlightItem

// spotlight.target = painting; // Target the spotlight to the painting
spotlight.castShadow = true; // Enable shadow casting for the spotlight
scene.add(spotlight);
scene.add(spotlight.target); // Ensure the target is added to the scene


// Add Orbit Controls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enables smooth movement
controls.dampingFactor = 0.25;
controls.enableZoom = false; // Disable zooming
controls.minPolarAngle = Math.PI / 4; // Limit looking up
controls.maxPolarAngle = Math.PI / 2; // Limit looking down
controls.enablePan = false; // Disable panning





//////////////////////////////////////////// RAYCASTER!
// HTML-Container für Beschreibung und maximiertes Bild erstellen
const descriptionContainer = document.createElement('div');
descriptionContainer.style.position = 'absolute';
descriptionContainer.style.bottom = '60px';
descriptionContainer.style.width = '100%';
descriptionContainer.style.textAlign = 'center';
descriptionContainer.style.color = 'white';
descriptionContainer.style.fontSize = '1.2em';
descriptionContainer.style.fontFamily = 'Arial, sans-serif';
descriptionContainer.style.display = 'none'; // Anfangs ausblenden
descriptionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
document.body.appendChild(descriptionContainer);



// Container für maximiertes Bild
const fullscreenContainer = document.createElement('div');
fullscreenContainer.style.position = 'fixed';
fullscreenContainer.style.top = '0';
fullscreenContainer.style.left = '0';
fullscreenContainer.style.width = '100vw';
fullscreenContainer.style.height = '100vh';
fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
fullscreenContainer.style.display = 'none'; // Anfangs ausblenden
fullscreenContainer.style.alignItems = 'center';
fullscreenContainer.style.justifyContent = 'center';
fullscreenContainer.style.cursor = 'pointer';
document.body.appendChild(fullscreenContainer);



const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let activePainting = null;
let isFullscreen = false;
// Raycaster

function onPointerMove(event){
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //event.hasEventListener( 'click', moveIt(pointer) );
  console.log("moving")
}

function onPointerDown(event) {
  // Prüfen, ob ein maximiertes Bild angezeigt wird
  if (isFullscreen) {
    closeFullscreen();
    return;
  }

  // Raycaster aktualisieren und auf Objekte prüfen
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    let object = intersects[i].object;

    if (object.isImage) {
      // Zweiter Klick auf dasselbe Bild -> Vollbildmodus
      if (activePainting === object && !isFullscreen) {
        openFullscreen(object);
        return;
      }

      // Bild vergrößern und Beschreibung anzeigen
      if (activePainting) {
        activePainting.scale.set(1, 1, 1); // Vorheriges Bild zurücksetzen
      }
      object.scale.set(2, 2, 2); // Vergrößern
      activePainting = object;

      // Textbeschreibung anzeigen
      const paintingInfo = obj.paintings.find(p => p.no == object.no);
      if (paintingInfo) {
        descriptionContainer.innerText = paintingInfo.description;
        descriptionContainer.style.display = 'block';
      }
      break; // Nur ein Objekt gleichzeitig verarbeiten
    }
  }
}


// Funktion, um das Bild im Vollbildmodus zu öffnen
function openFullscreen(object) {
  const paintingInfo = obj.paintings.find(p => p.no == object.no);
  if (paintingInfo) {
    const img = document.createElement('img');
    img.src = paintingInfo.path;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';

    fullscreenContainer.innerHTML = ''; // Vorherigen Inhalt entfernen
    fullscreenContainer.appendChild(img);
    fullscreenContainer.style.display = 'flex';
    isFullscreen = true;
    descriptionContainer.style.display = 'none'; // Beschreibung ausblenden
  }
}

// Funktion, um den Vollbildmodus zu schließen
function closeFullscreen() {
  fullscreenContainer.style.display = 'none';
  isFullscreen = false;

  // Zurück zur Vergrößerung
  if (activePainting) {
    activePainting.scale.set(2, 2, 2);
    descriptionContainer.style.display = 'block'; // Beschreibung wieder einblenden
  }
}

window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'click', onPointerDown );



/////// AR CONTROLLER!


// Controller-Model Factory für visuelle Darstellung
const controllerModelFactory = new XRControllerModelFactory();

// Erstelle VR-Controller
const controller1 = renderer.xr.getController(0); // Controller 1 als Interaktion
controller1.addEventListener('selectstart', onSelectStartVR);
controller1.addEventListener('selectend', onSelectEndVR);
scene.add(controller1);

const controller2 = renderer.xr.getController(1); // Controller 2 als Interaktion
controller2.addEventListener('selectstart', onSelectStartVR);
controller2.addEventListener('selectend', onSelectEndVR);
scene.add(controller2);

// Controller-Grips (für physische Darstellung)
const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);

const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
scene.add(controllerGrip2);



// Funktionen für Interaktionen mit den Controllern
function onSelectStartVR(event) {
  const controller = event.target;
  const intersects = getIntersections(controller);

  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;

    if (object.isImage) {
      // Überprüfen, ob dasselbe Bild erneut angeklickt wurde
      if (activePainting === object && !isFullscreen) {
        openFullscreen(object); // Vollbildmodus aufrufen
        return;
      }

      // Bild vergrößern und aktiv setzen
      if (activePainting) {
        activePainting.scale.set(1, 1, 1); // Setze vorheriges Bild zurück
      }
      object.scale.set(2, 2, 2); // Vergrößere aktuelles Bild
      activePainting = object;

      // Zeige die Textbeschreibung an
      const paintingInfo = obj.paintings.find(p => p.no == object.no);
      if (paintingInfo) {
        descriptionContainer.innerText = paintingInfo.description;
        descriptionContainer.style.display = 'block';
        descriptionContainer.style.bottom = '50px';
      }
      break; // Nur ein Objekt gleichzeitig verarbeiten
    }
  }
}

function onSelectEndVR(event) {
  const controller = event.target;

  // Entferne die Hervorhebung oder beende die Aktion
  if (controller.userData.selected !== undefined) {
    //const selectedObject = controller.userData.selected;
    if(isFullscreen){
      closeFullscreen()
    }

    //selectedObject.material.emissive.setHex(0x000000); // Farbe zurücksetzen
    controller.userData.selected = undefined;
  }
}

// Raycasting-Funktion für Controller-Interaktionen
const tempMatrix = new THREE.Matrix4();
function getIntersections(controller) {
  const raycaster = new THREE.Raycaster();
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

  return raycaster.intersectObjects(scene.children, false);
}

////////////////////////////////////////////
// Function to create text within VR scene
function createText(description) {
  const loader = new THREE.FontLoader();
  loader.load('path/to/font.json', function (font) {
    const textGeometry = new THREE.TextGeometry(description, {
      font: font,
      size: 0.2,
      height: 0.01,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position the text slightly below the camera
    textMesh.position.set(camera.position.x, camera.position.y - 0.5, camera.position.z - 1);
    textMesh.lookAt(camera.position);
    scene.add(textMesh);
  });
}





// Animation Loop
function animate() {
  controls.update(); // Update controls
  renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );
