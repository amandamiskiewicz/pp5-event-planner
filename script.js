        const events = [];
        const participants = [];
        const tasks = [];

        const sections = {
            events: document.getElementById('eventsSection'),
            participants: document.getElementById('participantsSection'),
            tasks: document.getElementById('tasksSection')
        };

        const eventsTab = document.getElementById('eventsTab');
        const participantsTab = document.getElementById('participantsTab');
        const tasksTab = document.getElementById('tasksTab');

        function switchSection(section) {
            Object.values(sections).forEach((sec) => sec.style.display = 'none');
            sections[section].style.display = 'block';

            [eventsTab, participantsTab, tasksTab].forEach((tab) => tab.classList.remove('active'));
            if (section === 'events') {
                eventsTab.classList.add('active');
            } else if (section === 'participants') {
                participantsTab.classList.add('active');
            } else {
                tasksTab.classList.add('active');
            }
        }

        eventsTab.addEventListener('click', () => switchSection('events'));
        participantsTab.addEventListener('click', () => switchSection('participants'));
        tasksTab.addEventListener('click', () => switchSection('tasks'));

        switchSection('events');

        document.getElementById('eventForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const eventName = document.getElementById('eventName').value;
            const eventDate = document.getElementById('eventDate').value;
            const eventTime = document.getElementById('eventTime').value;
            const eventLocation = document.getElementById('eventLocation').value;
            const eventDescription = document.getElementById('eventDescription').value;
            const eventPublic = document.getElementById('eventPublic').checked;

            let eventNames = JSON.parse(localStorage.getItem('eventNames')) || [];

            const event = {
                name: eventName,
                date: eventDate,
                time: eventTime,
                location: eventLocation,
                description: eventDescription,
                isPublic: eventPublic
            };
            fetch('http://localhost:3000/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            }).then(() => {
                alert("Wydarzenie zapisane!");
                displayEvents();
                document.getElementById('eventForm').reset();
            }).catch(error => console.error("Błąd:", error));
            

            events.push(event);
            localStorage.setItem('events', JSON.stringify(events))
            displayEvents();
            loadEventNames();  
            //saveEventsToLocalStorage();
            document.getElementById('eventForm').reset();
        });
    
        // wyświetlanie listy wydarzen
        function displayEvents() {
            const eventList = document.getElementById('eventList');
            eventList.innerHTML = '';

            let events = JSON.parse(localStorage.getItem('events')) || [];
            fetch('http://localhost:3000/events')
                .then(response => response.json())
                .then(events => {
                    const eventList = document.getElementById('eventList');
                    eventList.innerHTML = '';
                    events.forEach(event => {
                        const eventItem = document.createElement('div');
                        eventItem.classList.add('list-group-item');
                        eventItem.innerHTML = `
                            <h5>${event.name}</h5>
                            <p>${event.date} ${event.time}</p>
                            <p>${event.location}</p>
                            <p>${event.description}</p>
                            <p><strong>${event.isPublic ? 'Publiczne' : 'Prywatne'}</strong></p>
                        `;
                        eventList.appendChild(eventItem);
                    });
                }).catch(error => console.error("Błąd:", error));
        }

        document.addEventListener('DOMContentLoaded', displayEvents);


        document.addEventListener('DOMContentLoaded', function () {
            loadEventNames();
            displayEvents();
        });

        // formularz uczestnikow
        document.getElementById('addParticipant').addEventListener('click', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const role = document.getElementById('role').value;
            const confirmed = document.getElementById('confirmed').checked;
            const event = document.getElementById('eventSelect').value;

            const participant = {
                name,
                email,
                phone,
                role,
                confirmed,
                event
            };

            participants.push(participant);
            displayParticipants();
            saveUsersToLocalStorage();
            document.getElementById('addParticipant').reset();
        
        });

        // local storage
        function saveEventsToLocalStorage() {
            localStorage.setItem('events', JSON.stringify(events));
        }

        function loadEventsFromLocalStorage() {
            const storedEvents = localStorage.getItem('events');
            if (storedEvents) {
                events.push(...JSON.parse(storedEvents));
                displayEvents();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            loadEventsFromLocalStorage();
        });


        function saveUsersToLocalStorage() {
            localStorage.setItem('participants', JSON.stringify(participants));
        }


        function loadUsersFromLocalStorage() {
            const storedUsers = localStorage.getItem('participants');
            if (storedUsers) {
                participants.push(...JSON.parse(storedUsers));
                displayParticipants();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            loadUsersFromLocalStorage();
        });


        function saveTasksToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function loadTasksFromLocalStorage() {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                tasks.push(...JSON.parse(storedTasks));
                displayTasks();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            loadTasksFromLocalStorage();
        });
        

        // wyświetlanie listy uczestnikow
        function displayParticipants() {
            const participantList = document.getElementById('participantList');
            participantList.innerHTML = '';
            participants.forEach((participant) => {
                const participantItem = document.createElement('div');
                participantItem.classList.add('list-group-item');
                participantItem.innerHTML = `
                    <h5>${participant.name} (${participant.role})</h5>
                    <p>Email: ${participant.email}</p>
                    <p>Telefon: ${participant.phone}</p>
                    <p>Status potwierdzenia: <strong>${participant.confirmed ? 'Potwierdzony' : 'Niepotwierdzony'}</strong></p>
                    <p>Wydarzenie: ${participant.event}</p>
                `;
                participantList.appendChild(participantItem);
            });
        }

        //formularz zadań
        document.getElementById('addTask').addEventListener('click', function(e) {
            e.preventDefault();
            const taskName = document.getElementById('taskName').value;
            const taskDescription = document.getElementById('taskDescription').value;
            const taskDeadline = document.getElementById('taskDeadline').value;
            const taskPriority = document.getElementById('taskPriority').value;
            const taskAssignee = document.getElementById('taskAssignee').value;
            const event = document.getElementById('eventSelect').value; //#tasksSection select.form-select

            if (!event) {
                alert('Wybierz wydarzenie, do którego przypisujesz zadanie!');
                return;
            }

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            const task = {
                name: taskName,
                description: taskDescription,
                deadline: taskDeadline,
                priority: taskPriority,
                assignee: taskAssignee,
                event: event
            };

            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            displayTasks();
            //saveTasksToLocalStorage();
            document.getElementById('taskForm').reset();
        });

        // wyświetlanie listy zadań
        function displayTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('list-group-item');
                taskItem.innerHTML = `
                    <h5>${task.name}</h5>
                    <p>Opis: ${task.description}</p>
                    <p>Termin: ${task.deadline}</p>
                    <p>Priorytet: <strong>${task.priority}</strong></p>
                    <p>Odpowiedzialny: ${task.assignee}</p>
                    <p>Wydarzenie: ${task.event}</p>
                `;
                taskList.appendChild(taskItem);
            });
        }
        document.addEventListener('DOMContentLoaded', function () {
            displayEvents();
            displayTasks();
            loadEventNames();
        });

        function loadEventNames() {
            const eventSelects = document.querySelectorAll('#participantsSection #eventSelect, #tasksSection #eventSelect');

            if (!eventSelects.length) {
                console.error('Nie znaleziono elementów select!');
                return;
            }

            let events = JSON.parse(localStorage.getItem('events')) || [];

            console.log('Załadowane wydarzenia:', events);

            eventSelects.forEach(eventSelect => {
                eventSelect.innerHTML = '';

                if (events.length === 0) {
                    const noEventOption = document.createElement('option');
                    noEventOption.value = '';
                    noEventOption.textContent = 'Brak dostępnych wydarzeń';
                    eventSelect.appendChild(noEventOption);
                } else {
                    events.forEach(event => {
                        const option = document.createElement('option');
                        option.value = event.name;
                        option.textContent = event.name;
                        eventSelect.appendChild(option);
                    });
                }
            });
        }

        document.addEventListener('DOMContentLoaded', loadEventNames);