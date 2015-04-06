//* Map Init ==================================================================== //
L.mapbox.accessToken = 'pk.eyJ1IjoiYWx0YXBsYW5uaW5nIiwiYSI6InhqNzQwRW8ifQ.mlA6eN3JguZL_UkEV9WlMA';

var map = L.mapbox.map( 'map', null, {
    maxZoom: 18,
    minZoom: 6
}).setView([35.285, -78.9], 8);

map.addEventListener( 'click', clearRoute );

//* Add info control instead of bar attribution ============================================================ //
map.addControl( L.mapbox.infoControl().addInfo( '<a href="http://walkbikencroutes.altaprojects.net/disclaimer" target="_blank">Read Disclaimer</a>' ) );
map.attributionControl.removeFrom( map );

//* Other Variables ============================================================ //
var infobox = document.getElementById('infobox'),
    markerLayer = L.mapbox.featureLayer(),
    markerColor = '#ef4638',
    grey = '#b8b8b8',
    lightGrey = '#dad9df',
    darkGrey = '#474b4e',
    dataRequest = new XMLHttpRequest(),
    elevationTitle = document.querySelector('.elevation-title'),
    zoomInfo = document.querySelector('.zoom-info'),
    directionsTitle = document.querySelector('.directions-title');

// POIs
var bikeShops = L.mapbox.featureLayer(),
    historicDistricts = L.mapbox.featureLayer(),
    campgrounds = L.mapbox.featureLayer(),
    stateParksCamping = L.mapbox.featureLayer();

// POI clusters
var bikeClusterGroup = new L.markerClusterGroup({
        iconCreateFunction: iconCreateBikeShop,
        maxClusterRadius : 35,
        showCoverageOnHover: false
    }),
    historicDistrictsClusterGroup = new L.markerClusterGroup({
        iconCreateFunction: iconCreateHistoricDistrict,
        maxClusterRadius : 20,
        showCoverageOnHover: false
    }),
    campgroundsClusterGroup = new L.markerClusterGroup({
        iconCreateFunction: iconCreateCampground,
        maxClusterRadius : 20,
        showCoverageOnHover: false
    }),
    stateParksCampingClusterGroup = new L.markerClusterGroup({
        iconCreateFunction: iconCreateStateParkCamping,
        maxClusterRadius : 20,
        showCoverageOnHover: false
    });

//* Routes Layer ================================================================== //
var geojsonLayer = new L.GeoJSON.AJAX( '/wp-content/themes/walkbikenc/json/routes/routes.geojson', {
    style: getStyle,
    onEachFeature: onEachFeature
});

//* Elevation Marker =============================================== //
var ll = [];
var elMarker = L.marker([0, 0], {
    icon: L.divIcon({
        className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
        iconSize: new L.Point(14, 14)
    })
}).addTo(map);

//* Combine NC state routes and their markers =============================================== //
var routesAndMarkers = L.featureGroup([ geojsonLayer, markerLayer]);

//* Layers for legend map control ================================================================== //
var layers = L.control.layers({
    Simple : L.mapbox.tileLayer('altaplanning.k8ndphm6').addTo(map), // add Simple as initial map
    Satellite : L.mapbox.tileLayer('examples.map-igb471ik'),
    Terrain : L.mapbox.tileLayer('altaplanning.k9bmb42e')
},{ // points of interest and routes
    'Bike Routes' : routesAndMarkers.addTo(map),
    'Bike Shops' : bikeClusterGroup,
    'Historic Districts' : historicDistrictsClusterGroup,
    'Campgrounds' : campgroundsClusterGroup,
    'State Parks with Camping' : stateParksCampingClusterGroup
}).setPosition('topleft').addTo(map);

//* NC Routes Marker Setup ============================================================== //
markerLayer.on( 'layeradd', function(e) {
    layerAdd(e);
});

markerLayer.loadURL('/wp-content/themes/walkbikenc/json/markers/markers.geojson');

markerLayer.on( 'click', function(e) {
    e.layer.closePopup();
    mapInteraction(e);
});

//* points of interest setup ============================================================ //
// use icon object from json
bikeShops.on( 'layeradd', function(e) {
    layerAdd(e);
    e.target.eachLayer( function(layer) {
        bikeClusterGroup.addLayer(layer);
    });
});
historicDistricts.on( 'layeradd', function(e) {
    layerAdd(e);
    e.target.eachLayer( function(layer) {
        historicDistrictsClusterGroup.addLayer(layer);
    });
});
campgrounds.on( 'layeradd', function(e) {
    layerAdd(e);
    e.target.eachLayer( function(layer) {
        campgroundsClusterGroup.addLayer(layer);
    });
});
stateParksCamping.on( 'layeradd', function(e) {
    layerAdd(e);
    e.target.eachLayer( function(layer) {
        stateParksCampingClusterGroup.addLayer(layer);
    });
});

bikeShops.on( 'click', function(e) {
    map.panTo( e.layer.getLatLng() );
});
historicDistricts.on( 'click', function(e) {
    map.panTo( e.layer.getLatLng() );
});
campgrounds.on( 'click', function(e) {
    map.panTo( e.layer.getLatLng() );
});
stateParksCamping.on( 'click', function(e) {
    map.panTo( e.layer.getLatLng() );
});

// add layers
bikeShops.loadURL( '/wp-content/themes/walkbikenc/json/bikeshops/bikeshops.geojson' );
historicDistricts.loadURL( '/wp-content/themes/walkbikenc/json/historicdistricts/historicdistricts.geojson' );
campgrounds.loadURL( '/wp-content/themes/walkbikenc/json/campgrounds/campgrounds.geojson' );
stateParksCamping.loadURL( '/wp-content/themes/walkbikenc/json/stateparkscamping/stateparkscamping.geojson' );

//* Directions ============================================================== //
var directions = L.mapbox.directions({
        profile: 'mapbox.walking',
        alternatives : false
    });

var directionsLayer = L.mapbox.directions.layer(directions).addTo(map),
    directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map),
    directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map),
    directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map),
    directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map),
    originWrap = document.querySelector( '.mapbox-directions-origin' ),
    directionsRoutes = document.querySelector( '.mapbox-directions-routes' ),
    directionsInstructions = document.querySelector( '.mapbox-directions-instructions' ),
    directionsDiv = document.getElementById( 'directions' ),
    elevationChart = document.getElementById( 'elevation-chart' );

// Directions Icons
var r = document.getElementById( 'reverse' ),
    reload = document.getElementById( 'reload' ),
    pd = document.getElementById( 'print' ),
    is = document.getElementById( 'intro-start' );

r.addEventListener( 'click', function() {
    directions.reverse().query();
    this.classList.toggle('rotate');
    // Reverse Chart
    var el = chart.data.values('elevation').reverse(),
        lat = chart.data.values('lat').reverse(),
        lng = chart.data.values('lng').reverse(),
        d = chart.categories(),
        k = d.reverse();

    chart.flow({
        json : {
            'elevation' : el,
            'distance' : k,
            'lat' : lat,
            'lng' : lng
        },
        duration: 900,
        done : function() {
            jQuery('.c3-axis-x text').each( function() {
                this.style.opacity = 0;
            });
        }
    });
});

reload.addEventListener( 'click', function() {
    this.classList.toggle('rotate');
    document.location.reload(false);
});

pd.addEventListener( 'click', function() {
    window.print();
});

is.addEventListener( 'click', function() {

    if ( window.innerWidth > 896 ) {
        var steps = document.getElementById( 'steps-wrap' );
        steps.classList.add( 'visible' );
    }

    if ( steps.classList.contains( 'visible' ) ) {
        introJs().start();
    }

});

directions.on( 'unload', function() {
    showRoutes();

    directionsTitle.classList.remove( 'visible' );
    elevationTitle.classList.remove( 'visible' );
    zoomInfo.classList.remove( 'visible' );
});

var dirOM = directionsLayer.originMarker,
    dirDM = directionsLayer.destinationMarker,
    dirStart,
    dirDestination,
    dirWaypoints,
    routeWaypoints,
    omarker,
    dmarker,
    startNearest,
    destinationNearest,
    dirFeatures,
    dirFC,
    dirFCFL,
    startIndex,
    destinationIndex,
    newWaypoints;

function getRouteInfo ( origin, goal ) {
    var startCoord = origin.geometry.coordinates.toString();
    var endCoord = goal.geometry.coordinates.toString();
    var directionsURL = 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/'+ startCoord + ';' + endCoord +'.json?access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ';
    //bike route
    $.get(directionsURL, function(data){
      var route = data.routes[0].geometry;
      map.featureLayer.setGeoJSON(turf.linestring(route.coordinates));
    });
}

dirOM.on( 'drag', function() {
    // getRouteInfo(nearestStart,nearestEnd);
    dirOM = directionsLayer.originMarker;
    dirStart = dirOM.getLatLng();
    omarker = turf.point([dirStart.lng, dirStart.lat]);
    startNearest = turf.nearest(omarker, dirFC);
});

dirDM.on( 'drag', function() {
    dirDM = directionsLayer.destinationMarker;
    dirDestination = dirDM.getLatLng();
    dmarker = turf.point([dirDestination.lng, dirDestination.lat]);
    destinationNearest = turf.nearest(dmarker, dirFC);
});

dirOM.on( 'dragend', function() {
    var sI = dirFC.features.indexOf(startNearest);

    if ( sI > 0 ) {
        startIndex = sI;
        if ( typeof(destinationIndex) !== 'undefined' ) {
            newWaypoints = routeWaypoints.slice(startIndex, destinationIndex);
        } else {
            newWaypoints = routeWaypoints.slice(startIndex);
        }
    } else {
        startIndex = 0;
        if ( typeof(destinationIndex) !== 'undefined' ) {
            newWaypoints = routeWaypoints.slice(0, destinationIndex);
        } else {
            newWaypoints = routeWaypoints.slice(0);
        }
    }

    var currentDestination = directions.getDestination();

    directions
        .setOrigin(startNearest)
        .setWaypoints(newWaypoints)
        .setDestination(currentDestination)
        .query();
});

dirDM.on( 'dragend', destinationDragEnd );

function destinationDragEnd() {
    var dI = dirFC.features.indexOf(destinationNearest);

    if ( dI > 1 ) {
        destinationIndex = dI - 1;
        if ( typeof(startIndex) !== 'undefined' ) {
            newWaypoints = routeWaypoints.slice(startIndex, destinationIndex);
        } else {
            newWaypoints = routeWaypoints.slice(0, destinationIndex);
        }
    }

    var currentOrigin = directions.getOrigin();

    directions
        .setDestination(destinationNearest)
        .setWaypoints(newWaypoints)
        .setOrigin(currentOrigin)
        .query();
}

directions.on( 'load', function(e) {
    directionsTitle.classList.add( 'visible' );
    elevationTitle.classList.add( 'visible' );
    zoomInfo.classList.add( 'visible' );
    map.fitBounds( directionsLayer._routePolyline().getBounds(), {
        paddingTopLeft:[100,10],
        paddingBottomRight:[200,200]
    });
    map.removeEventListener( 'click', clearRoute );
});

directions.on( 'unload', function() {
    map.addEventListener( 'click', clearRoute );
});

// Scroll up for mobile ================================= //
directionsDiv.addEventListener( 'scroll', function() {

    if ( !directionsDiv.classList.contains( 'add-top' ) ) {
        directionsDiv.classList.add( 'add-top' );

        if ( window.innerWidth < 896 ) {
            clearElevation();
        }
    }

    directionsDivScrollEnd();
});

//* NC State Outline ============================================================== //
var ncStateLayer = new L.GeoJSON.AJAX( '/wp-content/themes/walkbikenc/json/ncoutline.geojson', {
    style : ncOutlineStyle
}).addTo(map);

//* Bike Routes Checkbox ============================================================== //
var bikeRoutesCheckbox = document.querySelector('.leaflet-control-layers-overlays .leaflet-control-layers-selector:checked');

// Handhelds and tablets no need for fullscreen or drawing
if ( screen.width > 768 ) {

    //* full screen option ============================================================ //
    L.control.fullscreen().addTo(map);

} else {

    cltTapAdd();

    var cl,
        clt,
        cltt;

    function cltTapAdd() {

        clt = document.querySelector('.leaflet-control-layers-toggle');
        cl = document.querySelector('.leaflet-control-layers');

        clt.addEventListener( 'click', function() {
            clt.classList.add('mobile-tap');
            cl.classList.add('leaflet-control-layers-expanded');
            cltTapRemove();
        });
    }

    function cltTapRemove() {

        clt.classList.remove('leaflet-control-layers-toggle');

        cltt = document.querySelector('.mobile-tap');

        cltt.addEventListener( 'click', function() {
            clt.classList.remove('mobile-tap');
            cl.classList.remove('leaflet-control-layers-expanded');
            clt.classList.add('leaflet-control-layers-toggle');
            cltTapAdd();
        });
    }
}

//= Functions ************************************************************************** //
function getStyle(feature) {
    return {
        weight: 5,
        opacity: 0.8,
        color: grey,
        lineJoin : 'round'
    };
}

function ncOutlineStyle(feature) {
    return {
        clickable : false,
        fillOpacity: 0.35,
        fillColor: grey,
        weight: 0
    };
}

function layerAdd(e) {
    var marker = e.layer,
        feature = marker.feature;

    marker.setIcon(L.divIcon(feature.properties.icon));
}

function onEachFeature(feature, layer) {

    layer.addEventListener( 'click', function(layer) {
        routeClick(layer);
    });

    if ( screen.width > 768 ) {
        // hover with jquery so we can remove it on click
        jQuery(layer).hover( function() {
            routeMouseOver(feature, layer);
        }, function() {
            routeMouseOut(feature, layer);
        });
    }

    // re add events when clicked route is exited
    map.addEventListener( 'click', function() {
        jQuery(layer).hover( function() {
            routeMouseOver(feature, layer);
        }, function() {
            routeMouseOut(feature, layer);
        });
    });
}

function clearRoute() {

    // Clear Info Box
    infobox.innerHTML = '';

    // Change all routes to grey
    geojsonLayer.eachLayer( function(i) {
        if ( i._layers ) {
            i.eachLayer( function(x) {
                if ( i._path ) {
                    x._path.attributes.stroke.value = grey;
                    x._path.attributes.stroke.opacity = 0.8;
                }
            });
        } else if ( i._path ) {
            i._path.attributes.stroke.value = grey;
            i._path.attributes.stroke.opacity = 0.8;
        }
    });

    // change markers to MarkerColor
    jQuery('.route-marker svg circle').css( 'fill', markerColor );
    jQuery('.route-marker svg polyline').css( 'fill', markerColor );
}

var way;

function calcRoute(routeObject, route, part) {
    hideRoutes();
    generateElevationChart(route, part);

    if (directions._waypoints) {
        directions._waypoints = [];
    }

    var rl = routeObject.length - 1;

    directions
        .setOrigin( routeObject[0] )
        .setDestination( routeObject[rl] );

    way = routeObject.slice(0, rl);

    directions.setWaypoints(way);
    directions.query();

    // Set up origin and destination marker drag to waypoints along selected route
    dirStart = dirOM.getLatLng();
    dirDestination = dirDM.getLatLng();
    dirWaypoints = directions.getWaypoints(),
    routeWaypoints = dirWaypoints;
    dirTSM = turf.point([dirStart.lng, dirStart.lat], {
        name : 'Start'
    });
    dirTDM = turf.point([dirDestination.lng, dirDestination.lat], {
        name : 'Finish'
    });
    dirFeatures = [];

    var wayIcon = {
        "iconUrl" : '/wp-content/themes/walkbikenc/img/marker-waypoint.svg',
        "iconSize": [8,8],
        "popupAnchor": [0,0],
        "className": "icon-way"
    };

    dirFeatures.push(dirTSM);
    for ( var i = 0, l = dirWaypoints.length; i < l; i++ ) {
        var c = dirWaypoints[i].geometry.coordinates,
            cp = turf.point([ c[0], c[1] ], {
                name : 'Waypoint',
                icon : wayIcon
            });
        dirFeatures.push(cp);
    }
    dirFeatures.push(dirTDM);

    dirFC = turf.featurecollection(dirFeatures);

    dirFCFL =
        L.mapbox
        .featureLayer()
        .on('layeradd', function(e) {
            var marker = e.layer,
            feature = marker.feature;
            marker.setIcon(L.icon(wayIcon))
        })
        .setGeoJSON(dirFC)
        .addTo(map);

    dirFCFL.eachLayer( function(layer) {
        layer.on('click', function(e) {
            directions.setDestination(e.latlng);

            dirDM = directionsLayer.destinationMarker;
            dirDestination = dirDM.getLatLng();
            dmarker = turf.point([dirDestination.lng, dirDestination.lat]);
            destinationNearest = turf.nearest(dmarker, dirFC);

            destinationDragEnd();
        })
    })
}

function generateElevationChart(route, part) {

    var chartHeight,
        marker = L.marker([-73, 40], {
            icon: L.mapbox.marker.icon({
                'marker-color': '#f86767'
            })
        }).addTo(map);

    if ( window.innerWidth < 896 ) {
        chartHeight = 100;
        if ( window.innerHeight > 481 ) {
            chartHeight = 170;
        }
    } else {
        chartHeight = 256;
    }

    chart = c3.generate({
        bindto: '.elevation-chart',
        data : {
            url : '/wp-content/themes/walkbikenc/json/elevation/' + route + '/' + part + '.json',
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
            selection: {
                enabled: true
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
        padding : {
            bottom: 10,
            left : 40,
            right : 15,
            top : 20
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
                    outer : false,
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

// Route Hover State
function routeMouseOver(feature, layer) {

    var routeId = feature.properties.id,
        routeColor = feature.properties.color;

    if ( layer._layers ) {

        layer.eachLayer( function(x) {
            x._path.attributes.stroke.value = routeColor;
        });

    } else if ( layer._path ) {

        layer._path.attributes.stroke.value = routeColor;

    }

    markerLayer.eachLayer( function(i) {
        var markerLayerId = i.feature.properties.id;

        if ( routeId === markerLayerId ) {

            var routeName = i.options.title,
                markerMatch = jQuery( '[title="' + routeName + '"] svg *' );

            jQuery( markerMatch ).css( 'fill', routeColor );
        }
    });
}

// Route Hover Exit State
function routeMouseOut(feature, layer) {

    var routeId = feature.properties.id;

    if ( layer._layers ) {
        layer.eachLayer( function(x) {
            x._path.attributes.stroke.value = grey;
        });
    } else if ( layer._path ) {
        layer._path.attributes.stroke.value = grey;
    }

    markerLayer.eachLayer( function(i) {

        var markerLayerId = i.feature.properties.id;

        if ( routeId === markerLayerId ) {
            var routeName = i.options.title,
                markerMatch = jQuery( '[title="' + routeName + '"] svg *' );

            jQuery( markerMatch ).css( 'fill', markerColor );
        }

    });
}

function exitInfoBox() {
    //* Clear infobox ===================================================== //
    var exitInfoBox = document.querySelector( '.clear-infobox' );

    exitInfoBox.addEventListener( 'click', function() {
        infobox.innerHTML = '';
    });
}

function hideRoutes() {
    if ( bikeRoutesCheckbox.checked === true ) {
        bikeRoutesCheckbox.click();
    }
    infobox.innerHTML = '';
}

function showRoutes() {
    if ( bikeRoutesCheckbox.checked === false ) {
        bikeRoutesCheckbox.click();
    }
}

function removeAddTop() {
    if ( directionsDiv.classList.contains( 'add-top' ) ) {
        directionsDiv.classList.remove( 'add-top' );
    }
}

function clearInstructions() {
    directionsInstructions.innerHTML = '';
    directionsRoutes.innerHTML = '';
}

function clearElevation() {
    while (elevationChart.firstChild) {
        elevationChart.removeChild(elevationChart.firstChild);
    }
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
                    width : 40,
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
            left: 5,
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

function iconCreateStateParkCamping(cluster) {
    return new L.DivIcon({
        html: 'x' + cluster.getChildCount(),
        className: 'poi-cluster-state-park',
        iconSize: new L.Point(26,25)
    });
}

function iconCreateCampground(cluster) {
    return new L.DivIcon({
        html: 'x' + cluster.getChildCount(),
        className: 'poi-cluster-campground',
        iconSize: new L.Point(20,17)
    });
}

function iconCreateHistoricDistrict(cluster) {
    return new L.DivIcon({
        html: 'x' + cluster.getChildCount(),
        className: 'poi-cluster-historic-district',
        iconSize: new L.Point(20,19)
    });
}

function iconCreateBikeShop(cluster) {
    return new L.DivIcon({
        html: 'x' + cluster.getChildCount(),
        className: 'poi-cluster-bikeshop',
        iconSize: new L.Point(28,28)
    });
}

// Remove add top on directions scroll
function directionsDivScrollEnd() {
    var top = directionsDiv.scrollTop;
    if ( top === 0 ) {
        directionsDiv.classList.remove( 'add-top' );
    }
}

// Route Click State
function routeClick(layer) {

    removeAddTop();
    clearInstructions();
    clearElevation();

    // Remove direction feature collection
    map.removeLayer(dirFCFL);

    // Clear Route
    directions
        .setOrigin(undefined)
        .setDestination(undefined);

    var routeId = layer.target.feature.properties.id,
        routeColor = layer.target.feature.properties.color;

    if ( window.innerWidth > 896 ) {
        map.fitBounds( layer.target.getBounds(), {
            paddingBottomRight : [100,100]
        });
    } else {
        map.fitBounds( layer.target.getBounds() );
    }

    geojsonLayer.eachLayer( function(i) {
        // Remove route hover event handlers
        jQuery(i).off( "mouseenter mouseleave" );

        if ( i._layers ) {
            i.eachLayer( function(x) {
                x._path.attributes.stroke.value = grey;
            });
        } else if ( i._path ) {
            i._path.attributes.stroke.value = grey;
        }

        if ( i.feature.properties.id === routeId ) {
            if ( i._layers ) {
                i.eachLayer( function(x) {
                    x._path.attributes.stroke.value = routeColor;
                });
            } else {
                i._path.attributes.stroke.value = routeColor;
            }
        }
    });

    markerLayer.eachLayer( function(i) {
        var markerLayerId = i.feature.properties.id;
        if ( routeId === markerLayerId ) {
            var routeName = i.options.title,
                markColor = i.feature.properties.color,
                markerMatch = jQuery( '[title="' + routeName + '"] svg *' ),
                routeVar = i.feature.properties.route,
                chartClass = markerLayerId + '-chart',
                routeNumber = i.feature.properties.number,
                content = '<section class="' + i.feature.properties.id + '"><div class="clear-infobox">X</div>' +
                  '<h4>' + i.feature.properties.title + '</h4>' +
                  '<span class="route-number">' + routeNumber + '</span>' +
                  '<svg class="popup-marker" width="28" height="35"><circle cx="14" cy="14" r="14" fill="' + markColor + '" /><polyline fill="' + markColor + '" points="8,25 14,35 20,25"/></svg>' +
                  '<div><strong>DISTANCE</strong>: ' + i.feature.properties.distance + ' Miles</div>' +
                  '<div><strong>DIFFICULTY</strong>: ' + i.feature.properties.difficulty + '</div>' +
                  '<div class="elevation"><strong>ELEVATION</strong><span></span></div>' +
                  '<div class="' + chartClass + '"></div>' +
                  '<div id="route-init-wrap"><button id="route-init" class="more-detail">Route This <span>&rsaquo;</span></button></div>' +
                  '</section>';

            jQuery( markerMatch ).css( 'fill', markColor );

            // assign info box content
            infobox.innerHTML = content;

            // add info box x, click x to remove infobox
            exitInfoBox();

            // Check if it is a multi segment route
            multiSegmentRoute(routeVar);

            // Make elevation chart
            generateEleChart(chartClass, routeId, routeColor);

            // Ready button for route
            addRoute(routeVar, routeId);
        }
    });
}

function mapInteraction(e) {

    // Clear add-top class
    removeAddTop();

    // Clear Instructions and Elevation
    clearInstructions();
    clearElevation();

    // Clear Route
    directions
        .setOrigin(undefined)
        .setDestination(undefined);

    var feature = e.layer.feature,
        routeId = feature.properties.id,
        routeVar = feature.properties.route,
        chartClass = feature.properties.id + '-chart',
        routeColor = feature.properties.color,
        markerNumber = feature.properties.number,
        markerLng = feature.geometry.coordinates,
        content = '<section class="' + routeId + '"><div class="clear-infobox">X</div>' +
                  '<h4>' + feature.properties.title + '</h4>' +
                  '<span class="route-number">' + markerNumber + '</span>' +
                  '<svg class="popup-marker" width="28" height="35"><circle cx="14" cy="14" r="14" fill="' + routeColor + '" /><polyline fill="' + routeColor + '" points="8,25 14,35 20,25"/></svg>' +
                  '<div><strong>DISTANCE</strong>: ' + feature.properties.distance + ' Miles</div>' +
                  '<div><strong>DIFFICULTY</strong>: ' + feature.properties.difficulty + '</div>' +
                  '<div class="elevation"><strong>ELEVATION</strong><span></span></div>' +
                  '<div class="' + chartClass + '"></div>' +
                  '<div id="route-init-wrap"><button id="route-init" class="more-detail">Route This <span>&rsaquo;</span></button></div>' +
                  '</section>';

    // assign info box content
    infobox.innerHTML = content;

    // add info box x, click x to remove infobox
    exitInfoBox();

    // Check if it is a multi segment route
    multiSegmentRoute(routeVar);

    e.layer._icon.children[0].innerHTML = "<span>" + markerNumber + "</span><svg width='28' height='35'><circle cx='14' cy='14' r='14' fill='" + routeColor + "' /><polyline fill='" + routeColor + "' points='8,25 14,35 20,25'/></svg>";

    geojsonLayer.eachLayer( function(i) {
        // Remove route hover event handlers
        jQuery(i).off( "mouseenter mouseleave" );

        if ( i._layers ) {
            i.eachLayer( function(x) {
                x._path.attributes.stroke.value = grey;
            });
        } else if ( i._path ) {
            i._path.attributes.stroke.value = grey;
        }

        if ( i.feature.properties.id === routeId ) {

            if ( i._layers ) {
                i.eachLayer( function(x) {
                    x._path.attributes.stroke.value = routeColor;
                });
            } else {
                i._path.attributes.stroke.value = routeColor;
            }

            // Fit Bounds
            if ( window.innerWidth > 896 ) {
                map.fitBounds( i.getBounds(), {
                    paddingBottomRight : [100,100]
                });
            } else {
                map.fitBounds( i.getBounds() );
            }
        }
    });

    // Make elevation chart
    generateEleChart(chartClass, routeId, routeColor)

    // Ready button for route
    addRoute(routeVar, routeId);
}

// Multi Segment Route Finder
function multiSegmentRoute(routeVar) {

    var routeButtons = document.getElementById( 'route-init-wrap' );

    switch (routeVar) {
        case 'us_oneRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Virginia to William Umstead State Park <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route William Umstead State Park to Sanford <span>&rsaquo;</span></button>' +
                '<button id="part-three-init" class="more-detail partialbtn">Route Sanford to South Carolina <span>&rsaquo;</span></button>';
            break;
        case 'nc_twoRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Manteo to Washington <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Washington to Gold Valley Crossroads <span>&rsaquo;</span></button>' +
                '<button id="part-three-init" class="more-detail partialbtn">Route Gold Valley Crossroads to Chapel Hill <span>&rsaquo;</span></button>' +
                '<button id="part-four-init" class="more-detail partialbtn">Route Chapel Hill to Taylorsville <span>&rsaquo;</span></button>' +
                '<button id="part-five-init" class="more-detail partialbtn">Route Taylorsville to Asheville <span>&rsaquo;</span></button>' +
                '<button id="part-six-init" class="more-detail partialbtn">Route Asheville to Murphy <span>&rsaquo;</span></button>';
            break;
        case 'nc_threeRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route From South Carolina to Southport Ferry <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route From Fort Fisher to Lee Creek Airport <span>&rsaquo;</span></button>' +
                '<button id="part-three-init" class="more-detail partialbtn">Route From Whitepost to Virginia <span>&rsaquo;</span></button>';
            break;
        case 'nc_fourRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Norlina to Virginia (East) <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Eden to Norlina <span>&rsaquo;</span></button>' +
                '<button id="part-three-init" class="more-detail partialbtn">Route Virginia (West) to Eden <span>&rsaquo;</span></button>';
            break;
        case 'nc_fiveRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Apex to Fayetteville <span>&rsaquo;</span></button>' +
            '<button id="part-two-init" class="more-detail partialbtn">Route Fayetteville to Fort Fisher State Park <span>&rsaquo;</span></button>';
            break;
        case 'nc_sixRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Morganton to Albemarle <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Albemarle to Liberty <span>&rsaquo;</span></button>';
            break;
        case 'nc_sevenRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Wilson to Kinston <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Kinston to Cedar Island <span>&rsaquo;</span></button>';
            break;
        case 'nc_eightRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Pisgah National Forest to Shiloh <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Shiloh to Lincolnton <span>&rsaquo;</span></button>';
            break;
        case 'sandhillsRoute':
            routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Pee Dee River to Raeford <span>&rsaquo;</span></button>' +
                '<button id="part-two-init" class="more-detail partialbtn">Route Raeford to Bladen Lakes State Forest <span>&rsaquo;</span></button>';
            break;
        default:
            routeButtons.innerHTML = 'Error on route selection, please submit issue';
    }
}

// Route Init
function addRoute(routeVar, routeId) {
    directions.options.profile = 'mapbox.driving';

    var route,
        part,
        routeOneInit = document.getElementById('part-one-init'),
        routeTwoInit = document.getElementById('part-two-init'),
        routeThreeInit = document.getElementById('part-three-init'),
        routeFourInit = document.getElementById('part-four-init'),
        routeFiveInit = document.getElementById('part-five-init'),
        routeSixInit = document.getElementById('part-six-init');

    switch (routeVar) {
        case 'us_oneRoute':
            route = 'us_one';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = us_oneRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = us_oneRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            routeThreeInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = us_oneRoute_partThree;
                part = 'partthree';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_twoRoute':
            route = 'nc_two';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            routeThreeInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partThree;
                part = 'partthree';
                calcRoute(routeObject, route, part);
            });
            routeFourInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partFour;
                part = 'partfour';
                calcRoute(routeObject, route, part);
            });
            routeFiveInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partFive;
                part = 'partfive';
                calcRoute(routeObject, route, part);
            });
            routeSixInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_twoRoute_partSix;
                part = 'partsix';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_threeRoute':
            route = 'nc_three';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_threeRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_threeRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            routeThreeInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_threeRoute_partThree;
                part = 'partthree';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_fourRoute':
            route = 'nc_four';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_fourRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_fourRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            routeThreeInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_fourRoute_partThree;
                part = 'partthree';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_fiveRoute':
            route = 'nc_five';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_fiveRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_fiveRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_sixRoute':
            route = 'nc_six';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_sixRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_sixRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_sevenRoute':
            route = 'nc_seven';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                directions.options.profile = 'mapbox.walking';
                routeObject = nc_sevenRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_sevenRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'nc_eightRoute':
            route = 'nc_eight';
            routeOneInit.addEventListener( 'click', function(e) {
                directions.options.profile = 'mapbox.walking';
                innerDirectionsTitle(e);
                routeObject = nc_eightRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = nc_eightRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            break;
        case 'sandhillsRoute':
            route = 'sandhills';
            routeOneInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = sandhillsRoute_partOne;
                part = 'partone';
                calcRoute(routeObject, route, part);
            });
            routeTwoInit.addEventListener( 'click', function(e) {
                innerDirectionsTitle(e);
                routeObject = sandhillsRoute_partTwo;
                part = 'parttwo';
                calcRoute(routeObject, route, part);
            });
            break;
    }
}

function innerDirectionsTitle(e) {
    rName = document.getElementById('directions-name');
    rName.innerHTML = e.target.textContent.slice(0, -1);
}