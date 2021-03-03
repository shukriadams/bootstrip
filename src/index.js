let handlebarsUtility = require('./lib/handlebarsUtility'),
    sassUtility = require('./lib/sassUtility'),
    port = 8020;

(async function(){

    const http = require('http'),
        Express = require('express'),
        app = Express()

    app.use(Express.static('./web'))
    app.use(Express.static('./images'))
    app.use(Express.static('./js'))
    
    await sassUtility.watch()
    await handlebarsUtility.watch()

    let server = http.createServer(app)
    server.listen(port)
    console.log(`express listening on port ${port}`)

})()