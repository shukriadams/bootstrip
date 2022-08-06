let chokidar = require('chokidar'),
    path = require('path'),
    process = require('process'),
    cwd = process.cwd(),
    fs = require('fs-extra'),
    Handlebars = require('handlebars'),
    layouts = require('handlebars-layouts'),
    Spectr = require('spectr')

function stripIndent(html){
    let lines = html.split('\n'),
        out = [],
        clip = 0,
        reset = true;

    for (let line of lines){

        // find start start of <pre> block
        if (line.trim().toLowerCase().indexOf('<pre') !== -1)
            clip = line.toLowerCase().indexOf('<pre');

        // find end of <pre> block
        if (clip > 0 && line.indexOf('</pre>') !== -1)
            reset = true;

        if (clip > 0)
            line = line.substring(clip)

        if (reset){
            clip = 0;
            reset = false;
        }

        out.push(line);
    }

    return out.join('\n');
}

module.exports = {

    async watch(){

        // wipe and set up required paths
        const workPath = path.join(cwd, 'web')
        fs.ensureDirSync(workPath)

        // start watching sass files
        const watcher = chokidar.watch([path.join('./hbs/**/*.hbs'), path.join('./modules/**/*.hbs'), path.join('./data/**/*')], {
            persistent: true,
            usePolling: true, 
            ignoreInitial: true
        })

        watcher
            .on('add', async file => {
                await this.renderAll(file)
            })
            .on('change', async file =>{
                await this.renderAll(file)
            })
            .on('unlink', async file =>{
                await this.renderAll(file)
            })

        await this.renderAll()
    },

    async renderAll (){
        Handlebars.registerHelper(layouts(Handlebars))

        Handlebars.registerHelper('stringify', data =>{
            return data ? JSON.stringify(data) : ''
        })

        Handlebars.registerHelper('for_n', (n, block) =>{
            let out = ''

            for (let i = 0 ; i < n ; i ++)
                out += block.fn(i)
            
            return out
        })

        Handlebars.registerHelper('sum', function(value1, value2){
            return parseInt(value1.toString()) + parseInt(value2.toString())
        })

        Handlebars.registerHelper('eq', (value1, value2, options)=>{
            return value1 === value2 ? 
                options.fn(this) :  
                options.inverse(this)
        })

        const spectr = new Spectr.Spectr({
            engine : new Spectr.engines.handlebars({
                Handlebars
            }),
            templates : {
                views :[ path.join(cwd, 'modules/**/*.hbs'), path.join(cwd, 'hbs/partials/**/*.hbs') ],
                pages : path.join(cwd, 'hbs/pages/**/*.hbs')
            },
            models : {
                pages : { cwd : path.join(cwd, 'data/pages'), src : ['**/*.json'] },
                functions : path.join(cwd, 'data/functions/**/*.js'),
                static : path.join(cwd, 'data/static/**/*.json')
            }
        })

        
        spectr.renderAllRoutes({
            file : function(err, output){
                if (err ||output.content === null)
                    return console.log(err)

                var filePath = path.join(cwd, 'web', output.path)
                if (!fs.existsSync(path.dirname(filePath)))
                    fs.mkdirSync(path.dirname(filePath))

                fs.writeFile(filePath, stripIndent( output.content), ()=>{
                    console.log(`rendered ${filePath}`)
                })
            },
            done : function(){
                console.log('rendering done')
            }
        })
        

    }
}