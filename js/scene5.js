
AFRAME.createAScene({
    id: 'scene5',
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
        // 1. add the video asset
        scene.assets.add('video', {
            id: 'v',
            src: './videos/v.mp4',
            preload: 'auto',
            loop: 'true',
            playsinline: 'true',
        });

        // 2. add the entity
        scene.addAnEntity('a-video', {
            class: 'collidable',
            src: '#v',
            width: 16,
            height: 9,
            position: "0 1 -5",
            scale: '0.4 0.4 0.4',
            'f-click-to-scene': 'scene:scene6'
        });
        scene.addEntities([
            {
                tag: 'a-text',
                attributes: {
                    position: '0 -0.4 -2',
                    scale: '0.6 0.6 0.6',
                    align: 'center',
                    value: 'click the video to next scene',
                    color: 'red',
                },
            }
        ]);


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
                'f-click-to-scene': 'scene: scene4'
            },
            'a-text#next': {
                class: 'collidable',
                geometry: "primitive: plane; width: 0.5; height: auto",
                material: "color: #aaa",
                position: '1 -1 -2',
                align: 'center',
                value: 'next',
                color: 'red',
                'f-click-to-scene': 'scene: scene6'
            },
        });
    },
    onLoaded: function () {
        var v = AFRAME.$('#v');
        v.muted = true;
        v.play();
    }
});

