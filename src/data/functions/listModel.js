const sample = require('lodash.sample'),
    Chance = require('chance'),
    chance = new Chance()
    
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

        for (let j = 0 ; j < cellCount ; j ++)
            row.cells.push ({
                text : chance.sentence({ words: sample([1, 5]) }),
                undertext : chance.paragraph({ sentences : sample([0, 5]) })
            })
    }

    return model
}