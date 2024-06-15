function updateTime() {
    const now = new Date();
    const options = { timeZone: 'Europe/Kiev', hour12: false };
    const timeString = now.toLocaleTimeString('uk-UA', options);
    document.getElementById('time').textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();


