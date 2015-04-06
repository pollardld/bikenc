//  Map  ** ============================================================== //
L.mapbox.accessToken = 'pk.eyJ1IjoiYWx0YXBsYW5uaW5nIiwiYSI6InhqNzQwRW8ifQ.mlA6eN3JguZL_UkEV9WlMA';

var map = L.mapbox.map( 'map', 'altaplanning.k8ndphm6', {
    maxZoom: 18,
    minZoom: 6,
    scrollWheelZoom : false
}).setView( [35.485, -78.9], 8);

// global variables
var infobox = document.getElementById('single-infobox'),
    markerColor = '#ef4638',
    grey = '#b8b8b8',
    chart,
    routeCitiesLayer;

// Which Route is page
var routePath;

if ( document.body.classList.contains( 'nc2-mountains-to-sea' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_two/nc_two.geojson';
} else if ( document.body.classList.contains( 'nc3-ports-of-call' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_three/nc_three.geojson';
} else if ( document.body.classList.contains( 'nc4-north-line-trace' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_four/nc_four.geojson';
} else if ( document.body.classList.contains( 'nc5-cape-fear-run' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_five/nc_five.geojson';
} else if ( document.body.classList.contains( 'nc6-piedmont-spur' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_six/nc_six.geojson';
} else if ( document.body.classList.contains( 'nc7-ocracoke-option' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_seven/nc_seven.geojson';
} else if ( document.body.classList.contains( 'nc8-southern-highlands' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/nc_eight/nc_eight.geojson';
} else if ( document.body.classList.contains( 'us1-carolina-connection' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/us_one/us_one.geojson';
} else if ( document.body.classList.contains( 'nc9-sandhills-sector' ) ) {
    routePath = '/wp-content/themes/walkbikenc/json/routes/sandhills/sandhills.geojson';
} else {
    routePath = '/wp-content/themes/walkbikenc/json/routes/routes.geojson';
}

var geojsonLayer = new L.GeoJSON.AJAX( routePath, {
    style: getStyle,
    onEachFeature: onEachFeature
}).addTo(map);

//* Add info control instead of bar attribution ============================================================ //
map.addControl( L.mapbox.infoControl() );
map.attributionControl.removeFrom( map );

//* Elevation Marker =============================================== //
var ll = [];
var elMarker = L.marker([0, 0], {
    icon: L.divIcon({
        className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
        iconSize: new L.Point(14, 14)
    })
}).addTo(map);

//  Functions  ** ============================================================== //
function getStyle(feature) {
    return {
        weight: 5,
        opacity: 0.5,
        color: feature.properties.color,
        lineJoin : 'round'
    };
}

function onEachFeature(feature, layer) {
    map.fitBounds( layer.getBounds() );
    routeLayer(layer);
};

function routeLayer(layer) {

    var feature = layer.feature,
        routeId = feature.properties.id,
        routeCities = feature.properties.cities,
        chartClass = feature.properties.id + '-chart',
        markerColor = feature.properties.color,
        markerNumber = feature.properties.number,
        routeDistance = feature.properties.distance,
        markerCoordinates = feature.properties.markerCoordinates,
        content = '<section class="spread content ' + feature.properties.id + '">' +
                    '<div class="span3">' +
                        '<h4><span>ROUTE:</span>' + feature.properties.name + '</h4>' +
                        '<h4><span>DISTANCE:</span>' + routeDistance + ' Miles</h4>' +
                        '<h4><span>DIFFICULTY:</span>' + feature.properties.difficulty + '</h4>' +
                        '<h4><span>START:</span>' + feature.properties.start + '</h4>' +
                        '<h4><span>FINISH:</span>' + feature.properties.finish + '</h4>' +
                    '</div>' +
                    '<div class="span9 elevation-wrap">' +
                        '<h4><span>ELEVATION:</span></h4>' +
                        '<span class="zoom-info">zoom in for more detail</span>' +
                        '<div class="elevation-chart ' + chartClass + '"></div>' +
                    '</div>' +
                  '</section>';

    // infobox content
    infobox.innerHTML = content;

    for ( var p in routeCities ) {

        var mc = markerColor,
            htmlM = "<div class='route-marker city-poi'><svg viewBox='0 0 14 18'><circle cx='7' cy='7.2' r='7' fill='" + markerColor + "' /><polyline fill='" + markerColor + "' points='4,12.8 7,17.8 10,12.8'/></svg></div>",
            anchor = [8,18],
            size = [14,18];

        if ( p === 'Start' ) {
            mc = '#ef4638';
            htmlM = "<div class='route-marker'><svg width='28' height='35'><circle cx='14' cy='14' r='14' fill='#ef4638'/><polyline fill='#ef4638' points='8,25 14,35 20,25'/></svg></div>";
            anchor = [14,35],
            size = [28,35];
        } else if ( p === 'Finish' ) {
            mc = '#474b4e';
            htmlM = "<div class='route-marker'><svg width='28' height='35'><circle cx='14' cy='14' r='14' fill='#474b4e'/><polyline fill='#474b4e' points='8,25 14,35 20,25'/></svg></div>";
            anchor = [14,35],
            size = [28,35];
        }

        L.marker( routeCities[p].reverse(), {
            icon: L.divIcon({
                className : 'icon-city',
                html : htmlM,
                iconAnchor : anchor,
                iconSize : size
            })
        })
        .bindPopup(p, {
            offset : [0,-18]
        })
        .addTo(map);
    }

    //  Charts  ** =========================================================== //
    chart = c3.generate({
        bindto: '.' + chartClass,
        data : {
            url : '/wp-content/themes/walkbikenc/json/elevation/' + routeId + '/index.json',
            mimeType: 'json',
            keys : {
                x : 'distance',
                value: [ 'elevation', 'lat', 'lng']
            },
            hide : ['lat', 'lng'],
            type : 'area',
            colors : {
                "elevation" : markerColor
            },
            onmouseover : function(d) {
                if ( d['name'] === 'lat' || d['name'] === 'lng' ) {
                    ll.push( d['value'] );
                }
                if ( ll.length === 2 ) {
                    elMarker.setLatLng(ll);
                }
            },
            onmouseout : function(d) {
                ll = [];
                elMarker.setLatLng([0,0]);
            }
        },
        padding: {
            left: 35,
            right: 10,
            bottom: 20
        },
        point: {
            show: false
        },
        axis: {
            x : {
                show : true,
                type: 'category',
                label: {
                    text : 'Distance (Miles)',
                    position: 'inner-right'
                },
                tick: {
                    fit: false,
                    outer: false,
                    centered: true,
                    width : 50
                }
            },
            y : {
                show : true,
                label : {
                    text : 'Elevation (ft)',
                    position : 'inner-top'
                },
                tick : {
                    outer : false
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        size : {
            height : 270
        },
        legend : {
            show : false
        },
        zoom: {
            enabled: true
        }
    });
}