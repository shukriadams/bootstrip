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
                await this.bundle()
            })
            .on('change', async file =>{
                await this.bundle()
            })
            .on('unlink', async file =>{
                await this.bundle()
            })

        await this.bundle()
    },

    /**
     * Concatenates all files found by "find" glob
     * find : glob string
     * output : path for output file
     */
    async bundle(){
        const fsUtils = require('madscience-fsUtils'),
            bundle = await fsUtils.bundle('./modules/base/**/*.js', './web/js/bootstrip.js')
            
        console.log('Bundled ', bundle)
    }
}