(async( )=>{
    const fs = require('fs-extra'),
        handlebarsUtility = require('./../lib/handlebarsUtility'),
        sassUtility = require('./../lib/sassUtility'),
        iconsUtility = require('./../lib/iconsUtility')

    await handlebarsUtility.renderAll()
    await sassUtility.renderAll()
    await iconsUtility.renderAll()
    await fs.copy('./static', './web')
})()