define(() => {

    var csv = "KimkiKamil";

    function createSideBar(changePointCount, changeMinimumDistance, changeMaximumConnections, limitConnections, showPoints, showLines, rotateBox, randomMove, loadFileAsText) {

        var sidebarDiv = document.getElementById("sidebar");
        sidebarDiv.className = "sidebar";
        var divCanvas = document.getElementById("canvas");
        divCanvas.className = "pad";

        //fill window
        var windowHeight = window.innerHeight;
        var divCanvasHeight = windowHeight;

        //set sidebar and pad sizes and store in 
        divCanvas.setAttribute("style", "height:" + divCanvasHeight + "px;");
        sidebarDiv.setAttribute("style", "min-height:" + divCanvasHeight + "px;");

        var e = document.createElement("SPAN");
        e.className = "title";
        e.innerHTML = "Point Box";
        e.innerHTML += '<span class="n">ITU</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // Point Count
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Point Count";
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", defaultSettings.pointCount);
        e.setAttribute("id", "pointCount");
        e.addEventListener('change', function (evt) {
            var pointCount = parseInt(document.getElementById("pointCount").value);
            if (pointCount >= 1000) {
                return;
            }
            changePointCount(document.getElementById("pointCount").value);
        });
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);


        // Minimum Distance
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Maximum Distance";
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", defaultSettings.minimumDistance);
        e.setAttribute("id", "minimumDistance");
        e.addEventListener('change', function (evt) {
            changeMinimumDistance(document.getElementById("minimumDistance").value);
        });
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);


        // Connection Limit
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Connection Limit";
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "checkbox");
        e.checked = defaultSettings.limitConnections;
        // e.setAttribute("checked", defaultSettings.limitConnections);
        e.setAttribute("id", "limitConnections");
        e.addEventListener('change', function (evt) {
            limitConnections(document.getElementById("limitConnections").checked);
        });
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);


        // Maximum Connection
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Maximum Connection";
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", defaultSettings.maximumConnections);
        e.setAttribute("id", "maximumConnections");
        e.addEventListener('change', function (evt) {
            changeMaximumConnections(document.getElementById("maximumConnections").value);
        });
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);



        // Show Point
        var button = makeButton("showPoints", "small", "showPoints", false, defaultSettings.showPoints);
        var image = makeImage("showIcon", "edit", "img/point.png");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var element = document.getElementById("showPoints");
            if (element.value === "true") {
                element.setAttribute("class", "small");
                element.value = "false";
                showPoints(false);
            } else {
                element.setAttribute("class", "selected");
                element.value = "true";
                showPoints(true);
            }
        });


        // Show Line
        var button = makeButton("showLines", "small", "showLines", false, defaultSettings.showLines);
        var image = makeImage("linesIcon", "edit", "img/lines.png");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var element = document.getElementById("showLines");
            if (element.value === "true") {
                element.setAttribute("class", "small");
                element.value = "false";
                showLines(false);
            } else {
                element.setAttribute("class", "selected");
                element.value = "true";
                showLines(true);
            }
        });

        // Rotate
        var button = makeButton("rotateBox", "small", "rotateBox", false, defaultSettings.rotateBox);
        var image = makeImage("rotateBoxIcon", "edit", "img/rotate.png");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var element = document.getElementById("rotateBox");
            if (element.value === "true") {
                element.setAttribute("class", "small");
                element.value = "false";
                rotateBox(false);
            } else {
                element.setAttribute("class", "selected");
                element.value = "true";
                rotateBox(true);
            }
        });


        // Random Move
        var button = makeButton("randomMove", "small", "randomMove", false, defaultSettings.rondamMove);
        var image = makeImage("rondamMoveIcon", "edit", "img/camera.png");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var element = document.getElementById("randomMove");
            if (element.value === "true") {
                element.setAttribute("class", "small");
                element.value = "false";
                randomMove(false);
            } else {
                element.setAttribute("class", "selected");
                element.value = "true";
                randomMove(true);
            }
        });



        // Load File
        var button = makeButton("loadFile", "small", "loadFile", false, null);
        var image = makeImage("loadFileIcon", "edit", "img/upload.png");
        var inputFile = document.createElement("INPUT");
        inputFile.className = "file";
        inputFile.setAttribute("type", "file");
        inputFile.setAttribute("id", "inputFile");
        button.appendChild(inputFile);
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var element = document.getElementById("inputFile");
            element.click();
        });
        inputFile.addEventListener("change", () => {
            console.log("yuklendi");
            loadFileAsText();
        })

        e = document.createElement("A");
        e.setAttribute("id", "a2");
        sidebarDiv.appendChild(e);

        //Download File
        var button = makeButton("downloadFile", "small", "downloadFile", false, null);
        var image = makeImage("downloadFileIcon", "edit", "img/download.png");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            var data = new Blob([csv]);
            var a2 = document.getElementById("a2");
            a2.setAttribute("download", "data.txt");
            a2.href = URL.createObjectURL(data);
            a2.click();
        });
    }


    function setData(data) {
        csv = data;
    }

    function makeButton(id, className, title, text, value) {
        var button = document.createElement("BUTTON");
        if (className) {
            button.setAttribute("class", className);
        }
        if (id) {
            button.setAttribute("id", id);
        }
        if (title) {
            button.setAttribute("title", title);
        }
        if (text) {
            button.innerHTML = text;
        }
        button.value = value;
        return button;
    }

    function makeImage(id, className, src) {
        var i = document.createElement("IMG");
        if (className) {
            i.setAttribute("class", className);
        }
        if (id) {
            i.setAttribute("id", id);
        }
        if (src) {
            i.setAttribute("src", src);
        }
        return i;
    }

    return {
        createSideBar,
        setData,
    };
});