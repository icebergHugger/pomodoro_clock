let circle = document.querySelector('circle');

let first = document.querySelector('.first');
let second = document.querySelector('.second');
let third = document.querySelector('.third');
let forth = document.querySelector('.forth');
let fifth = document.querySelector('.fifth');

let iconImg = document.querySelector('.icon_img');

let radius;
let circumference;

let focusCounter = 0;
let focusTime = 1500;
let breakCounter = 0;
let breakTime = 300;
let level = 4;

let longBreakTime = 1200;

let isFocus = false;
let hasStarted = false;

let interval;

const timerText = document.querySelector("#timer");

const levels = [first, second, third, forth, fifth];

focusManager();
iconImg.href = "pomodoro.ico";

function focusManager(){
    formatTimer(focusTime);
    iconImg.href = "pomodoro.ico";
    isFocus = true;
}

function breakManager(){
    if(focusCounter == 3){
      formatTimer(longBreakTime);
    }else{
      formatTimer(breakTime);
    }
    iconImg.href = "pomodoro.ico";
    isFocus = false;
}

function startTimer(){
  if(!hasStarted){
   hasStarted = true;
   if(focusCounter == 3){
     longBreak(longBreakTime - 1);
   }else{
     (isFocus) ? timer(focusTime - 1, true, level) :
     timer(breakTime - 1, false, level);
   }
  }
}

function resetTimer(){
  clearInterval(interval);
  hasStarted = false;
  (isFocus) ? focusManager() : breakManager();
  if(focusCounter == 3){
    levels.forEach((ring) => {
      radius = ring.r.baseVal.value;
      circumference = radius * 2 * Math.PI;
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      ring.style.strokeDashoffset = circumference;
    });
  }else{
    levels[level].style.strokeDashoffset = 0;
  }
}

function timer(secs, section, numOfCircle){
  let originalSecs = secs + 1;
  circleManager(levels[level]);
  interval = setInterval(function(){
    formatTimer(secs);
    let percent = 100 - (((originalSecs - secs) / originalSecs) * 100);
    setProgress(percent, levels[level]);
    secs--;
    iconImg.href = (focusCounter <= breakCounter) ? "red.ico" : "green.ico";
    if(secs < 0) {
      hasStarted = false;
      clearInterval(interval);
      if(section) {
        focusCounter++;
        level--
        breakManager();
      }else {
        breakCounter++;
        level--;
        focusManager();
      }
    }
  }, 1000);
}

function longBreak(secs){
  let originalSecs = secs + 1;

  levels.forEach((ring) => {ring.style.transform =
  'rotate(' + (Math.random() * (360 - 0) + 0) + 'deg)'});

  interval = setInterval(function () {
    formatTimer(secs);
    let percent = (((originalSecs - secs) / originalSecs) * 100);
    secs--;
    levels.forEach((ring) => {
      radius = ring.r.baseVal.value;
      circumference = radius * 2 * Math.PI;
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      console.log(circumference);
      setProgress(percent, ring);
    });
    if(secs < 0){
      hasStarted = false;
      clearInterval(interval);
      focusCounter = 0;
      breakCounter = 0;
      level = 4;
      focusManager();
    }
  }, 1000);
}


function circleManager(numOfCircle){
  radius = numOfCircle.r.baseVal.value;
  circumference = radius * 2 * Math.PI;
  numOfCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  numOfCircle.style.transform = 'rotate(' + (-90) + 'deg)';
  //numOfCircle.style.strokeDashoffset = `${circumference}`;
  //numOfCircle.style.strokeDashoffset = circumference - 100 / 100 * circumference
}

function setProgress(percent, numOfCircle) {
  const offset = circumference - percent / 100 * circumference;
  numOfCircle.style.strokeDashoffset = offset;
  //console.log(offset);
}

function formatTimer(time){
  let minutes = Math.floor(time/60);
  let seconds = time - minutes * 60;
  if(seconds < 10){
    timerText.innerHTML = minutes + ":" + "0" + seconds;
  }else{
    timerText.innerHTML = minutes + ":" + seconds;
  }

  document.title = timerText.innerHTML;
  iconImg.href = (focusCounter <= breakCounter) ? "red.ico" : "green.ico";

}
