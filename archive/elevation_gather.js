directions.on( 'load', function() {   
    if ( directions.directions.routes.length > 0 ) {
        var dir = directions.directions.routes[0];
        routeElevation(dir);
    }

    var steps = directions.directions.routes[0].steps;
    // console.log(JSON.stringify(steps), null, 4);
});

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
            bottom : 0,
            left : 35,
            right : 10,
            top : 10
        },
        grid: {
            y: {
                show: true
            }
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

        points.push( pointLat, pointLng );
                    
        if ( i % 20 === 0 ) {
                points.push( pointLat, pointLng );
        }
    }

    var query = points.toString(),
        url = 'http://open.mapquestapi.com/elevation/v1/profile?key=' + key + '&shapeFormat=raw&unit=f&latLngCollection=' + query;

    var req = new XMLHttpRequest();
    req.onload = reqListener;
    req.open("get", url, true);
    req.send();
}