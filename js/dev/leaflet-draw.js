//* Drawing ===================================================================== //
map.addLayer(drawnItems);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw : {
            polyline : {
                metric : false,
                shapeOptions: {
                    color: markerColor,
                    weight: 3
                }
            },
            polygon : false,
            rectangle : false,
            circle : false,
            marker : false
        }
    });

    map.addControl(drawControl);

    // Draw created
    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;

        layer.bindPopup('Custom Route');
        drawnItems.addLayer(layer);
        print(layer);
    });

    // Line title text
    L.drawLocal.draw.toolbar.buttons.polyline = "Draw a custom route";
    L.drawLocal.draw.handlers.polyline.tooltip.cont = "Click to continue drawing route"
    L.drawLocal.draw.handlers.polyline.tooltip.start = "Click to start drawing route";
    L.drawLocal.draw.handlers.polyline.tooltip.end = "Click last point to finish route";