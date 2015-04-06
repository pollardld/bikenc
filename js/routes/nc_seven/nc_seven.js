var nc_sevenRoute = L.Routing.control({
    waypoints : [ 
        L.latLng(35.016641584170756,-76.31627082824707),
        L.latLng(34.83785252525252,-76.42572473247324),
        L.latLng(34.78931919191919,-76.59893646364635),
        L.latLng(34.86138383838384,-76.77677402740274),
        L.latLng(34.97336767676767,-76.80744158415841),
        L.latLng(35.02799393939394,-76.8278295129513),
        L.latLng(35.05488686868687,-76.88025561556155),
        L.latLng(35.093998733374065,-76.87871932983398),
        L.latLng(35.133989898989896,-76.92582863286329),
        L.latLng(35.09711717171717,-77.0267403140314),
        L.latLng(35.108147474747476,-77.04918416841684),
        L.latLng(35.114450505050506,-77.07094271427142),
        L.latLng(35.15268888888889,-77.12593872387238),
        L.latLng(35.1647696969697,-77.23353216321632),
        L.latLng(35.17790101010101,-77.50200178017802),
        L.latLng(35.19103232323232,-77.60685398539854),
        L.latLng(35.20594949494949,-77.70074125412542),
        L.latLng(35.41164791132063,-77.78200149536133),
        L.latLng(35.528454545454544,-77.86521530153016),
        L.latLng(35.58913218871883,-77.93169021606444),
        L.latLng(35.644850505050506,-77.9459103810381),
        L.latLng(35.66659595959596,-77.96681229122913),
        L.latLng(35.67258383838384,-77.97058148814882),
        L.latLng(35.69560863219186,-77.97958374023438),
        L.latLng(35.704600138181455,-77.99232959747314),
        L.latLng(35.74475353535354,-78.00690284028403),
        L.latLng(35.810156948713,-78.00189971923828)
    ],
    plan : L.Routing.plan(null, {
        waypointIcon: function(i) {
            return new L.Icon({
                iconUrl : '/wp-content/themes/walkbikenc/img/marker.png'
            })
        }
    })
}).addTo(body);