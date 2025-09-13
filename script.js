let curPos = 0;
let position = 0;
let start_x, end_x;
const IMAGE_WIDTH = 375;
const images = document.querySelector('.image');

images.addEventListener('touchstart', touch_start);
images.addEventListener('touchend', touch_end);

function prev() {
    if (curPos < 0) {
        curPos += IMAGE_WIDTH;
        images.style.transform = `translateX(${position}px)`;
        curPos = curPos - 1;
    }
}

function next() {
    if(curPos <3) {
        position -= IMAGE_WIDTH;
        images.style.transform = `translateX(${position}px)`;
        curPos = curPos + 1;
    }
}

function touch_start(event) {
    start_x = event.touches[0].pageX;
}

function touch_end(event) {
    end_x = event.changedTouches[0].pageX;
    if (start_x > end_X) {
        next();
    } else {
        prev();
    }
}
