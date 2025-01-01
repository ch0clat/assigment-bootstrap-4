let timers = {}; //object to store timers for each activity
//inisialize pastActivities variable
//Function to update the stopwatch display
function updateDisplay(element, time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliSeconds = Math.floor((time % 1000) / 10);

    element.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliSeconds).padStart(2, '0')}`;
}

//function to convert time format (MM:SS.ms) to milliseconds
function timeToMilliseconds(time) {
    const [minutes, seconds] = time.split(":").map(part => part.split("."));
    return parseInt(minutes) * 60000 + parseInt(seconds[0]) * 1000 + parseInt(seconds[1]);
}

//function to update the past activity table
function updatePastActivityTable() {
    const pastActivityTableBody = document.querySelector(".past-activity tbody");
    pastActivityTableBody.innerHTML = ""; //clear previous data

    //retrieve data from localStorage
    const pastActivities = JSON.parse(localStorage.getItem("pastActivities")) || [];
    pastActivities.forEach((activity) => {
        const newRow = document.createElement("tr");
        //create new cells for activity, target, time tracked, and performance
        newRow.innerHTML = `
            <td>${activity.name}</td>
            <td>${activity.target}</td>
            <td>${activity.timeTracked}</td>
            <td>${activity.performance}</td>
        `;
        pastActivityTableBody.appendChild(newRow);
    });
}

//function to start the stopwatch
/*function startStopwatch(activityIndex) {
    const startTime = Date.now() - timers[activityIndex].elapsedTime;
    timers[activityIndex].timerInterval = setInterval(function () {
        timers[activityIndex].elapsedTime = Date.now() - startTime;
        updateDisplay(timers[activityIndex].display, timers[activityIndex].elapsedTime);
    }, 10); //update every 10 milliseconds for better precision
}*/

//function to stop the stopwatch, rest it, and save data
function stopStopwatch(activityIndex, activityName, targetTime) {
    clearInterval(timers[activityIndex].timerInterval);
    
    const elapsedTime = timers[activityIndex].elapsedTime; //get the elapsed time
    const timeTracked = timers[activityIndex].display.textContent;
    //calculate performance (target / time tracked) * 100%
    const targetMilliseconds = timeToMilliseconds(targetTime);
    const performance = Math.round((targetMilliseconds / elapsedTime) * 100); //round to nearest integer
    //create a new entry for this activity
    const newEntry = {
        name: activityName,
        target: targetTime,
        timeTracked:timeTracked,
        performance: performance + "%"
    };

    //save the entry to localStorage
    const pastActivities = JSON.parse(localStorage.getItem("pastActivities")) || [];
    pastActivities.push(newEntry);
    localStorage.setItem("pastActivities", JSON.stringify(pastActivities));

    //update the past activity table
    updatePastActivityTable();
    //reset the stopwatch display
    timers[activityIndex].elapsedTime = 0;
    updateDisplay(timers[activityIndex].display, 0);
}

//initialize all stopwatches
document.querySelectorAll('.activity-card').forEach((activityCard, index) => {
    const display = activityCard.querySelector('.stopwatch');
    const startButton = activityCard.querySelector('.start');
    const stopButton = activityCard.querySelector('.stop');
    const activityName = activityCard.querySelector('h3').textContent;
    const targetTime = activityCard.querySelector('.p').textContent.split(": ")[1];

    //store each timer details in an object
    timers[index] = {
        display: display,
        elapsedTime: 0,
        timerInterval: null
    };

    //attach event listeners to the buttons
    startButton.addEventListener('click', () => {
        const startTime = Date.now() - timers[index].elapsedTime;
        timers[index].timerInterval = setInterval(function () {
            timers[index].elapsedTime = Date.now() - startTime;
            updateDisplay(timers[index].display, timers[index].elapsedTime);
        }, 10); //update every 10 milliseconds
    })
    stopButton.addEventListener('click', () => stopStopwatch(index, activityName, targetTime));
});

//load the past activities when the page is loaded
window.onload = function() {
    updatePastActivityTable();
}

