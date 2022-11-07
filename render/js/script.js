const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(event) {
    const file = event.target.files[0]

    if(!isFileImage(file)) {
        alertMessage('Please select an image', 'red')
        return
    }

    // Get original dimensions
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = function () {
        widthInput.value = this.width
        heightInput.value = this.height
    }

    form.style.display = 'block'
    filename.innerText = file.name
    outputPath.innerText = path.join(os.homedir(), 'imageresizer')
}

// Send image data to main
function sendImage(event) {
    event.preventDefault()

    const width = widthInput.value
    const height = heightInput.value
    const imgPath = img.files[0].path

    if(!img.files[0]) {
        alertMessage('Please upload an image', 'red')
        return
    }

    if(!width || !height) {
        alertMessage('Please fill in the fields', 'red')
        return
    }

    // Send to main using ipcRender
    ipcRenderer.send('image:resize', { imgPath, width, height })
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
    alertMessage(`Image resized to ${widthInput.value} x ${heightInput.value}`, 'green')
})

// Make sure file is image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg']
    return file && acceptedImageTypes.includes(file['type'])
}

function alertMessage(message, color) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: color,
            color: 'white',
            textAlign: 'center'
        }
    })
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)