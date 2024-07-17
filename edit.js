function removeComments(json) {
    return json.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

// function removeNewLines(json) {
//     return json.replace(/ /g, '').replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '');
// }

function removeNewLines(json) {
    return json.replace(/("[^"]*")|(\s+)/g, (match, quotedText) => {
        return quotedText ? quotedText : '';
    })
    .replace(/\t/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '');
}

function removeFinalComma(json) {
    return json.replace(/,}/g, '}').replace(/,]/g, ']');
}

function getQueryParams() {
    const params = {};
    window.location.search.substr(1).split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}

document.getElementById('cancel-button').addEventListener('click', () => {
    window.location.href = './upcoming.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskTableBody = document.getElementById('taskTableBody');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const addTaskBtn = document.getElementById('addTaskBtn');

    const params = getQueryParams();
    const params_accessToken = params.access_token;
    const page = params.page;
    let accessToken = null;

    const backendUrl = 'https://timetable-oauth.vercel.app';

    if (params_accessToken) {
        accessToken = params_accessToken;
        localStorage.setItem('accessToken', params_accessToken);
    } else {
        accessToken = localStorage.getItem('accessToken');
    }

    //let page = "common";

    if (accessToken) {
        // Fetch user info as an example
        fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        })
        .then(response => {
            // Redirect to login page if token is invalid
            if (response.ok) {
                return response.json();
            } else {
                localStorage.removeItem('accessToken');
                window.location.href = `${backendUrl}/login?page=${page}`;
            }
        })
        .then(data => {
            document.getElementById('user-info').textContent = data.name;
        });
    

    const owner = 'Abhinav-ark';
    const repo = 'timetable_csea';
    const filename = page === 'common' ? 'tasks' :
                page === 'pe4' ? 'tasksPE4' :
                page === 'pe5' ? 'tasksPE5' :
                page === 'pe6' ? 'tasksPE6' :
                'tasks';

    document.getElementById('page-title').textContent = `Editing ${page} tasks`;

    const path = `tasks/${filename}.js`;
    let sha = '';
    let tasksVar = [];

    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
            'Authorization': `token ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(fileData => {
        const content = atob(fileData.content);
        sha = fileData.sha;
        const jsonString = removeFinalComma(removeNewLines(removeComments(content.split('=')[1])));
        tasksVar = JSON.parse(jsonString);
        rendertasks();
        //localStorage.setItem('tasksVar', JSON.stringify(tasksVar));
    })
    .catch(error => {
        console.error('Error fetching file:', error);
        alert('Error fetching file');
    });

    // let tasksVar = page === 'common' ? tasks :
    //             page === 'pe4' ? tasksPE4 :
    //             page === 'pe5' ? tasksPE5 :
    //             page === 'pe6' ? tasksPE6 :
    //             tasks;

    // const varname = page === 'common' ? 'tasks' :
    //             page === 'pe4' ? 'tasksPE4' :
    //             page === 'pe5' ? 'tasksPE5' :
    //             page === 'pe6' ? 'tasksPE6' :
    //             'tasks';

    // Render tasks in the table
    function rendertasks() {
        taskTableBody.innerHTML = '';
        tasksVar.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.subject}</td>
                <td>${task.due}</td>
                <td>${task.task}</td>
                <td class="actions">
                    <button class='edit-button' onclick="editTask(${index})"><span class="material-symbols-outlined icon">edit</span></button>
                    <button class='delete-button' onclick="deleteTask(${index})"><span class="material-symbols-outlined icon">delete</span></button>
                </td>
            `;
            taskTableBody.appendChild(row);
        });
    }

    // Show modal
    function showModal() {
        taskModal.style.display = "block";
    }

    // Hide modal
    function hideModal() {
        taskModal.style.display = "none";
        taskForm.reset();
        document.getElementById('taskId').value = '';
    }

    // Handle form submission
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('taskId').value;
        const subject = document.getElementById('subject').value;
        const due = document.getElementById('due').value;
        const task = document.getElementById('task').value;

        const taskData = { subject, due, task };

        if (id) {
            // Edit task
            tasksVar[id] = taskData;
        } else {
            // Add new task
            tasksVar.push(taskData);
        }

        //localStorage.setItem('tasksVar', JSON.stringify(tasksVar));
        console.log("const tasks = "+JSON.stringify(tasksVar,null,'\t'));
     
        hideModal();
        rendertasks();
    });

    // Edit task
    window.editTask = function (index) {
        const task = tasksVar[index];
        document.getElementById('taskId').value = index;
        document.getElementById('subject').value = task.subject;
        document.getElementById('due').value = task.due;
        document.getElementById('task').value = task.task;
        showModal();
    };

    // Delete task
    window.deleteTask = function (index) {
        tasksVar.splice(index, 1);
        //localStorage.setItem('tasksVar', JSON.stringify(tasksVar));
        rendertasks();
    };

    // Show modal for adding a new task
    addTaskBtn.onclick = function() {
        showModal();
    }

    // Close modal
    closeModal.onclick = function() {
        hideModal();
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == taskModal) {
            hideModal();
        }
    }

    document.getElementById('use-editor').addEventListener('click', () => {
        window.location.href = `editTasks.html?page=${page}`;
    });

    document.getElementById('save-button').addEventListener('click', () => {
        // yes or no prompt
        if (confirm('Are you sure you want to save the file?')) {
            const updatedContent = `const ${filename} = \n${JSON.stringify(tasksVar, null, '\t')}\n\n`;
            const encodedContent = btoa(updatedContent);

        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Updated file from editor',
                content: encodedContent,
                sha: sha // Include the SHA of the file being updated
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.content) {
                alert('File saved successfully. Please Wait for 2mins for the changes to propogate.');
            } else {
                alert('Error saving file');
                localStorage.removeItem('accessToken');
            }
        });
        }
    });

    //rendertasks();
    }
    else {
        window.location.href = `${backendUrl}/login?page=${page}`;
    }
});