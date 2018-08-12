class ImageEditor {
    constructor(opt = {}) {
        this.src = opt.imageSrc || dataUrl
        this.id = opt.canvasId || 'image-for-edit'
        this.size = opt.canvasSize || 128
        this.scaleStep = opt.scaleStep || 0.25
        this.scale = 1
        this.dragInfo = {
            isDragging: false,
            startX: 0,
            startY: 0,
            diffX: 0,
            diffY: 0,
            canvasX: 0,
            canvasY: 0
        }
    }
    insertTo(el) {
        const container = document.createElement('div')
        el.appendChild(container)

        const zoomSlider = document.createElement('input')
        zoomSlider.type = 'range'
        zoomSlider.min = 0.01
        zoomSlider.max = 2
        zoomSlider.value = 1
        zoomSlider.step = 'any'
        zoomSlider.addEventListener('input', this.zoom.bind(this))
        container.appendChild(zoomSlider)

        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.canvas.id = this.id
        this.canvas.width = this.canvas.height = this.size

        this.img = new Image()
        this.img.crossOrigin = 'anonymous'
        this.img.src = this.src
        this.img.onload = () => {
            this.ctx.drawImage(this.img, 0, 0)
        }
        this.img.onerror = e => {
            [...el.children].forEach(a => a.remove())
            alert('画像読み込み失敗')
        }

        this.canvas.addEventListener('mousedown', this.dragStart.bind(this))
        this.canvas.addEventListener('mousemove', this.drag.bind(this))
        this.canvas.addEventListener('mouseup', this.dragEnd.bind(this))
        
        this.canvas.addEventListener('touchstart', this.touchStart.bind(this))
        this.canvas.addEventListener('touchmove', this.touch.bind(this))
        this.canvas.addEventListener('touchend', this.touchEnd.bind(this))


        el.appendChild(this.canvas)
    }

    _redraw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.scale(this.scale, this.scale)
        this.ctx.drawImage(this.img, this.dragInfo.diffX, this.dragInfo.diffY)
        this.ctx.scale(1 / this.scale, 1 / this.scale)
    }

    zoom(event) {
        this.scale = event.target.value
        this._redraw()
    }

    zoomIn() {
        this.scale += this.scaleStep
        this._redraw()
    }

    zoomOut() {
        this.scale -= this.scaleStep
        this._redraw()
    }

    dragStart(event) {
        this.dragInfo.isDragging = true
        this.dragInfo.startX = event.clientX
        this.dragInfo.startY = event.clientY
    }

    drag(event) {
        if (this.dragInfo.isDragging) {
            //alert( "X>>" + this.dragInfo.startX + "  Y >>" + this.dragInfo.startY);
            this.dragInfo.diffX = this.dragInfo.canvasX + (event.clientX - this.dragInfo.startX) / this.scale;
            this.dragInfo.diffY = this.dragInfo.canvasY + (event.clientY - this.dragInfo.startY) / this.scale;
            this._redraw();
        }
    }

    dragEnd(event) {
        this.dragInfo.isDragging = false
        this.dragInfo.canvasX = this.dragInfo.diffX
        this.dragInfo.canvasY = this.dragInfo.diffY
    }
    
    touchStart(event) {
        this.dragInfo.isDragging = true
        event.preventDefault();
        this.dragInfo.startX = event.targetTouches[0].clientX
        this.dragInfo.startY = event.targetTouches[0].clientY
    }

    touch(event) {
        if (this.dragInfo.isDragging) {
            this.dragInfo.diffX = this.dragInfo.canvasX + (event.targetTouches[0].clientX - this.dragInfo.startX) / this.scale;
            this.dragInfo.diffY = this.dragInfo.canvasY + (event.targetTouches[0].clientY - this.dragInfo.startY) / this.scale;
            this._redraw();
        }
    }

    touchEnd(event) {
        this.dragInfo.isDragging = false
        this.dragInfo.canvasX = this.dragInfo.diffX
        this.dragInfo.canvasY = this.dragInfo.diffY
    }

    getCanvas() {
        return this.canvas
    }

    getImage() {
        const img = new Image()
        const data = this.canvas.toDataURL('image/png')
        img.src = data

        return img
    }
}

let obj1 = document.getElementById("imgfile")
obj1.addEventListener("change", function(evt) {
    let file = evt.target.files
    let reader = new FileReader()
    reader.readAsDataURL(file[0])
    reader.onload = function() {
        let dataUrl = reader.result

        const imageEditor = new ImageEditor({
            imageSrc: dataUrl,
            canvasSize: 500
        });
        imageEditor.insertTo(document.getElementById('image'))
        cvs = document.getElementById("image-for-edit")
        console.log(cvs)
        let chgImg = function changeImage() {
            let png = cvs.toDataURL()
            document.getElementById("newImg").src = png
        }
        document.getElementById("changeImg").onclick=chgImg
    }
}, false)





function chgImg() {
    let png = cvs.toDataURL()
    document.getElementById("newImg").src = png
}