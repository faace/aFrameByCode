
AFRAME.createAScene({
    id: 'scene3',
    attributes: {},
    children: { // add some default entity
        'a-entity': {
            attributes: {
                camera: '',
                'look-controls': '',
            },
            children: {
                'a-cursor': ''
            }
        }
    },
    onInit: function (scene) { // create anything in the functions
        // 1 create some assets
        var assets = {
            'img#texture1': './imgs/texture1.jpg', // the string after # of the key is its id
            'img#texture2': './imgs/texture2.jpg',
        };
        scene.assets.addList(assets);

        // 2. add a box by this way
        scene.addAnEntity('a-box', {
            position: '1 1 -3',
            src: '#texture1',
            animation: 'property: object3D.rotation.y; from: 0; to: 360; dur: 3000; easing: linear;loop:true; dir: alternate;'
        });
        scene.addAnEntity('a-box', {
            position: '-1 1 -3',
            src: '#texture2',
            animation: 'property: object3D.rotation.x; from: 0; to: 360; dur: 3000; easing: linear;loop:true; dir: alternate;'
        });


        // add navigator
        scene.addEntities({
            'a-text#prev': {
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '-1 -1 -2',
                align: 'center',
                value: 'prev',
                color: 'red',
                'f-click-to-scene': 'scene: scene2'
            },
            'a-text#next': {
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '1 -1 -2',
                align: 'center',
                value: 'next',
                color: 'red',
                'f-click-to-scene': 'scene: scene4'
            },
        });
    },
});
