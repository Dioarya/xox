// Made by Dio Arya Raditya.
function easeIn(t, p) {
    return t ** p;
}
function easeOut(t, p) {
    return 1 - (1 - t) ** p;
}
function easeInOut(t) {
    return (Math.sin(Math.PI * (t - 0.5)) + 1) / 2
}

function shiftCoordinatesMiddle(x, y, w, h) {
    // Shifts the coordinates from the top left of a square to the middle.
    return [x + w / 2, y + h / 2];
}