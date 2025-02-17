// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix *u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;

  uniform int u_WhichTexture;
  uniform float u_texColorWeight;

  void main() {
    vec4 texColor;

    if (u_WhichTexture == -2) {
        gl_FragColor = u_FragColor;
    } else if (u_WhichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_WhichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_WhichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_WhichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_WhichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else {
        gl_FragColor = vec4(1, 0.0, 0.0, 1);
    }

    //gl_FragColor = mix(u_FragColor, texColor, u_texColorWeight);
}`

////////////////////////////// Global Variables ////////////////////////////////////////
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;//
let u_ModelMatrix;
let u_ProjectionMatrix;//
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_texColorWeight;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;

let u_WhichTexture;

//===========Penguin 
let g_penguins = [];

////////////////////////////////////////////////////////////////////////////////

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  //Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  //Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  //Get the storage location of u_GlobalRotateMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  //Get the storage location of u_GlobalRotateMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  //Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // In connectVariablesToGLSL(), add:
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
  if (!u_WhichTexture) {
    console.log('Failed to get the storage location of u_WhichTexture');
    return;
  }

  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  if (!u_texColorWeight) {
    //console.log('Failed to get the storage location of u_texColorWeight');
    return;
  }

  //Set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

///////////////////////////////// TEXTURES ///////////////////////////////////////
function initTextures () {
    var image0 = new Image(); //Create the image object

    if(!image0) {
        console.log('Failed to create the image object');
        return false;
    }

    //register the event handler to be called on loading an image
    image0.onload = function(){ sendImageToTEXTURE0(image0);};
    image0.src = 'snow-block1.png';
    //ADD more texture loading
    return true;
}

function initTextures1 () {
    //var texture0 = gl.createTexture();

    var image1 = new Image();

    if(!image1) {
        console.log('Failed to create the image object');
        return false;
    }

    //register the event handler to be called on loading an image
    image1.onload = function(){ sendImageToTEXTURE1(image1);};
    image1.src = 'ice-block1.png';
    //ADD more texture loading
    return true;
}

function initTextures2 () {
    //var texture0 = gl.createTexture();

    var image2 = new Image();

    if(!image2) {
        console.log('Failed to create the image object');
        return false;
    }

    //register the event handler to be called on loading an image
    image2.onload = function(){ sendImageToTEXTURE2(image2);};
    image2.src = 'snow-floor1.png';
    //ADD more texture loading
    return true;
}


function initTextures3 () {
    //var texture0 = gl.createTexture();

    var image3 = new Image();

    if(!image3) {
        console.log('Failed to create the image object');
        return false;
    }

    //register the event handler to be called on loading an image
    image3.onload = function(){ sendImageToTEXTURE3(image3);};
    image3.src = 'fish1.png';
    //ADD more texture loading
    return true;
}

function sendImageToTEXTURE0(image0) {
    //console.log("Loading texture 0"); // Debug
    var texture = gl.createTexture();
    if (!texture){
        console.log('Failed to create the texture object');
        return false;
    }
    
    //Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //flip image's y axis
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.uniform1i(u_Sampler0, 0);

    //console.log('finished loadTexture');
    return true;
}

function sendImageToTEXTURE1(image1) {
    var texture1 = gl.createTexture(); 
    if (!texture1) {
        console.log('Failed to create the texture object');
        return false;
    }
    
    gl.activeTexture(gl.TEXTURE1); 
    gl.bindTexture(gl.TEXTURE_2D, texture1);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    
    gl.uniform1i(u_Sampler1, 1);  
    
    //console.log('Successfully loaded texture 1 (ice)');
    return true;
}

function sendImageToTEXTURE2(image2) {
    var texture2 = gl.createTexture(); 
    if (!texture2) {
        console.log('Failed to create the texture object');
        return false;
    }
    
    gl.activeTexture(gl.TEXTURE2); 
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
    
    gl.uniform1i(u_Sampler2, 2);  
    
    //console.log('Successfully loaded texture 1 (ice)');
    return true;
}


function sendImageToTEXTURE3(image3) {
    var texture3 = gl.createTexture(); 
    if (!texture3) {
        console.log('Failed to create the texture object');
        return false;
    }
    
    gl.activeTexture(gl.TEXTURE3); 
    gl.bindTexture(gl.TEXTURE_2D, texture3);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
    
    gl.uniform1i(u_Sampler3, 3);  
    
    //console.log('Successfully loaded texture 1 (ice)');
    return true;
}
////////////////////////////////////////////////////////////////////////

/////////////////////////////////// MAIN //////////////////////////////////////////

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    initializeBuffers();
    initTextures();
    initTextures1();
    initTextures2();
    initTextures3();

    // Camera
    camera = new Camera();

    // Initialize world
    initializeWorld();

    //==============PENGUIN
    //g_penguin = new Penguin(-1, -1, -3);  // OLD Position your penguin where desired bUt detroyed penguin
    //g_worldObjects.push(g_penguin); //OLD

    g_penguins.push(new Penguin(0, -1, -2));          // one penguin //Medium front
    g_penguins.push(new Penguin(5, -1.5, 5));          // two penguin //Baby across mom
    g_penguins.push(new Penguin(-5, -0.7, 5));         // three penguin //Big mom

    g_penguins.push(new Penguin(5, -1, -8));         // three penguin //Medium across
    g_penguins.push(new Penguin(-5, -1.5, 1.5));          // two penguin //Baby

    // Set different rotations and scales
    g_penguins[0].rotation[1] = 170;// Rotate

    g_penguins[1].scale = [0.5, 0.5, 0.5]; //half size
    g_penguins[1].rotation[1] = -50; //across mother

    g_penguins[2].scale = [1.5, 1.5, 1.5]; //1.5x size mama
    g_penguins[2].rotation[1] = -65;

    g_penguins[3].rotation[1] = 50; // next to main

    g_penguins[4].scale = [0.5, 0.5, 0.5];
    // Add all penguins to world objects
    g_penguins.forEach(penguin => g_worldObjects.push(penguin));

    canvas.onmousemove = function(ev) { 
        if (ev.buttons == 1) { 
            click(ev); 
        } else { 
            pre_mouse_pos = null;
        } 
    };

    // Keyboard controls
    document.onkeydown = function(ev) {
        switch(ev.code) {
            case "KeyW": camera.moveForward(); break;
            case "KeyS": camera.moveBackward(); break;
            case "KeyA": camera.moveLeft(); break;
            case "KeyD": camera.moveRight(); break;
            case "KeyQ": camera.panLeft(); break;
            case "KeyE": camera.panRight(); break;
            case "KeyF": // Add block
            case "KeyG": // Remove block
                handleBlockInteraction(ev);
                break;
        }
        renderScene();
    };

    // HTML game UI in canvas
    document.getElementById('webgl').insertAdjacentHTML('beforebegin', `
        <div style="position: fixed; top: 10px; left: 10px; color: white; font-family: Arial; text-shadow: 1px 1px 2px black;">
            <div id="gameScore">Score: 0 - Fish Blocks Found: 0/4</div>
            <div id="gameWin"></div>
        </div>
    `);

  
    gl.enable(gl.DEPTH_TEST);
    // Light black canvas
    gl.clearColor(0.8, 0.8, 1.0, 1.0);
    requestAnimationFrame(tick);
    return true;
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Global UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
var g_shapesList = [];

let pre_mouse_pos = null;
let global_angle_x = 0;
let global_angle_y = 0;

//Animation
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds = performance.now()/1000.0-g_startTime;
  renderScene();
  requestAnimationFrame(tick);
}

////////////////////////////////////////////////////////////////////////

/////////////////////////////////// World //////////////////////////////////////////
// World map 32x32 array
let g_worldMap = [];
let g_worldObjects = [];

let g_box1 = null;
let g_box2 = null;

// Game variables //
let fishLocations = [
    {x: 5, z: 5, found: false},
    {x: 25, z: 25, found: false},
    {x: 5, z: 25, found: false},
    {x: 25, z: 5, found: false}
];
let score = 0;
let gameStartTime = performance.now();


function initializeWorld() {
    //empty 32x32 map with walls
    for(let x = 0; x < 32; x++) {
        g_worldMap[x] = [];
        for(let z = 0; z < 32; z++) {
            //border walls
            if(x === 0 || x === 31 || z === 0 || z === 31) {
                g_worldMap[x][z] = 3;  //walls are 3 units high
            } else {
                g_worldMap[x][z] = 0;
            }
        }
    }

    // dirt clumps
    createCornerClump(2, 2, 6);      // top-left
    createCornerClump(24, 24, 6);    // bottom-right
    createCornerClump(24, 2, 6);     // top-right
    createCornerClump(2, 24, 6);     // Bottom-left
    
    // middle clumps
    createCornerClump(13, 8, 5);     //up middle
    createCornerClump(15, 20, 5);    //Low middle

    //fish Blocks
    fishLocations.forEach(fish => {
        if (!fish.found) {
            g_worldMap[fish.x][fish.z] = 1;  //ONe block high
        }
    });

    createWorldObjects();

}

function createCornerClump(startX, startZ, size) {
    //sparse Clumps
    for(let x = startX; x < startX + size; x++) {
        for(let z = startZ; z < startZ + size; z++) {
            //skip if Position outside bounds or border
            if(x <= 0 || x >= 31 || z <= 0 || z >= 31) continue;
            
            const centerX = startX + (size/2);
            const centerZ = startZ + (size/2);
            const distFromCenter = Math.sqrt(
                Math.pow((x - centerX), 2) + 
                Math.pow((z - centerZ), 2)
            );
            
            const height = Math.max(1, Math.floor(2.5 - (distFromCenter/2)));
            
            if (Math.random() > 0.5 + (distFromCenter * 0.15)) {
                if (g_worldMap[x][z] < height) {
                    g_worldMap[x][z] = height;
                }
            }
        }
    }
}

function createWorldObjects() {
    g_worldObjects = [];
    
    // ground
    const ground = new Cube(2);  // snow-floor texture
    const groundMatrix = new Matrix4();
    groundMatrix.setTranslate(-16, -2, -16);
    groundMatrix.scale(32, 0.1, 32);
    ground.matrix = groundMatrix;
    g_worldObjects.push(ground);
    
    //Ssky box
    const sky = new Cube(-2);
    sky.color = [0.6, 0.8, 1.0, 1.0];
    const skyMatrix = new Matrix4();
    skyMatrix.setTranslate(-16, -2, -16);
    skyMatrix.scale(500, 500, 500);
    sky.matrix = skyMatrix;
    g_worldObjects.push(sky);
    
    //create walls and Clumps
    for(let x = 0; x < 32; x++) {
        for(let z = 0; z < 32; z++) {
            if(g_worldMap[x][z] > 0) {
                for(let y = 0; y < g_worldMap[x][z]; y++) {
                    const isWall = (x === 0 || x === 31 || z === 0 || z === 31);
                    const isFish = fishLocations.some(t => 
                        !t.found && t.x === x && t.z === z
                    );
                    // fish blocks
                    const block = new Cube(isFish ? 3 : (isWall ? 0 : 1));
                    const blockMatrix = new Matrix4();
                    blockMatrix.setTranslate(x - 16, -2 + y, z - 16);
                    block.matrix = blockMatrix;
                    g_worldObjects.push(block);
                }
            }
        }
    }

}

////////////////////////////////////////////////////////////////////////

/////////////////////////////////// RENDER SCENE //////////////////////////////////////////
function renderScene(){
  var globalRotMat = new Matrix4()
    // .rotate(g_mouseAngleX, 1, 0, 0)  // X-axis rotation/vertical mouse movement
    // .rotate(g_mouseAngleY, 0, 1, 0)  // Y-axis rotation/horizontal mouse movement
    // .rotate(g_globalAngle, 0, 1, 0); // Original slider rotation
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //Camera matrices
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (camera._viewNeedsUpdate) {
    camera.updateViewMatrix();
    gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
  }

  if (camera._projectionNeedsUpdate) {
    camera.updateProjectionMatrix();
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  }

  //REnder world objects
  for(let obj of g_worldObjects) {
    obj.render();
  }

  // Calculate and display FPS
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numd");
  startTime = performance.now(); // Reset the start time for next frame
}

function handleBlockInteraction(ev) {
    let target = camera.getRayFromCamera();
    let worldX = Math.floor(target.elements[0] + 16);
    let worldY = Math.floor(target.elements[1] + 2);
    let worldZ = Math.floor(target.elements[2] + 16);
    
    if (worldX >= 0 && worldX < 32 && worldZ >= 0 && worldZ < 32) {
        if (ev.code === 'KeyG') { //removes the block
            //Check if it is a fish block
            let fish = fishLocations.find(t => 
                !t.found && t.x === worldX && t.z === worldZ
            );
            
            if (fish) {
                fish.found = true;
                score += 100;
                g_worldMap[worldX][worldZ] = 0;
                createWorldObjects();
                
                let fishFound = fishLocations.filter(t => t.found).length;
                sendTextToHTML(`Score: ${score} - Fish Found: ${fishFound}/4`, "gameScore");
                
                if (fishLocations.every(t => t.found)) {
                    let timeSpent = Math.floor((performance.now() - gameStartTime) / 1000);
                    sendTextToHTML(`Congratulations! You found all fish in ${timeSpent} seconds!`, "gameWin");
                }
            } else if (g_worldMap[worldX][worldZ] > 0) {
                g_worldMap[worldX][worldZ]--;
                createWorldObjects();
            }
        } else if (ev.code === 'KeyF') { //adDs blocks
            // Cant build higher than 4 blocks
            if (g_worldMap[worldX][worldZ] < 4) {
                //Cant build on fish blocks
                let isFish = fishLocations.some(t => 
                    !t.found && t.x === worldX && t.z === worldZ
                );
                
                if (!isFish) {
                    g_worldMap[worldX][worldZ]++;
                    createWorldObjects();
                }
            }
        }
    }
}



function renderAllShapes(){
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  // Clear <canvas>, add depth buffer clearing
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

}

let startTime = performance.now();
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get" + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function click(ev) {
    let curent_mouse_pos = [ev.clientX, ev.clientY];

    if (pre_mouse_pos != null) {
        let movement_x = (curent_mouse_pos[0] - pre_mouse_pos[0]);
        let movement_y = (curent_mouse_pos[1] - pre_mouse_pos[1]) / 2;

        global_angle_y = Math.max(-85, Math.min(85, global_angle_y - movement_y));
        global_angle_x -= movement_x;
        
        camera.rotate(global_angle_y, global_angle_x);
    }

    if (ev.buttons == 1) {
        pre_mouse_pos = curent_mouse_pos;
    } else {
        pre_mouse_pos = null;
    }
    
    renderScene();
}



//Take out the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate mouse pointer
  var y = ev.clientY; // y coordinate mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}




