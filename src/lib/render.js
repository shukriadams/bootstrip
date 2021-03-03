module.exports = async ()=>{
    const path = require('path'),
        process = require('process'),
        cwd = process.cwd(),
        fs = require('fs-extra'),
        Handlebars = require('handlebars'),
        Spectr = require('spectr')

    Spectr.engines.handlebars({ Handlebars })

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
        templates : {
            views : path.join(cwd, 'hbs/partials/**/*.hbs'),
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

            var filePath = path.join('./web', output.path)
            if (!fs.existsSync(path.dirname(filePath)))
                fs.mkdirSync(path.dirname(filePath))

            fs.writeFile(filePath, output.content, ()=>{
                console.log(`rendered ${filePath}`)
            })
        },
        done : function(){
            console.log('rendered')
        }
    })


}
