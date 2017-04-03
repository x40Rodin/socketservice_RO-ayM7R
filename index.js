import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';

import * as RODIN from 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN.js';

import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';

import {CubeObject} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/CubeObject.js';

import {MouseController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController.js';



const SS = new RodinSocket();

let scene = SceneManager.get();
let mouseController = new MouseController();
SceneManager.addController(mouseController);


// let skybox = new CubeObject(15, 'img/boxW.jpg');
// skybox.on('ready', (evt) => {
//     scene.add(evt.target.object3D);
//     evt.target.object3D.position.y = scene.controls.userHeight;
// });

let users = [];

let player = new RODIN.THREEObject(new THREE.Object3D());
player.on('ready', (evt) => {
    evt.target.object3D.position.set(Math.randomIntIn(-2, 2), 0, Math.randomIntIn(-2, 2));
    scene.add(evt.target.object3D);
    evt.target.object3D.add(scene.camera);
    socketInit(evt.target.object3D.position);
});


SS.onMessage('changeCoordinate', (data)=>{
     let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshBasicMaterial({color: 0x33669})));
     
     cube.on('ready', () => {
        console.log(data);
        cube.object3D.position.copy(data);
        scene.add(cube.object3D);
        //user.model = cube;
        //users.push(user);
    })
    console.log('received Coordinate', data);
})

SS.onMessage('joinRoom', (data)=>{
    console.log('joinRoom', data);
});

SS.onConnected((data)=>{
    console.log('socket connected', data);
    SS.disconnect();
    setTimeout(()=>{
        console.log('aaa');
        SS.reconnect();
        SS.broadcastToAll('changeCoordinate', {x:1, y:2, z:2});
        SS.joinRoom('roomOne', true);
    }, 5000);
})

function socketInit(pos){
    let username = prompt('Please enter your name', '');
    SS.connect({username:username});
    SS.broadcastToAll('changeCoordinate', pos);
    SS.joinRoom('roomOne', true);
}