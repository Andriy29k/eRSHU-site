document.addEventListener("DOMContentLoaded", function() {
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'Europe/Kiev', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = now.toLocaleTimeString('uk-UA', options);
        document.getElementById('time').textContent = timeString;
    }

    setInterval(updateTime, 1000);  // Оновлює час кожну секунду
    updateTime();  // Викликає функцію updateTime одразу при завантаженні сторінки

    function getProfileInfoFromStorage() {
        return {
            faculty: localStorage.getItem('faculty') || 'fmi_schedule',
            course: localStorage.getItem('course') || '3',
            group: localStorage.getItem('group') || 'ІПЗ-31'
        };
    }

    async function loadSchedule(faculty, course, group) {
        const url = `https://raw.githubusercontent.com/tunetc/Bot_telegram/main/recours/${faculty}/${course}/${encodeURIComponent(group)}.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.week;
        } catch (error) {
            console.error('Error loading schedule:', error);
            return null;
        }
    }

    function displaySchedule(dayIndex, schedule) {
        const scheduleContainer = document.getElementById('schedule');
        scheduleContainer.innerHTML = '';  // Очищує попередній розклад

        if (!schedule || !schedule[dayIndex] || schedule[dayIndex].length === 0) {
            const noClasses = document.createElement('div');
            noClasses.className = 'schedule-item';
            noClasses.textContent = 'Немає занять';
            scheduleContainer.appendChild(noClasses);
        } else {
            schedule[dayIndex].forEach(item => {
                if (item.lesson_name) {
                    const scheduleItem = document.createElement('div');
                    scheduleItem.className = 'schedule-item';
                    scheduleItem.innerHTML = `
                        <span class="number">${item.lesson_number}</span>
                        <span class="subject">${item.lesson_name}</span>
                        <span class="mute-icon">&#128263;</span>
                    `;
                    scheduleContainer.appendChild(scheduleItem);
                }
            });
        }
    }

    const tabs = document.querySelectorAll('.tab');
    let currentSchedule = [];
    const { faculty, course, group } = getProfileInfoFromStorage();

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const dayIndex = parseInt(this.dataset.day);
            displaySchedule(dayIndex, currentSchedule);
        });
    });

    loadSchedule(faculty, course, group).then(schedule => {
        if (schedule) {
            currentSchedule = schedule;
            displaySchedule(0, schedule);  // Відобразити розклад для першого дня тижня
        } else {
            displaySchedule(0, []);  // Показати повідомлення "Немає занять", якщо розклад не завантажено
        }
    });
});
