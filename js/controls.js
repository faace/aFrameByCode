document.addEventListener('DOMContentLoaded', function () {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);

    // AFRAME.loadScene('scene1'); // load the default scene

}, false);

// window.onload = function () {
//     console.log('onload');
// };