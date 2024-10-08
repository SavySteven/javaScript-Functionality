const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();

    })
    .catch(err => {
        console.error(`OH NO!!`, err);
    })
}


function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() =>{
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out that would be used to mexx with
        let pixels = ctx.getImageData(0,0, width, height);
        //mess with them effects
        pixels = redEffect(pixels);

        pixels = rgbSplit(pixels);

        pixels = greenScreen(pixels);

        ctx.globalAlpha = 0.1;
        //put them back
        ctx.putImageData(pixels, 0,0);
    }, 16);
}

function takePhoto(){
    //play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt = "Handsome Man">`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for (let i = 0; i< pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for (let i = 0; i< pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 100] = pixels.data[i + 1] - 50; // green
        pixels.data[i - 500] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

function greenScreen(){
    const levels = {};
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.ariaValueMax;
    });

    for (i = 0; i < pixels.data.length; i = i + 4){
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
    }

    if (red >= levels.rmin 
        && green >= levels.gmin
        && blue >= levels.gmin
        && red >= levels.gmin
        && green >= levels.gmin
        && blue >= levels.gmin ){
            // take it out the green screen
            pixels.data[i + 3] = 0;
        }
}

video.addEventListener('canplay',paintToCanvas)
getVideo()