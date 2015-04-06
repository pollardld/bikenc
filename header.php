<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<title><?php wp_title(''); ?><?php if(wp_title('', false)) { echo ' :'; } ?> <?php bloginfo('name'); ?></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<meta name="description" content="<?php bloginfo('description'); ?>">
	<meta name="keywords" content="bicycle, bicycling, bike, walk, walking, community, communities, project, studies, case studies, walk bike, walking biking, biking">
	<link href="http://fonts.googleapis.com/css?family=Lato:300,400,700,900|OpenSans:300,400,700,900" type="text/css">

	<link rel="shortcut icon" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-152x152.png" type="image/x-icon" />
	<!-- Apple Touch Icons -->
	<link rel="apple-touch-icon" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon.png" />
	<link rel="apple-touch-icon" sizes="57x57" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-114x114.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-144x144.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-114x114.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-144x144.png" />
	<link rel="apple-touch-icon" sizes="60x60" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-120x120.png" />
	<link rel="apple-touch-icon" sizes="120x120" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-120x120.png" />
	<link rel="apple-touch-icon" sizes="76x76" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-152x152.png" />
	<link rel="apple-touch-icon" sizes="152x152" href="/wp-content/themes/walkbikenc/img/favicons/apple-touch-icon-152x152.png" />
	<!-- Windows 8 Tile Icons -->
    <meta name="msapplication-square70x70logo" content="/wp-content/themes/walkbikenc/img/favicons/smalltile.png" />
	<meta name="msapplication-square150x150logo" content="/wp-content/themes/walkbikenc/img/favicons/mediumtile.png" />
	<meta name="msapplication-wide310x150logo" content="/wp-content/themes/walkbikenc/img/favicons/widetile.png" />
	<meta name="msapplication-square310x310logo" content="/wp-content/themes/walkbikenc/img/favicons/largetile.png" />

	<script>
		var $buoop = {c:2};
		function $buo_f(){
		 var e = document.createElement("script");
		 e.src = "//browser-update.org/update.js";
		 document.body.appendChild(e);
		};
		try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
		catch(e){window.attachEvent("onload", $buo_f)}
	</script>

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

	<header>

		<section class="beta-notice">This is the initial, beta release of this website. Please provide comments and suggestions <a href="/contact/">here</a>.</section>

		<input type="checkbox" name="nav" class="nav-check">
    	<label rel="navigation" class="navicon"></label>

		<nav class="nav-menu">
			<?php wp_nav_menu( array(
				'theme_location' => 'header-menu',
				'menu' => 'main',
				'container' => false,
				'items_wrap' => '<ul class="main-nav">%3$s</ul>'
			)); ?>
		</nav>

		<div class="intro">
			<a href="/">
				<?php include ( get_stylesheet_directory() . '/img/logo.svg' ); ?>
			</a>
			<span id="beta-label">Beta</span>
		</div>

	</header>