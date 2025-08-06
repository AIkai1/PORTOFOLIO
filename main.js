// Scene setup
let scene, camera, renderer, boxGroup, wireframeBox;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;

// Movement controls
let moveForward = false, moveBackward = false;
let moveLeft = false, moveRight = false;
let moveUp = false, moveDown = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

// Tile interaction
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let raisedTile = null;
let isIn3DMode = false;
let exitSphere = null; // 3D rotating sphere for exit button

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf0f0f0, 500, 2500);

    // Create camera with perspective above the floor
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, -350, 0); // Position above the floor
    camera.lookAt(0, -350, -200); // Look forward horizontally

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High resolution
    renderer.setClearColor(0xf5f5f5, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create box container
    createBox();

    // Create lighting
    createLighting();

    // Add event listeners - Added click and mouse move for tile interaction
    document.addEventListener('click', onDocumentClick, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Create exit button (initially hidden)
    createExitButton();
}

function createBox() {
    boxGroup = new THREE.Group();

    // No cube walls - just infinite floor grid
    createGridFloor();

    // Set initial rotation for view
    boxGroup.rotation.x = 0;
    boxGroup.rotation.y = 0;
    
    scene.add(boxGroup);
}

function createGridFloor() {
    // Create checkerboard pattern like chess - optimized for performance
    const boardSize = 120; // Balanced between detail and performance
    const squareSize = 80; // Balanced size for good visuals and performance
    const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
    
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            // Checkerboard pattern: alternate colors
            const isGray = (i + j) % 2 === 1;
            const material = new THREE.MeshBasicMaterial({
                color: isGray ? 0x808080 : 0xffffff, // Gray or white
                side: THREE.DoubleSide
            });
            
            const square = new THREE.Mesh(geometry, material);
            square.rotation.x = -Math.PI / 2; // Lay flat on ground
            square.position.set(
                (i - boardSize/2) * squareSize,
                -400, // Floor level
                (j - boardSize/2) * squareSize
            );
            
            // Add properties for animation
            square.userData = {
                isGray: isGray,
                originalY: -400,
                targetY: -400,
                isRaised: false
            };
            
            // For gray tiles, create a clickable floor area that appears when raised
            if (isGray) {
                const floorGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
                const floorMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xD20000,
                    visible: false,
                    transparent: true, // Pre-enable transparency for better performance
                    opacity: 0
                });
                
                const floorArea = new THREE.Mesh(floorGeometry, floorMaterial);
                floorArea.rotation.x = -Math.PI / 2;
                floorArea.position.set(
                    (i - boardSize/2) * squareSize,
                    -401, // Just slightly below main floor
                    (j - boardSize/2) * squareSize
                );
                
                floorArea.userData = {
                    isFloorArea: true,
                    parentTile: square
                };
                
                square.userData.floorArea = floorArea;
                square.userData.floorAreaOpacity = 0; // Track opacity for smooth fading
                boxGroup.add(floorArea);
            }
            
            boxGroup.add(square);
        }
    }
}

function createLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Directional light for 3D effect on sphere
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, -200, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
}

function createExitButton() {
    // Create 3D sphere with chess pattern
    const sphereGeometry = new THREE.SphereGeometry(5, 35, 35);
    
    // Create a canvas texture with chess pattern
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // Draw chess pattern with more tiles
    const tileSize = 10.67; // Medium tiles = 12 tiles per side
    for (let x = 0; x < 12; x++) {
        for (let y = 0; y < 12; y++) {
            // Checkerboard pattern: alternate colors
            const isWhite = (x + y) % 2 === 0;
            
            // Make one specific GRAY tile red (replace a gray tile, not white)
            if (x === 2 && y === 5) { // This position would normally be gray
                context.fillStyle = '#FF0000'; // Red tile replacing gray
            } else {
                context.fillStyle = isWhite ? '#FFFFFF' : '#808080'; // White or gray
            }
            
            context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    const sphereMaterial = new THREE.MeshLambertMaterial({ 
        map: texture
    });
    
    exitSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Fixed position that's always visible
    exitSphere.position.set(100, -300, -100);
    
    // Set initial rotation/angle of the sphere
    exitSphere.rotation.x = Math.PI / 11; // Small tilt like Earth
    exitSphere.rotation.y = 0; // Initial Y rotation (will be animated)
    exitSphere.rotation.z = 0; // No sideways tilt
    
    exitSphere.visible = false; // Initially hidden
    exitSphere.castShadow = true; // Enable shadow casting
    exitSphere.receiveShadow = true; // Enable shadow receiving
    
    // Add click detection userData
    exitSphere.userData = {
        isExitButton: true,
        isHovered: false
    };
    
    scene.add(exitSphere);
}

function enterTo3DMode() {
    isIn3DMode = true;
    
    // Hide chess floor
    boxGroup.visible = false;
    
    // Set background to white
    renderer.setClearColor(0xffffff, 1);
    
    // Show 3D exit sphere
    if (exitSphere) {
        exitSphere.visible = true;
    }
    
    // Reset camera
    camera.position.set(0, -350, 0);
    raisedTile = null;
}

function exitTo3DMode() {
    isIn3DMode = false;
    
    // Restore original background color
    renderer.setClearColor(0xf5f5f5, 1);
    
    // Show chess floor
    boxGroup.visible = true;
    
    // Hide 3D exit sphere
    if (exitSphere) {
        exitSphere.visible = false;
    }
    
    // Reset any raised tiles and hide all floor areas
    boxGroup.children.forEach(tile => {
        if (tile.userData) {
            tile.userData.targetY = tile.userData.originalY;
            // Hide any visible floor areas
            if (tile.userData.floorArea) {
                tile.userData.floorArea.material.visible = false;
                tile.userData.floorAreaOpacity = 0;
            }
        }
    });
    raisedTile = null;
}

function onDocumentMouseMove(event) {
    // Calculate mouse position for raycasting in both modes
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    if (isIn3DMode) {
        // Check for sphere hover in 3D mode
        if (exitSphere && exitSphere.visible) {
            const sphereIntersects = raycaster.intersectObject(exitSphere);
            exitSphere.userData.isHovered = sphereIntersects.length > 0;
        }
        return;
    }
    
    // Chess mode mouse interactions
    const intersects = raycaster.intersectObjects(boxGroup.children);
    
    // Check if mouse is still over the red floor area
    if (raisedTile) {
        let stillOnRedArea = false;
        
        if (intersects.length > 0) {
            const currentTile = intersects[0].object;
            // Check if mouse is over the red floor area (not the raised tile)
            if (currentTile.userData.isFloorArea && currentTile.userData.parentTile === raisedTile) {
                stillOnRedArea = true;
            }
        }
        
        // If mouse left the red floor area, lower the tile
        if (!stillOnRedArea) {
            raisedTile.userData.targetY = raisedTile.userData.originalY;
            // Start fading out the floor area when tile goes down
            if (raisedTile.userData.floorArea) {
                raisedTile.userData.floorAreaOpacity = 0; // Target opacity
            }
            raisedTile = null;
        }
    }
}

function onDocumentClick(event) {
    // Calculate mouse position for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    if (isIn3DMode) {
        // In 3D mode, check for clicking the exit sphere
        if (exitSphere && exitSphere.visible) {
            const sphereIntersects = raycaster.intersectObject(exitSphere);
            if (sphereIntersects.length > 0) {
                exitTo3DMode();
                return;
            }
        }
        return;
    }
    
    // Chess mode interactions
    const intersects = raycaster.intersectObjects(boxGroup.children);
    
    if (intersects.length > 0) {
        const tile = intersects[0].object;
        
        // Check if clicking on floor area (red area under raised tile)
        if (tile.userData.isFloorArea) {
            // Hide the floor area before entering 3D mode to prevent glitches
            tile.material.visible = false;
            enterTo3DMode();
            return;
        }
        
        // Only interact with gray tiles
        if (tile.userData.isGray) {
            // Lower any previously raised tile and hide its floor area smoothly
            if (raisedTile && raisedTile !== tile) {
                raisedTile.userData.targetY = raisedTile.userData.originalY;
                if (raisedTile.userData.floorArea) {
                    raisedTile.userData.floorAreaOpacity = 0; // Start fade out
                }
            }
            
            // Raise the clicked tile and show its floor area
            raisedTile = tile;
            tile.userData.targetY = tile.userData.originalY + 400; // Raised height
            if (tile.userData.floorArea) {
                tile.userData.floorArea.material.visible = true;
                tile.userData.floorAreaOpacity = 1; // Target opacity
            }
        }
    }
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            moveUp = true;
            break;
        case 'ShiftLeft':
        case 'ShiftRight':
            moveDown = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
        case 'Space':
            moveUp = false;
            break;
        case 'ShiftLeft':
        case 'ShiftRight':
            moveDown = false;
            break;
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Maintain high resolution on resize
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.0005;

    // Camera behavior depends on mode
    if (isIn3DMode) {
        // Static camera in 3D mode - no spinning
        camera.rotation.order = 'YXZ';
        camera.rotation.y = 0;
        camera.rotation.x = 0;
        
        // Handle sphere rotation based on hover state
        if (exitSphere) {
            if (exitSphere.userData.isHovered) {
                // Only rotate when hovered - same speed as before
                exitSphere.rotation.y += 0.02;
            }
            // Otherwise sphere stays still
            
            // Debug: log rotation to console
            if (Math.floor(exitSphere.rotation.y * 100) % 100 === 0) {
                console.log('Sphere rotation:', exitSphere.rotation.y, 'Visible:', exitSphere.visible);
            }
        }
    } else {
        // Auto spin in chess mode
        camera.rotation.order = 'YXZ';
        camera.rotation.y = time * 0.050;
        camera.rotation.x = 0;
    }

    // Animate tile positions smoothly (only in chess mode)
    if (!isIn3DMode) {
        boxGroup.children.forEach(tile => {
            if (tile.userData && tile.userData.targetY !== undefined) {
                const currentY = tile.position.y;
                const targetY = tile.userData.targetY;
                const diff = targetY - currentY;
                
                if (Math.abs(diff) > 1) {
                    tile.position.y += diff * 0.1; // Smooth animation
                } else {
                    tile.position.y = targetY;
                }
            }
            
            // Animate floor area opacity for smooth fade in/out
            if (tile.userData && tile.userData.floorArea && tile.userData.floorAreaOpacity !== undefined) {
                const floorMaterial = tile.userData.floorArea.material;
                const currentOpacity = floorMaterial.opacity;
                const targetOpacity = tile.userData.floorAreaOpacity;
                const opacityDiff = targetOpacity - currentOpacity;
                
                if (Math.abs(opacityDiff) > 0.01) {
                    floorMaterial.opacity += opacityDiff * 0.15; // Smooth fade
                    
                    // Show/hide based on opacity - optimized
                    floorMaterial.visible = floorMaterial.opacity > 0.01;
                } else {
                    floorMaterial.opacity = targetOpacity;
                    floorMaterial.visible = targetOpacity > 0;
                }
            }
        });
    }

    renderer.render(scene, camera);
}
