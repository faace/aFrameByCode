
AFRAME.createAScene({
    id: 'scene2',
    attributes: {},
    onInit: function (scene) { // create anything in the functions
        // 1. add camera and cursor
        var cameraEntity = scene.addAnEntity('a-entity', { camera: '', 'look-controls': '' });
        cameraEntity.addAnEntity('a-cursor', '');

        // 2. add a box by this way
        scene.addAnEntity('a-box', {
            position: '0 1 -3',
            color: 'blue',
            animation: 'property: object3D.rotation.y; from: 0; to: 360; dur: 3000; easing: linear;loop:true; dir: alternate;'
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
                'f-click-to-scene': 'scene: scene1'
            },
            'a-text#next': {
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '1 -1 -2',
                align: 'center',
                value: 'next',
                color: 'red',
                'f-click-to-scene': 'scene: scene3'
            },
        });
    },
});
