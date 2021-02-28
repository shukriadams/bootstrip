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

    return {
        "columns" : [
            { "text" : "#" },
            { "text" : "First!!" },
            { "text" : "Last" },
            { "text" : "Handle" }
        ],
    
        "rows" : [
            
            { "cells" : [
                { "text" : "1" },
                { "text" : "Bob22" },
                { "text" : "Jacob" },
                { "text" : "Larry" }
            ], "modifier" : getModifier() },
    
            { "cells" : [
                { "text" : "1" },
                { "text" : "Bob3" },
                { "text" : "Jacob" },
                { "text" : "Larry" }
            ], "modifier" : getModifier()},
    
            { "cells" : [
                { "text" : "1" },
                { "text" : "Bodfdb" },
                { "text" : "Jacob" },
                { "text" : "Larry" }
            ], "modifier" : getModifier()}
    
        ]
    }
    
    
}