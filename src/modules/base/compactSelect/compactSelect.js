class CompactSelect{
    constructor(element){
        this.element = element
        
        this.element.__compactSelect = this

        this.select = this.element.querySelector('select')
        if (!this.select)
            return console.log(`cannot init compactSelect, element has no select`, this.element)

        if (!this.element.querySelector('.compactSelect-trigger'))
            return console.log('No .compactSelect-trigger element on compactSelect', this.element)

        const customMenu = document.createElement('x-compactSelect-menu')  
        this.element.appendChild(customMenu)


        for(let option of this.select.options){
            const customOption = document.createElement('x-compactSelect-menuItem')  
            customOption.textContent = option.text
            customOption.classList.add('--value')
            customOption.setAttribute('data-compactSelectValue', option.value)

            if (option.value === this.select.value)
                customOption.classList.add('--selected')

                customMenu.appendChild(customOption)
        }

        
    }
    
    setSelected(optionElement){
        for (let option of this.element.querySelectorAll('x-compactSelect-menuItem'))
            if (option !== optionElement)
                option.classList.remove('--selected')

        optionElement.classList.add('--selected')
        this.select.value = optionElement.getAttribute('data-compactSelectValue')
        this.close()
    }
    
    getValue(){
        return this.select.value
    }

    open(){
        this.element.classList.add('--visible')
    }

    close(){
        this.element.classList.remove('--visible')
    }

    toggle(){
        if (this.element.classList.contains('--visible'))
            this.close()
        else
            this.open()
    }

    static bindStaticEvents(){
        document.addEventListener('click', CompactSelect.handleClicks)

        window.addEventListener('resize', CompactSelect.handleWindowResize)
    }

    static handleWindowResize(e){
        let timeout = null,
            delay = 250 

        clearTimeout(timeout)

        // start timing for event "completion"
        if (!timeout)
            timeout = setTimeout(()=>{
                // do stuff
                timeout = null
            }, delay)
    }

    /**
     * Binds all events related to this control, a single handler scales better than binding per instance or binding a specific 
     * handler for each piece of logic
     */
    static handleClicks(e){
        let current = e.target

        while (current){

            if (current.classList.contains('compactSelect-trigger')){
                current.parentElement.__compactSelect.toggle()
                break
            }

            // click was on an option
            if (current.tagName.toLowerCase() === 'x-compactselect-menuitem'){
                if (current.parentElement.parentElement.__compactSelect)
                    current.parentElement.parentElement.__compactSelect.setSelected(current)

                break
            }


            // if reached top of document, or reached a compactSelect element, force close non-clicked elements
            if (!current.parentElement || current.classList.contains('x-compactSelect') || current.tagName.toLowerCase() === 'x-compactselect'){
                // find all 
                const allCompactSelects = document.querySelectorAll('x-compactSelect, .compactSelect')
                for (let compactSelect of allCompactSelects){
                    if (compactSelect === current)
                        continue

                    if (compactSelect.__compactSelect)
                        compactSelect.__compactSelect.close()
                }

                break
            }

            current = current.parentElement === document ? null : current.parentElement
        } 
    }

    static InitializeAll(){
        for (const element of document.querySelectorAll('x-compactSelect, .compactSelect'))
            new CompactSelect(element) 

        CompactSelect.bindStaticEvents()
    }
}

(()=>{
    CompactSelect.InitializeAll()
})();
