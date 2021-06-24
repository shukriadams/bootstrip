(async( )=>{
    const fs = require('fs-extra'),
        handlebarsUtility = require('./../lib/handlebarsUtility'),
        sassUtility = require('./../lib/sassUtility'),
        iconsUtility = require('./../lib/iconsUtility'),
        jsUtility = require('./../lib/jsUtility')

    await fs.remove('./web')
    await handlebarsUtility.renderAll()
    await sassUtility.renderAll()
    await iconsUtility.renderAll()
    await jsUtility.bundle()
    await fs.copy('./static', './web')
})()