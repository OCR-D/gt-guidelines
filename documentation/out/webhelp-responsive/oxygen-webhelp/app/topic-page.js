/**
 * Load the libraries for the DITA topics pages.
 */
define(["require", "config"], function() {
    require([
        'nav-links-loader',
        'searchAutocomplete',
        'webhelp',
        'search-init',
        'expand',
        'image-map',
        'template-module-loader'
    ]);
});