(async function(){
    const handlebarsUtility = require('./lib/handlebarsUtility'),
        jsUtility = require('./lib/jsUtility'),
        sassUtility = require('./lib/sassUtility'),
        port = 8020,
        http = require('http'),
        Express = require('express'),
        app = Express()

    app.use(Express.static('./web'))
    app.use(Express.static('./static'))
    
    await sassUtility.watch()
    await handlebarsUtility.watch()
    await jsUtility.watch()
    
    const server = http.createServer(app)
    server.listen(port)
    console.log(`express listening on port ${port}`)

})()