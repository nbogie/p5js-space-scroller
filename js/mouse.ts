function mouseWorldPos(): p5.Vector {
    return cameraPos.copy().add(mousePos());
}

function mousePos(): p5.Vector {
    return createVector(mouseX, mouseY);
}
