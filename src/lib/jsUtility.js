let chokidar = require('chokidar'),
    path = require('path'),
    process = require('process'),
    cwd = process.cwd(),
    fs = require('fs-extra')

module.exports = {

    async watch(){
        // wipe and set up required paths
        await fs.remove(path.join(cwd, './web/js'))
        await fs.ensureDir(path.join(cwd, './web/js'))

        const watcher = chokidar.watch(['./modules/base/**/*.js'], {
            persistent: true,
            usePolling: true,
            ignoreInitial: true
        })

        watcher
            .on('add', async file => {
                await this.bundleAll(false)
            })
            .on('change', async file =>{
                await this.bundleAll(false)
            })
            .on('unlink', async file =>{
                await this.bundleAll(false)
            })

        await this.bundleAll(false)
    },

    /**
     * Concatenates all files found by "find" glob
     * find : glob string
     * output : path for output file
     */
    async bundleAll(minify = true){
        const webBuildUtils = require('madscience-webbuildutils'),
            headerUtil = require('./headerUtil'),
            header = await headerUtil.generateHeader()

        await fs.ensureDir('./web/js')

        const bundledFiles = await webBuildUtils.bundle('./modules/base/**/*.js', './web/js/bootstrip.js')
        console.log('Bundled ', bundledFiles)
        if (minify){
            await webBuildUtils.minifyJS(path.join(cwd, 'web/js/bootstrip.js'), path.join(cwd, 'web/js/bootstrip.min.js'))
            console.log('Minified')

            await webBuildUtils.bannerize(path.join(cwd, 'web/js/bootstrip.js'), header)
            await webBuildUtils.bannerize(path.join(cwd, 'web/js/bootstrip.min.js'), header)
            console.log('Bannerized')
        }
    }
}