function movePlayer() {
    playerVelocity.set(0, playerVelocity.y, 0);

    // Forward and backward movement
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    if (keys['KeyW']) playerVelocity.addScaledVector(forward, moveSpeed);
    if (keys['KeyS']) playerVelocity.addScaledVector(forward, -moveSpeed);

    // Left and right strafing
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();
    if (keys['KeyA']) playerVelocity.addScaledVector(right, -moveSpeed);
    if (keys['KeyD']) playerVelocity.addScaledVector(right, moveSpeed);

    // Jumping with improved detection
    if (keys['Space'] && camera.position.y === 1.5 && !isJumping) {
        playerVelocity.y = 0.3; // Adjusted jump force for smoother jump
        isJumping = true;
    }

    // Apply gravity
    playerVelocity.y += gravity;

    // Ground collision detection
    if (camera.position.y <= 1.5) {
        playerVelocity.y = 0;
        isJumping = false; // Reset jump state
        camera.position.y = 1.5; // Maintain ground level
    }

    camera.position.add(playerVelocity);
}
