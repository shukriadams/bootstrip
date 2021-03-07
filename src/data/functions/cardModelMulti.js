module.exports = (color)=>{

    let model = { 
        modifiers : color,
        content : []
    }
    
    model.content.push({
        title: 'Status',
        titleModifiers : 'util-bold'
    })

    model.content.push({
        text: 'All is well <i class="icon icon-add"></i>'
    })

    model.content.push({
        text: 'All is well <i class="icon icon-add"></i>'
    })



    return model
}