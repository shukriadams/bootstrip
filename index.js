let chokidar = require('chokidar'),
    fs = require('fs-extra'),
    fileconcat = require('fileconcat'),
    path = require('path'),
    port = 8020,
    sass = require('node-sass'),
    _triggerFile = null

/** 
 * Converts a Sass file map to its destination compiled css path in ./tmp folder
 */
function mapSassToCss(file){
    return path.join(
        './.tmp',
        path.dirname(file),
        path.basename(file).substr(0, path.basename(file).length - 5) + '.css') // remove .scss extension
}

async function concatenate(){
    return new Promise(async function(resolve, reject){
        try {
            await fs.ensureDir('./src/css')

            fileconcat(['./.tmp/src/modules/base/**/*.css'], './src/css/style.css').then(() => {
                fileconcat(['./.tmp/src/modules/themes/default/**/*.css'], './src/css/theme-default.css').then(() => {
                    resolve()
                })
            })
            
        } catch(ex){
            resolve(ex)
        }
    })
}

/** 
 * Compiles a Sass file to Css. CSS is written to ./tmp/css folder.
 */
async function compileSassFile(file){
    return new Promise(function(resolve, reject){

        try {
            sass.render({
                file: file,
                sourceComments: true
            }, function(err, result){
                if (err){
                    console.log(err);
                    return resolve(err);
                }
                    

                const outfile = mapSassToCss(file);
                fs.ensureDirSync(path.dirname(outfile))
                fs.writeFileSync(outfile, result.css);
                console.log(`compiled ${outfile}`);
                resolve();
        
            });
        }catch(ex){
            reject(ex);
        }
    });
}

/** 
 * Called by SassWatcher when a sass file is added or changed. Compiles the sass that triggered
 * event, then concats all css files in ./tmp and places it in Express public folder. To improve
 * performance, if multiple Sass files trigger simultaneously concating is done only after the last
 * Sass file is compiled.
 */
async function handleSassEvent(file){
    _triggerFile = file
    console.log('sass', file)
    await compileSassFile(file);
    
    if (_triggerFile === file){
        await concatenate();
        console.log(`concatenated css after last change to ${file}`);
    }
}

/**
 * Load world's smallest Express server
*/
function startExpress(){
    const http = require('http'),
        Express = require('express'),
        handlebarsLoader = require('madscience-handlebarsloader'),
        app = Express()

    handlebarsLoader.initialize({ 
        forceInitialize : true,
        pages : './src/hbs/pages',
        partials : './src/hbs/partials'
    })

    app.use(Express.static('./src'))
    app.get('/', async function (req, res) {
        try {
            const view = await handlebarsLoader.getPage('index')
            res.send(view())
        } catch (ex){
            console.log(ex)
            res.end(ex)
        }
    })

    let server = http.createServer(app)
    server.listen(port)
    console.log(`express listening on port ${port}`)
}


(async function(){
    // set up required paths
    await fs.remove('./.tmp');
    await fs.ensureDir('./.tmp');

    // start watching sass files
    let sassWatcher = chokidar.watch(['./src/modules/**/*.scss'], {
        persistent: true,
        usePolling: true
    });

    sassWatcher
        .on('add', async function(file) {
            await handleSassEvent(file);
        })
        .on('change', async function(file){
            await handleSassEvent(file);
        })
        .on('unlink', async function(file){
            const outfile = mapSassToCss(file);
            await fs.remove(outfile);
            await concatenate();
            console.log(`processed delete ${file}`);
        });

    startExpress();

    console.log('Watching...');
})()