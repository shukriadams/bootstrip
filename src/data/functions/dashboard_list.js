const sample = require('lodash.sample')

module.exports = (rows, cells)=>{

    const data = []
    rows = parseInt(rows)
    cells = parseInt(cells)

    for (let row_counter = 0 ; row_counter < rows ; row_counter ++){
        const row_model = { cells: []}
        for (let cell_counter = 0 ; cell_counter < cells ; cell_counter ++){
            const cell_model = {}

            if (cell_counter === 0 || cell_counter === 3  || cell_counter === 6){
                cell_model.icon = sample(['heart', 'star', 'cube', 'cart', 'search'])
                cell_model.color = sample(['#6442FF', '#DB0041', '#20AD00'])
            }

            cell_model.text = 
                cell_counter === 0 ? sample(['Tokyo', 'Berlin', 'Nairobi', 'Moscow', 'Lima', 'Manilla']) :
                cell_counter === 1 ? sample(['€102.34', '€12.14', '€1372.41', '€2.24',]) :
                cell_counter === 2 ? sample(['Transferred', 'Pending', 'Cancelled', 'Rejected']) : 
                cell_counter === 3 ? sample(['Amazin', 'Microshift', 'Goggles', 'Applied']) : 
                    sample(['Automative', 'Hospitality', 'Media', 'Entertainment', 'Aggritech', 'Pharma'])

            if (cell_counter === 2)
                cell_model.badgeType = sample(['default', 'warning', 'success', 'danger'])

            row_model.cells.push(cell_model)
        }
        data.push(row_model)
    }

    return data
}