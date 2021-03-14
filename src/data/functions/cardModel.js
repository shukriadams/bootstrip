module.exports = (content = '*', count = 1)=>{

    content = content.split(',')

    let model = { 
        align : 'Left',
        stroke : null,
        modifiers : '',
        content : []
    }

    if (content.includes('*') || content.includes('image'))
        model.image = 'http://placehold.it/1280x720'

    if (content.includes('align=right'))
        model.modifiers += 'right '
    
    if (content.includes('stroke')){
        model.stroke = 'warning'
        model.modifiers += ' stroke '
    }

    if (content.includes('align=center'))
        model.modifiers += 'center '

    for (let i = 0 ; i < count ; i ++){
        const item = { }

        if (content.includes('*') || content.includes('title'))
            item.title = "Lorem title"
    
        if (content.includes('*') || content.includes('text'))
            item.text = "Some quick example text to build on the card title and make up the bulk of the card's content."
    
        if (content.includes('*') || content.includes('link'))
            item.link = "Go somewhere"

    
        model.content.push(item)
    }
    
    return model
}