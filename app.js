// === STUDENT INFO — PERMANENTLY SET ===
const STUDENT_NAME = "Clara Paya Shaverroy";
let homeworkList = JSON.parse(localStorage.getItem('homework')) || [];
let marksList = JSON.parse(localStorage.getItem('marks')) || [];
let currentFilter = 'all';

// === SWITCH PAGE ===
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'parent-page') {
        renderHomeworkList();
        renderMarksList();
    }
}

// === SWITCH TAB (Teacher) ===
function showTab(tabId) {
    document.querySelectorAll('#teacher-page .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#teacher-page .tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// === SWITCH TAB (Parent) ===
function showParentTab(tabId) {
    document.querySelectorAll('#parent-page .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#parent-page .tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// === SAVE HOMEWORK ===
document.getElementById('hw-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const hw = {
        id: Date.now(),
        subject: document.getElementById('hw-subject').value,
        task: document.getElementById('hw-task').value,
        dueDate: document.getElementById('hw-date').value,
        completed: false
    };
    homeworkList.push(hw);
    saveData();
    this.reset();
    alert('✅ Homework saved successfully!');
});

// === SAVE MARKS + AUTO CALCULATE PERCENTAGE ===
document.getElementById('marks-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const markValue = parseFloat(document.getElementById('mark-value').value);
    const percentage = markValue; // Out of 100 = same %
    
    const mark = {
        id: Date.now(),
        subject: document.getElementById('mark-subject').value,
        assessmentType: document.getElementById('assessment-type').value,
        mark: markValue,
        percentage: percentage,
        date: document.getElementById('mark-date').value
    };
    marksList.push(mark);
    saveData();
    this.reset();
    alert(`✅ Mark saved!\nScore: ${markValue}/100\nPercentage: ${percentage}%`);
});

// === SAVE DATA ===
function saveData() {
    localStorage.setItem('homework', JSON.stringify(homeworkList));
    localStorage.setItem('marks', JSON.stringify(marksList));
}

// === FILTER HOMEWORK ===
function filterHomework(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderHomeworkList();
}

// === TOGGLE COMPLETED STATUS ===
function toggleHomeworkStatus(id) {
    const hw = homeworkList.find(item => item.id === id);
    if (hw) {
        hw.completed = !hw.completed;
        saveData();
        renderHomeworkList();
    }
}

// === RENDER HOMEWORK LIST ===
function renderHomeworkList() {
    const list = document.getElementById('homework-list');
    let filtered = homeworkList;
    if (currentFilter === 'pending') filtered = homeworkList.filter(hw => !hw.completed);
    else if (currentFilter === 'done') filtered = homeworkList.filter(hw => hw.completed);

    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-msg">No homework found.</p>';
        return;
    }
    list.innerHTML = '';
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).forEach(hw => {
        const statusBadge = hw.completed 
            ? '<span class="status-done">✅ Completed</span>'
            : '<span class="status-pending">⏳ Pending</span>';
        const btnText = hw.completed ? 'Mark as Pending' : 'Mark as Completed';
        list.innerHTML += `
        <div class="record-item">
            <h4>${hw.subject} ${statusBadge}</h4>
            <p><strong>Task:</strong> ${hw.task}</p>
            <p><strong>Due Date:</strong> ${hw.dueDate}</p>
            <button class="toggle-btn" onclick="toggleHomeworkStatus(${hw.id})">${btnText}</button>
        </div>`;
    });
}

// === RENDER MARKS LIST — SHOW PERCENTAGE ===
function renderMarksList() {
    const list = document.getElementById('marks-list');
    if (marksList.length === 0) {
        list.innerHTML = '<p class="empty-msg">No marks recorded yet.</p>';
        return;
    }
    list.innerHTML = '';
    marksList.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
        let markClass = 'mark-poor';
        if (m.mark >= 80) markClass = 'mark-good';
        else if (m.mark >= 50) markClass = 'mark-avg';
        
        list.innerHTML += `
        <div class="record-item">
            <h4>📚 ${m.subject}</h4>
            <p><strong>Assessment:</strong> ${m.assessmentType}</p>
            <p><strong>Mark Obtained:</strong> ${m.mark}/100</p>
            <p><strong>Percentage:</strong> <span class="${markClass}">${m.percentage}%</span></p>
            <p><strong>Date:</strong> ${m.date}</p>
        </div>`;
    });
}
