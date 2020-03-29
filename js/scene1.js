
AFRAME.createAScene({
    id: 'scene1',
    attributes: {},
    onInit: function (scene) { // create anything in the functions
        // 1. add camera and cursor
        var cameraEntity = scene.addAnEntity('a-entity', { camera: '', 'look-controls': '' });
        cameraEntity.addAnEntity('a-cursor', '');

        // 2. only add a text
        scene.addEntities([
            {
                tag: 'a-text',
                attributes: {
                    geometry: "primitive: plane; width: 2.5; height: auto",
                    material: "color: #aaa",
                    position: '0 0 -2',
                    align: 'center',
                    value: 'click me to next scene',
                    color: 'red',
                    'f-click-to-scene': 'scene: scene2' // a component for clicking to a scene
                },
            }
        ]);
    },
});
