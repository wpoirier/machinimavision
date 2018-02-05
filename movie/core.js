//const nodeserver = 'http://localhost:3000' // video and user database server
const mid = getUrlVars()["mid"]; // Movie ID. Used to identity what movie in the database we're working with.

//get querry string variables
//**I think we will just start with a url param like vid (video id)
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
//get the Url Params
console.log(getUrlVars());

//get from database server the movie id


//load the movie for playback


//parse json and load the playback data into the playback array


//set up camera and scene
var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 2;
camera.position.z = 5;

//set up renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//set up webvr
renderer.vr.enabled = true;
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );
document.body.appendChild( WEBVR.createButton( renderer ) );

// instantiate the loader
var loader = new THREE.OBJLoader2();			
var callbackOnLoad = function ( event ) {
	scene.add( event.detail.loaderRootNode );
};

// load the stage from provided URL synchronously
loader.load( './prototype_assets/stage_basic.obj', callbackOnLoad, null, null, null, false );

//set up player1
var prop_loader = new THREE.OBJLoader();
var player = new THREE.Object3D();
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
prop_loader.load( 
	'./prototype_assets/ico_man.obj', 
	function(object){
		//object.material = material;
		player = object;
		scene.add(player);
	}
);
//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
//var player = new THREE.Mesh( geometry, material );			
//scene.add( player );
player.position.y = 1;

//orbit controls
var controls = new THREE.OrbitControls(camera);
controls.update();

//input related variables
var leftheld = false;
var rightheld = false;
var upheld = false;
var downheld = false;

var leftheld_p2 = false;
var rightheld_p2 = false;
var upheld_p2 = false;
var downheld_p2 = false;

var xSpeed = 0.05;
var zSpeed = 0.05;
var yRotation = 0.05;

var keyboardInputList = [];
var savedInputsArray = [];
var scene_index = 0;

//set up the lighting
var light = new THREE.PointLight( 0xff0000, 1, 1000 );
light.position.set( player.position.x, player.position.x, player.position.x );
scene.add( light );
// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );
//light.target = player;

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 10, 10, 10 );
scene.add( spotLight );

var spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );

//Let's test having a timeline
const STAGING = 0;
const RECORD = 1;
const PLAYBACK = 2;

var mode = STAGING;

var time = 0;
var playback_index = 0; //index for keyboard recording playback
var saved_inputs_length;

//timeline interval function
setInterval(function(){ 
	//console.log(time);
	//if record mode, start the timer and record inputs for wasd
	//if playback mode, set the [key]held variables to true and false based on time. (note, make sure initial object position is set at start of playback)
	//if staging mode, don't do anything
	if (mode == RECORD){
		time++;
	}
	else if (mode == PLAYBACK){
		time++;
		//we may do other functionality here later, thus there are two if statements 
	}
	//console.log("time: " + time)
}, 100);	

//animation and movement for the player
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );

	//if playback mode, run through the saved input array to set the key held vars
	if (mode == PLAYBACK){
		//if playback index is less than length of saved inputs array
		if ( playback_index < saved_inputs_length ){
			if (savedInputsArray[scene_index][playback_index][0] == time){
				eval(savedInputsArray[scene_index][playback_index][1]);
				playback_index++;
			}
		}
	}

	if (leftheld){
		//player.position.x+=xSpeed;
		player.rotation.y -= yRotation;
	}
	if (rightheld){
		//player.position.x-=xSpeed;
		player.rotation.y += yRotation;
	}
	if (upheld){
		//player.position.z+=zSpeed;
		player.position.z -= Math.cos(player.rotation.y) * zSpeed;
		player.position.x -= Math.sin(player.rotation.y) * xSpeed;
	}
	if (downheld){
		//player.position.z-=zSpeed;
		player.position.z += Math.cos(player.rotation.y) * zSpeed;
		player.position.x += Math.sin(player.rotation.y) * xSpeed;
	}
}
animate();

function recordKey(position,data){
	if (mode == RECORD){
    	//keyboardInputList[playback_index] = time;
    	//keyboardInputList[playback_index][position] = data;
    	keyboardInputList.push([time,data]);
    	//playback_index++;
    }
    console.log(keyboardInputList);
 }


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 83) { //s
    	if (!downheld){
    		console.log("downheld Key pressed");
    		recordKey(0,"downheld = true");
    	}
        downheld = true;
    } else if (keyCode == 87) { //w
    	if (!upheld){
    		console.log("upheld Key Pressed");
    		recordKey(1,"upheld = true");
    	}
        upheld = true;
    } else if (keyCode == 65) { //a 
    	if (!rightheld){
    		console.log("rightheld Key Pressed");
    		recordKey(2,"rightheld = true");
    	}
        rightheld = true
    } else if (keyCode == 68) { //d
    	if (!leftheld){
    		console.log("leftheld Key Pressed");
    		recordKey(3,"leftheld = true");
    	}
        leftheld = true;
    } else if (keyCode == 32) { //key == space
    	setStagingRecordMode();
    }
    else if (keyCode == 80){ //key == p
    	setPlaybackMode();
    }
};

document.addEventListener("keyup", onDocumentKeyUp, false);
document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event){
	if (mode != PLAYBACK) {
		var keyCode = event.which;
		if (keyCode == 83) {
			if (downheld){
				console.log("downheld key released");
				recordKey(0,"downheld = false");
			}
	        downheld = false;
	    } else if (keyCode == 87) {
			if (upheld){
				console.log("upheld key released");
				recordKey(1,"upheld = false");
			}
	        upheld = false;
	    } else if (keyCode == 65) {
			if (rightheld){
				console.log("rightheld key released");
				recordKey(2,"rightheld = false");
			}
	        rightheld = false
	    } else if (keyCode == 68) {
			if (leftheld){
				console.log("leftheld key released");
				recordKey(3,"leftheld = false"); 
			}			    	
	        leftheld = false;
	    }
	}
}


/*setStagingRecord Mode
* ~ swap between staging and record mode when this is called. Returns null.
*/
function setStagingRecordMode(){

    player.position.set(0, 0, 0);
    player.rotation.y = 0;
    time = 0;
    playback_index = 0;

    if (mode == RECORD){
    	console.log("saved scene_index: " + scene_index);
    	savedInputsArray[scene_index] = keyboardInputList.slice(0);

    	//POST saved inputs to database server
    	$.ajax({
  			type: "POST",
  			url: nodeserver,
			data: JSON.stringify(keyboardInputList),
			success: function(){alert('inputs saved')},
			contentType: "application/json",
			dataType: 'json'
		});

		console.log('here');
    	keyboardInputList = [];
        mode = STAGING;
        document.getElementById('mode').innerHTML = "Mode: Staging";
        document.getElementById('record-button').innerHTML = "Record";
        document.getElementById('playback-button').innerHTML = "Play";
    }
    else if (mode == STAGING){
    	if (confirm("Scene will be overwritten. Continue?")){
	    	mode = RECORD;
	    	document.getElementById('mode').innerHTML = "Mode: Recording";
	    	document.getElementById('record-button').innerHTML = "Save";
	    	document.getElementById('playback-button').innerHTML = "";
	    }
	}
}
function setPlaybackMode(){
	if (mode == STAGING){
	    player.position.set(0, 0, 0);
	    time = 0;
	    playback_index = 0;
	    mode = PLAYBACK;
	    saved_inputs_length = savedInputsArray[scene_index].length;
	    document.getElementById('mode').innerHTML = "Mode: Playback";
	    document.getElementById('record-button').innerHTML = " ";
	    document.getElementById('playback-button').innerHTML = "Stop";
    }
    else if (mode == PLAYBACK){
		player.position.set(0, 0, 0);
		player.rotation.y = 0;
		downheld = false;
		upheld = false;
		rightheld = false;
		leftheld = false;
    	time = 0;
		document.getElementById('mode').innerHTML = "Mode: Staging";
		document.getElementById('record-button').innerHTML = "Record";
		document.getElementById('playback-button').innerHTML = "Play";
		mode = STAGING;
	}
}

//resize window when utilizing web VR
function onPointerRestricted() {
	var pointerLockElement = renderer.domElement;
	if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
		pointerLockElement.requestPointerLock();
	}
}
function onPointerUnrestricted() {
	var currentPointerLockElement = document.pointerLockElement;
	var expectedPointerLockElement = renderer.domElement;
	if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
		document.exitPointerLock();
	}
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

/* Start a simple ruby http server with ruby:
ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 8000, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start" 
*/