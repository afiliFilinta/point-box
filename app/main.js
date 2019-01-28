define(function (require) {

    var gui = require('./gui');

    var group;
    var container;
    var pointsData = [];
    var camera, scene, renderer;
    var positions, colors;
    var points;
    var pointCloud;
    var pointPositions;
    var linesMesh;

    var data = "x, y, z, velocityX, velocityY, velocityZ\n";

    var maxPointCount = 1000;
    var pointCount = 500;
    var r = 800;
    var rHalf = r / 2;

    var settings = Object.assign({}, defaultSettings);

    init();
    animate();

    function init() {

        gui.createSideBar(changePointCount, changeMinimumDistance, changeMaximumConnections, limitConnections, showPoints, showLines, rotateBox, randomMove, loadFileAsText);

        container = document.getElementById('canvas');

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.z = 1750;
        var controls = new THREE.OrbitControls(camera, container);
        scene = new THREE.Scene();

        group = new THREE.Group();
        scene.add(group);

        var helper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxBufferGeometry(r, r, r)));
        helper.material.color.setHex(0x080808);
        helper.material.blending = THREE.AdditiveBlending;
        helper.material.transparent = true;
        group.add(helper);

        var segments = maxPointCount * maxPointCount;

        positions = new Float32Array(segments * 3);
        colors = new Float32Array(segments * 3);

        var pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false
        });

        points = new THREE.BufferGeometry();
        pointPositions = new Float32Array(maxPointCount * 3);

        for (var i = 0; i < maxPointCount; i++) {

            var x = Math.random() * r - r / 2;
            var y = Math.random() * r - r / 2;
            var z = Math.random() * r - r / 2;

            pointPositions[i * 3] = x;
            pointPositions[i * 3 + 1] = y;
            pointPositions[i * 3 + 2] = z;

            var velocityX = -1 + Math.random() * 2;
            var velocityY = -1 + Math.random() * 2;
            var velocityZ = -1 + Math.random() * 2;

            // add it to the geometry
            pointsData.push({
                velocity: new THREE.Vector3(velocityX, velocityY, velocityZ),
                numConnections: 0
            });

            data += x + ", " + y + ", " + z + ", " + velocityX + ", " + velocityY + ", " + velocityZ + "\n";
        }
        gui.setData(data);

        points.setDrawRange(0, pointCount);
        points.addAttribute('position', new THREE.BufferAttribute(pointPositions, 3).setDynamic(true));

        pointCloud = new THREE.Points(points, pMaterial);
        pointCloud.visible = defaultSettings.showPoints;
        group.add(pointCloud);

        var geometry = new THREE.BufferGeometry();

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

        geometry.computeBoundingSphere();

        geometry.setDrawRange(0, 0);

        var material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        linesMesh = new THREE.LineSegments(geometry, material);
        linesMesh.visible = defaultSettings.showLines;
        group.add(linesMesh);

        //

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        container.appendChild(renderer.domElement);

        //
        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

        var vertexpos = 0;
        var colorpos = 0;
        var numConnected = 0;

        for (var i = 0; i < pointCount; i++)
            pointsData[i].numConnections = 0;

        for (var i = 0; i < pointCount; i++) {

            // get the particle
            var particleData = pointsData[i];

            if (settings.rondamMove) {
                pointPositions[i * 3] += particleData.velocity.x;
                pointPositions[i * 3 + 1] += particleData.velocity.y;
                pointPositions[i * 3 + 2] += particleData.velocity.z;

                if (pointPositions[i * 3 + 1] < -rHalf || pointPositions[i * 3 + 1] > rHalf)
                    particleData.velocity.y = -particleData.velocity.y;

                if (pointPositions[i * 3] < -rHalf || pointPositions[i * 3] > rHalf)
                    particleData.velocity.x = -particleData.velocity.x;

                if (pointPositions[i * 3 + 2] < -rHalf || pointPositions[i * 3 + 2] > rHalf)
                    particleData.velocity.z = -particleData.velocity.z;
            }

            if (settings.limitConnections && particleData.numConnections >= settings.maximumConnections)
                continue;

            for (var j = i + 1; j < pointCount; j++) {

                var particleDataB = pointsData[j];
                if (settings.limitConnections && particleDataB.numConnections >= settings.maximumConnections)
                    continue;

                var dx = pointPositions[i * 3] - pointPositions[j * 3];
                var dy = pointPositions[i * 3 + 1] - pointPositions[j * 3 + 1];
                var dz = pointPositions[i * 3 + 2] - pointPositions[j * 3 + 2];
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < settings.minimumDistance) {

                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    var alpha = 1.0 - dist / settings.minimumDistance;

                    positions[vertexpos++] = pointPositions[i * 3];
                    positions[vertexpos++] = pointPositions[i * 3 + 1];
                    positions[vertexpos++] = pointPositions[i * 3 + 2];

                    positions[vertexpos++] = pointPositions[j * 3];
                    positions[vertexpos++] = pointPositions[j * 3 + 1];
                    positions[vertexpos++] = pointPositions[j * 3 + 2];

                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;

                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;

                    numConnected++;

                }

            }

        }


        linesMesh.geometry.setDrawRange(0, numConnected * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;

        pointCloud.geometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animate);
        render();

    }

    function render() {

        var time = Date.now() * 0.001;
        if (settings.rotateBox) {
            group.rotation.y = time * 0.1;
        }
        renderer.render(scene, camera);

    }

    function changePointCount(value) {
        pointCount = parseInt(value);
        settings.pointCount = pointCount;
        points.setDrawRange(0, pointCount);
    }

    function changeMinimumDistance(value) {
        settings.minimumDistance = parseInt(value);
    }

    function changeMaximumConnections(value) {
        settings.maximumConnections = parseInt(value);
    }

    function limitConnections(value) {
        settings.limitConnections = value;
    }

    function showPoints(value) {
        settings.showPoints = value;
        pointCloud.visible = value;
    }

    function showLines(value) {
        settings.showLines = value;
        linesMesh.visible = value;
    }

    function rotateBox(value) {
        settings.rotateBox = value;
    }

    function randomMove(value) {
        settings.rondamMove = value;
    }

    function loadFileAsText() {
        var fileToLoad = document.getElementById("inputFile").files[0];

        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            console.log(textFromFileLoaded);
        };

        fileReader.readAsText(fileToLoad, "UTF-8");
    }
});