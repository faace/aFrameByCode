
AFRAME.createAScene({
    id: 'scene4',
    attributes: {},
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
    assets: { // can be defined by this way
        'img#texture1': './imgs/texture1.jpg', // the string after # of the key is its id
        'img#texture2': './imgs/texture2.jpg',
    },
    getTemplate: function (x, y, src) {
        var tpl = {
            tag: 'a-box',
            attributes: {
                scale: '0.3 0.3 0.3',
                position: x + ' ' + y + ' -3',
                src: src,
            }
        }
        return tpl;
    },
    onInit: function (scene) { // create anything in the functions
        // 1. add some entities by a template
        var textures = [assets['img#texture1'], assets['img#texture2']];
        for (var y = -0.5; y < 1; y += 0.5) {
            for (var x = -1; x < 2; x++) {
                scene.addAnEntity(this.getTemplate(x, y, textures[Math.floor(textures.length * Math.random())]));
            }
        }

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
                'f-click-to-scene': 'scene: scene3'
            },
            'a-text#next': {
                class: 'collidable',
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '1 -1 -2',
                align: 'center',
                value: 'next',
                color: 'red',
                'f-click-to-scene': 'scene: scene5'
            },
        });
    },
});
