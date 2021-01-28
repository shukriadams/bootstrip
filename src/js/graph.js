// credits : https://stackoverflow.com/questions/14222138/css-progress-circle
function renderCircleGraph(el){
    
    let options = {
            percent:  el.getAttribute('data-percent') || 25,
            size: el.getAttribute('data-size') || 220,
            lineWidth: el.getAttribute('data-line') || 15,
            rotate: el.getAttribute('data-rotate') || 0
        },
        canvas = document.createElement('canvas'),
        span = document.createElement('span')

    span.textContent = options.percent + '%'

    if (typeof(G_vmlCanvasManager) !== 'undefined') 
        G_vmlCanvasManager.initElement(canvas)

    let ctx = canvas.getContext('2d')
    canvas.width = canvas.height = options.size

    el.appendChild(span)
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

    drawCircle('#2B3038', options.lineWidth, 100 / 100)
    drawCircle('#FF662B', options.lineWidth, options.percent / 100)
}

for (const element of document.querySelectorAll('.dashiGraph-circle'))
    renderCircleGraph(element) 
