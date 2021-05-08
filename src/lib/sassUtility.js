let chokidar = require('chokidar'),
    fs = require('fs-extra'),
    fileconcat = require('fileconcat'),
    path = require('path'),
    process = require('process'),
    cwd = process.cwd(),
    exec = require('madscience-node-exec'),
    runner = require('node-sass-runner'),
    _triggerFile = null

module.exports = {

    async watch(){

        // wipe and set up required paths
        fs.removeSync(path.join(cwd, '.tmp'))
        fs.ensureDirSync(path.join(cwd, '.tmp'))

        // start watching sass files
        const watcher = chokidar.watch(['./modules/**/*.scss'], {
            persistent: true,
            usePolling: true,
            ignoreInitial: true
        })

        watcher
            .on('add', async file => {
                await this.handleSassEvent(file)
            })
            .on('change', async file =>{
                await this.handleSassEvent(file)
            })
            .on('unlink', async file =>{
                const outfile = this.mapSassToCss(file)
                await fs.remove(outfile)
                await this.concatenate()
            })

        await this.renderAll()
    },

    async renderAll(){
        await runner.renderAll({
            scss : './modules/**/*.scss',
            css : path.join(cwd, '.tmp')
        })

        await this.concatenate()

    },


    async concatFiles(infiles, outFile){
        return new Promise((resolve, reject)=>{
            try {
                fileconcat(infiles, outFile).then(() => {
                    resolve()
                }) 
            } catch(ex){
                reject(ex)
            }
        })
    },


    /** 
     * Converts a Sass file map to its destination compiled css path in ./tmp folder
     */
    mapSassToCss(file){
        return path.join(
            cwd,
            '.tmp',
            path.dirname(file),
            path.basename(file).substr(0, path.basename(file).length - 5) + '.css') // remove .scss extension
    },

    async concatenate(){
        const hash = (await exec.sh({ cmd : 'git rev-parse --short HEAD' })).result,
            tag = (await exec.sh({ cmd : 'git describe --abbrev=0 --tags' })).result,
            header = `/* tag: ${tag}     hash: ${hash} */`

        await fs.ensureDir(path.join(cwd, 'web/css'))
        await fs.outputFile(path.join(cwd,'.tmp/modules/base/_header.css'), header)
        await fs.outputFile(path.join(cwd,'.tmp/modules/themes/default/_header.css'), header)
        await fs.outputFile(path.join(cwd,'.tmp/modules/themes/darkmoon/_header.css'), header)

        await this.concatFiles([path.join(cwd, '.tmp/modules/base/**/*.css')], path.join(cwd, 'web/css/bootstrip.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/themes/default/**/*.css')], path.join(cwd, 'web/css/bootstrip-theme-default.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/themes/darkmoon/**/*.css')], path.join(cwd, 'web/css/bootstrip-theme-darkmoon.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/demo/**/*.css')], path.join(cwd, 'web/css/bootstrip-demo.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/dashboard-common/**/*.css')], path.join(cwd, 'web/css/bootstrip-demo-dashboard-common.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/dashboard-default/**/*.css')], path.join(cwd, 'web/css/bootstrip-demo-dashboard-default.css'))
        await this.concatFiles([path.join(cwd, '.tmp/modules/dashboard-darkmoon/**/*.css')], path.join(cwd, 'web/css/bootstrip-demo-dashboard-darkmoon.css'))
    },

    /** 
     * Called by SassWatcher when a sass file is added or changed. Compiles the sass that triggered
     * event, then concats all css files in ./tmp and places it in Express public folder. To improve
     * performance, if multiple Sass files trigger simultaneously concating is done only after the last
     * Sass file is compiled.
     */
    async handleSassEvent(file){
        _triggerFile = file
        console.log('sass', file)
        await this.compileSassFile(file)
        
        if (_triggerFile === file){
            await this.concatenate()
            console.log(`concatenated css after last change to ${file}`)
        }
    },

    /** 
     * Compiles a Sass file to Css. CSS is written to ./tmp/css folder.
     */
    async compileSassFile(file){
        const outfile = this.mapSassToCss(file)
        await runner.renderSingle(file, outfile)
    }

}