<?php
// Query for home page ================================================ //
function my_post_queries( $query ) {
	// do not alter the query on wp-admin pages and only alter it if it's the main query
	if (!is_admin() && $query->is_main_query()){

	    // alter the query for the home page
	    if( is_home() ){
			$query->set( 'post_type', array( 'routes' ) );
			$query->set( 'orderby', 'date' );
            $query->set( 'order', 'ASC' );
	    }
	}
}
add_action( 'pre_get_posts', 'my_post_queries' );

// Add theme support ================================================ //
if (function_exists('add_theme_support')) {

    // Add Menu Support
    add_theme_support('menus');

    // Add Thumbnail Theme Support
    add_theme_support('post-thumbnails');
    add_image_size('large', 1000, 400, true);
    add_image_size('medium', 400, 400, true);
    add_image_size('small', 200, 200, true);

    add_image_size('route-thumb', 440, 200, true);

    // Enables post and comment RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Localisation Support
    load_theme_textdomain( 'walkbikenc', get_template_directory() . '/languages');
}

// Custom Post Types =============================================== //
add_action( 'init', 'custom_posttype' );
function custom_posttype() {
    register_post_type( 'routes', array(
        'labels' => array(
            'name' => __( 'Routes' ),
            'singular_name' => __( 'Route' )
        ),
        'public' => true,
		'has_archive' => true,
		'menu_position' => 5,
		'supports' => array(
			'title',
			'editor',
			'thumbnail',
			'custom-fields',
			'revisions'
		),
    ));
};

// Excerpt ======================================================= //
function custom_excerpt_length( $length ) {
    return 60;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

function new_excerpt_more( $more ) {
    return ' ... <a href="' . get_permalink() . '" class="excerpt-link more-detail">Read More <span>&rsaquo;</span></a>';
}
add_filter('excerpt_more', 'new_excerpt_more');

// Styles and Scripts =========================================== //
function register_scripts() {
	
    // Styles
	wp_register_style( 
		'style', 
		get_template_directory_uri() . '/style.css', 
		array(), 
		'1.0', 
		'all'
	);

	wp_enqueue_style( 'style' );

    wp_register_script( 
        'mapbox', 
        get_template_directory_uri() . '/js/vendor/mapbox.min.js', 
        array(), 
        '0.1', 
        false
    );

    wp_register_script( 
        'all-vendor-combined', 
        get_template_directory_uri() . '/js/vendor/all-vendor-combined.js', 
        array(), 
        '0.1', 
        true
    );

    /* wp_register_script( 
        'global', 
        get_template_directory_uri() . '/js/global.js', 
        array( 'mapbox', 'jquery' ), 
        '0.1', 
        true
    ); */

    wp_enqueue_script( 'mapbox' );
    wp_enqueue_script( 'all-vendor-combined' );
    // wp_enqueue_script( 'global' );

    if ( is_home() ) {

        wp_register_script( 
            'scripts', 
            get_template_directory_uri() . '/js/scripts.js', 
            array( 'jquery' ), 
            '0.2', 
            true
        );

        wp_enqueue_script( 'scripts' );

    }

    if ( is_page( '2' ) ) {

        wp_register_script( 
            'map-page-vendor-combined', 
            get_template_directory_uri() . '/js/vendor/map-page-vendor-combined.js', 
            array(), 
            '1.0', 
            true
        );

        wp_register_script( 
            'all-routes', 
            get_template_directory_uri() . '/js/routes/index.js', 
            array(), 
            '1.0', 
            true
        );

        wp_register_script( 
            'scripts-routes', 
            get_template_directory_uri() . '/js/scripts-routes.js', 
            array( 'all-routes', 'jquery' ), 
            '1.0', 
            true
        );

        wp_enqueue_script( 'map-page-vendor-combined' );
        wp_enqueue_script( 'all-routes' );
        wp_enqueue_script( 'scripts-routes' );

    }

    if ( is_singular( 'routes' ) ) {

        wp_register_script( 
            'scripts-single', 
            get_template_directory_uri() . '/js/scripts-single.js', 
            array( 'jquery' ), 
            '0.1', 
            true
        );

        wp_enqueue_script( 'scripts-single' );
    }

}
add_action( 'wp_enqueue_scripts', 'register_scripts' );

// Async scripts
if ( !( is_admin() ) ) {

    function defer_parsing_of_js ( $url ) {
        if ( FALSE === strpos( $url, '.js' ) ) return $url;
        if ( strpos( $url, 'jquery.js' ) ) return $url;
        if ( strpos( $url, 'mapbox.min.js' ) ) return $url;
        if ( strpos( $url, 'jquery-migrate.min.js' ) ) return "$url' async defer='defer";
        return "$url";
    }

    add_filter( 'clean_url', 'defer_parsing_of_js', 11, 1 );
}

// Menus ====================================================== //
function register_menus()
{
    register_nav_menus( array( // Using array to specify more menus if needed
        'header-menu' => __('Header Menu', 'walkbikenc'),
        'sidebar-menu' => __('Sidebar Menu', 'walkbikenc'),
        'footer-menu' => __('Footer Menu', 'walkbikenc')
    ));
}
add_action('init', 'register_menus');

// Widgets ====================================================== //
function walkbikenc_widgets_init() {

    register_sidebar( array(
        'name'          => __( 'Footer', 'walkbikenc' ),
        'id'            => 'footer_widget',
        'before_widget' => '',
        'after_widget'  => '',
        'before_title'  => '',
        'after_title'   => '',
    ));

    register_sidebar( array(
        'name'          => __( 'Footer Contact', 'walkbikenc' ),
        'id'            => 'footer_contact',
        'before_widget' => '',
        'after_widget'  => '',
        'before_title'  => '',
        'after_title'   => '',
    ));
}
add_action( 'widgets_init', 'walkbikenc_widgets_init' );

// Remove invalid rel attribute values in the categorylist ===== //
function remove_category_rel_from_category_list($thelist)
{
    return str_replace('rel="category tag"', 'rel="tag"', $thelist);
}
add_filter('the_category', 'remove_category_rel_from_category_list');

// Add page slug to body class, love this - Credit: Starkers Wordpress Theme
function add_slug_to_body_class($classes)
{
    global $post;
    if (is_home()) {
        $key = array_search('blog', $classes);
        if ($key > -1) {
            unset($classes[$key]);
        }
    } elseif (is_page()) {
        $classes[] = sanitize_html_class($post->post_name);
    } elseif (is_singular()) {
        $classes[] = sanitize_html_class($post->post_name);
    }

    return $classes;
}
add_filter('body_class', 'add_slug_to_body_class');

// Remove Admin bar =============================================== //
function remove_admin_bar()
{
    return false;
}
add_filter('show_admin_bar', 'remove_admin_bar');

// Remove 'text/css' from our enqueued stylesheet ================= //
function style_remove($tag)
{
    return preg_replace('~\s+type=["\'][^"\']++["\']~', '', $tag);
}
add_filter('style_loader_tag', 'style_remove');

// Remove thumbnail width and height dimensions that prevent fluid images in the_thumbnail
function remove_thumbnail_dimensions( $html )
{
    $html = preg_replace('/(width|height)=\"\d*\"\s/', "", $html);
    return $html;
}
add_filter('post_thumbnail_html', 'remove_thumbnail_dimensions', 10);
add_filter('image_send_to_editor', 'remove_thumbnail_dimensions', 10); 

// Custom Gravatar in Settings > Discussion ======================== //
function blankgravatar($avatar_defaults)
{
    $myavatar = get_template_directory_uri() . '/img/gravatar.jpg';
    $avatar_defaults[$myavatar] = "Custom Gravatar";
    return $avatar_defaults;
}
add_filter('avatar_defaults', 'blankgravatar');

// Threaded Comments =============================================== //
function enable_threaded_comments()
{
    if (!is_admin()) {
        if (is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
            wp_enqueue_script('comment-reply');
        }
    }
}
add_action('get_header', 'enable_threaded_comments');

// Remove <div> from navs ============================================== //
function my_wp_nav_menu_args($args = '')
{
    $args['container'] = false;
    return $args;
}
add_filter('wp_nav_menu_args', 'my_wp_nav_menu_args');

// SVGs ================================================================ //
function cc_mime_types( $mimes ){
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

// Filters ============================================================ //
add_filter('widget_text', 'shortcode_unautop');
add_filter('the_excerpt', 'shortcode_unautop');
// Remove auto paragraph
remove_filter( 'the_content', 'wpautop' );
remove_filter('the_excerpt', 'wpautop');