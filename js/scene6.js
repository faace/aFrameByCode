
AFRAME.createAScene({
    id: 'scene6',
    children: { // add some default entity
        'a-entity': {
            attributes: {
                camera: '',
                'look-controls': '',
            },
            children: {
                'a-cursor': { objects: '.collidable' }
            }
        }
    },
    onInit: function (scene) {
        // 1. add the glb asset
        scene.assets.add('a-asset-item#parrot', '../models/parrot.glb');

        // 2. add the entity
        this.parrot = scene.addAnEntity('a-entity', {
            'gltf-model': '#parrot',
            'f-model-animations': 'clip:KeyAction',
            scale: '0.2 0.2 0.2',
            position: '0 0 -2',
            rotation: '0 36 0'
        });

        // add navigator
        scene.addEntities({
            'a-text#prev': {
                class: 'collidable',
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '-1 -1 -2',
                align: 'center',
                value: 'prev',
                color: 'red',
                'f-click-to-scene': 'scene: scene5'
            },
            // 'a-text#next': {
            //     geometry: "primitive: plane; width: 0.5; height: auto",
            //     material: "color: #aaa",
            //     position: '1 -1 -2',
            //     align: 'center',
            //     value: 'next',
            //     color: 'red',
            //     'f-click-to-scene': 'scene: scene5'
            // },
        });
    },
    onLoaded: function () {
        var scene = AFRAME.extCurrScene;
        var assets = scene.assets;
        assets.add('a-asset-item#flamingo', '../models/flamingo.glb').load(function () {
            scene.addAnEntity('a-entity', {
                'gltf-model': '#flamingo',
                'f-model-animations': 'clip:KeyAction',
                scale: '0.2 0.2 0.2',
                position: '-0.5 0.5 -2.5',
                rotation: '0 36 0'
            })
        });

        assets.add('a-asset-item#stork', '../models/stork.glb').load(function () {
            scene.addAnEntity('a-entity', {
                'gltf-model': '#stork',
                'f-model-animations': 'clip:KeyAction',
                scale: '0.2 0.2 0.2',
                position: '0.5 0.5 -2.5',
                rotation: '0 36 0'
            })
        });
    },
});

AFRAME.registerComponent('f-model-animations', { // a component to play animations
    schema: {
        clip: { type: 'string', default: '' }, // which clip to play
    },
    init: function () {
        this.model = null;
        this.mixer = null;
        this.currAnimationName = null; // the current animation name
        this.animations = {}; // a map of the name to the coresponding animation

        var model = this.el.getObject3D('mesh');
        if (model) this.load(model);
        else { // model hasn't been loaded. just wait
            this.el.addEventListener('model-loaded', function (e) {
                this.load(e.detail.model);
            }.bind(this));
        }
    },
    load: function (model) {
        this.model = model;
        this.mixer = new THREE.AnimationMixer(model);
        var animations = this.model.animations;

        for (var i in animations) {
            this.animations[animations[i].name] = animations[i];
        }
        if (this.data.clip) this.playAnim(this.data.clip);
    },

    playAnim: function (name) { // play animation by clip name;
        if (name == this.currAnimationName) return; // the same animation, ignore

        if (this.currAnimationName) {
            this.mixer.uncacheAction(this.animations[this.currAnimationName], this.model);
            this.currAnimationName = null;
        }
        var animation = this.getAnimation(name);
        if (animation) {
            this.currAnimationName = name;
            this.action = this.mixer.clipAction(animation, this.model);
            this.action.play();
        }

    },
    getAnimation: function (name) {
        return this.animations[name];
    },
    getAnimationNameList: function () {
        return Object.keys(this.animations);
    },
    tick: function (t, dt) {
        if (this.currAnimationName && !isNaN(dt)) {
            this.mixer.update(dt / 1000);
        }
    }
});