<?php
function petcalculator_enqueue_assets() {
    wp_enqueue_style(
        'petcalculator-style',
        get_stylesheet_uri(),
        array(),
        filemtime(get_stylesheet_directory() . '/style.css')
    );
    wp_enqueue_script(
        'petcalculator-script',
        get_template_directory_uri() . '/script.js',
        array(),
        filemtime(get_stylesheet_directory() . '/script.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'petcalculator_enqueue_assets');
