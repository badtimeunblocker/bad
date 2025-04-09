let camera, scene, renderer, controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let isRunning = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Movement constants
const WALK_SPEED = 400.0;
const RUN_SPEED = 800.0;
const JUMP_FORCE = 350.0;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 750);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Walls
    createWalls();

    // Controls
    controls = new THREE.PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
}

function createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7,
    });

    // Create walls
    const wallGeometry = new THREE.BoxGeometry(2000, 100, 10);
    
    // North wall
    const northWall = new THREE.Mesh(wallGeometry, wallMaterial);
    northWall.position.z = -1000;
    northWall.position.y = 50;
    scene.add(northWall);

    // South wall
    const southWall = new THREE.Mesh(wallGeometry, wallMaterial);
    southWall.position.z = 1000;
    southWall.position.y = 50;
    scene.add(southWall);

    // East wall
    const eastWall = new THREE.Mesh(wallGeometry, wallMaterial);
    eastWall.rotation.y = Math.PI / 2;
    eastWall.position.x = 1000;
    eastWall.position.y = 50;
    scene.add(eastWall);

    // West wall
    const westWall = new THREE.Mesh(wallGeometry, wallMaterial);
    westWall.rotation.y = Math.PI / 2;
    westWall.position.x = -1000;
    westWall.position.y = 50;
    scene.add(westWall);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump) velocity.y += JUMP_FORCE;
            canJump = false;
            break;
        case 'ShiftLeft':
            isRunning = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
        case 'ShiftLeft':
            isRunning = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        // Apply gravity
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        const speed = isRunning ? RUN_SPEED : WALK_SPEED;

        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        // Simple collision with ground
        if (camera.position.y < 10) {
            velocity.y = 0;
            camera.position.y = 10;
            canJump = true;
        }

        prevTime = time;
    }

    renderer.render(scene, camera);
}