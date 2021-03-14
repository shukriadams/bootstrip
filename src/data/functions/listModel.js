const sample = require('lodash.sample')

module.exports = (rowCount = '3', cellCount = '3')=>{
    rowCount = parseInt(rowCount)
    cellCount = parseInt(cellCount)

    const model = {
        rows : []
    }

    for (let i = 0 ; i < rowCount ; i ++){
        const row = { 
            active : sample([true, false]),
            cells : [] 
        }

        model.rows.push(row)

        for (let j = 0 ; j < cellCount ; j ++){
            const hasContent = sample([true, true])

            row.cells.push ({
                text : hasContent ? 'Lorem' : '',
                undertext : hasContent ? 'Ipsum' : '',
            })
        }
    }

    return model
}