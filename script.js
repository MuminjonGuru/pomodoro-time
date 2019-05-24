const mainBody = document.getElementById("main");
const modeIndicator = document.querySelector("#mode-indicator");

const hoverColor = (e) => e.target.classList.contains("button") ? e.target.style.color = "yellow": false;
const removeHoverColor = (e) => e.target.classList.contains("button") ? e.target.style.color = "white": false;
const addZeroPadding = (num) => "0" + num;
const updateSession = () => displaySessionMinute.textContent = sessionValue;
const updateBreak = () => displayBreakMinute.textContent = breakValue;

let sessionValue = 25;
const displaySessionMinute = document.getElementById("session-minute");
updateSession();
const IncreaseSessionBtn = document.getElementById("increase-session");
const DecreaseSessionBtn = document.getElementById("decrease-session");

let breakValue = 5;
const displayBreakMinute = document.getElementById("break-minute");
updateBreak();
const IncreaseBreakBtn = document.getElementById("increase-break");
const DecreaseBreakBtn = document.getElementById("decrease-break");

let timeValue = "25:00";
const displayTime = document.getElementById("time");
updateTimerDisplay();

function changeSessionTime(e) {
    const incrementSession = () => sessionValue += 1;
    const decrementSession = () => sessionValue -= 1;

    if (sessionValue == 1 && e.target.id == "increase-session") {
        incrementSession();
        updateSession();
    } else if (sessionValue == 1 && e.target.id == "decrease-session" || sessionValue == 1440 && e.target.id == "increase-session") {
        return;
    } else if (e.target.id == "increase-session") {
        incrementSession();
        updateSession();
    } else if (e.target.id == "decrease-session") {
        decrementSession();
        updateSession();
    } else {
        return;
    }
    convertNumberToTimer(sessionValue);
    updateTimerDisplay();
}

function changeBreakTime(e) {
    const incrementBreak = () => breakValue += 1;
    const decrementBreak = () => breakValue -= 1;

    if (breakValue == 1 && e.target.id == "increase-break") {
        incrementBreak();
        updateBreak();
    } else if (breakValue == 1 && e.target.id == "decrease-break" || breakValue == 1440 && e.target.id == "increase-break") {
        return;
    } else if (e.target.id == "increase-break") {
        incrementBreak();
        updateBreak();
    } else if (e.target.id == "decrease-break") {
        decrementBreak();
        updateBreak();
    } else {
        return;
    }
}

function updateTimerDisplay() {
    displayTime.textContent = timeValue;
}

function displayZeroTime() {
    timeValue = "00:00";
    updateTimerDisplay();
}

function convertNumberToTimer(number) {
    let hours = Math.floor(number / 60);
    let minutes = number % 60;
    let digitalTime;
    let timeArr = [];
    
    if (number >= 1 && number <= 9) {
        digitalTime = addZeroPadding(number) + ":00";
        timeArr = digitalTime.split(":");
    } else if (number >= 10 && number <= 59) {
        digitalTime = number + ":00";
        timeArr = digitalTime.split(":");
    } else if (number >= 60) {
        timeArr[0] = addZeroPadding(hours);
        timeArr[2] = "00";
        if (minutes >= 0 && minutes <= 9 && hours >= 1 && hours <= 9) {
            timeArr[1] = addZeroPadding(minutes);
        } else if (minutes >= 10 && minutes <= 59 && hours >= 1 && hours <= 9) {
            timeArr[1] = minutes;
        } else if (hours >= 10) {
            timeArr[0] = hours;
            timeArr[2] = "00";
            if (minutes >= 0 && minutes <= 9) {
                timeArr[1] = addZeroPadding(minutes);
            } else if (minutes >= 10 && minutes <= 59) {
                timeArr[1] = minutes;
            }
        }
    }
    timeValue = timeArr.join(":");
    return timeValue;
}

function pauseTimer(e) {
    if (e.target.id === "pause") {
        clearInterval(intervalID, 1000);
        mainBody.addEventListener("click", startTimer);
    } 
}

function startTimer(e) {
    if (e.target.id === "start") {
        intervalID = setInterval(updateTime, 1000);

        mainBody.removeEventListener("click", changeSessionTime);
        mainBody.removeEventListener("click", changeBreakTime);
        mainBody.removeEventListener("click", startTimer);
    }
}

function stopTimer(e) {
    if (e.target.id === "stop") {
        clearInterval(intervalID);
        convertNumberToTimer(sessionValue);
        updateTimerDisplay();
        modeIndicator.textContent = "Session";
        displayTime.removeAttribute("style");

        mainBody.addEventListener("click", changeSessionTime);
        mainBody.addEventListener("click", changeBreakTime);
        mainBody.addEventListener("click", startTimer);
        clearInterval(repeatBeep);
        NumberOfBeeps = 0;
    }
}

function updateTime() {
    timeArray = timeValue.split(":");
    hour = Math.floor(sessionValue / 60);

    countdownTimer();
    timeValue = timeArray.join(":");
    updateTimerDisplay();
    colorTimer();
    switchTimerMode();
}

function countdownTimer() {
    const seconds = timeArray[timeArray.length - 1];
    const minutes = timeArray[timeArray.length - 2];
    const hours = timeArray[timeArray.length - 3];

        if (seconds == "00" && minutes == "00" && hours == "01") {
            timeArray.shift();
            timeArray[timeArray.length - 2] = "59";
            timeArray[timeArray.length - 1] = "59";
        } else if (seconds == "00" && minutes == "00" && hours >= "02" && hours <= "09") {
            timeArray[timeArray.length -3] = addZeroPadding(hours - 1);
            timeArray[timeArray.length - 2] = "59";
            timeArray[timeArray.length - 1] = "59";
        } else if (seconds == "00" && minutes >= "11") {
            timeArray[timeArray.length - 1] = "59";
            timeArray[timeArray.length - 2] -= 1;
        } else if (seconds == "00" && minutes < 11) {
            timeArray[timeArray.length - 1] = "59";
            timeArray[timeArray.length - 2] = addZeroPadding(minutes - 1);
        } else if (seconds >= "11" && seconds <= "59") {
            timeArray[timeArray.length - 1] -= 1;
        } else if (seconds <= "10") {
            timeArray[timeArray.length - 1] = addZeroPadding(seconds - 1);
        }
}

function switchTimerMode() {
    if (timeValue.search(/\-/) > -1 && modeIndicator.textContent == "Session") {
        modeIndicator.textContent = "Break";
        changeAndStartTimerMode(breakValue);
    } else if (timeValue.search(/\-/) > -1 && modeIndicator.textContent == "Break") {
        modeIndicator.textContent = "Session";
        changeAndStartTimerMode(sessionValue);
    }
}

function colorTimer() {
    if (timeArray.length == 2 && timeArray[timeArray.length - 2] == 0 && timeArray[timeArray.length - 1] >= 0 && timeArray[timeArray.length - 1] <= 5) {
        displayTime.setAttribute("style", "color:red");  
    } else if (timeArray.length == 2 && timeArray[timeArray.length - 2] == 0 && timeArray[timeArray.length - 1] >= 6 && timeArray[timeArray.length - 1] <= 15) {
        displayTime.setAttribute("style", "color:yellow");
    } else {
        displayTime.setAttribute("style", "color:green");
    }
}

function changeAndStartTimerMode(value) {
    clearInterval(intervalID); 
    convertNumberToTimer(value);
    updateTimerDisplay();
    intervalID = setInterval(updateTime, 1000);
}

function resetToDefaultSettings(e) {
    if (e.target.id === "reset") {
        sessionValue = 25;
        updateSession();
        breakValue = 5;
        updateBreak();
        clearInterval(intervalID);
        convertNumberToTimer(sessionValue);
        updateTimerDisplay();
        modeIndicator.textContent = "Session";
        displayTime.removeAttribute("style");

        mainBody.addEventListener("click", changeSessionTime);
        mainBody.addEventListener("click", changeBreakTime);
        mainBody.addEventListener("click", startTimer);
    }
}

mainBody.addEventListener("mouseover", hoverColor);
mainBody.addEventListener("mouseout", removeHoverColor);
mainBody.addEventListener("click", changeSessionTime);
mainBody.addEventListener("click", changeBreakTime);
mainBody.addEventListener("click", startTimer);
mainBody.addEventListener("click", pauseTimer);
mainBody.addEventListener("click", stopTimer);
mainBody.addEventListener("click", resetToDefaultSettings);