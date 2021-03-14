module.exports = (addModifiers = false)=>{
    let modifiers =['', 'danger', 'warning','success'],
        current = 0

    function getModifier(){
        if (!addModifiers)
            return ''

        current ++
        if (current >= modifiers.length)
            current = 0
        return modifiers[current]
        
    }
    const model = {
        columns : [
            { text : '#' },
            { text : 'First' },
            { text : 'Last' },
            { text : 'Handle' }
        ],
        rows : []
    }

    for (let i = 0; i < 9 ; i ++)
        model.rows.push({ cells : [
            { text : i + 1 },
            { text : 'Lorem' },
            { text : 'Ipsum' },
            { text : 'Something' }
        ], modifier : getModifier() })

    return model
}