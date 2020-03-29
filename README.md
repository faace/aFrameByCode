# aFrameByCode
A way to use A-Frame all by js code.
A-Frame is an excellent web framework for building VR experiences. 
As we know, the common way to build 3d objects is using html language to define scene and entities. But in this way, it is not so convenient to add/remove 3d objects. In order to control 3d objects and scene more easily, A-Frame-By-Code comes out.
A-Frame-By-Code is an extension of A-Frame. You can use A-Frame as before, and you can also : 
- use code to add and remove an entity to another antity
- use code to add assets whenever you want
- use code to switch multiple scenes
- use code to realise anything easily, such a template entity, grid or some kind of layout

## how to use
Add the script after aframe.min.js
```
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<script src="https://faace.github.io/aFrameByCode/dist/aFrameByCode.min.js"></script>
```
## A full exmaple
The link is [HERE](https://faace.github.io/aFrameByCode).

![a full example](https://faace.github.io/aFrameByCode/imgs/fullExample.gif "a full example")

## define a scene
Below is the code of defining a scene.
```
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

```
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
Usually we add default entities in the onInit function when create a scene. Of course, we can add entities at any time and anywhere, we can also add entities in a component.
There are many ways to add entities to the scene or another entities.
- add an entity in a simple way
```
scene.addAnEntity('a-box', {
    position: '0 1 -3',
});
```

- add with an object
```
scene.addAnEntity({
    tag: 'a-box',
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- add with an id
```
scene.addAnEntity({
    tag: 'a-box@box1', // the string after # of the value is its id
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- add many entities at the same time
```
scene.addEntities({
    'a-box': {
        position: '-1 1 -3',
        color: 'blue',
    },
     'a-box@box2': {
        position: '0 1 -3',
        color: 'red',
    },
     'a-box@box3': {
        position: '1 1 -3',
        color: 'blue',
    }
});
```

## handle assets
A-assets will be added to the scene by default.
- We can use it by scene.assets
```
scene.assets.add('video', { // tag, attributes
    id: 'v',
    src: './videos/v.mp4',
    preload: 'auto',
    loop: 'true',
    playsinline: 'true',
});
```

- or add id to tag
```
scene.assets.add('a-asset-item#parrot', '../models/parrot.glb'); // (tag#id, src), #id is optional
```

- or add many assets at the same times

```
var assets = {
    'img#texture1': './imgs/texture1.jpg',
    'img#texture2': './imgs/texture2.jpg',
};
scene.assets.addList(assets);
```

If we add assets to scene.assets in function onInit, we do not need to call load function of assets.
Buf if we add assets after the scene is loaded, we need to call load function by code.
```
var scene = AFRAME.extCurrScene;
var assets = scene.assets;
assets.add('a-asset-item#stork', '../models/stork.glb').load(function () {
    // a callback function when the asset is loaded.
});
```

## multiple scenes
Multiple scenes can be defined at the same time.
And we can change from one scene to another by the component 'f-click-to-scene' or using code AFRAME.loadScene.

```
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

There are two way to define the default scene.
- set default scene by code: `AFRAME.loadScene('scene1');`
- set default scene as a attribute in body tag: `<body scene="scene1">...</body>`
