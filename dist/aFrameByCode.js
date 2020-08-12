// name: aFrameByCode
// author: Faace Yu
// version: 1.1.3
// github: https://github.com/faace/aFrameByCode

(function (g) {
    AFRAME.$ = $ = document.querySelector.bind(document); // for id
    AFRAME.$$ = $$ = document.querySelectorAll.bind(document); // for class

    // public functions
    var afterAllCallback = AFRAME.afterAllCallback = function (num, cb, progressCb) {
        var count = 0;
        return function () {
            progressCb && progressCb(Math.min(num, count + 1), num);
            if (++count >= num) {
                num = null;
                if (progressCb) progressCb = null;
                if (cb) {
                    cb();
                    cb = null;
                }
            }
        };
    };
    var standardEntiyParm = function () {
        // var type1 = {
        //     tag: 'a-entity', // optional, default is a-enity
        //     attributes: { // optional
        //         position: '0 0 0',
        //     },
        //     children: [ // optional
        //         // a loop
        //     ]
        // }
        // var type2 = {  // for resource
        //     tag: 'a-entity',
        //     src: 'a link', // optional, can place to attibutes object
        //     attributes: { // optional
        //         loop: 'true',
        //     },
        // };
        // var type3 = 'tag#id, src, attributes'; // arguments; #id is optional, src is optional, attributes is optional

        var obj;
        if (typeof arguments[0] == 'string') { // type of type4
            obj = { tag: arguments[0] };
            if (typeof arguments[1] == 'string') { // it sould be src;
                obj.attributes = arguments[2] || {};
                obj.attributes.src = arguments[1];
            } else { // no src, it should be attributes of empty
                if (arguments[1].attributes) {
                    obj.attributes = arguments[1].attributes;
                    obj.children = arguments[1].children;
                } else if (arguments[1].children) {
                    obj.attributes = {};
                    obj.children = arguments[1].children;
                } else {
                    obj.attributes = arguments[1] || {};
                }
            }
        } else obj = arguments[0];

        // now, we need a deep copy and to the standard type whick is type1
        var newObj = { attributes: {} };
        if (true) { // handle tag
            var tag = obj.tag || 'a-entity';
            var id = '';
            var tags = tag.split('#');
            if (tags.length > 1) {
                tag = tags[0];
                id = tags[1];
            }
            newObj.tag = tag;
            newObj.attributes.id = id;
        }
        for (var i in obj.attributes) newObj.attributes[i] = obj.attributes[i];

        if (obj.children) {
            var children = obj.children;
            newObj.children = [];
            if (Array.isArray(children)) { // handle one by one
                for (var j = 0; j < children.length; j++) {
                    newObj.children.push(standardEntiyParm(children[j]));
                }
            } else { // can be a type3 object
                for (var j in children) newObj.children.push(standardEntiyParm(j, children[j]));
            }
        }

        return newObj;
    };
    var parseHtml = function (html) {
        var div = document.createElement('div');
        div.innerHTML = (html || '').replace(/\n/g, '').replace(/\s+/g, ' ').replace(/^\s*/, '').replace(/\s*$/, '').replace(/>\s*</g, '><');

        var getAllEntities = function (el, entities) {
            var entity = { tag: el.localName };
            entities.push(entity);

            if (el.attributes.length > 0) {
                var attributes = entity.attributes = {};
                for (var j = 0; j < el.attributes.length; j++) {
                    attributes[el.attributes[j].name] = el.attributes[j].value;
                }
            }

            if (el.children.length > 0) {
                var children = entity.children = [];
                for (var i = 0; i < el.children.length; i++) {
                    getAllEntities(el.children[i], children);
                }
            }
        };

        var entities = [];
        try {
            getAllEntities(div, entities);
        } catch (error) {
            console.log('err html', error)
        }

        return (entities[0] && entities[0].children) || [];
    }
    var addAnEntity = function () {
        var parm = standardEntiyParm.apply(standardEntiyParm, arguments);
        return this.createAnEntity(parm, this)
    };
    var addEntities = function (list, cb) {
        if (!list) return;
        var el;
        if (Array.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                el = this.createAnEntity(list[i], this);
                cb && cb(el);
            }
        } else if (typeof list == 'string') {
            var entities = parseHtml(list);
            addEntities.bind(this)(entities, cb);
        } else { // 对象方式，这个时候，可能有id做标签
            for (var tag in list) {
                el = this.addAnEntity(tag, list[tag]); // this is for el
                cb && cb(el);
            }
        }
    };
    var createAnEntity = function (parm, parent) {
        if (typeof parent == 'undefined') parent = this;

        var parm = standardEntiyParm(parm);
        var el = document.createElement(parm.tag);
        if (parent) parent.appendChild(el);
        extendFunctions(el);
        setAttributes(el, parm.attributes);

        if (parm.children) {
            for (var i = 0; i < parm.children.length; i++) {
                this.createAnEntity(parm.children[i], el);
            }
        }

        return el;
    };

    var removeAnEntity = function (id) {
        var el = AFRAME.$(id);
        el.parentNode.removeChild(el);
    };

    var removeEntities = function (ids) {
        var els = $$(ids);
        for (var i = 0; i < els.length; i++) {
            els[i].parentNode && els[i].parentNode.removeChild(els[i]);
        }
    };
    var removeMe = function () {
        this.onRemove && this.onRemove();
        delete this.onRemove;
        this.parentNode && this.parentNode.removeChild(this);
    };

    var setAttributes = function (el, attributes) {
        if (typeof attributes == 'function') attributes = attributes();
        if (attributes) {
            for (var i in attributes) {
                el.setAttribute(i, attributes[i] || '');
            }
        }
    };
    var defineGetterSetter = function (parm) {
        Object.defineProperty(parm.obj, parm.key, {
            get: parm.get,
            set: parm.set,
        });
    };
    var defineVector3GetterSetter = function (obj, vec3) {
        defineGetterSetter({
            obj: obj,
            key: 'x',
            get: function () { return vec3.x; },
            set: function (value) { return vec3.x = value },
        });
        defineGetterSetter({
            obj: obj,
            key: 'y',
            get: function () { return vec3.y; },
            set: function (value) { return vec3.y = value },
        });
        defineGetterSetter({
            obj: obj,
            key: 'z',
            get: function () { return vec3.z; },
            set: function (value) { return vec3.z = value },
        });

    };
    var addQuickAttributes = AFRAME.addQuickAttributes = function (el) {
        if (typeof el.visible == 'undefined') {
            defineGetterSetter({
                obj: el,
                key: 'visible',
                get: function () { return el.getAttribute('visible') },
                set: function (value) { return el.setAttribute('visible', value) },
            });
        }
        if (el.object3D && el.object3D.position) {
            el.position = {};
            defineVector3GetterSetter(el.position, el.object3D.position);
        }
        if (el.object3D && el.object3D.rotation) {
            el.rotation = {};
            defineVector3GetterSetter(el.rotation, el.object3D.rotation);
        }
        if (el.object3D && el.object3D.scale) {
            el.scale = {};
            defineVector3GetterSetter(el.scale, el.object3D.scale);
        }
    };

    var animRun = function (anim) {
        if (!anim || !anim.conf) return;

        if (!this.hasLoaded) return this.addEventListener('loaded', function () {
            animRun.bind(this)(anim);
        });

        var system = this.sceneEl && this.sceneEl.systems['afbcAnim'];
        if (!system) {
            return setTimeout(function () {
                animRun.bind(this)(anim);
            }, 100);
        }

        var animIdx = Date.now() + Math.round(10000 * Math.random());
        var currConf = anim.conf;
        currConf['currRepeat' + animIdx] = 0;
        AnimRealRun.bind(this)(currConf, null, animIdx);
    }
    var animPause = function () {
        if (!this.hasLoaded) return this.addEventListener('loaded', function () {
            animPause.bind(this)();
        });

        var system = this.sceneEl && this.sceneEl.systems['afbcAnim'];
        if (!system) {
            return setTimeout(function () {
                animPause.bind(this)();
            }, 100);
        }

        system.pause(this);
    };
    var animResume = function () {
        if (!this.hasLoaded) return this.addEventListener('loaded', function () {
            animResume.bind(this)();
        });

        var system = this.sceneEl && this.sceneEl.systems['afbcAnim'];
        if (!system) {
            return setTimeout(function () {
                animResume.bind(this)();
            }, 100);
        }

        system.resume(this);
    };
    var extendFunctions = function (el) { // add extend functions to the el
        el.addAnEntity = addAnEntity.bind(el);
        el.addEntities = addEntities.bind(el);
        el.createAnEntity = createAnEntity.bind(el);
        el.removeAnEntity = removeAnEntity.bind(el);
        el.removeEntities = removeEntities.bind(el);
        el.removeMe = removeMe.bind(el);
        el.setAttributes = function (attributes) {
            setAttributes(el, attributes);
        };
        addQuickAttributes(el);

        el.animRun = animRun.bind(el);
        el.animPause = animPause.bind(el);
        el.animResume = animResume.bind(el);
        return el;
    };


    AFRAME.extScenes = {}; // store all the scenes
    AFRAME.extCurrScene = null; // curring running scene on the web

    // a-loader-title
    AFRAME.createAScene = function (parm) { // add a scene. only to the list, not du anything
        AFRAME.extScenes[parm.id] = parm;
        return this;
    };
    AFRAME.loadScene = function (sceneId) { // start to load a scene to the web
        // 0. if there is a sceen running, remove it
        if (this.extCurrScene) this.extCurrScene.removeMe();

        // 1. create a default scene
        var el = document.createElement('a-scene');
        extendFunctions(el);
        var parm = this.extScenes[sceneId];
        if (!parm) return console.error('No scene: ' + sceneId);
        document.body.appendChild(el);
        if (parm.onRemove) el.onRemove = parm.onRemove.bind(parm);
        this.extCurrScene = el;

        // 2. set attributes
        var attributes = parm.attributes || {};
        if (typeof attributes == 'function') attributes = attributes();
        attributes.id = sceneId;
        setAttributes(el, attributes);

        // 3. add assets
        el.addAnEntity('a-assets', { id: 'assets' });
        el.assets = new Assets('#assets');
        // auto add the default assets
        var assets = parm.assets || {};
        if (typeof assets == 'function') assets = assets();
        el.assets.addList(assets);

        // 4 add children
        el.addEntities(parm.children)

        // 5. call onInit functoin to add other entities
        if (parm.onInit) parm.onInit.bind(parm)(el);

        // 6. waiting all assets are loaded
        el.assets.load(function () { // need to check where all things are loaded
            var run = function () {
                parm.onLoaded && parm.onLoaded.bind(parm)(el);
            }.bind(this);

            if (el.hasLoaded) run();
            else el.addEventListener('loaded', run);

        }, parm.onLoading && parm.onLoading.bind(parm));
    }


    // for Assets class
    var addAssetsEventListener = function (el, tag, callback) { // not handle error situation. maybe next version
        if (!callback) return; // do not need to know when it is loaded

        var func = function () {
            el.removeEventListener(el._eventName, func);
            delete el._eventName;
            var cb = callback
            callback = null;
            cb();
        };
        if (tag == 'script') { // special to handle
            return el.onload = function () {
                delete el.onload;
                var cb = callback
                callback = null;
                cb();
            }
        }
        if (tag == 'img') el._eventName = 'load';
        else if (tag == 'audio' || tag == 'video') el._eventName = 'loadeddata';
        else el._eventName = 'loaded';

        el.addEventListener(el._eventName, func)
    };

    var Assets = function (id) {
        this.id = id;
        this.list = {};
    };

    Assets.prototype.add = function () {
        var parm = standardEntiyParm.apply(standardEntiyParm, arguments);
        if (!parm.attributes.crossorigin) parm.attributes.crossorigin = 'anonymous'; // not confirm
        var tag = parm.tag;
        var assetsEl = $(this.id);
        var el = assetsEl.addAnEntity(parm);
        this.list[tag] = el;
        return this;
    };
    Assets.prototype.addList = function (list) {
        if (!list) return;

        if (Array.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                this.add(list[i]);
            }
        } else { // 对象方式，这个时候，可能有id做标签
            for (var tag in list) {
                this.add(tag, list[tag]);
            }
        }
        return this;
    };
    Assets.prototype.load = function (cb, progressCb) {
        var list = this.list;
        this.list = {};
        var num = 0;
        for (var i in list) num++;
        if (num < 1) return cb && cb();

        var realCb = afterAllCallback(num, function () {
            cb && cb();
        }, progressCb);

        for (var tag in list) addAssetsEventListener(list[tag], tag, realCb);

        return this;
    };



    // some extend components ========================
    AFRAME.registerComponent('f-click-to-scene', {
        schema: {
            scene: { type: 'string' }
        },

        init: function () {
            this.el.addEventListener('click', this.loadScene.bind(this));
        },
        loadScene: function () {
            AFRAME.loadScene(this.data.scene);
        },
        remove: function () {
            this.el.removeEventListener('click', this.loadScene.bind(this));
        }
    });

    // load the default scene define in body attribute
    document.addEventListener('DOMContentLoaded', function () {
        document.removeEventListener('DOMContentLoaded', arguments.callee, false);

        var defaultScene = document.body.getAttribute('scene');
        if (defaultScene) AFRAME.loadScene(defaultScene);

    }, false);


    // for animation =========================
    AFRAME.registerSystem('afbcAnim', {
        init: function () {
            this.list = [];
        },
        addAnim: function (idx, anim, target) {
            this.list.push({ idx: idx, anim: anim, target: target });
        },
        removeAnim: function (idx) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].idx == idx) {
                    this.list.splice(i, 1);
                }
            }
        },
        removeAnimByTarget: function (target) {
            for (i = this.list.length - 1; i > -1; i--) {
                if (this.list[i].target == target) {
                    this.list.splice(i, 1);
                }
            }
        },
        pause: function (target) {
            target.isAnimPause = true;
            for (i = this.list.length - 1; i > -1; i--) {
                if (this.list[i].target == target) {
                    this.list[i].anim.pause();
                }
            }
        },
        resume: function (target) {
            target.isAnimPause = false;
            for (i = this.list.length - 1; i > -1; i--) {
                if (this.list[i].target == target) {
                    this.list[i].anim.play();
                }
            }
        },
        tick: (function () {
            var i;
            return function (ms) {
                if (this.list.length) {
                    for (i = this.list.length - 1; i > -1; i--) {
                        if (this.list[i].target.isAnimPause) return;
                        this.list[i].anim.tick(ms);
                    }
                }
            }
        })(),
    });


    var Anim = function () { this.conf = null; };
    AFRAME.anim = function () { return new Anim(); };
    var checkEpsilon = function (vec3) {
        if (Math.abs(vec3.x) < Number.EPSILON) vec3.x = 0;
        if (Math.abs(vec3.y) < Number.EPSILON) vec3.y = 0;
        if (Math.abs(vec3.z) < Number.EPSILON) vec3.z = 0;
    };
    AnimRealRun = function (conf, cb, animIdx) {
        if (conf._repeat > -1 && conf['currRepeat' + animIdx] >= conf._repeat) {
            delete conf['currRepeat' + animIdx];
            delete conf['_from' + animIdx];
            delete conf['_to' + animIdx];
            return cb && cb(); // 循环结束了
        }
        var realRun = AnimRealRun.bind(this);
        var system = this.sceneEl.systems['afbcAnim'];

        conf['currRepeat' + animIdx]++;
        switch (conf.type) {
            case 'sequence': {
                if (typeof conf['sequenceIdx' + animIdx] == 'undefined') conf['sequenceIdx' + animIdx] = 0;
                var aConf = conf._sequence[conf['sequenceIdx' + animIdx]];
                conf['sequenceIdx' + animIdx]++;
                if (aConf) {
                    conf['currRepeat' + animIdx]--;
                    aConf['currRepeat' + animIdx] = 0;
                    realRun(aConf, function () {
                        realRun(conf, cb, animIdx);
                    }, animIdx);
                } else {
                    conf['sequenceIdx' + animIdx] = 0;
                    realRun(conf, cb, animIdx);
                }
                break;
            }
            case 'spawn': {
                if (conf._spawn.length < 1) return realRun(conf, cb, animIdx);
                var callback = afterAllCallback(conf._spawn.length, function () {
                    realRun(conf, cb, animIdx);
                });
                for (var i = 0; i < conf._spawn.length; i++) {
                    conf._spawn[i]['currRepeat' + animIdx] = 0;
                    realRun(conf._spawn[i], callback, animIdx);
                }
                break;
            }
            case 'cb': {
                // conf['currRepeat' + animIdx] = 0;
                conf.cb && conf.cb.bind(conf.taget)();
                realRun(conf, cb, animIdx);
                // cb && cb();
                break;
            }
            case 'delay': {
                setTimeout(function () {
                    realRun(conf, cb, animIdx);
                }, conf._delay);
                break;
            }
            case 'fadeOut':
            case 'fadeIn':
            case 'fadeTo': {
                var idx = Date.now() + Math.round(10000 * Math.random());
                var config = conf.getConfig();

                // opacity need transparent is set to true;
                var m = (this.object3DMap && this.object3DMap.mesh && this.object3DMap.mesh.material) || (this.components && this.components.material && this.components.material.material);
                if (!m) return cb && cb();

                if (Array.isArray(m)) m.forEach(function (one) { one.transparent = true; })
                else m.transparent = true;

                var from, to;
                if (conf._reverse && conf['currRepeat' + animIdx] % 2 == 0) { // 需要反转
                    to = conf['_from' + animIdx];
                    from = conf['_to' + animIdx];
                } else {
                    from = conf.from;
                    to = conf.to;
                    if (typeof from == 'undefined') from = Array.isArray(m) ? m[0].opacity : m.opacity;
                }

                config.opacity = [from, to];

                conf['_from' + animIdx] = from;
                conf['_to' + animIdx] = to;

                config.targets = m;
                config.complete = function () {
                    system.removeAnim(idx);
                    realRun(conf, cb, animIdx);
                };

                system.addAnim(idx, AFRAME.ANIME(config), this);
                break;
            }
            case 'move':
            case 'moveTo':
            case 'moveBy': {
                var idx = Date.now() + Math.round(10000 * Math.random());
                var config = conf.getConfig();

                // opacity need transparent is set to true;
                var t = this.object3D && this.object3D.position;
                if (!t) return cb && cb();

                var from, to;
                if (conf._reverse && conf['currRepeat' + animIdx] % 2 == 0) { // 需要反转
                    to = conf['_from' + animIdx];
                    from = conf['_to' + animIdx];
                } else {
                    from = conf.from && new THREE.Vector3().copy(conf.from);
                    to = conf.to && new THREE.Vector3().copy(conf.to);
                    if (!from) from = new THREE.Vector3().copy(t);
                    if (!to) to = new THREE.Vector3().copy(t).add(conf.by);
                }

                checkEpsilon(from);
                checkEpsilon(to);

                config.x = [from.x, to.x];
                config.y = [from.y, to.y];
                config.z = [from.z, to.z];

                conf['_from' + animIdx] = from;
                conf['_to' + animIdx] = to;

                config.targets = t;
                config.complete = function () {
                    system.removeAnim(idx);
                    realRun(conf, cb, animIdx);
                };

                system.addAnim(idx, AFRAME.ANIME(config), this);
                break;
            }
            case 'scale':
            case 'scaleTo':
            case 'scaleBy': {
                var idx = Date.now() + Math.round(10000 * Math.random());
                var config = conf.getConfig();

                // opacity need transparent is set to true;
                var t = this.object3D && this.object3D.scale;
                if (!t) return cb && cb();

                var from, to;
                if (conf._reverse && conf['currRepeat' + animIdx] % 2 == 0) { // 需要反转
                    to = conf['_from' + animIdx];
                    from = conf['_to' + animIdx];
                } else {
                    from = conf.from && new THREE.Vector3().copy(conf.from);
                    to = conf.to && new THREE.Vector3().copy(conf.to);
                    if (!from) from = new THREE.Vector3().copy(t);
                    if (!to) to = new THREE.Vector3().copy(t).add(conf.by);
                }

                checkEpsilon(from);
                checkEpsilon(to);

                config.x = [from.x, to.x];
                config.y = [from.y, to.y];
                config.z = [from.z, to.z];

                conf['_from' + animIdx] = from;
                conf['_to' + animIdx] = to;

                config.targets = t;
                config.complete = function () {
                    system.removeAnim(idx);
                    realRun(conf, cb, animIdx);
                };

                system.addAnim(idx, AFRAME.ANIME(config), this);
                break;
            }
            case 'rotation':
            case 'rotationTo':
            case 'rotationBy': {
                var idx = Date.now() + Math.round(10000 * Math.random());
                var config = conf.getConfig();

                // opacity need transparent is set to true;
                var t = this.object3D && this.object3D.rotation;
                if (!t) return cb && cb();

                var from, to;
                if (conf._reverse && conf['currRepeat' + animIdx] % 2 == 0) { // 需要反转
                    to = conf['_from' + animIdx];
                    from = conf['_to' + animIdx];
                } else {
                    from = conf.from && new THREE.Vector3().copy(conf.from);
                    to = conf.to && new THREE.Vector3().copy(conf.to);
                    if (!from) from = new THREE.Vector3().copy(t);
                    if (!to) to = new THREE.Vector3().copy(t).add(conf.by);
                }

                checkEpsilon(from);
                checkEpsilon(to);

                config.x = [from.x, to.x];
                config.y = [from.y, to.y];
                config.z = [from.z, to.z];

                conf['_from' + animIdx] = from;
                conf['_to' + animIdx] = to;

                config.targets = t;
                config.complete = function () {
                    system.removeAnim(idx);
                    realRun(conf, cb, animIdx);
                };

                system.addAnim(idx, AFRAME.ANIME(config), this);
                break;
            }
            case 'color':
            case 'colorTo':
            case 'colorBy': {
                var idx = Date.now() + Math.round(10000 * Math.random());
                var config = conf.getConfig();

                // opacity need transparent is set to true;
                var m = (this.object3DMap && this.object3DMap.mesh && this.object3DMap.mesh.material) || (this.components && this.components.material && this.components.material.material);
                if (!m) return cb && cb();

                var t = [];
                if (Array.isArray(m)) m.forEach(function (one) { t.push(one.color) })
                else t.push(m.color)

                var from, to;
                if (conf._reverse && conf['currRepeat' + animIdx] % 2 == 0) { // 需要反转
                    to = conf['_from' + animIdx];
                    from = conf['_to' + animIdx];
                } else {
                    from = conf.from && new THREE.Color().copy(conf.from);
                    to = conf.to && new THREE.Color().copy(conf.to);
                    if (!from) from = new THREE.Color().copy(t[0]);
                    if (!to) to = new THREE.Color().copy(t[0]).add(conf.by);
                }

                config.r = [from.r, to.r];
                config.g = [from.g, to.g];
                config.b = [from.b, to.b];

                conf['_from' + animIdx] = from;
                conf['_to' + animIdx] = to;

                config.targets = t;
                config.complete = function () {
                    system.removeAnim(idx);
                    realRun(conf, cb, animIdx);
                };

                system.addAnim(idx, AFRAME.ANIME(config), this);
                break;
            }
        }
    };

    Anim.prototype.fadeOut = function (dur) {
        return this.conf = new AnimConf().setDuration(dur).setFrom(1).setTo(0).setType('fadeOut');
    };
    Anim.prototype.fadeIn = function (dur) {
        return this.conf = new AnimConf().setDuration(dur).setFrom(0).setTo(1).setType('fadeIn');
    };
    Anim.prototype.fadeTo = function (dur, opacity) {
        return this.conf = new AnimConf().setDuration(dur).setTo(opacity).setType('fadeTo');
    };
    Anim.prototype.move = function (dur, from, to) {
        return this.conf = new AnimConf().setDuration(dur).setFrom(from).setTo(to).setType('move');
    };
    Anim.prototype.moveTo = function (dur, to) {
        return this.conf = new AnimConf().setDuration(dur).setTo(to).setType('moveTo');
    };
    Anim.prototype.moveBy = function (dur, by) {
        return this.conf = new AnimConf().setDuration(dur).setBy(by).setType('moveBy');
    };
    Anim.prototype.scale = function (dur, from, to) {
        return this.conf = new AnimConf().setDuration(dur).setFrom(from).setTo(to).setType('scale');
    };
    Anim.prototype.scaleTo = function (dur, to) {
        return this.conf = new AnimConf().setDuration(dur).setTo(to).setType('scaleTo');
    };
    Anim.prototype.scaleBy = function (dur, by) {
        return this.conf = new AnimConf().setDuration(dur).setBy(by).setType('scaleBy');
    };
    var deg2Rad = Math.PI / 180;
    Anim.prototype.rotation = function (dur, from, to) {
        from = { x: from.x * deg2Rad, y: from.y * deg2Rad, z: from.z * deg2Rad };
        to = { x: to.x * deg2Rad, y: to.y * deg2Rad, z: to.z * deg2Rad };
        return this.conf = new AnimConf().setDuration(dur).setFrom(from).setTo(to).setType('rotation');
    };
    Anim.prototype.rotationTo = function (dur, to) {
        to = { x: to.x * deg2Rad, y: to.y * deg2Rad, z: to.z * deg2Rad };
        return this.conf = new AnimConf().setDuration(dur).setTo(to).setType('rotationTo');
    };
    Anim.prototype.rotationBy = function (dur, by) {
        by = { x: by.x * deg2Rad, y: by.y * deg2Rad, z: by.z * deg2Rad };
        return this.conf = new AnimConf().setDuration(dur).setBy(by).setType('rotationBy');
    };

    var formatColor = function (color) {
        if (typeof color != 'object') return new THREE.Color(color);
        return { r: color.r / 255, g: color.g / 255, b: color.b / 255 };
    }
    Anim.prototype.color = function (dur, from, to) {
        from = formatColor(from);
        to = formatColor(to);
        return this.conf = new AnimConf().setDuration(dur).setFrom(from).setTo(to).setType('color');
    };
    Anim.prototype.colorTo = function (dur, to) {
        to = formatColor(to);
        return this.conf = new AnimConf().setDuration(dur).setTo(to).setType('colorTo');
    };
    Anim.prototype.colorBy = function (dur, by) {
        by = formatColor(by);
        return this.conf = new AnimConf().setDuration(dur).setBy(by).setType('colorBy');
    };
    Anim.prototype.cb = function (cb, target) {
        return this.conf = new AnimConf().setCb(cb, target).setType('cb');
    };
    Anim.prototype.delay = function (s) {
        return this.conf = new AnimConf().delay(s).setType('delay');
    };
    Anim.prototype.sequence = function () {
        return this.conf = new AnimConf().sequence(arguments).setType('sequence');
    };
    Anim.prototype.spawn = function () {
        return this.conf = new AnimConf().spawn(arguments).setType('spawn');
    };

    var AnimConf = function () {
        this._repeat = 1;
        // this.type
        // this.duration
        // this.from
        // this.to
        // this.by
        // this.cb
        // this._delay
        // this._reverse
        // this.easing
        // this.currRepeat
        // this._sequence
        // this.sequenceIdx
    };
    AnimConf.prototype.getConfig = function () {
        var config = {
            autoplay: false,
            direction: 'normal',
            duration: 1000, // dur;
            easing: 'linear', // 'easeInOutQuad',
            elasticity: 400,
            loop: 0,
            round: false,
        };
        for (var i in config) {
            if (typeof this['_' + i] != 'undefined') config[i] = this['_' + i];
        }
        return config;
    };
    AnimConf.prototype.setType = function (type) {
        this.type = type;
        return this;
    };
    AnimConf.prototype.setDuration = function (ms) {
        this._duration = parseInt(ms);
        return this;
    };
    AnimConf.prototype.setFrom = function (from) {
        this.from = from;
        return this;
    };
    AnimConf.prototype.setTo = function (to) {
        this.to = to;
        return this;
    };
    AnimConf.prototype.setBy = function (by) {
        this.by = by;
        return this;
    };
    AnimConf.prototype.setCb = function (cb, taget) {
        this.cb = cb;
        this.taget = taget;
        return this;
    };
    AnimConf.prototype.delay = function (s) {
        this._delay = s;
        return this;
    };
    AnimConf.prototype.reverse = function (r) {
        this._reverse = true;
        return this;
    };
    AnimConf.prototype.sequence = function (list) {
        var _sequence = this._sequence = [];
        for (var i = 0; i < list.length; i++) {
            _sequence.push(list[i]);
        }
        return this;
    };
    AnimConf.prototype.spawn = function (list) {
        var _spawn = this._spawn = [];
        for (var i = 0; i < list.length; i++) {
            _spawn.push(list[i]);
        }
        return this;
    };
    AnimConf.prototype.repeat = function (num) {
        this._repeat = num;
        return this;
    };
    AnimConf.prototype.repeatForever = function () {
        this._repeat = -1;
        return this;
    };
    ['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
        'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
        'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
        'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInBack', 'easeOutBack', 'easeInOutBack',
        'easeInElastic', 'easeOutElastic', 'easeInOutElastic'].forEach(function (one) {
            AnimConf.prototype[one] = function () {
                this._easing = one;
                return this;
            };
        })
})(window);