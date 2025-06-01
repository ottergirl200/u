let question = "will you stay?";
let typedQuestion = "";
let questionStage = 0;
let questionIndex = 0;
let typing = true;
let typeSpeed = 80;

let input, button;
let acceptedAnswer = "yes";
let userInput = "";

let fadeOpacity = 0;
let startFade = false;
let fadeStartTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textSize(24);
  textAlign(CENTER, CENTER);

  input = createInput();
  button = createButton('submit');

  input.size(200);
  input.input(forceYesOnly);
  button.mousePressed(handleSubmit);

  positionUI(); 
}

function draw() {
  background(255);

  if (typing && frameCount % int(typeSpeed / (1000 / 60)) === 0) {
    if (questionIndex < question.length) {
      typedQuestion += question.charAt(questionIndex);
      questionIndex++;
    } else {
      typing = false;
    }
  }

  text(typedQuestion, width / 2, height / 2);

  if (startFade) {
    fadeOpacity += 1;
    fadeOpacity = constrain(fadeOpacity, 0, 255);
    fill(0, fadeOpacity);
    rect(0, 0, width, height);

    // if (fadeOpacity >= 255 && millis() - fadeStartTime > 10000) {
    //   window.location.href = "error.html";
    // }
  }
}

function forceYesOnly() {
  let val = input.value();
  if (acceptedAnswer.startsWith(val.toLowerCase())) {
    userInput = val.toLowerCase();
  } else {
    input.value(userInput);
  }
}

function handleSubmit() {
  if (userInput === acceptedAnswer) {
    questionStage++;

    if (questionStage === 1) {
      updateQuestion("really?");
    } else if (questionStage === 2) {
      updateQuestion("i'll stay with you forever.");
      setTimeout(() => {
        input.remove();
        button.remove();
        startFade = true;
        fadeStartTime = millis();
      }, 3000);
    }
  }
}

function updateQuestion(newText) {
  question = newText;
  typedQuestion = "";
  questionIndex = 0;
  typing = true;
  input.value('');
  userInput = '';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionUI();
}

function positionUI() {
  let inputX = width / 2 - 100;
  let inputY = height / 2 + 50;
  input.position(inputX, inputY);
  button.position(inputX + input.width + 10, inputY);
}
