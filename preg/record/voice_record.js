let mic, recorder, soundFile;
let state = 0; // 0: ready, 1: recording, 2: playback ready

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(5, 77, 149);
  textAlign(CENTER, CENTER);
  textSize(18);
  
  fill(255); 
  textFont('Helvetica'); 

  //setup mic recorder
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();
}

function draw() {
  background(5, 77, 149);
  
  fill(255); 
  textFont('Helvetica'); 
  
  if (state === 0) {
    text("speak to me", width / 2, height / 2);
  } else if (state === 1) {
    text("listening...", width / 2, height / 2);
  } else if (state === 2) {
    text("i see.\ni'll remember that.", width / 2, height / 2);
  }
}

function mousePressed() {
  userStartAudio(); 

  if (state === 0) {
    recorder.record(soundFile);
    state = 1;
  } else if (state === 1) {
    recorder.stop(); // stop recording
    state = 2;
  } else if (state === 2) {
    soundFile.play(); // play back
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


