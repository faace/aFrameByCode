# aFrameByCode
通過純JS代碼的方式去使用A-Frame。
A-Frame是個非常棒的WebVR構建框架。基於這個框架，我們可以通過標準的HTML標簽和屬性就可以定義場景，實體和對應的屬性。不過，通過這種方式，在控制3D模型的時候非常不方便。
A-Frame-By-Code將提供通過JS代碼的方式去構建場景和控制3d物體。
A-Frame-By-Code是A-Frame的壹個擴展，通過它，妳可以：
- 通過代碼的方式，從壹個實體中添加或者移除另外壹個實體
- 通過代碼的方式，可以隨時添加資源
- 支持多場景切換
- 通過代碼，可以更加輕松的實現模板功能，布局功能等

*其他語言選擇：[English](README.md)，[简体中文](README.zh-cn.md)，[正體中文](README.zh-tw.md).*

## 如何使用
只要在aframe.min.js之後引用本庫即可：
```
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<script src="https://faace.github.io/aFrameByCode/dist/aFrameByCode.min.js"></script>
```
## 壹個完整的示例
請點擊[這個鏈接](https://faace.github.io/aFrameByCode)。

![壹個完整的示例](https://faace.github.io/aFrameByCode/imgs/fullExample.gif "壹個完整的示例")

## 定義壹個場景
直接上代碼：
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
[這裏](https://faace.github.io/aFrameByCode/demo.html) 可以查看壹個簡單的例子。

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
![通過代碼產生壹個場景](https://faace.github.io/aFrameByCode/imgs/screenShot.jpg "通過代碼產生壹個場景")


## 在場景的初始化函數onInit中添加實體
通常，我們會把默認的實體放在場景的初始化函數onInit中創建。當然，也可以在後期的任何時候，任何地方（例如component組件中）來添加實體。
添加實體有多種方式：
- 最簡單的添加方式
```
scene.addAnEntity('a-box', {
    position: '0 1 -3',
});
```

- 通過壹個對象添加
```
scene.addAnEntity({
    tag: 'a-box',
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- 添加實體的時候，順便指定id
```
scene.addAnEntity({
    tag: 'a-box#box1', // the string after # of the value is its id
    attibutes: {
        position: '0 1 -3',
        color: 'blue',
    }
});
```

- 壹次性添加多個實體
```
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

- 直接添加html格式的實體
```
scene.addEntities(`
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
    <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
    <a-sky color="#ECECEC"></a-sky>
`);
```

## 處理資源
資源會隨著場景的創建而創建。
- 我們可以在定義場景的時候同時定義需要加載的資源
```
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

- 我們可以通過scene.assets來使用資源的相關功能。
```
scene.assets.add('video', { // tag, attributes
    id: 'v',
    src: './videos/v.mp4',
    preload: 'auto',
    loop: 'true',
    playsinline: 'true',
});
```

- 給資源添加tag和id
```
scene.assets.add('a-asset-item#parrot', '../models/parrot.glb'); // (tag#id, src), #id is optional
```

- 壹次性添加多個資源

```
var assets = {
    'img#texture1': './imgs/texture1.jpg',
    'img#texture2': './imgs/texture2.jpg',
};
scene.assets.addList(assets);
```

如果我們是在onInit函數中通過scene.assets來添加資源，那麽我們是不需要調用load函數來正真加載。
但是，如果我們在其他地方添加資源，那麽就需要我們自己調用load函數。
```
var scene = AFRAME.extCurrScene;
var assets = scene.assets;
assets.add('a-asset-item#stork', '../models/stork.glb').load(function () {
    // a callback function when the asset is loaded.
});
```

## 多場景應用
多個場景可以同時定好，也可以在後期需要的時候動態定義。
接著，我們可以通過組件'f-click-to-scene'或者使用AFRAME.loadScene來切換場景。
註意：定義場景的時候並不會記載資源，只有在loadScene的時候才會正真加載資源

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

網頁打開的時候，需要指定默認場景，這裏有兩種方式來定義默認場景：
- 代碼方式：`AFRAME.loadScene('scene1');`
- 標簽方式：`<body scene="scene1">...</body>`
