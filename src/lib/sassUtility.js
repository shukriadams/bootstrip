let chokidar = require('chokidar'),
    fs = require('fs-extra'),
    path = require('path'),
    process = require('process'),
    cwd = process.cwd(),
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
                await this.bundleAll()
            })

        await this.renderAll()
    },

    async renderAll(){
        const webBuildUtils = require('madscience-webbuildutils'),
            headerUtil = require('./headerUtil')

        await runner.renderAll({
            scss : './modules/**/*.scss',
            css : path.join(cwd, '.tmp'),
            sassOptions: {
                sourceComments : false
            }
        })

        await this.bundleAll()

        webBuildUtils.minifyCSS(path.join(cwd, 'web/css/bootstrip.css'), path.join(cwd, 'web/css/bootstrip.min.css'))
        webBuildUtils.minifyCSS(path.join(cwd, 'web/css/bootstrip-theme-default.css'), path.join(cwd, 'web/css/bootstrip-theme-default.min.css'))
        webBuildUtils.minifyCSS(path.join(cwd, 'web/css/bootstrip-theme-darkmoon.css'), path.join(cwd, 'web/css/bootstrip-theme-darkmoon.min.css'))

        const banner = await headerUtil.generateHeader()
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip.css'), banner)
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip.min.css'), banner)
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip-theme-default.css'), banner)
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip-theme-default.min.css'), banner)
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip-theme-darkmoon.css'), banner)
        webBuildUtils.bannerize(path.join(cwd, 'web/css/bootstrip-theme-darkmoon.min.css'), banner)
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


    /**
     * 
     */
    async bundleAll(){
        const webBuildUtils = require('madscience-webbuildutils')
        await fs.ensureDir(path.join(cwd, 'web/css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/base/**/*.css'), path.join(cwd, 'web/css/bootstrip.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/themes/default/**/*.css'), path.join(cwd, 'web/css/bootstrip-theme-default.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/themes/darkmoon/**/*.css'), path.join(cwd, 'web/css/bootstrip-theme-darkmoon.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/demo/**/*.css'), path.join(cwd, 'web/css/bootstrip-demo.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/dashboard-common/**/*.css'), path.join(cwd, 'web/css/bootstrip-demo-dashboard-common.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/dashboard-default/**/*.css'), path.join(cwd, 'web/css/bootstrip-demo-dashboard-default.css'))
        await webBuildUtils.bundle(path.join(cwd, '.tmp/modules/dashboard-darkmoon/**/*.css'), path.join(cwd, 'web/css/bootstrip-demo-dashboard-darkmoon.css'))
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
            await this.bundleAll()
            console.log(`bundled css after last change to ${file}`)
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