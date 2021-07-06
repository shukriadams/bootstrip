(()=>{
    
    function initialize($header){
        for (const $trigger of $header.querySelectorAll('x-header-toggle, .header-toggle')){
            $trigger.addEventListener('click', ()=>{
                
                if($header.classList.contains('--open'))
                    $header.classList.remove('--open')
                else
                    $header.classList.add('--open')

            }, false)
        }
        
    }
    
    for (const $header of document.querySelectorAll('x-header, .header'))
        initialize($header) 

})();
