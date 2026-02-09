<?php
add_action( 'wp_enqueue_scripts', function() {
    $themeUrl = get_template_directory_uri();

    // css files
    wp_enqueue_style( 'scrollable-css', $themeUrl . '/assets/vender/scrollable/scrollable.css?ver=1.0.1' );
    wp_enqueue_style( 'style-css', $themeUrl . '/assets/css/common.css?ver=1.0.1' );

    if(is_front_page()){
        wp_enqueue_style( 'slick-css', $themeUrl . '/assets/vender/slick/slick.css?ver=1.0.1' );
        wp_enqueue_style( 'top-css', $themeUrl . '/assets/css/top.css?ver=1.0.1' );
    }

    

    // js files

    wp_enqueue_script( 'jquery-js', $themeUrl . '/assets/vender/jquery/jquery-3.5.1.min.js', array(), '1.0', true );    
    wp_enqueue_script( 'scrollable-js', $themeUrl . '/assets/vender/scrollable/scrollable.js', array(), '1.0', true );
    wp_enqueue_script( 'cookie-js', $themeUrl . '/assets/js/cookie.js', array(), '1.0', true );
    wp_enqueue_script( 'common-js', $themeUrl . '/assets/js/common.js', array(), '1.0', true );
    

    // js only page, post
    if(is_front_page()){
        wp_enqueue_script( 'slick-js', $themeUrl . '/assets/vender/slick/slick.min.js', array(), '1.0', true );
        wp_enqueue_script( 'top-js', $themeUrl . '/assets/js/top.js', array(), '1.0', true );
    }

} );             
?>