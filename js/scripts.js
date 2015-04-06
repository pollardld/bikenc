//  Map  ** ============================================================== //
L.mapbox.accessToken = 'pk.eyJ1IjoiYWx0YXBsYW5uaW5nIiwiYSI6InhqNzQwRW8ifQ.mlA6eN3JguZL_UkEV9WlMA';

var map = L.mapbox.map( 'map', 'altaplanning.k8ndphm6', {
    maxZoom: 18,
    minZoom: 6,
    scrollWheelZoom : false
}).setView([35.485, -78.9], 8);

//* Add info control instead of bar attribution ============================================================ //
map.addControl( L.mapbox.infoControl() );
// map.attributionControl.removeFrom( map );

if ( window.innerWidth < 600 ) {
    map.setZoom( 6 );
} else if ( window.innerWidth < 900 ) {
    map.setZoom( 7 );
}

var geojsonLayer = new L.GeoJSON.AJAX( '/wp-content/themes/walkbikenc/json/routes/routes.geojson', {
    style: getStyle,
    onEachFeature: onEachFeature
}).addTo(map);

var infobox = document.getElementById('infobox'),
    markerLayer = L.mapbox.featureLayer().addTo(map),
    markerColor = '#ef4638',
    grey = '#b8b8b8';

markerLayer.on( 'layeradd', function(e) {
    var marker = e.layer,
        feature = marker.feature;

    marker.setIcon(L.divIcon(feature.properties.icon));
});

markerLayer.loadURL('/wp-content/themes/walkbikenc/json/markers/markers.geojson').addTo(map);

markerLayer.on( 'click', function(e) {
    e.layer.closePopup();
    map.panTo( e.layer.getLatLng() );
    mapInteraction(e);
});

map.addEventListener( 'click', clearRoute );

//  Overlay  ** =========================================================== //
var overlay = document.querySelector( '.map-overlay' );

function mapOverlay() {
    overlay.classList.add( 'collapse' );
}

function mapOverlayAdd() {
    overlay.classList.remove( 'collapse' );
}

//  Style  ** =========================================================== //
function getStyle(feature) {
    return {
        weight: 5,
        opacity: 0.8,
        color: grey,
        lineJoin : 'round'
    };
}

//  Features  ** =========================================================== //
function onEachFeature(feature, layer) {
    layer.addEventListener( 'click', function() { routeClick(layer) });
    // hover with jquery so we can remove it on click
    jQuery(layer).hover( function() {
        routeMouseOver(feature, layer);
    }, function() {
        routeMouseOut(feature, layer);
    });
    // re add events when clicked route is exited
    map.addEventListener( 'click', function() {
        jQuery(layer).hover( function() {
            routeMouseOver(feature, layer);
        }, function() {
            routeMouseOut(feature, layer);
        });
    });
};

function clearRoute() {
    infobox.innerHTML = '';

    // Add overlay back
    mapOverlayAdd();

    geojsonLayer.eachLayer( function(i) {
        if ( i._layers ) {
            i.eachLayer( function(x) {
                x._path.attributes.stroke.value = '#b8b8b8';
            });
        } else {
            i._path.attributes.stroke.value = '#b8b8b8';
        }
    });
    jQuery('.route-marker svg circle').css( 'fill', '#ef4638' );
    jQuery('.route-marker svg polyline').css( 'fill', '#ef4638' );
};

function mapInteraction(e) {
    jQuery('.route-marker svg circle').css( 'fill', markerColor );
    jQuery('.route-marker svg polyline').css( 'fill', markerColor );

    // Collapse overlay
    mapOverlay();

    var feature = e.layer.feature,
        routeId = feature.properties.id,
        chartClass = feature.properties.id + '-chart',
        markerColor = feature.properties.color,
        markerNumber = feature.properties.number,
        markerLng = feature.geometry.coordinates,
        content = '<section class="' + feature.properties.id + '"><div class="clear-infobox">X</div>' +
                  '<h4>' + feature.properties.title + '</h4>' +
                  '<span class="route-number">' + markerNumber + '</span>' +
                  '<svg class="popup-marker" width="28" height="35"><circle cx="14" cy="14" r="14" fill="' + markerColor + '" /><polyline fill="' + markerColor + '" points="8,25 14,35 20,25"/></svg>' +
                  '<div><strong>DISTANCE</strong>: ' + feature.properties.distance + ' Miles</div>' +
                  '<div><strong>DIFFICULTY</strong>: ' + feature.properties.difficulty + '</div>' +
                  '<div class="elevation"><strong>ELEVATION</strong><span></span></div>' +
                  '<div class="' + chartClass + '"></div>' +
                  '<div class="popup-img-wrapper"><img src="' + feature.properties.imageurl + '" class="popup-img" /></div>' +
                  '<div class="description">' + feature.properties.description + '</div>' +
                  '<div><a href="' + feature.properties.permalink + '" class="more-detail">FIND OUT MORE <span>&rsaquo;</span></a></div>' +
                  '</section>';

    markerLng = markerLng[0];
    markerLng = markerLng + 78.2;

    if ( markerLng > 0 ) {
        jQuery( '#infobox' ).css( 'left', 'auto' );
        jQuery( '#infobox' ).css( 'right', '10%' );
    } else {
        jQuery( '#infobox' ).css( 'left', '10%' );
        jQuery( '#infobox' ).css( 'right', 'auto' );
    }

    infobox.innerHTML = content;

    generateEleChart(chartClass, routeId, markerColor);

    e.layer._icon.children[0].innerHTML = "<div class='route-marker'><span>" + markerNumber + "</span><svg width='28' height='35'><circle cx='14' cy='14' r='14' fill='" + markerColor + "' /><polyline fill='" + markerColor + "' points='8,25 14,35 20,25'/></svg></div>";

    geojsonLayer.eachLayer( function(i) {
        // Remove route hover event handlers
        jQuery(i).off( "mouseenter mouseleave" );

        if ( i._layers ) {
            i.eachLayer( function(x) {
                x._path.attributes.stroke.value = '#b8b8b8';
            });
        } else {
            i._path.attributes.stroke.value = '#b8b8b8';
        }

        if ( i.feature.properties.id === routeId ) {
            if ( i._layers ) {
                i.eachLayer( function(x) {
                    x._path.attributes.stroke.value = markerColor;
                });
            } else {
                i._path.attributes.stroke.value = markerColor;
            }
        }
    });

    exitInfoBox();


}

// Route Hover State
function routeMouseOver(feature, layer) {
    var routeId = feature.properties.id,
        routeColor = feature.properties.color;
    if ( layer._layers ) {
        layer.eachLayer( function(x) {
            x._path.attributes.stroke.value = routeColor;
        });
    } else {
        layer._path.attributes.stroke.value = routeColor;
    }
    markerLayer.eachLayer( function(i) {
        var markerLayerId = i.feature.properties.id;
        if ( routeId === markerLayerId ) {
            var markerName = i.options.title,
                markerColor = i.feature.properties.color,
                markerMatch = jQuery( '[title="' + markerName + '"] svg *' );

            jQuery( markerMatch ).css( 'fill', markerColor );
        }
    });
};

// Route Hover Exit State
function routeMouseOut(feature, layer) {
    var routeId = feature.properties.id;
    if ( layer._layers ) {
        layer.eachLayer( function(x) {
            x._path.attributes.stroke.value = grey;
        });
    } else {
        layer._path.attributes.stroke.value = grey;
    }
    markerLayer.eachLayer( function(i) {
        var markerLayerId = i.feature.properties.id;
        if ( routeId === markerLayerId ) {
            var markerName = i.options.title,
                markerMatch = jQuery( '[title="' + markerName + '"] svg *' );

            jQuery( markerMatch ).css( 'fill', markerColor );
        }
    });
};

// Route Click State
function routeClick(layer) {

    jQuery(layer).off( "mouseenter mouseleave" );

    mapOverlay();

    var routeId = layer.feature.properties.id,
        routeColor = layer.feature.properties.color;

    if ( layer._layers ) {
        layer.eachLayer( function(x) {
            x._path.attributes.stroke.value = routeColor;
        });
    } else {
        layer._path.attributes.stroke.value = routeColor;
    }
    markerLayer.eachLayer( function(i) {
        var markerLayerId = i.feature.properties.id;
        if ( routeId === markerLayerId ) {
            var markerName = i.options.title,
                markerColor = i.feature.properties.color,
                markerMatch = jQuery( '[title="' + markerName + '"] svg *' ),
                chartClass = markerLayerId + '-chart',
                routeNumber = i.feature.properties.number,
                content = '<section class="' + i.feature.properties.id + '"><div class="clear-infobox">X</div>' +
                  '<h4>' + i.feature.properties.title + '</h4>' +
                  '<span class="route-number">' + routeNumber + '</span>' +
                  '<svg class="popup-marker" width="28" height="35"><circle cx="14" cy="14" r="14" fill="' + markerColor + '" /><polyline fill="' + markerColor + '" points="8,25 14,35 20,25"/></svg>' +
                  '<div><strong>DISTANCE</strong>: ' + i.feature.properties.distance + ' Miles</div>' +
                  '<div><strong>DIFFICULTY</strong>: ' + i.feature.properties.difficulty + '</div>' +
                  '<div class="elevation"><strong>ELEVATION</strong><span></span></div>' +
                  '<div class="' + chartClass + '"></div>' +
                  '<div class="popup-img-wrapper"><img src="' + i.feature.properties.imageurl + '" class="popup-img" /></div>' +
                  '<div class="description">' + i.feature.properties.description + '</div>' +
                  '<div><a href="' + i.feature.properties.permalink + '" class="more-detail">FIND OUT MORE <span>&rsaquo;</span></a></div>' +
                  '</section>';

            jQuery( markerMatch ).css( 'fill', markerColor );
            map.panTo( i.getLatLng() );
            infobox.innerHTML = content;
            exitInfoBox();
            generateEleChart(chartClass, routeId, markerColor);
        }
    });
};

function exitInfoBox() {
    //* Clear infobox ===================================================== //
    var exitInfoBox = document.querySelector( '.clear-infobox' );

    exitInfoBox.addEventListener( 'click', function() {
        infobox.innerHTML = '';
        mapOverlayAdd();
    });
}

//  Charts  ** =========================================================== //
function generateEleChart(chartClass, routeId, routeColor) {

    var chartHeight;

    if ( window.innerWidth > 896 ) {
        chartHeight = 160;
    } else {
        chartHeight = 100;
    }

    c3.generate({
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
                "elevation" : routeColor
            }
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
                    width : 50,
                    outer : false
                }
            },
            y : {
                show : true,
                label : {
                    text : 'Elevation (ft)',
                    position : 'inner-top'
                },
                outer : false
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        padding : {
            bottom : 0,
            left: 5,
            top : 5,
            right: 5
        },
        size : {
            height : chartHeight
        },
        legend : {
            show : false
        },
        zoom: {
            enabled: true
        }
    });

}

// Print Stuff
window.addEventListener( 'onbeforeprint', function() {
    var bounds = map.getBounds( map.featureLayer );
    map.fitBounds( bounds );
});