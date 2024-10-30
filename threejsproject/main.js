// Import Three.js library
import * as THREE from 'three';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js'; // Ensure correct path

// Create the Scene
const scene = new THREE.Scene();

// Paintings

let paintings = '{ "paintings" : [' +
    '{ "path": "assets/paintings/1.jpg", "Description":" \'Mona Lisa ist ein weltberühmtes Ölgemälde von Leonardo da Vinci aus der Hochphase der italienischen Renaissance Anfang des 16. Jahrhunderts. Das auf Italienisch als La Gioconda (‚die Heitere‘) – davon abgeleitet ihr französischer Name La Joconde – bekannte Bild wurde vermutlich nach der Florentinerin Lisa del Giocondo benannt. Der unter anderem im deutschsprachigen Raum gebräuchliche Titel Mona Lisa beruht auf einem Rechtschreibfehler, denn Mona leitet sich von der italienischen Kurzform Monna (für Madonna ‚Frau‘) ab, und ist demnach also kein Vorname, sondern der Titel, mit dem Lisa als Ehefrau (madonna) von Francesco del Giocondo angeredet wurde."},' +
    '{ "path": "assets/paintings/2.jpg", "Description":" \'Der Schrei (norwegisch Skrik, deutsch ursprünglich auch Geschrei) ist der Titel von vier Gemälden und einer Lithografie des norwegischen Malers Edvard Munch mit weitgehend identischem Motiv, die zwischen 1893 und 1910 entstanden sind. Sie zeigen eine menschliche Figur unter einem roten Himmel, die ihre Hände gegen die Ohren presst, während sie Mund und Augen angstvoll aufreißt. Munch verarbeitete in dem Motiv eine eigene Angstattacke während eines abendlichen Spaziergangs, bei der er einen Schrei zu vernehmen meinte, der durch die Natur ging."}]}';
const obj = JSON.parse(paintings)


// Load textures
const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load('assets/wall.jpg') //Wall Texture

// Create the Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5); // Set camera lower for a more realistic viewpoint

// Create the Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows
document.getElementById('canvas-container').appendChild(renderer.domElement);

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
const numberOfPaintings = 5; // Anzahl der Bilder entlang einer Wand
const paintingSpacing = 2; // Abstand zwischen den Bildern und Fenstern
const wallZPosition = -roomDepth / 2 + 0.1; // Leichte Entfernung von der Wand für alle Objekte

// Textur für die Bilder und Fenster laden
//const paintingTexture = textureLoader.load('assets/paintings/ai_painting.webp');
const paintingTexture = textureLoader.load(obj.paintings[0].path);

const paintingMaterial = new THREE.MeshStandardMaterial({ map: paintingTexture });
const windowTexture = textureLoader.load('assets/window_texture1.webp');
const windowMaterial = new THREE.MeshStandardMaterial({ map: windowTexture });
var spotlightItem = null;

// Erstellen von Bildern und Fenstern entlang der Wand
for (let i = 0; i < numberOfPaintings; i++) {
  // Bestimmen der x-Position für das Objekt
  const xPosition = -roomWidth / 2 + paintingSpacing + i * paintingSpacing * 2;

  // Prüfen, ob es sich um ein Bild oder ein Fenster handeln soll
  const isPainting = i % 2 === 0 || i === 0 || i === numberOfPaintings - 1;

  // Geometrie und Material auswählen
  const geometry = new THREE.PlaneGeometry(2, 3); // Standardgröße für Bilder und Fenster
  const material = isPainting ? paintingMaterial : windowMaterial;

  // Neues Mesh erstellen
  const item = new THREE.Mesh(geometry, material);
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

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

animate();
