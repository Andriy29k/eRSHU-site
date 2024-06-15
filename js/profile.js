document.addEventListener("DOMContentLoaded", function() {
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'Europe/Kiev', hour12: false, hour: '2-digit', minute: '2-digit' };
        const timeString = now.toLocaleTimeString('uk-UA', options);
        document.getElementById('time').textContent = timeString;
    }

    updateTime();
    setInterval(updateTime, 60000); // Оновлює час кожну хвилину

    document.getElementById('edit-button').addEventListener('click', function() {
        document.getElementById('edit-form').style.display = 'block';
        loadFaculties();
    });

    document.getElementById('faculty').addEventListener('change', function() {
        const faculty = document.getElementById('faculty').value;
        if (faculty) {
            loadCourses(faculty);
        }
    });

    document.getElementById('course').addEventListener('change', function() {
        const course = document.getElementById('course').value;
        if (course) {
            loadGroups(course);
        }
    });

    document.getElementById('save-button').addEventListener('click', function() {
        const facultySelect = document.getElementById('faculty');
        const courseSelect = document.getElementById('course');
        const groupSelect = document.getElementById('group');

        const faculty = facultySelect.options[facultySelect.selectedIndex].text;
        const course = courseSelect.value;
        const group = groupSelect.options[groupSelect.selectedIndex].text;

        document.getElementById('faculty-value').textContent = faculty;
        document.getElementById('specialty-value').textContent = group;

        // Зберігання в localStorage
        localStorage.setItem('faculty', facultySelect.value);
        localStorage.setItem('course', course);
        localStorage.setItem('group', group);

        document.getElementById('edit-form').style.display = 'none';
    });

    function loadProfileFromStorage() {
        const storedFaculty = localStorage.getItem('faculty');
        const storedGroup = localStorage.getItem('group');
        const storedCourse = localStorage.getItem('course');

        if (storedFaculty) {
            document.getElementById('faculty-value').textContent = storedFaculty;
        }

        if (storedGroup) {
            document.getElementById('specialty-value').textContent = storedGroup;
        }
    }

    async function loadFaculties() {
        const response = await fetch('https://raw.githubusercontent.com/tunetc/Bot_telegram/main/recours/all_faculties.json');
        const data = await response.json();
        const facultySelect = document.getElementById('faculty');
        facultySelect.innerHTML = '<option value="">Оберіть факультет</option>';
        data.all_faculties.forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty.folder_name;
            option.textContent = faculty.faculty_name;
            facultySelect.appendChild(option);
        });
        document.getElementById('course').disabled = true;
        document.getElementById('group').disabled = true;
    }

    async function loadCourses(faculty) {
        const response = await fetch(`https://tunetc.github.io/Bot_telegram/recours/${faculty}/all_years.json`);
        const data = await response.json();
        const courseSelect = document.getElementById('course');
        courseSelect.innerHTML = '<option value="">Оберіть курс</option>';
        data.all_years.forEach((year, index) => {
            const option = document.createElement('option');
            option.value = index + 1;  // Збільшуємо індекс на 1 для коректного курсу
            option.textContent = `Курс ${index + 1}`;
            courseSelect.appendChild(option);
        });
        courseSelect.disabled = false;
        document.getElementById('group').disabled = true;
    }

    async function loadGroups(courseIndex) {
        const faculty = document.getElementById('faculty').value;
        const response = await fetch(`https://tunetc.github.io/Bot_telegram/recours/${faculty}/all_years.json`);
        const data = await response.json();
        const groupSelect = document.getElementById('group');
        groupSelect.innerHTML = '<option value="">Оберіть групу</option>';
        data.all_years[courseIndex - 1].forEach(group => {
            const option = document.createElement('option');
            option.value = group.specialty_name;
            option.textContent = group.specialty_name;
            groupSelect.appendChild(option);
        });
        groupSelect.disabled = false;
    }

    loadProfileFromStorage();
});
