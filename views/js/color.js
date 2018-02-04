

//$('#changeColor').css("background-color", randomColor);

function pickColor() {
    return Math.floor(Math.random() * 200);
}
function randomColor() {
    var red = pickColor();
    var green = pickColor();
    var blue = pickColor();

    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

