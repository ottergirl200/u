//let fonts;
let img;
let alphaValue = 0;
let fadeDirection = 1;
let holdCounter = 0;
let holdDuration = 120;
let hasRedirected = false;

function preload(){
  //fonts = loadFont("data/helv-light.ttf");
  img = loadImage("imgs_assets/her_op.png");
}

let theAlert, theConfirm, thePrompt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //alerts give message, only option ok
  //saves no useful information
  alert("Welcome.");
  //console.log(theAlert)
  
  //confirm gives ok/cancel option
  //returns true or false to program
  //can save response to variable
  theConfirm=confirm("By entering this website, you agree to play with me?");
  //console.log(theConfirm)
  
  //allows user to type answer
  //returns answer to program
  //answer can be saved to variable
  thePrompt=prompt("What's your name?");
  console.log(thePrompt);
  //textFont(fonts);
  //textAlign(CENTER, CENTER);

  //confirm gives ok/cancel option
  //returns true or false to program
  //can save response to variable
  alert("Beautiful. Please use a device that has a camera and a microphone, if you could be so kind.");
  //console.log(theConfirm)
}

function draw() {
  background(255);
  
  tint(255, alphaValue);
  image(img, 0, 0, width, height);
  
   alphaValue += fadeDirection * 2;
  
   if (fadeDirection === 1 && alphaValue >= 255) {
    alphaValue = 255;
    
    //pause img before fade-out
    if (holdCounter < holdDuration) {
      holdCounter++;
    } else {
      fadeDirection = -1; //start fade-out
    }

  } else if (fadeDirection === -1 && alphaValue <= 0 && !hasRedirected) {
    alphaValue = 0;
    hasRedirected = true;
    redirect(); // call redirect after fade out
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function redirect() {
  window.location.href = "ovulation1.html";
}
1