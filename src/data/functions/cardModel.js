module.exports = (content = '*', count = 1)=>{

    content = content.split(',')

    let model = { 
        align : 'Left',
        modifiers : '',
        content : []
    }

    if (content.includes('*') || content.includes('image'))
        model.image = "/images/example.jpg"

    if (content.includes('align=right'))
        model.modifiers += 'card--alignRight '
    
    if (content.includes('align=center'))
        model.modifiers += 'card--alignCenter '

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