# aFrameByCode
通过纯JS代码的方式去使用A-Frame。
A-Frame是个非常棒的WebVR构建框架。基于这个框架，我们可以通过标准的HTML标签和属性就可以定义场景，实体和对应的属性。不过，通过这种方式，在控制3D模型的时候非常不方便。
A-Frame-By-Code将提供通过JS代码的方式去构建场景和控制3d物体。
A-Frame-By-Code是A-Frame的一个扩展，通过它，你可以：
- 通过代码的方式，从一个实体中添加或者移除另外一个实体
- 通过代码的方式，可以随时添加资源
- 支持多场景切换
- 通过代码，可以更加轻松的实现模板功能，布局功能等

*其他语言选择：[English](README.md)，[简体中文](README.zh-cn.md)，[正體中文](README.zh-tw.md).*

## 如何使用
只要把库在aframe.min.js之后引用即可：
```
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<script src="https://faace.github.io/aFrameByCode/dist/aFrameByCode.min.js"></script>
```
## 一个完整的示例
请点击[这个链接](https://faace.github.io/aFrameByCode)。

![一个完整的示例](https://faace.github.io/aFrameByCode/imgs/fullExample.gif "一个完整的示例")

## 定义一个场景
直接上代码：
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
[这里](https://faace.github.io/aFrameByCode/demo.html) 可以查看一个简单的例子。

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
![通过代码产生一个场景](https://faace.github.io/aFrameByCode/imgs/screenShot.jpg "通过代码产生一个场景")


## 在场景的初始化函数onInit中添加实体
通常，我们会把默认的实体放在场景的初始化函数onInit中创建。当然，也可以在后期的任何时候，任何地方（例如component组件中）来添加实体。
添加实体有多种方式：
- 最简单的添加方式
```
scene.addAnEntity('a-box', {
    position: '0 1 -3',
});
```

- 通过一个对象添加
```
scene.addAnEntity({
    tag: 'a-box',
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- 添加实体的时候，顺便指定id
```
scene.addAnEntity({
    tag: 'a-box@box1', // the string after # of the value is its id
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- 一次性添加多个实体
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

- 直接添加html格式的实体
```
scene.addEntities(`
<a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
<a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
<a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
<a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
<a-sky color="#ECECEC"></a-sky>
`);
```

## 处理资源
资源会随着场景的插件而创建踹。
- 我们可以通过scene.assets来使用资源的相关功能。
```
scene.assets.add('video', { // tag, attributes
    id: 'v',
    src: './videos/v.mp4',
    preload: 'auto',
    loop: 'true',
    playsinline: 'true',
});
```

- 给资源添加tag和id
```
scene.assets.add('a-asset-item#parrot', '../models/parrot.glb'); // (tag#id, src), #id is optional
```

- 一次性添加多个资源

```
var assets = {
    'img#texture1': './imgs/texture1.jpg',
    'img#texture2': './imgs/texture2.jpg',
};
scene.assets.addList(assets);
```

如果我们是在onInit函数中通过scene.assets来添加资源，那么我们是不需要调用load函数来正真加载。
但是，如果我们在其他地方添加资源，那么就需要我们自己调用load函数。
```
var scene = AFRAME.extCurrScene;
var assets = scene.assets;
assets.add('a-asset-item#stork', '../models/stork.glb').load(function () {
    // a callback function when the asset is loaded.
});
```

## 多场景应用
多个场景可以同时定好，也可以在后期需要的时候动态定义。
接着，我们可以通过组件'f-click-to-scene'或者使用AFRAME.loadScene来切换场景。
注意：定义场景的时候并不会记载资源，只有在loadScene的时候才会正真加载资源

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

网页打开的时候，需要制定默认场景，这里有两种方式来定义默认场景：
- 代码方式：`AFRAME.loadScene('scene1');`
- 标签方式：`<body scene="scene1">...</body>`
