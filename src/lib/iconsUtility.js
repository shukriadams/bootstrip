/**
 * This script builds fonts from svgs. It is not supposed to be run on build servers, but rather on local dev systems. Please commit your 
 * fonts to git after generation.
 */
module.exports = {
    renderAll(){
        const webfontsGenerator = require('webfonts-generator')
 
        webfontsGenerator({
                files: [
                    'svgs/add.svg',
                    'svgs/back.svg',
                    'svgs/check.svg',
                    'svgs/close.svg',
                    'svgs/github.svg',
                    'svgs/heart.svg',
                    'svgs/right.svg',
                    'svgs/menu.svg',
                    'svgs/star.svg',
                    'svgs/search.svg',
                    'svgs/cart.svg',
                    'svgs/tick.svg',
                    'svgs/cube.svg',
                    'svgs/up.svg',
                    'svgs/down.svg'
                ],
                dest: './web/css/icons/',
                cssFontsUrl : '/css/icons',
                types :['woff2', 'woff', 'eot', 'ttf'],
                html : true
            }, function(error) {
                if (error)
                    console.log('Error generating icons :', error)
                else
                    console.log('Icons generated')
            })
    }
}
