import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';

import { lineMP } from './lineMP.mjs';


let camera, scene, renderer;
let geometry, material;

const raycaster = new THREE.Raycaster();
let intersects;
const mouse = new THREE.Vector2( 1, 1 );

const squareSide = 50;
const squareWidth = squareSide;
const squareHeight = squareSide;
const squareDepth = 0;
const squares = [];

// "pixel" max and min coordinates
const minPixel = -10;
const maxPixel = 10;

// colors
const red = new THREE.Color( 0xff0000 );
const blue = new THREE.Color( 0x0000ff );
const yellow = new THREE.Color( 0xffff00 );
const black = new THREE.Color( 0x000000 );
const lightGrey = new THREE.Color( 0xf0f0f0 );
const lightGreen = new THREE.Color( 0x00cc99 );
const lightBlue = new THREE.Color( 0x4676ff );

// to get the current square intersecting the mouse pointer
let currentPosition = new THREE.Vector3( 0, 0, 0 );

// to get the current index in 'squares' array intersecting the mouse pointer
let currentIndexSquare;

// "pixel" coordinates of red points
const redPoints = [];

// red squares to change color when backspace is pressed
const redSquares = [];

// objects to delete when backspace is pressed
const objects = [];

init();
animate();


function init() {

    // set camera
    camera = new THREE.PerspectiveCamera( 
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000);
    camera.position.set( 10, -300, 200 );
    camera.lookAt( 0, 0, 0 );

    // initiate scene
    scene = new THREE.Scene();
    
    // x-axis
    const xLength = squareSide * 10 + (squareSide / 2);
    const xPoints = [];
    const xAxisColor = blue;
    material = new THREE.LineBasicMaterial( {color: xAxisColor} );
    xPoints.push( new THREE.Vector3( 0, 0, 0 ) );
    xPoints.push( new THREE.Vector3( xLength, 0, 0 ) );
    geometry = new THREE.BufferGeometry().setFromPoints( xPoints );
    const xAxis = new THREE.Line( geometry, material );
    scene.add( xAxis );

    // y-axis
    const yLength = squareSide * 10 + (squareSide / 2);
    const yPoints = [];
    const yAxisColor = red;
    material = new THREE.LineBasicMaterial( {color: yAxisColor} );
    yPoints.push( new THREE.Vector3( 0, 0, 0 ) );
    yPoints.push( new THREE.Vector3( 0, yLength, 0 ) );
    geometry = new THREE.BufferGeometry().setFromPoints( yPoints );
    const yAxis = new THREE.Line( geometry, material );
    scene.add( yAxis );

    // Plane divided by alternating colored squares
    geometry = new THREE.BoxGeometry( squareWidth, squareHeight, squareDepth );

    for ( let i = minPixel; i <= maxPixel; i++ ) {
        for ( let j = minPixel; j <= maxPixel; j++ ) {
            // if i, j are both even OR i, j are both odd
            if ( ( isEven(i) && isEven(j) ) || ( !isEven(i) && !isEven(j) ) ) {
                squares.push( makeInstanceSquare( geometry, lightGreen, i, j ) );
            }
            else {
                squares.push( makeInstanceSquare( geometry, lightBlue, i, j ) );
            }
        }
    }
    
    renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    new OrbitControls( camera, renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'mousemove', onMouseMove );
    document.addEventListener( 'keydown', onDocumentKeyDown );
}

function isEven( num ) {

    return num % 2 === 0;
}

// create a single square with given geometry, color and position
function makeInstanceSquare( geometry, color, i, j ) {

    const material = new THREE.MeshBasicMaterial( {color} );

    const square = new THREE.Mesh( geometry, material );
    
    square.position.x = squareWidth * i;
    square.position.y = squareHeight * j;
    
    scene.add( square );
    
    return square;
}

function findIndexSquare( vector ) {

    for ( let i = 0; i < squares.length; i++ ) {

        if ( squares[i].position === vector ) {
            return i;
        }
    }

    return -1;
}

// Change a square color to its original
function reverseSquaresColor( object ) {

    const x = object.position.x / squareSide;
    const y = object.position.y / squareSide;

    // if x and y are both even OR both odd
    if ( ( isEven(x) && isEven(y) ) || ( !isEven(x) && !isEven(y) ) ) {
        object.material.color.set( lightGreen );
    }
    else {
        object.material.color.set( lightBlue );
    }
}

// Draw a black line given two points
function drawLine( a = {x, y}, b = {x, y} ) {
    
    const points = [];
    
    points.push( new THREE.Vector3( a.x * squareSide, a.y * squareSide, 0 ) );
    points.push( new THREE.Vector3( b.x * squareSide, b.y * squareSide, 0 ) );

    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial( { color: black } );

    const line = new THREE.Line( geometry, material );

    scene.add( line );

    objects.push( line );
}

// Draw a yellow tile given a vector3
function drawTiles( vector ) {
    
    const tileWidth = squareSide;
    const tileHeight = squareSide;
    const tileDepth = squareSide / 4;

    geometry = new THREE.BoxGeometry( tileWidth, tileHeight, tileDepth );
    
    const material = new THREE.MeshBasicMaterial( {
        color: yellow,
        opacity: 0.5,
        transparent: true} );
    
    for ( let i = 0; i < vector.length; i++ ) {
        
        const tile = new THREE.Mesh( geometry, material );
        
        tile.position.x = squareSide * (vector[i].x);
        tile.position.y = squareSide * (vector[i].y);
        tile.position.z = squareSide / 8;

        scene.add( tile );

        objects.push( tile );
    }
}

// Window Resize Event
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Mouse Move Event
function onMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( squares );
    
    if ( intersects.length > 0 && currentPosition !== intersects[0].object.position) {
        currentPosition = intersects[0].object.position;

        currentIndexSquare = findIndexSquare(currentPosition);
        
        console.log(`Mouse in square ${currentIndexSquare}`);
    }
}

// Key Down Event
function onDocumentKeyDown( event ) {
    
    switch ( event.keyCode ) {

        // keyCode 88 is key 'x'
        case 88:

            if ( intersects.length > 0 ) {

                const squareColor = intersects[0].object.material.color;
                
                if ( !squareColor.equals(red) ) {

                    intersects[0].object.material.color.set( red );

                    const pixel = {
                        x: currentPosition.x / squareSide,
                        y: currentPosition.y / squareSide };
                    
                    redPoints.push(pixel);
                    redSquares.push( intersects[0].object );
                }

                if ( redPoints.length > 1 && redPoints.length % 2 === 0 ) {

                    const lastPoint = redPoints[ redPoints.length - 2 ];
                    const lastButOnePoint = redPoints[ redPoints.length - 1 ];
                    
                    drawLine( lastPoint, lastButOnePoint);
                    
                    const vectorMP = lineMP( lastPoint, lastButOnePoint );
                    
                    drawTiles( vectorMP );
                }
            }
            break;

        // keyCode 8 is the Backspace key
        case 8:

            // delete from scene all objects in 'objects'
            objects.forEach( object => scene.remove( object ) );
            
            // clear objects array since it's no longer needed
            objects.splice(0, objects.length);

            // change grid red squares to original color
            redSquares.forEach( redSquare => reverseSquaresColor( redSquare ) );

            // clear arrays redSquares and redPoints since they're no longer needed
            redSquares.splice( 0, redSquares.length );
            redPoints.splice( 0, redPoints.length );

            break;
    }
}

function animate() {
    
    requestAnimationFrame( animate );
    
    render();
}

function render() {

    renderer.render( scene, camera );
}