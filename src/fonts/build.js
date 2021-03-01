/**
 * This script builds fonts from svgs. It is not supposed to be run on build servers, but rather on local dev systems. Please commit your 
 * fonts to git after generation.
 */
const webfontsGenerator = require('webfonts-generator')
 
webfontsGenerator({
        files: [
            'svgs/add.svg',
            'svgs/back-arrow.svg',
            'svgs/check-symbol.svg',
            'svgs/close-button.svg',
            'svgs/favorite-heart-button.svg',
            'svgs/keyboard-right-arrow-button.svg',
            'svgs/menu-button.svg',
            'svgs/rate-star-button.svg',
            'svgs/searching-magnifying-glass.svg',
            'svgs/shopping-cart.svg',
            'svgs/tick-inside-circle.svg'
        ],
        dest: './../web/css/icons/',
        cssFontsUrl : '/css/icons',
        types :['woff2', 'woff', 'eot', 'ttf'],
        html : true
    }, function(error) {
        if (error)
            console.log('Fail!', error)
        else
            console.log('Done!')
    })