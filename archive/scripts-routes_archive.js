//* Map Init ==================================================================== //
L.mapbox.accessToken = 'pk.eyJ1IjoiYWx0YXBsYW5uaW5nIiwiYSI6InhqNzQwRW8ifQ.mlA6eN3JguZL_UkEV9WlMA';    

var map = L.mapbox.map( 'map', null, {
    maxZoom: 18,
    minZoom: 6
}).setView([35.285, -78.9], 8);

map.addEventListener( 'click', clearRoute );

//* Add info control instead of bar attribution ============================================================ //
map.addControl( L.mapbox.infoControl() );
map.attributionControl.removeFrom( map );

//* Other Variables ============================================================ //
var infobox = document.getElementById('infobox'),
    markerLayer = L.mapbox.featureLayer(),
    markerColor = '#ef4638',
    grey = '#b8b8b8',
    lightGrey = '#dad9df',
    darkGrey = '#474b4e',
    dataRequest = new XMLHttpRequest();

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
    map.panTo( e.layer.getLatLng() );
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
        options : {
            alternatives : false
        }
    });

var directionsLayer = L.mapbox.directions.layer(directions).addTo(map),
    directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map),
    directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map),
    directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map),
    directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map),
    geoLocate = document.getElementById("geofind"),
    errorsDiv = document.getElementById("errors"),
    originWrap = document.querySelector( '.mapbox-directions-origin' ),
    destinationWrap = document.querySelector( '.mapbox-directions-destination' ),
    directionsOrigin = document.getElementById('mapbox-directions-origin-input'),
    directionsDestination = document.getElementById('mapbox-directions-destination-input'),
    directionsRoutes = document.querySelector( '.mapbox-directions-routes' ),
    directionsInstructions = document.querySelector( '.mapbox-directions-instructions' ),
    closeIcon = document.querySelectorAll('.mapbox-directions-icon.mapbox-close-icon'),
    directionsDiv = document.getElementById( 'directions' ),
    instructionsDiv = document.getElementById( 'instructions' ),
    directionsCheck = document.querySelector( '.directions-check' ),
    elevationChart = document.getElementById( 'elevation-chart' );

for ( var i = 0, l = closeIcon.length; i < l; i++ ) {

    closeIcon[i].addEventListener( 'click', function() {
        
        directions.options.profile = 'mapbox.walking';

        removeAddTop();
        clearInstructions();       
        clearElevation();
        
        // Remove watch and marker on geolocation
        navigator.geolocation.clearWatch( watch );
        positionMarker.setLatLng( [ 0, 180 ] );

        // If bike routes are hidden add them back
        showRoutes();

    });
};

// Route Elevation ================================= //
directions.on( 'load', function() {   
    if ( directions.directions.routes.length > 0 ) {
        var dir = directions.directions.routes[0];
        routeElevation(dir);
    }  
});

// Use NC Bike Routes between locations ================================= //
var des,
    desPoint,
    desNearest,
    desNearestFc,
    ori,
    oriPoint,
    oriNearest,
    midPoint,
    bear,
    desIndex,
    oriIndex,
    count;

directions.on( 'origin', closestRoutePointOrigin );
directions.on( 'destination', closestRoutePointDestination );

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

// Geocoder for inputs ================================= //
var geocoder = L.mapbox.geocoder('mapbox.places');

// Bind events to directions origin for geocoder
jQuery( directionsOrigin ).bind( 'input paste', function() {    
    // if more than 3 characters typed into directions origin, query geocoder
    if ( this.value.length > 3 ) {
        geocoder.query( this.value, updateQuery );
    }
});
// Bind events to directions destination for geocoder
jQuery( directionsDestination ).bind( 'input paste', function() {
    // if more than 3 characters typed into directions origin, query geocoder
    if ( this.value.length > 3 ) {
        geocoder.query( this.value, updateQuery );
    }
});

// html5 geolocation and set directions origin ================================= //
var geo_options = {
    enableHighAccuracy: true, 
    maximumAge        : 3000,
    timeout           : 9000
};

// geolocation position marker
var positionMarker = L.marker( [0, 0], {
    icon: L.icon({
        iconUrl : '/wp-content/themes/walkbikenc/img/icon-route_path.svg',
        iconSize : [24, 24],
        iconAnchor : [0, 0],
        popupAnchor: [-24, -24]
    }),
    title : 'You'
});

// create watch variable so we can remove it
var watch;

geoLocate.addEventListener( 'click', function() {

    if ( !navigator.geolocation ) {
        errorsDiv.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success( position ) {      
        var lat  = position.coords.latitude,
            lng = position.coords.longitude;
        map.panTo( [lat,lng] );
        map.setZoom( 17 );
        directions.setOrigin( L.latLng(lat,lng) );
        geoWatch( position );
        positionMarker.addTo(map);
    }

    function watchSuccess( position ) {
        positionMarker.setLatLng( L.latLng( position.coords.latitude, position.coords.longitude ) );
    }

    function error() {
        errorsDiv.innerHTML = "Unable to retrieve your location";
    }

    function geoWatch( position ) {
        watch = navigator.geolocation.watchPosition( watchSuccess, error, geo_options);
    }

    // Geo Position
    navigator.geolocation.getCurrentPosition( success, error, geo_options );

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

    //* Geocoder ============================================================ //
    var geocoderControl = L.mapbox.geocoderControl( 'mapbox.places', {
        autocomplete : true
    });

    geocoderControl.on( 'select', function(e) {
        var results = toLatLng(e),
            t = typeof( directions.origin );
        // set origin and destination based on geocoder searches
        if ( t === 'undefined' ) {
            directions.setOrigin( results );
        } else if ( t === 'object' ) {
            directions.setDestination( results );
            directions.query();
        }
        // reverse for directions  
        function toLatLng(e) {
            return L.latLng( e.feature.center.reverse() );
        }
    });

    map.addControl( geocoderControl );

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
function layerAdd(e) {
    var marker = e.layer,
        feature = marker.feature;
    
    marker.setIcon(L.divIcon(feature.properties.icon));
}

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

function hideRoutes() {
    if ( bikeRoutesCheckbox.checked === true ) {
        bikeRoutesCheckbox.click();
    } 
}

function showRoutes() {
    if ( bikeRoutesCheckbox.checked === false ) {
        bikeRoutesCheckbox.click();
    } 
}

// Find closest bike route to directions origin
function closestRoutePointOrigin() {

    if ( directionsOrigin.value === '' ) {
        return;
    } else {
        // Hide NC routes
        hideRoutes();

        ori = directions.origin.geometry.coordinates;
        oriPoint = turf.point(ori[0], ori[1]);
        oriNearest = turf.nearest(oriPoint, rouFc);
    }
}

function closestRoutePointDestination() {

    if ( directionsDestination.value === '' ) {
        return;
    } else {

        if ( directions._waypoints ) {
            directions._waypoints = [];
        }

        des = directions.destination.geometry.coordinates;  
        desPoint = turf.point(des[0], des[1]);
        desNearest = turf.nearest(desPoint, rouFc);

        desIndex = rouAll.indexOf( desNearest );
        oriIndex = rouAll.indexOf( oriNearest );
        count = 0;

        bear = turf.bearing(oriPoint, desPoint).toFixed(3);

        var pone,
            p;

        if ( oriIndex < desIndex ) {
            pone = oriIndex + 1;
            midPoint = rouAll.slice( pone, desIndex );
        } else {
            pone = desIndex + 1;
            midPoint = rouAll.slice( pone, oriIndex );
        }

        if ( bear < 0 ) {
            midPoint.reverse();
        }

        if ( midPoint.length >= 24 ) {

            directions._waypoints = [];
            directions.setDestination('');

            swal({
                title: "Oh No!\nYour route is too long.\nPlease shorten your route.",
                text: "Try using a NC bicyle route or spliting your route into legs.\nA good tip is try and limit each leg to a single state bike route.",
                showCancelButton: false,
                confirmButtonColor: markerColor,
                confirmButtonText: "Can do",
                closeOnConfirm: true,
                imageUrl: "/wp-content/themes/walkbikenc/img/icon-bike.svg"
            }, function(isConfirm) {   
                if (isConfirm) {
                    swal("", "success");   
                } else {     
                    swal("Routed", "Your route may not include NC bike routes", "error");   
                }
            });

        } else {

            for ( var i = 0, l = midPoint.length; i < l; i++ ) {           
                p = midPoint[i];
                directions.addWaypoint( count, p );
                directions.options.profile = 'mapbox.driving';
                count++;
            }
        }
    } 
}

function makeChart(e,d,p) {

    var points      = [ 'elevation' ],
        distances   = [ 'x' ],
        coords      = [ 'coordinates' ];

    for ( var i = 0; i < e.length; i++ ) {
        points.push( e[i] );
        distances.push( d[i] );
        coords.push( p[i] );
    }

    var chartHeight;

    if ( window.innerWidth > 896 && window.innerWidth < 1248 ) {
        chartHeight = 200;
    } else if ( window.innerWidth > 1249 ) {
        chartHeight = 250;
    } else {
        chartHeight = 100;
    }

    c3.generate({
        bindto : '.elevation-chart',
        data : {
            x : 'x',
            y : 'elevation',
            columns: [
                points,
                distances
            ],
            type : 'area'
        },
        point: { show: false },
        axis: { 
            x: { show : true },
            y : { show : true }
        },
        padding : {
            bottom : 5,
            left : 35,
            right : 5,
            top : 5
        },
        size : {
            height: chartHeight
        },
        legend : { 
            show : false
        },
        zoom: {
            enabled: true
        }
    });
}

function reqListener() {

    var res = this.responseText,
        data = JSON.parse( res ),
        ele = data.elevationProfile,
        route = data.shapePoints,
        elevationPoints = [],
        distancePoints = [],
        pathPoints = [];

    var count = 0;

    for (var i = 0, l = ele.length; i < l; i++) {
        
        var height = ele[i].height,
            d = ele[i].distance;

        height = height.toFixed();
        d = d * 100;
        d = d.toFixed();
        d = d / 100;

        elevationPoints.push( height );
        distancePoints.push( d );

        var count_two = count + 1;
        var c = [route[count_two],route[count]];
        pathPoints.push(c);
        count = count + 2;

        console.log(height.toString());
        console.log(d.toString());
        console.log(c.toString());

    }

    makeChart( elevationPoints, distancePoints, pathPoints );
}

function routeElevation(e) {

    var route = e.geometry.coordinates,
        key = 'Fmjtd%7Cluur2ha7nh%2C8g%3Do5-9wb006',
        points = [];

    for (var i = 0, l = route.length; i < l; i++) {

        var point = route[i].reverse(),
            pointLat = point[0],
            pointLng = point[1];

        if ( l > 600 ) {
            
            if ( i % 20 === 0 ) {
                points.push( pointLat, pointLng );
            }

        } else if ( l < 60 ) {

            points.push( pointLat, pointLng );

        } else {

            if ( i % 10 === 0 ) {
                points.push( pointLat, pointLng );  
            }

        }
    }

    var query = points.toString(),
        url = 'http://open.mapquestapi.com/elevation/v1/profile?key=' + key + '&shapeFormat=raw&unit=f&latLngCollection=' + query;

    var req = new XMLHttpRequest();
    req.onload = reqListener;
    req.open("get", url, true);
    req.send();
}

function updateQuery(err, data) {
    
    // Remove any previous query results
    jQuery('.query-result').remove();

    var resultFeatures = data.results.features,
        activeInput,
        activeDirection;

    // reverse for mapbox
    function reverse( y ) {
        return y.geometry.coordinates.reverse();
    }

    function queryable() {

        directions.options.profile = 'mapbox.walking';

        if ( directions.getOrigin() && directions.getDestination() ) {
            directions.query();
        }
    }

    function destinationDirection( a ) {
        directions.setDestination( L.latLng( a ) );
    }

    function originDirection( a ) {
        directions.setOrigin( L.latLng( a ) );
    }
    
    if ( document.activeElement === directionsDestination ) {

        activeInput = destinationWrap;
        activeDirection = destinationDirection;

    } else if ( document.activeElement === directionsOrigin ) {
        
        activeInput = originWrap;
        activeDirection = originDirection;

    }

    // limit results to 5
    for ( var e = 0, i = Math.min( resultFeatures.length, 5); i > e; e++ ) {
        
        var x = resultFeatures[e],
            placeName = x.place_name,
            placeCoords = reverse(x),
            resultLink = L.DomUtil.create( "a", "query-result", activeInput ); 

        // add data to newly created a tag
        resultLink.href = "#";
        resultLink.innerHTML = placeName;
        resultLink.setAttribute( 'data-coords', placeCoords )
            
        L.DomEvent.addListener( resultLink, "click", function() {

            var f = this.getAttribute( 'data-coords'),
                a = [],
                sp = f.split( ',', 2 ),
                pff = parseFloat( sp[0] ),
                pfs = parseFloat( sp[1] );

            a.push( pff, pfs );        
            map.setZoom( 17 );        
            map.panTo( L.latLng( a ) );
            activeDirection( a );
            queryable();

            // directions origin set, remove query results
            jQuery('.query-result').remove();

        });
    }
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

// Route Click State
function routeClick(layer) {

    removeAddTop();

    clearInstructions();

    jQuery(layer).off( "mouseenter mouseleave" );

    var routeId = layer.target.feature.properties.id,
        routeColor = layer.target.feature.properties.color;

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
            
            map.panTo( i.getLatLng() );
            
            // assign info box content
            infobox.innerHTML = content;

            // add info box x, click x to remove infobox
            exitInfoBox();

            // Check if it is a multi segment route
            multiSegmentRoute(routeVar);

            // Make elevation chart
            generateEleChart(chartClass, routeId, routeColor);

            // Ready button for route
            addRoute(routeVar);
        }
    });
}

function mapInteraction(e) {

    removeAddTop();
    clearInstructions();

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
        }
    });

    // Make elevation chart
    generateEleChart(chartClass, routeId, routeColor)

    // Ready button for route
    addRoute(routeVar);
}

// Multi Segment Route Finder
function multiSegmentRoute(routeVar) {

    var routeButtons = document.getElementById( 'route-init-wrap' );

    if ( routeVar === 'us_oneRoute' ) {

        routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Virginia to William Umstead State Park <span>&rsaquo;</span></button>' +
            '<button id="part-two-init" class="more-detail partialbtn">Route William Umstead State Park to South Carolina <span>&rsaquo;</span></button>';
    }

    // Set route portions for route 3. Too long for single route.
    if ( routeVar === 'nc_threeRoute' ) {

        routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route From South Carolina to Southport Ferry <span>&rsaquo;</span></button>' +
            '<button id="part-two-init" class="more-detail partialbtn">Route From Fort Fisher to Lee Creek Airport <span>&rsaquo;</span></button>' +
            '<button id="part-three-init" class="more-detail partialbtn">Route From Whitepost to Virginia <span>&rsaquo;</span></button>';
    }

    if ( routeVar === 'nc_twoRoute' ) {

        routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Whalebone to Gold Valley Crossroads <span>&rsaquo;</span></button>' +
            '<button id="part-two-init" class="more-detail partialbtn">Route Gold Valley Crossroads to Jamestown <span>&rsaquo;</span></button>' +
            '<button id="part-three-init" class="more-detail partialbtn">Route Jamestown to Shining Route Wilderness <span>&rsaquo;</span></button>' +
            '<button id="part-four-init" class="more-detail partialbtn">Route Shining Route Wilderness to Murphy <span>&rsaquo;</span></button>';        
    }

    if ( routeVar === 'nc_fourRoute' ) {

        routeButtons.innerHTML = '<button id="part-one-init" class="more-detail partialbtn">Route Virginia (East) to Stovall <span>&rsaquo;</span></button>' +
            '<button id="part-two-init" class="more-detail partialbtn">Route Stovall to Virginia (West) <span>&rsaquo;</span></button>';
    }
}

// Route Init
function addRoute(routeVar) {

    directions.options.profile = 'mapbox.driving';
    
    var routeObject,
        routeOneInit,
        routeTwoInit,
        routeThreeInit,
        routeFourInit;

    if ( routeVar === 'us_oneRoute' ) {

        routeOneInit = document.getElementById('part-one-init');
        routeTwoInit = document.getElementById('part-two-init');

        routeOneInit.addEventListener( 'click', function() {
            routeObject = us_oneRoute_partOne;
            calcRoute(routeObject);
        });

        routeTwoInit.addEventListener( 'click', function() {
            routeObject = us_oneRoute_partTwo;
            calcRoute(routeObject);
        });

    } else if ( routeVar === 'nc_threeRoute' ) {
        
        routeOneInit = document.getElementById('part-one-init');
        routeTwoInit = document.getElementById('part-two-init');
        routeThreeInit = document.getElementById('part-three-init');

        routeOneInit.addEventListener( 'click', function() {
            routeObject = nc_threeRoute_partOne;
            calcRoute(routeObject);
        });

        routeTwoInit.addEventListener( 'click', function() {
            routeObject = nc_threeRoute_partTwo;
            calcRoute(routeObject);
        });

        routeThreeInit.addEventListener( 'click', function() {
            routeObject = nc_threeRoute_partThree;
            calcRoute(routeObject);
        });

    } else if ( routeVar === 'nc_twoRoute' ) {

        routeOneInit = document.getElementById('part-one-init');
        routeTwoInit = document.getElementById('part-two-init');
        routeThreeInit = document.getElementById('part-three-init');
        routeFourInit = document.getElementById('part-four-init');

        routeOneInit.addEventListener( 'click', function() {
            routeObject = nc_twoRoute_partOne;
            calcRoute(routeObject);
        });

        routeTwoInit.addEventListener( 'click', function() {
            routeObject = nc_twoRoute_partTwo;
            calcRoute(routeObject);
        });

        routeThreeInit.addEventListener( 'click', function() {
            routeObject = nc_twoRoute_partThree;
            calcRoute(routeObject);
        });

        routeFourInit.addEventListener( 'click', function() {
            routeObject = nc_twoRoute_partFour;
            calcRoute(routeObject);
        });

    } else if ( routeVar === 'nc_fourRoute' ) {

        routeOneInit = document.getElementById('part-one-init');
        routeTwoInit = document.getElementById('part-two-init');

        routeOneInit.addEventListener( 'click', function() {
            routeObject = nc_fourRoute_partOne;
            calcRoute(routeObject);
        });

        routeTwoInit.addEventListener( 'click', function() {
            routeObject = nc_fourRoute_partTwo;
            calcRoute(routeObject);
        });

    } else {

        routeInit = document.getElementById('route-init');
    
        routeInit.addEventListener( 'click', function() {
            
            if ( routeVar === 'nc_fiveRoute' ) {
                routeObject = nc_fiveRoute;
            } else if ( routeVar === 'nc_sixRoute' ) {
                routeObject = nc_sixRoute;
            } else if ( routeVar === 'nc_sevenRoute' ) {
                routeObject = nc_sevenRoute;
            } else if ( routeVar === 'nc_eightRoute' ) {
                routeObject = nc_eightRoute;
            } else if ( routeVar === 'sandhillsRoute' ) {
                routeObject = sandhillsRoute;
            }

            calcRoute(routeObject);

        });
    }    
}

function calcRoute(routeObject) {

    if ( directions._waypoints ) {
        directions._waypoints = [];
    }

    directions
        .setOrigin( routeObject[0] )
        .setDestination( routeObject[ routeObject.length - 1 ] );
    directions.query();

    infobox.innerHTML = '';
    clearElevation();
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
        chartHeight = 150;
    } else {
        chartHeight = 100;
    }

    c3.generate({
        bindto: '.' + chartClass,
        data: {
            url : '/wp-content/themes/walkbikenc/json/elevation/' + routeId + '/',
            mimeType: 'json',
            type : 'area',
            colors : { "elevation" : routeColor }
        },
        point: { show: false },
        axis: { 
            x : { show : false },
            y : { show : false }
        },
        padding : {
            left: 0,
            right: 0
        },
        size : {
            height : chartHeight
        },
        legend : { show : false }
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

window.addEventListener( 'beforeprint', function() {
    if ( directions.directions.routes.length > 0 ) {
        var bounds = map.getBounds( directions.directions.routes[0] );
        map.fitBounds( bounds );
    }
});

window.matchMedia('print').addListener( function() { 
    if ( directions.directions.routes.length > 0 ) {
        var bounds = map.getBounds( directions.directions.routes[0] );
        map.fitBounds( bounds );
    }
});