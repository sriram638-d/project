/*
           MODULE 6: FACULTY PORTAL VIEWS (js/faculty.js)
           ========================================================================== */
        let tempQuizQuestions = [
            { qText: '', options: ['', '', '', ''], correctIndex: 0 }
        ];

        function renderFacultyPortalView(faculty, db) {
            const myCourses = db.courses.filter(c => c.facultyId === faculty.id || true); // Allow demo faculty to manage courses
            const pendingSubmissions = db.submissions.filter(s => s.status !== 'Graded');
            const studentUsers = db.users.filter(u => u.role === 'student');

            switch (appState.activeTab) {
                case 'dashboard': {
                    return `
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Active Courses</h4>
                                <div class="stat-num">${db.courses.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-book"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Enrolled Students</h4>
                                <div class="stat-num">${studentUsers.length}</div>
                            </div>
                            <div class="stat-icon green"><i class="fa-solid fa-users"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Pending Submissions</h4>
                                <div class="stat-num">${pendingSubmissions.length}</div>
                            </div>
                            <div class="stat-icon amber"><i class="fa-solid fa-hourglass-half"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Published Quizzes</h4>
                                <div class="stat-num">${db.quizzes.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-list-check"></i></div>
                        </div>
                    </div>

                    <div class="grid-2col">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-inbox"></i> Recent Student Assignment Submissions</div>
                                <button class="btn btn-primary btn-sm" onclick="switchPortalTab('submissions')">Open Grading Center</button>
                            </div>
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Course</th>
                                            <th>File</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${db.submissions.map(sub => `
                                            <tr>
                                                <td style="font-weight:500;">${escapeHTML(sub.studentName)}</td>
                                                <td><span class="badge badge-primary">${escapeHTML(sub.courseId)}</span></td>
                                                <td style="font-size:12px;">${escapeHTML(sub.fileName)}</td>
                                                <td><span class="badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}">${escapeHTML(sub.status)}</span></td>
                                                <td>
                                                    <button class="btn btn-secondary btn-sm" onclick="openGradeSubmissionModal('${sub.id}')">
                                                        Grade
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-bolt"></i> Quick Faculty Actions</div>
                            </div>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <button class="btn btn-primary" onclick="switchPortalTab('create-quiz')">
                                    <i class="fa-solid fa-plus"></i> Create New Online Quiz
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('manage-assignments')">
                                    <i class="fa-solid fa-file-circle-plus"></i> Post New Course Assignment
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('manage-courses')">
                                    <i class="fa-solid fa-upload"></i> Upload Study Material / Syllabus Module
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('announcements')">
                                    <i class="fa-solid fa-bullhorn"></i> Broadcast Student Announcement
                                </button>
                            </div>
                        </div>
                    </div>`;
                }

                case 'manage-courses': {
                    return `
                    <div class="grid-2col">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-plus"></i> Add Syllabus Module to Course</div>
                            </div>
                            <form onsubmit="handleAddModule(event)">
                                <div class="form-group">
                                    <label class="form-label">Select Course *</label>
                                    <select id="mod-course" class="form-control" required>
                                        ${db.courses.map(c => `<option value="${c.id}">${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Unit / Module Title *</label>
                                        <input type="text" id="mod-title" class="form-control" placeholder="e.g., Unit 5: Indexing & B-Trees" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Duration *</label>
                                        <input type="text" id="mod-duration" class="form-control" placeholder="e.g., 4 Hours" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Lecture Notes &amp; Topics Covered *</label>
                                    <textarea id="mod-notes" class="form-control" rows="3" placeholder="Brief summary of topics covered in this unit..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Add Syllabus Unit</button>
                            </form>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-file-arrow-up"></i> Upload Study Material / Lecture PDF</div>
                            </div>
                            <form onsubmit="handleUploadMaterial(event)">
                                <div class="form-group">
                                    <label class="form-label">Target Course *</label>
                                    <select id="mat-course" class="form-control" required>
                                        ${db.courses.map(c => `<option value="${c.id}">${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Document Title *</label>
                                    <input type="text" id="mat-title" class="form-control" placeholder="e.g., Unit 4 Transaction Concurrency Notes.pdf" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Material Type</label>
                                        <select id="mat-type" class="form-control">
                                            <option value="PDF Document">PDF Document</option>
                                            <option value="Lecture Slides">Lecture Slides</option>
                                            <option value="Lab Manual">Lab Manual</option>
                                            <option value="Question Bank">Question Bank</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Attach File</label>
                                        <input type="file" class="form-control">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success"><i class="fa-solid fa-upload"></i> Publish Material</button>
                            </form>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-book"></i> Current Courses &amp; Syllabus Structure</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Course Title</th>
                                        <th>Department</th>
                                        <th>Syllabus Units</th>
                                        <th>Instructor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.courses.map(c => `
                                        <tr>
                                            <td><span class="badge badge-primary">${escapeHTML(c.code)}</span></td>
                                            <td style="font-weight:600;">${escapeHTML(c.title)}</td>
                                            <td>${escapeHTML(c.department)}</td>
                                            <td>${c.modules.length} Modules</td>
                                            <td>${escapeHTML(c.facultyName)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'manage-quizzes': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-list-ol"></i> Published Quizzes &amp; Student Attempt Stats</div>
                            <button class="btn btn-primary btn-sm" onclick="switchPortalTab('create-quiz')">
                                <i class="fa-solid fa-plus"></i> Create New Quiz
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Quiz Title</th>
                                        <th>Course</th>
                                        <th>Questions</th>
                                        <th>Duration</th>
                                        <th>Total Marks</th>
                                        <th>Total Attempts</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.quizzes.map(qz => {
                                        const attempts = db.quizAttempts.filter(a => a.quizId === qz.id);
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(qz.title)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(qz.courseId)}</span></td>
                                            <td>${qz.questions.length}</td>
                                            <td>${qz.durationMinutes} mins</td>
                                            <td>${qz.totalMarks}</td>
                                            <td><span class="badge badge-neutral">${attempts.length} Attempts</span></td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" onclick="deleteQuizItem('${qz.id}')">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'create-quiz': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-circle-plus"></i> Create New Multiple-Choice Quiz</div>
                        </div>
                        <form onsubmit="handlePublishNewQuiz(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Course *</label>
                                    <select id="nq-course" class="form-control" required>
                                        ${db.courses.map(c => `<option value="${c.id}">${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Quiz Title *</label>
                                    <input type="text" id="nq-title" class="form-control" placeholder="e.g., Quiz 2: Transaction Concurrency" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Duration (Minutes) *</label>
                                    <input type="number" id="nq-duration" class="form-control" value="10" min="1" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Total Marks *</label>
                                    <input type="number" id="nq-marks" class="form-control" value="20" min="5" required>
                                </div>
                            </div>

                            <h4 style="margin:16px 0 12px;font-size:15px;">Quiz Questions (${tempQuizQuestions.length})</h4>
                            <div id="dynamic-questions-container">
                                ${tempQuizQuestions.map((q, qIdx) => `
                                    <div style="padding:16px;border:1px solid var(--border-color);background:#F8FAFC;border-radius:var(--radius);margin-bottom:14px;">
                                        <div class="form-group">
                                            <label class="form-label">Question ${qIdx + 1} Text *</label>
                                            <input type="text" class="form-control" value="${escapeHTML(q.qText)}"
                                                oninput="updateTempQuestionText(${qIdx}, this.value)"
                                                placeholder="Enter question prompt..." required>
                                        </div>
                                        <div class="form-row">
                                            ${[0, 1, 2, 3].map(optIdx => `
                                                <div class="form-group" style="margin-bottom:8px;">
                                                    <label class="form-label">Option ${optIdx + 1}</label>
                                                    <input type="text" class="form-control" value="${escapeHTML(q.options[optIdx])}"
                                                        oninput="updateTempQuestionOption(${qIdx}, ${optIdx}, this.value)"
                                                        placeholder="Option ${optIdx + 1}" required>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="form-group" style="margin-bottom:0;max-width:240px;">
                                            <label class="form-label">Correct Option</label>
                                            <select class="form-control" onchange="updateTempQuestionCorrect(${qIdx}, this.value)">
                                                <option value="0" ${q.correctIndex === 0 ? 'selected' : ''}>Option 1</option>
                                                <option value="1" ${q.correctIndex === 1 ? 'selected' : ''}>Option 2</option>
                                                <option value="2" ${q.correctIndex === 2 ? 'selected' : ''}>Option 3</option>
                                                <option value="3" ${q.correctIndex === 3 ? 'selected' : ''}>Option 4</option>
                                            </select>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="display:flex;gap:12px;margin-top:12px;">
                                <button type="button" class="btn btn-secondary" onclick="addAnotherTempQuestion()">
                                    <i class="fa-solid fa-plus"></i> Add Question Slot
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa-solid fa-check"></i> Publish Quiz to Student Portal
                                </button>
                            </div>
                        </form>
                    </div>`;
                }

                case 'manage-assignments': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-clipboard-list"></i> Create New Course Assignment</div>
                        </div>
                        <form onsubmit="handleCreateAssignment(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Course *</label>
                                    <select id="asg-course" class="form-control" required>
                                        ${db.courses.map(c => `<option value="${c.id}">${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Assignment Title *</label>
                                    <input type="text" id="asg-title" class="form-control" placeholder="e.g., B+ Tree Indexing Implementation" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Submission Due Date *</label>
                                    <input type="date" id="asg-due" class="form-control" value="2026-11-25" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Maximum Marks *</label>
                                    <input type="number" id="asg-marks" class="form-control" value="50" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Instructions &amp; Deliverables *</label>
                                <textarea id="asg-desc" class="form-control" rows="3" placeholder="Specify deliverable format and rubric..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Publish Assignment</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Active Course Assignments</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Course</th>
                                        <th>Due Date</th>
                                        <th>Max Marks</th>
                                        <th>Submissions Received</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.assignments.map(a => {
                                        const subCount = db.submissions.filter(s => s.assignmentId === a.id).length;
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(a.title)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(a.courseId)}</span></td>
                                            <td>${escapeHTML(a.dueDate)}</td>
                                            <td>${a.maxMarks}</td>
                                            <td><span class="badge badge-neutral">${subCount} Submitted</span></td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'submissions': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-check-double"></i> Student Submissions &amp; Grading Center</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Submitted File &amp; Notes</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Marks Awarded</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.submissions.map(sub => {
                                        const asg = db.assignments.find(a => a.id === sub.assignmentId);
                                        const maxM = asg ? asg.maxMarks : 100;
                                        return `
                                        <tr>
                                            <td>
                                                <div style="font-weight:600;">${escapeHTML(sub.studentName)}</div>
                                                <div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(sub.studentId)}</div>
                                            </td>
                                            <td><span class="badge badge-primary">${escapeHTML(sub.courseId)}</span></td>
                                            <td>
                                                <div style="font-weight:500;font-size:13px;"><i class="fa-solid fa-paperclip"></i> ${escapeHTML(sub.fileName)}</div>
                                                <div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(sub.notes)}</div>
                                            </td>
                                            <td>${escapeHTML(sub.submittedDate)}</td>
                                            <td><span class="badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}">${escapeHTML(sub.status)}</span></td>
                                            <td>${sub.marksObtained !== null ? `<strong>${sub.marksObtained} / ${maxM}</strong>` : '-'}</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm" onclick="openGradeSubmissionModal('${sub.id}')">
                                                    <i class="fa-solid fa-pen-to-square"></i> Evaluate
                                                </button>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'students': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-users"></i> Enrolled Student Roster &amp; Academic Progress</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Roll ID</th>
                                        <th>Student Name</th>
                                        <th>Department</th>
                                        <th>Semester</th>
                                        <th>Enrolled Courses</th>
                                        <th>Quizzes Taken</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${studentUsers.map(s => {
                                        const qCount = db.quizAttempts.filter(a => a.studentId === s.id).length;
                                        return `
                                        <tr>
                                            <td><strong>${escapeHTML(s.id)}</strong></td>
                                            <td>${escapeHTML(s.name)}<div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(s.email)}</div></td>
                                            <td>${escapeHTML(s.department)}</td>
                                            <td>${escapeHTML(s.semester)}</td>
                                            <td>${(s.enrolledCourses || []).map(cid => `<span class="badge badge-primary" style="margin-right:4px;">${escapeHTML(cid)}</span>`).join('')}</td>
                                            <td>${qCount}</td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'announcements': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-bullhorn"></i> Post New Announcement to Students</div>
                        </div>
                        <form onsubmit="handlePostAnnouncement(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Announcement Title *</label>
                                    <input type="text" id="ann-title" class="form-control" placeholder="e.g., Extra Lab Session for DBMS" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Target Audience *</label>
                                    <select id="ann-course" class="form-control">
                                        <option value="ALL">All Enrolled Students</option>
                                        ${db.courses.map(c => `<option value="${c.id}">${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Message Content *</label>
                                <textarea id="ann-content" class="form-control" rows="3" placeholder="Enter detailed circular or announcement..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Broadcast Announcement</button>
                        </form>
                    </div>`;
                }
            }
            return '';
        }

        // Faculty Action Handlers
        function handleAddModule(e) {
            e.preventDefault();
            const db = getDB();
            const courseId = document.getElementById('mod-course').value;
            const title = document.getElementById('mod-title').value.trim();
            const duration = document.getElementById('mod-duration').value.trim();
            const notes = document.getElementById('mod-notes').value.trim();

            const course = db.courses.find(c => c.id === courseId);
            if (course) {
                course.modules.push({
                    id: 'M' + (course.modules.length + 1) + '_' + Date.now(),
                    title,
                    duration,
                    videoUrl: '#',
                    notes
                });
                saveDB(db);
                showToast(`Added syllabus module to ${course.code}`, 'success');
                renderApp();
            }
        }

        function handleUploadMaterial(e) {
            e.preventDefault();
            const db = getDB();
            const courseId = document.getElementById('mat-course').value;
            const title = document.getElementById('mat-title').value.trim();
            const type = document.getElementById('mat-type').value;

            db.materials.unshift({
                id: 'MAT' + Date.now(),
                courseId,
                title,
                type,
                size: '1.4 MB',
                uploadedBy: appState.currentUser.name,
                date: new Date().toISOString().split('T')[0]
            });
            saveDB(db);
            showToast('Study material published to student repository.', 'success');
            renderApp();
        }

        function updateTempQuestionText(qIdx, val) {
            tempQuizQuestions[qIdx].qText = val;
        }
        function updateTempQuestionOption(qIdx, optIdx, val) {
            tempQuizQuestions[qIdx].options[optIdx] = val;
        }
        function updateTempQuestionCorrect(qIdx, val) {
            tempQuizQuestions[qIdx].correctIndex = parseInt(val, 10);
        }
        function addAnotherTempQuestion() {
            tempQuizQuestions.push({ qText: '', options: ['', '', '', ''], correctIndex: 0 });
            renderApp();
        }

        function handlePublishNewQuiz(e) {
            e.preventDefault();
            const db = getDB();
            const courseId = document.getElementById('nq-course').value;
            const title = document.getElementById('nq-title').value.trim();
            const durationMinutes = parseInt(document.getElementById('nq-duration').value, 10) || 10;
            const totalMarks = parseInt(document.getElementById('nq-marks').value, 10) || 20;

            db.quizzes.push({
                id: 'QZ' + Date.now(),
                courseId,
                title,
                durationMinutes,
                totalMarks,
                passingMarks: Math.ceil(totalMarks * 0.5),
                questions: JSON.parse(JSON.stringify(tempQuizQuestions))
            });
            saveDB(db);
            tempQuizQuestions = [{ qText: '', options: ['', '', '', ''], correctIndex: 0 }];
            showToast('New quiz published! Students can now attempt it.', 'success');
            switchPortalTab('manage-quizzes');
        }

        function deleteQuizItem(quizId) {
            const db = getDB();
            db.quizzes = db.quizzes.filter(q => q.id !== quizId);
            saveDB(db);
            showToast('Quiz removed.', 'primary');
            renderApp();
        }

        function handleCreateAssignment(e) {
            e.preventDefault();
            const db = getDB();
            db.assignments.push({
                id: 'ASG' + Date.now(),
                courseId: document.getElementById('asg-course').value,
                title: document.getElementById('asg-title').value.trim(),
                dueDate: document.getElementById('asg-due').value,
                maxMarks: parseInt(document.getElementById('asg-marks').value, 10) || 50,
                description: document.getElementById('asg-desc').value.trim()
            });
            saveDB(db);
            showToast('New assignment posted to course.', 'success');
            renderApp();
        }

        function openGradeSubmissionModal(submissionId) {
            const db = getDB();
            const sub = db.submissions.find(s => s.id === submissionId);
            if (!sub) return;
            const asg = db.assignments.find(a => a.id === sub.assignmentId);
            const maxMarks = asg ? asg.maxMarks : 100;

            openModal(
                `Evaluate Submission: ${escapeHTML(sub.studentName)}`,
                `<div style="background:#F8FAFC;padding:12px;border:1px solid var(--border-color);border-radius:var(--radius);margin-bottom:16px;font-size:13px;">
                    <div><strong>Submitted File:</strong> ${escapeHTML(sub.fileName)}</div>
                    <div style="margin-top:4px;"><strong>Student Notes:</strong> ${escapeHTML(sub.notes)}</div>
                 </div>
                 <div class="form-group">
                    <label class="form-label">Marks Awarded (Max: ${maxMarks}) *</label>
                    <input type="number" id="grade-marks-input" class="form-control" value="${sub.marksObtained !== null ? sub.marksObtained : maxMarks - 5}" min="0" max="${maxMarks}" required>
                 </div>
                 <div class="form-group">
                    <label class="form-label">Evaluator Feedback / Remarks *</label>
                    <textarea id="grade-feedback-input" class="form-control" rows="3" placeholder="Provide constructive feedback...">${escapeHTML(sub.feedback || 'Well-structured solution and clear documentation.')}</textarea>
                 </div>`,
                `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                 <button class="btn btn-success" onclick="saveSubmissionGrade('${sub.id}')"><i class="fa-solid fa-check"></i> Save Grade</button>`
            );
        }

        function saveSubmissionGrade(submissionId) {
            const db = getDB();
            const sub = db.submissions.find(s => s.id === submissionId);
            if (!sub) return;
            const marks = parseInt(document.getElementById('grade-marks-input').value, 10) || 0;
            const feedback = document.getElementById('grade-feedback-input').value.trim();

            sub.marksObtained = marks;
            sub.feedback = feedback;
            sub.status = 'Graded';
            saveDB(db);
            closeModal();
            showToast(`Grade saved for ${sub.studentName}.`, 'success');
            renderApp();
        }

        function handlePostAnnouncement(e) {
            e.preventDefault();
            const db = getDB();
            db.announcements.unshift({
                id: 'ANN' + Date.now(),
                title: document.getElementById('ann-title').value.trim(),
                courseId: document.getElementById('ann-course').value,
                content: document.getElementById('ann-content').value.trim(),
                postedBy: appState.currentUser.name,
                date: new Date().toISOString().split('T')[0]
            });
            saveDB(db);
            showToast('Announcement broadcasted to students.', 'success');
            renderApp();
        }

