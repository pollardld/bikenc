//* Routing Directions ============================================================ //
/* var route = L.Routing.control({ 
    waypoints : [],
    plan : L.Routing.plan( null, { 
        waypointIcon : function(i) { return new L.Icon({ 
            iconUrl : '/wp-content/themes/walkbikenc/img/marker.png',
            iconSize : [0, 0],
        })},
        dragStyles : [{color: 'black', opacity: 0.15, weight: 0}, {color: 'white', opacity: 0.8, weight: 0}, {color: markerColor, opacity: 0.8, weight: 5,}],
        geocoder : L.mapbox.geocoder( 'mapbox.places-v1' )
    }),
    fitSelectedRoutes : false,
    pointMarkerStyle : { radius: 10, stroke : false, fillColor: darkGrey, fillOpacity: 1},
    summaryTemplate : '<h2>{name}</h2>',
    containerClassName: 'itinerary-wrap',
    minimizedClassName: 'itinerary-min',
    itineraryClassName: 'itinerary-table',
    show: true
}).addTo(map);

route.on( 'routingstart', function() {
    document.body.classList.add( 'loading' );
    route.on( 'routesfound', function(e) {
        document.body.classList.remove( 'loading' );
        return;
    });
    route.on( 'routingerror', function() {
        console.log( routingerror );
    });
}); */