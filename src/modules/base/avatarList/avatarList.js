(()=>{
    // assigns a custom index to avatars in avatarlists based on their position in parent. This is then
    // used by CSS to position children relative to each other
    document.querySelectorAll('x-avatarList,.avatarList').forEach((el) => 
        el.querySelectorAll('x-avatar, .avatar').forEach((avatar, index)=>{
            avatar.style.setProperty('--avatarList-index', index)
        })
    )
})();