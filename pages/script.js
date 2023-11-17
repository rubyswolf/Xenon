// var movement = {speed: 1.0,friction: 1.0,grip: 1.0,stop: 1.0,slip: 0.0} //sharp
// var movement = {speed: 1.0,friction: 0.05,grip: 1.0,stop: 1.0,slip: 0.0} //smooth
var movement = {speed: 1.0,friction: 0.05,grip: 0.2,stop: 0.0,slip: 1.0,zoomSpeed: 0.001} //buttery
// var movement = {speed: 2.0,friction: 0.05,grip: 0.0,stop: 1.0,slip: 1.0} //quick
// var movement = {speed: 1.0,friction: 0.01,grip: 0.05,stop: 0.5,slip: 1.0} //slippery
// var movement = {speed: 2.0,friction: 0.0,grip: 0.01,stop: 0.0,slip: 1.0} //wd40

var render = {x: 0, y: 0, velX: 0, velY: 0, zoom: 1.0, canvas: document.getElementById('render'), width: window.innerWidth, height: window.innerHeight}

render.ctx = render.canvas.getContext('2d')
render.canvas.width = render.width;
render.canvas.height = render.height;

//draw a black square in the center of canvas
render.ctx.clearRect(0, 0, render.width, render.height);
render.ctx.fillStyle = 'black';
render.ctx.fillRect(render.width / 2 - 50 / 2, render.height / 2 - 50 / 2, 50, 50);

// Variables to track mouse positions and canvas transformation with velocity
var input = {
    grabbed: false
}

// Function to handle mouse down event
document.body.addEventListener('mousedown', (e) => {
    input.grabbed = true;
    input.x = e.clientX;
    input.y = e.clientY;
    render.velX *= 1-movement.stop;
    render.velY *= 1-movement.stop;
});

// Function to handle mouse up event
document.body.addEventListener('mouseup', () => {
    input.grabbed = false;
});

// Function to handle mouse move event
document.body.addEventListener('mousemove', (e) => {
    if (!input.grabbed) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const dx = mouseX - input.x;
    const dy = mouseY - input.y;

    input.x = mouseX;
    input.y = mouseY;

    let factor = movement.speed*(1-movement.slip)
    render.x += dx*factor;
    render.y += dy*factor;

    render.velX = dx;
    render.velY = dy;

    render.canvas.style.transform = `translate(${render.x}px, ${render.y}px) scale(${render.zoom})`;
});

// Function to handle mouse wheel event for zooming
document.body.addEventListener('wheel', (e) => {
    const zoomFactor = 1 - e.deltaY * movement.zoomSpeed;

    let rect = render.canvas.getBoundingClientRect()
    let currentX = ((e.clientX-rect.left)/render.zoom)-render.width/2
    let currentY = ((e.clientY-rect.top)/render.zoom)-render.height/2
    
    render.x-=((currentX*zoomFactor)-currentX)*render.zoom
    render.y-=((currentY*zoomFactor)-currentY)*render.zoom

    render.zoom *= zoomFactor;

    render.canvas.style.transform = `translate(${render.x}px, ${render.y}px) scale(${render.zoom})`;
});


// Function to update canvas position with velocity persistence
render.update = () => {
    let factor =(input.grabbed?movement.slip:1)*movement.speed
    render.x += render.velX*factor;
    render.y += render.velY*factor;

    render.canvas.style.transform = `translate(${render.x}px, ${render.y}px) scale(${render.zoom})`;

    let decay = (input.grabbed?(1-movement.grip):(1-movement.friction))
    render.velX *= decay;
    render.velY *= decay;
    requestAnimationFrame(render.update);
}

// Initial call to the update function
requestAnimationFrame(render.update);