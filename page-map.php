<?php
/*
* Template Name: Map
*/
get_header(); ?>

<div class="data-steps" id="steps-wrap">

	<div class="step" data-intro="Map Controls" data-step="1">
		<h5>Map Controls</h5>

		<h6>Zooming</h6>
		<p>To zoom in on the map, click the “+” icon. (<i class="in-icon"></i>)</p>
		<p>To zoom out on the map, click the “-“ icon. (<i class="out-icon"></i>)</p>

		<h6>Layers</h6>
		<p>To turn on/off layers, click on the layer icon. (<i class="layer-icon"></i>)</p>

		<h6>Layer Descriptions</h6>

		<ul>
			<li><strong>Background Selection</strong></li>
			<li>Simple background – gray background</li>
			<li>Satellite background – aerial photograph background</li>
			<li>Terrain background – background showing terrain</li>
		</ul>

		<ul>
			<li><strong>Layer Selection</strong></li>
			<li>You may turn on or off the layers Bike Shops, Historic Districts, Campgrounds, State Parks with Camping, and Bike Routes.</li>
			<li>To see the name of the location, click on the map icon.</li>
			<li>Zoom in for further locational information.</li>
		</ul>

		<h6>Full Screen Option</h6>
		<p>Click on full screen icon (<i class="fullscreen-icon"></i>) to see the map in full screen mode.</p>

	</div>

	<div class="step panning-step" data-intro="Panning" data-step="2">
		<h6>Panning</h6>
		<p>To pan around the map, place the cursor on the map, click and drag.</p>
	</div>

	<div class="step panning-step" data-intro="Route Information" data-step="3">
		<h5>Route Information</h5>
		<p>Upon selecting a route</p>

		<h6>Turn-by-turn directions</h6>
		<p>On the right hand side are turn-by-turn directions for the selected route.</p>
		<h6>Route Reversal Option</h6>
		<p>To reverse the route (change the starting point to the opposite end), click on the reverse (<i class="reverse-icon"></i>) icon. The directions will start from the new location and elevation profile will update.</p>
		<h6>Elevation Profile</h6>
		<p>The elevation profile is shown along the bottom of the screen. To zoom in, zoom out, or pan on elevation profile, you may scroll and drag.</p>
		<h6>Update Starting Point</h6>
		<p>To adjust the location of your starting point, select orange dots located along the route.</p>

		<div class="directions-sample">Turn-by-turn directions</div>
		<div class="elevation-sample">Elevation</div>
	</div>

</div>

<section class="map-wrapper">

	<div class="custom-popup" id="map"></div>

	<div id="intro-start">?</div>

	<div id="infobox"></div>

	<div id='inputs'></div>
	<div id='errors'></div>
	<div id='out'></div>
	<div id='directions'>
		<div id="directions-name"></div>
		<strong class="directions-title">Turn-by-Turn Directions</strong>
		<div id='routes'></div>
		<div id='instructions'></div>
		<div id="reverse" class="mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input"></div>
		<div id="reload" class="reload-icon"></div>
		<div id="print" class="print-icon"></div>
	</div>
	<div class="chart-wrap">
		<strong class="elevation-title">Elevation Profile</strong>
		<span class="zoom-info">zoom in for more detail</span>
		<div class="elevation-chart" id="elevation-chart"></div>
	</div>

</section>

<?php get_footer(); ?>