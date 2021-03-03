// credits : https://stackoverflow.com/questions/14222138/css-progress-circle
function renderCircleGraph(el){
    
    let options = {
            percent:  el.getAttribute('data-percent') || 25,
            size: el.getAttribute('data-size') || 220,
            color: el.getAttribute('data-color') || '#fff',
            bgcolor: el.getAttribute('data-bgcolor') || '#000',
            lineWidth: el.getAttribute('data-line') || 14,
            rotate: el.getAttribute('data-rotate') || 0
        },
        canvas = document.createElement('canvas')


    if (typeof(G_vmlCanvasManager) !== 'undefined') 
        G_vmlCanvasManager.initElement(canvas)

    let ctx = canvas.getContext('2d')
    canvas.width = canvas.height = options.size

    el.appendChild(canvas)

    ctx.translate(options.size / 2, options.size / 2) // change center
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI) // rotate -90 deg

    let radius = (options.size - options.lineWidth) / 2,
        drawCircle = function(color, lineWidth, percent) {
                percent = Math.min(Math.max(0, percent || 1), 1)
                ctx.beginPath()
                ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false)
                ctx.strokeStyle = color
                ctx.lineCap = 'round' // butt, round or square
                ctx.lineWidth = lineWidth
                ctx.stroke()
        }

    drawCircle(options.bgcolor, options.lineWidth, 100 / 100)
    // making inner line 2 px thinner makes compensates for jaggies
    drawCircle(options.color, options.lineWidth -2, options.percent / 100)
}

for (const element of document.querySelectorAll('.circleGraph'))
    renderCircleGraph(element) 
