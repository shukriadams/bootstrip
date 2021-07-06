module.exports = {
    async generateHeader(){
        const exec = require('madscience-node-exec'),
            hash = (await exec.sh({ cmd : 'git rev-parse --short HEAD' })).result.trim(),
            tag = (await exec.sh({ cmd : 'git describe --abbrev=0 --tags' })).result.trim()

return `/* 
============================================================
Bootstrip - A stripped-down minimalist version of Bootstrip.
URL : https://github.com/shukriadams/bootstrip
Version: ${tag}
Hash: ${hash}
Date : ${new Date().toISOString().substring(0, 10)}
============================================================
*/

`
    }
}