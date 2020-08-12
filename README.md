# aFrameByCode
A way to use A-Frame all by javascript code.
A-Frame is an excellent web framework for building VR experiences. 
As we know, the common way to build 3d objects is using html language to define scene and entities. But in this way, it is not so convenient to add/remove 3d objects. In order to control 3d objects and scene more easily, A-Frame-By-Code comes out.
A-Frame-By-Code is an extension of A-Frame. You can use A-Frame as before, and you can also : 
- use code to add/remove an entity to/from another antity
- use code to add assets whenever you want
- use code to switch multiple scenes
- use code to realise anything easily, such a template entity, grid or some kind of layout
- **use code to animate an entity by any move/rotation/scale/color/fade action**

*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md), [正體中文](README.zh-tw.md).*

## How to use
Add the script after aframe.min.js
```html
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<script src="https://faace.github.io/aFrameByCode/dist/aFrameByCode.min.js"></script>
```
## A full exmaple
The link is [HERE](https://faace.github.io/aFrameByCode).

![a full example](https://faace.github.io/aFrameByCode/imgs/fullExample.gif "a full example")

## Define a scene
Below is the code of defining a scene.
```javascript
AFRAME.createAScene({
    id: 'scene1', // scene's id
    attributes: {}, // will add to a-scene's attibutes
    onInit: function (scene) {
        // optional function
        // add entities here
    },
    onLoaded: function() {
        // optional function
        // do something when all things are loaded
    },
    onRemove:function() {
        // optional function
        // clean something you need
    }
});
```
An example is:  [Open this link to see the result.](https://faace.github.io/aFrameByCode/demo.html) 

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A demo of A-Frame-By-Code</title>
    <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
    <script src="https://faace.github.io/aFrameByCode/js/aFrameByCode.js"></script>
</head>

<body>
    <script>
        AFRAME.createAScene({
            id: 'scene1',
            onInit: function (scene) {
                scene.addEntities({
                    'a-box': { position: "-1 0.5 -3", rotation: "0 45 0", color: "#4CC3D9" },
                    'a-sphere': { position: "0 1.25 -5", radius: "1.25", color: "#EF2D5E" },
                    'a-cylinder': { position: "1 0.75 -3", radius: "0.5", height: "1.5", color: "#FFC65D" },
                    'a-plane': { position: "0 0 -4", rotation: "-90 0 0", width: "4", height: "4", color: "#7BC8A4" },
                    'a-sky': { color: "#ECECEC" },
                });
            },
        });
        AFRAME.loadScene('scene1'); // load the scene
    </script>
</body>

</html>
```
![create a scene by code](https://faace.github.io/aFrameByCode/imgs/screenShot.jpg "create a scene by code")


## Add entities in function onInit
Usually we add default entities in the onInit function when creating a scene. Of course, we can add entities at any time and anywhere, we can also add entities in a component.
There are many ways to add entities to the scene or another entities.
- add an entity in a simple way
```javascript
scene.addAnEntity('a-box', {
    position: '0 1 -3',
});
```

- add with an object
```javascript
scene.addAnEntity({
    tag: 'a-box',
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- add with an id
```javascript
scene.addAnEntity({
    tag: 'a-box#box1', // the string after # of the value is its id
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- add many entities at the same time
```javascript
scene.addEntities({
    'a-box': {
        position: '-1 1 -3',
        color: 'blue',
    },
     'a-box#box2': {
        position: '0 1 -3',
        color: 'red',
    },
     'a-box#box3': {
        position: '1 1 -3',
        color: 'blue',
    }
});
```

- add many entities by html
```javascript
scene.addEntities(`
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
    <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
    <a-sky color="#ECECEC"></a-sky>
`);
```

## Handle assets
A-assets will be added to the scene by default.
- We can define assets as the key value when define the screne
```javascript
AFRAME.createAScene({
    id: 'scene4',
    assets: {
        'img#texture1': './imgs/texture1.jpg',
        'a-asset-item#parrot': './models/parrot.glb',
    },
    onInit: function (scene) {
        // ...
    },
});
```

- We can use it by scene.assets
```javascript
scene.assets.add('video', { // tag, attributes
    id: 'v',
    src: './videos/v.mp4',
    preload: 'auto',
    loop: 'true',
    playsinline: 'true',
});
```

- or add id to tag
```javascript
scene.assets.add('a-asset-item#parrot', '../models/parrot.glb'); // (tag#id, src), #id is optional
```

- or add many assets at the same times

```javascript
var assets = {
    'img#texture1': './imgs/texture1.jpg',
    'img#texture2': './imgs/texture2.jpg',
};
scene.assets.addList(assets);
```

If we add assets to scene.assets in function onInit, we do not need to call load function of assets.
Buf if we add assets after the scene is loaded, we need to call load function by code.
```javascript
var scene = AFRAME.extCurrScene;
var assets = scene.assets;
assets.add('a-asset-item#stork', '../models/stork.glb').load(function () {
    // a callback function when the asset is loaded.
});
```

## Multiple scenes
Multiple scenes can be defined at the same time.
And we can change from one scene to another by the component 'f-click-to-scene' or using code AFRAME.loadScene.

```javascript
AFRAME.createAScene({
    id: 'scene1',
    onInit: function (scene) { // create anything in the functions
        scene.addAnEntity('a-box', {
            position: '0 1 -3',
            color: 'blue',
            'f-click-to-scene': 'scene: scene2'
        });
    },
});

AFRAME.createAScene({
    id: 'scene2',
    onInit: function (scene) { // create anything in the functions
        scene.addAnEntity('a-box', {
            position: '0 1 -3',
            color: 'red',
            'f-click-to-scene': 'scene: scene1'
        });
    },
});
AFRAME.loadScene('scene1'); // load the scene
```

There are two ways to define the default scene.
- set default scene by code: `AFRAME.loadScene('scene1');`
- set default scene as an attribute in body tag: `<body scene="scene1">...</body>`


## Animation
Animations are supported, and all of them can be combined to use.
One Animation can be applied many times.
One Animation can be applied to many entities at the same time.
Multi animations can be applied to a single entity once.

The animations are list below:
- fadeOut/fadeIn/fadeTo: change the opacity
- move/moveTo/moveBy: change the position
- scale/scaleTo/ScaleBy: change the scale
- rotation/rotationTo/rotationBy: change the rotation
- color/colorTo/colorBy: change the color
- delay: delay some ms
- cb: run a callback function
- sequence: let many animations run one by one
- spawn: let many animations runn all together at the same time

All animations can be set to repeat/repeatForever/reserve.

The exmaple is [HERE](https://faace.github.io/aFrameByCode/anim.html).

![an animation example](https://faace.github.io/aFrameByCode/imgs/anim.gif "an animation example")

Exmaple code:

```javascript
var box = scene.addAnEntity('a-box', { position: "-1 0.5 -3", rotation: "0 45 0", color: "#4CC3D9" });
var sphere = scene.addAnEntity('a-sphere', { position: "0 1.25 -5", radius: "1.25", color: "#EF2D5E" });
var cylinder = scene.addAnEntity('a-cylinder', { position: "1 0.75 -3", radius: "0.5", height: "1.5", color: "#FFC65D" });
var plane = scene.addAnEntity('a-plane', { position: "0 0 -4", rotation: "-90 0 0", width: "4", height: "4", color: "#7BC8A4" });
var sky = scene.addAnEntity('a-sky', { color: "#ECECEC" });

var anim1 = AFRAME.anim();
anim1.sequence(
    anim1.scale(1000, { x: 1, y: 1, z: 1 },{ x: 0.5, y: 0.5, z: 0.5 }),
    anim1.scaleTo(1000, { x: 1, y: 1, z: 1 }),
    anim1.scaleBy(1000, { x: 1, y: 0, z: 0 }),
);
cylinder.animRun(anim1);


var anim2 = AFRAME.anim();
anim2.sequence(
    anim2.rotationBy(1000, { x: 45, y: 45, z: 45 }).repeat(2).reverse(),
    anim2.fadeTo(1500, 0).repeat(2).reverse(),
).repeatForever();
cylinder.animRun(anim2);

var anim3 = AFRAME.anim();
anim3.sequence(
    anim3.cb(function () {
        console.log('start')
    }),
    anim3.moveTo(1000, { x: 1, y: 0.5, z: -3 }),
    anim3.moveBy(1000, { x: 1, y: 1, z: -1 }).repeat(2).reverse(),
    anim3.cb(function () {
        console.log('end');
        sphere.animRun(anim1);
    }),
    anim3.moveTo(1000, { x: -1, y: 0.5, z: -3 }),
).repeatForever();
box.animRun(anim3);

var anim4 = AFRAME.anim();
anim4.spawn(
    anim4.colorBy(5000, { r: 100, g: 0, b: 0 }).repeatForever().reverse(),
    anim4.rotationBy(1000, { x: 0, y: 360, z: 0 }).repeatForever(),
);
plane.animRun(anim4);
```


## Event
A global Event system is added into A-Frame. when calling functions registerComponent, registerGeometry, 'registerSystem', registerShader, registerPrimitive and createAScene, you can use this.on/this.ons in any function to listen some events and do not neet to worry about unlistening events because aFrameByCode will do this for you. You can also unlistening events manually by this.off/this.offs。

When listening an event, you need to implement the event handler(on + eventName) or just implement the onAnyEvent function which can receive any event. 

you can use this.emit(eventName, eventData) to emit an event.


The following code is an example to use Event:
```
AFRAME.registerComponent('counter', {
    schema: {
        step: { type: 'int', default: 1 }
    },
    init: function () {
        this.on('Counter'); // listen the "Counter" event.
    },
    onCounter: function (event) { // define a handle function for the "Counter" event, the function name should be on+EventName
        var num = event.data.num;
        this.el.setAttribute('value', Math.floor(num / this.data.step));
    }
});

AFRAME.createAScene({
    id: 'scene1',
    onInit: function (scene) {
        scene.addEntities({
            'a-text#mid': { position: '0 2 -4', value: "0", color: "green", counter: '' },
        });

        var num = 0;
        setInterval(function () {
            this.emit('Counter', { num: ++num }); // send the "Counter" event
        }.bind(this), 1000);
    },
});
AFRAME.loadScene('scene1');

```