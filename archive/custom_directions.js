/* var container = jQuery(instructionsDiv);

            container.html('');

            var steps = container.append('<ol class="mapbox-directions-steps">');

            var stepsOl = jQuery('.mapbox-directions-steps');

            for (var i = 0, l = routeObject.length; i < l; i++) {
                
                stepsOl.append( '<li class="mapbox-directions-step step' + i + '">' );

                var impDistance = routeObject[i].distance / 1609.344;
                    impDistance = impDistance * 100;
                    impDistance = impDistance.toFixed();
                    impDistance = impDistance / 100;
                
                var step = jQuery('.step' + i)
                    .append( 
                        '<span class="mapbox-directions-icon mapbox-' + routeObject[i].maneuver.type.replace(/\s+/g, '-').toLowerCase() + '-icon"></span>' + 
                        '<div class="mapbox-directions-step-maneuver">' + routeObject[i].maneuver.instruction + '</div>' +
                        '<div class="mapbox-directions-step-distance">' + impDistance + ' miles</div>'
                    );
            } */
