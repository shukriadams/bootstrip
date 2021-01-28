let path = require('path'),
    fs = require('fs'),
    Spectr = require('spectr').spectr,
    HandlebarsEngine = require('spectr').engines.handlebars,
    spectr = new Spectr({
        templates : {
            views : path.join(__dirname, './src/hbs/partials/**/*.hbs'),
            pages : path.join(__dirname, './src/hbs/pages/**/*.hbs')
        },
        models : {
            pages : { cwd : path.join(__dirname, './src/models/pages'), src : ['**/*.json'] },
            functions : path.join(__dirname, './bogus/**/*.js'),
            static : path.join(__dirname, './bogus/**/*.json')
        },
        engine : new HandlebarsEngine()
    }),
     folderPath = path.join(__dirname, 'web')

if (!fs.existsSync(folderPath))
    fs.mkdirSync(folderPath)

// reload all data from file each page load, you probably want this on a dev environment
spectr.renderAllRoutes({
    file : function(err, output){
        if (err ||output.content === null)
            return console.log(err)

        var filePath = path.join(folderPath, output.path)
        if (!fs.existsSync(path.dirname(filePath)))
            fs.mkdirSync(path.dirname(filePath))

        fs.writeFile(filePath, output.content, ()=>{
            console.log('file written')
        })
    },
    done : function(){
        console.log('finished rendering')
    }
})

