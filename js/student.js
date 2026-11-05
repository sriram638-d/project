/*
           MODULE 5: STUDENT PORTAL VIEWS (js/student.js, js/quiz.js, js/certificates.js)
           ========================================================================== */
        function getCourseProgressPercent(studentId, courseId, db) {
            const course = db.courses.find(c => c.id === courseId);
            if (!course || !course.modules || course.modules.length === 0) return 0;
            const key = `${studentId}_${courseId}`;
            const doneList = db.moduleProgress[key] || [];
            return Math.round((doneList.length / course.modules.length) * 100);
        }

        function renderStudentPortalView(student, db) {
            const enrolledIds = student.enrolledCourses || [];
            const enrolledCourses = db.courses.filter(c => enrolledIds.includes(c.id));
            const mySubmissions = db.submissions.filter(s => s.studentId === student.id);
            const myQuizAttempts = db.quizAttempts.filter(a => a.studentId === student.id);

            switch (appState.activeTab) {
                case 'dashboard': {
                    const courseAssignments = db.assignments.filter(a => enrolledIds.includes(a.courseId));
                    const pendingAssignments = courseAssignments.filter(a => !mySubmissions.some(s => s.assignmentId === a.id));
                    const avgQuizPct = myQuizAttempts.length > 0
                        ? Math.round(myQuizAttempts.reduce((acc, cur) => acc + (cur.score / cur.totalMarks) * 100, 0) / myQuizAttempts.length)
                        : 0;

                    return `
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Enrolled Courses</h4>
                                <div class="stat-num">${enrolledCourses.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-book-open"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Pending Assignments</h4>
                                <div class="stat-num">${pendingAssignments.length}</div>
                            </div>
                            <div class="stat-icon amber"><i class="fa-solid fa-file-signature"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Quizzes Completed</h4>
                                <div class="stat-num">${myQuizAttempts.length}</div>
                            </div>
                            <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Quiz Average Score</h4>
                                <div class="stat-num">${avgQuizPct}%</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-chart-line"></i></div>
                        </div>
                    </div>

                    <div class="grid-2col">
                        <!-- Left Column: Course Progress & Deadlines -->
                        <div>
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title"><i class="fa-solid fa-bars-progress"></i> Enrolled Course Progress</div>
                                    <button class="btn btn-secondary btn-sm" onclick="switchPortalTab('courses')">All Courses</button>
                                </div>
                                ${enrolledCourses.length === 0 ? `<p style="color:var(--text-secondary);">No courses enrolled yet.</p>` :
                                enrolledCourses.map(c => {
                                    const pct = getCourseProgressPercent(student.id, c.id, db);
                                    return `
                                    <div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-color);">
                                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                                            <a href="javascript:void(0)" onclick="switchPortalTab('course-details', '${c.id}')" style="font-weight:600;color:var(--text-main);">
                                                ${escapeHTML(c.code)}: ${escapeHTML(c.title)}
                                            </a>
                                            <span style="font-weight:600;font-size:12.5px;color:${pct === 100 ? 'var(--success)' : 'var(--primary)'};">${pct}% Completed</span>
                                        </div>
                                        <div class="progress-wrapper">
                                            <div class="progress-fill ${pct === 100 ? 'success' : ''}" style="width:${pct}%;"></div>
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title"><i class="fa-solid fa-calendar-check"></i> Upcoming Assignment Deadlines</div>
                                    <button class="btn btn-secondary btn-sm" onclick="switchPortalTab('assignments')">View All</button>
                                </div>
                                <div class="table-responsive">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Assignment</th>
                                                <th>Course</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${courseAssignments.map(a => {
                                                const sub = mySubmissions.find(s => s.assignmentId === a.id);
                                                return `
                                                <tr>
                                                    <td style="font-weight:500;">${escapeHTML(a.title)}</td>
                                                    <td><span class="badge badge-neutral">${escapeHTML(a.courseId)}</span></td>
                                                    <td>${escapeHTML(a.dueDate)}</td>
                                                    <td>
                                                        ${sub
                                                            ? `<span class="badge badge-success">${escapeHTML(sub.status)}</span>`
                                                            : `<button class="btn btn-primary btn-sm" onclick="switchPortalTab('assignments')">Submit</button>`}
                                                    </td>
                                                </tr>`;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Announcements -->
                        <div>
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title"><i class="fa-solid fa-bullhorn"></i> Recent Announcements</div>
                                    <button class="btn btn-secondary btn-sm" onclick="switchPortalTab('notifications')">All</button>
                                </div>
                                ${db.announcements.slice(0, 4).map(ann => `
                                    <div style="padding:12px;border:1px solid var(--border-color);border-radius:var(--radius);margin-bottom:10px;background:#F8FAFC;">
                                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                            <span class="badge badge-primary">${escapeHTML(ann.courseId)}</span>
                                            <span style="font-size:11.5px;color:var(--text-secondary);">${escapeHTML(ann.date)}</span>
                                        </div>
                                        <div style="font-weight:600;margin-bottom:4px;">${escapeHTML(ann.title)}</div>
                                        <div style="font-size:13px;color:var(--text-secondary);">${escapeHTML(ann.content)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>`;
                }

                case 'courses': {
                    const filteredCourses = db.courses.filter(c => {
                        const matchesQuery = c.title.toLowerCase().includes(appState.courseSearchQuery.toLowerCase()) ||
                                             c.code.toLowerCase().includes(appState.courseSearchQuery.toLowerCase());
                        const matchesDept = appState.courseDeptFilter === 'ALL' || c.department === appState.courseDeptFilter;
                        return matchesQuery && matchesDept;
                    });

                    return `
                    <div class="card">
                        <div class="form-row" style="align-items:end;">
                            <div class="form-group" style="margin-bottom:0;">
                                <label class="form-label">Search Courses by Title or Code</label>
                                <input type="text" class="form-control" placeholder="e.g., Database or CS-301..."
                                    value="${escapeHTML(appState.courseSearchQuery)}"
                                    oninput="updateCourseFilter(this.value, null)">
                            </div>
                            <div class="form-group" style="margin-bottom:0;">
                                <label class="form-label">Filter by Department</label>
                                <select class="form-control" onchange="updateCourseFilter(null, this.value)">
                                    <option value="ALL" ${appState.courseDeptFilter === 'ALL' ? 'selected' : ''}>All Departments</option>
                                    <option value="Computer Science (CSE)" ${appState.courseDeptFilter === 'Computer Science (CSE)' ? 'selected' : ''}>Computer Science (CSE)</option>
                                    <option value="Electronics (ECE)" ${appState.courseDeptFilter === 'Electronics (ECE)' ? 'selected' : ''}>Electronics (ECE)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="course-cards-grid">
                        ${filteredCourses.map(c => {
                            const isEnrolled = enrolledIds.includes(c.id);
                            const pct = getCourseProgressPercent(student.id, c.id, db);
                            return `
                            <div class="course-card">
                                <div class="course-card-top">
                                    <div class="course-code-row">
                                        <span class="badge badge-primary">${escapeHTML(c.code)}</span>
                                        <span class="badge ${isEnrolled ? 'badge-success' : 'badge-neutral'}">${isEnrolled ? 'Enrolled' : c.credits + ' Credits'}</span>
                                    </div>
                                    <h3 class="course-title">${escapeHTML(c.title)}</h3>
                                    <div class="course-meta">
                                        <i class="fa-solid fa-chalkboard-user"></i> ${escapeHTML(c.facultyName)} &bull; ${escapeHTML(c.semester)}
                                    </div>
                                    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">${escapeHTML(c.description)}</p>
                                    ${isEnrolled ? `
                                        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:4px;">
                                            <span>Syllabus Progress</span>
                                            <strong>${pct}%</strong>
                                        </div>
                                        <div class="progress-wrapper">
                                            <div class="progress-fill ${pct === 100 ? 'success' : ''}" style="width:${pct}%;"></div>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="course-card-footer">
                                    <span style="font-size:12px;color:var(--text-secondary);">${c.modules.length} Syllabus Units</span>
                                    ${isEnrolled ? `
                                        <button class="btn btn-primary btn-sm" onclick="switchPortalTab('course-details', '${c.id}')">
                                            Open Course <i class="fa-solid fa-arrow-right"></i>
                                        </button>
                                    ` : `
                                        <button class="btn btn-success btn-sm" onclick="enrollInCourse('${c.id}')">
                                            <i class="fa-solid fa-plus"></i> Enroll Now
                                        </button>
                                    `}
                                </div>
                            </div>`;
                        }).join('')}
                    </div>`;
                }

                case 'course-details': {
                    const course = db.courses.find(c => c.id === appState.selectedCourseId) || enrolledCourses[0] || db.courses[0];
                    if (!course) return `<div class="card">No course available.</div>`;
                    const key = `${student.id}_${course.id}`;
                    const completedModules = db.moduleProgress[key] || [];
                    const pct = getCourseProgressPercent(student.id, course.id, db);
                    const courseMaterials = db.materials.filter(m => m.courseId === course.id);

                    return `
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                            <div>
                                <span class="badge badge-primary">${escapeHTML(course.code)}</span>
                                <h2 style="font-size:20px;margin-top:6px;">${escapeHTML(course.title)}</h2>
                                <p style="color:var(--text-secondary);font-size:13px;">Instructor: ${escapeHTML(course.facultyName)} | Department: ${escapeHTML(course.department)}</p>
                            </div>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <label style="font-size:13px;font-weight:500;">Switch Course:</label>
                                <select class="form-control" style="width:auto;" onchange="switchPortalTab('course-details', this.value)">
                                    ${db.courses.map(c => `<option value="${c.id}" ${c.id === course.id ? 'selected' : ''}>${escapeHTML(c.code)} - ${escapeHTML(c.title)}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border-color);">
                            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;">
                                <span><strong>Course Completion Status:</strong> Check off syllabus modules below as you complete them</span>
                                <strong>${pct}% (${completedModules.length}/${course.modules.length} Units)</strong>
                            </div>
                            <div class="progress-wrapper" style="height:10px;">
                                <div class="progress-fill ${pct === 100 ? 'success' : ''}" style="width:${pct}%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="grid-2col">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-list-check"></i> Syllabus Modules &amp; Lecture Tracker</div>
                            </div>
                            ${course.modules.map((m, idx) => {
                                const isDone = completedModules.includes(m.id);
                                return `
                                <div style="padding:14px;border:1px solid ${isDone ? '#BBF7D0' : 'var(--border-color)'};background:${isDone ? '#F0FDF4' : '#FFFFFF'};border-radius:var(--radius);margin-bottom:12px;">
                                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
                                        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-weight:600;">
                                            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleModuleCompletion('${course.id}', '${m.id}')" style="margin-top:4px;transform:scale(1.2);">
                                            <span>${escapeHTML(m.title)}</span>
                                        </label>
                                        <span class="badge badge-neutral">${escapeHTML(m.duration)}</span>
                                    </div>
                                    <p style="font-size:13px;color:var(--text-secondary);margin:8px 0 0 26px;">${escapeHTML(m.notes)}</p>
                                </div>`;
                            }).join('')}
                        </div>

                        <div>
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title"><i class="fa-solid fa-file-pdf"></i> Course Study Materials</div>
                                </div>
                                ${courseMaterials.length === 0 ? `<p style="color:var(--text-secondary);">No files uploaded for this course yet.</p>` :
                                courseMaterials.map(mat => `
                                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-color);">
                                        <div>
                                            <div style="font-weight:500;font-size:13.5px;">${escapeHTML(mat.title)}</div>
                                            <div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(mat.type)} &bull; ${escapeHTML(mat.size)}</div>
                                        </div>
                                        <button class="btn btn-secondary btn-sm" onclick="downloadSimulatedMaterial('${escapeHTML(mat.title)}', '${escapeHTML(course.title)}')">
                                            <i class="fa-solid fa-download"></i> Download
                                        </button>
                                    </div>
                                `).join('')}
                            </div>

                            ${pct === 100 ? `
                            <div class="card" style="background:#F0FDF4;border-color:#BBF7D0;">
                                <h3 style="color:var(--success);font-size:16px;margin-bottom:6px;"><i class="fa-solid fa-award"></i> Course Completed!</h3>
                                <p style="font-size:13px;margin-bottom:12px;">You have completed 100% of the modules in this course. Your completion certificate is ready.</p>
                                <button class="btn btn-success btn-sm" onclick="switchPortalTab('certificates')">View Certificate</button>
                            </div>` : ''}
                        </div>
                    </div>`;
                }

                case 'quizzes': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-clock"></i> Available Course Quizzes &amp; Assessments</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Quiz Title</th>
                                        <th>Course</th>
                                        <th>Questions</th>
                                        <th>Time Limit</th>
                                        <th>Total Marks</th>
                                        <th>Status / Best Score</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.quizzes.map(qz => {
                                        const prevAttempt = myQuizAttempts.find(a => a.quizId === qz.id);
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(qz.title)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(qz.courseId)}</span></td>
                                            <td>${qz.questions.length} MCQs</td>
                                            <td>${qz.durationMinutes} Mins</td>
                                            <td>${qz.totalMarks} Marks</td>
                                            <td>
                                                ${prevAttempt
                                                    ? `<span class="badge ${prevAttempt.passed ? 'badge-success' : 'badge-danger'}">Scored ${prevAttempt.score}/${prevAttempt.totalMarks}</span>`
                                                    : `<span class="badge badge-warning">Not Attempted</span>`}
                                            </td>
                                            <td>
                                                <button class="btn btn-primary btn-sm" onclick="startInteractiveQuiz('${qz.id}')">
                                                    <i class="fa-solid fa-play"></i> ${prevAttempt ? 'Retake Quiz' : 'Start Quiz'}
                                                </button>
                                                ${prevAttempt ? `
                                                <button class="btn btn-secondary btn-sm" onclick="switchPortalTab('quiz-results', '${prevAttempt.id}')">
                                                    Review
                                                </button>` : ''}
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'take-quiz': {
                    return renderInteractiveQuizEngine();
                }

                case 'quiz-results': {
                    const selectedAttempt = db.quizAttempts.find(a => a.id === appState.activeQuizAttemptId) || myQuizAttempts[myQuizAttempts.length - 1];
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-square-poll-vertical"></i> My Quiz Attempt History</div>
                            <button class="btn btn-primary btn-sm" onclick="switchPortalTab('quizzes')">Back to Quizzes</button>
                        </div>
                        ${myQuizAttempts.length === 0 ? `<p style="color:var(--text-secondary);">You have not completed any quizzes yet.</p>` : `
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Quiz</th>
                                        <th>Date</th>
                                        <th>Score</th>
                                        <th>Percentage</th>
                                        <th>Result</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${myQuizAttempts.map(att => {
                                        const qz = db.quizzes.find(q => q.id === att.quizId);
                                        const pct = Math.round((att.score / att.totalMarks) * 100);
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(qz ? qz.title : att.quizId)}</td>
                                            <td>${escapeHTML(att.date)}</td>
                                            <td><strong>${att.score} / ${att.totalMarks}</strong></td>
                                            <td>${pct}%</td>
                                            <td><span class="badge ${att.passed ? 'badge-success' : 'badge-danger'}">${att.passed ? 'PASSED' : 'FAILED'}</span></td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm" onclick="switchPortalTab('quiz-results', '${att.id}')">
                                                    Inspect Answers
                                                </button>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`}
                    </div>

                    ${selectedAttempt ? renderDetailedQuizBreakdown(selectedAttempt, db) : ''}`;
                }

                case 'assignments': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-file-arrow-up"></i> Course Assignments &amp; Submissions</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Assignment Title</th>
                                        <th>Course</th>
                                        <th>Due Date</th>
                                        <th>Max Marks</th>
                                        <th>Submission Status</th>
                                        <th>Marks &amp; Feedback</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.assignments.map(asg => {
                                        const sub = mySubmissions.find(s => s.assignmentId === asg.id);
                                        return `
                                        <tr>
                                            <td>
                                                <div style="font-weight:600;">${escapeHTML(asg.title)}</div>
                                                <div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(asg.description)}</div>
                                            </td>
                                            <td><span class="badge badge-primary">${escapeHTML(asg.courseId)}</span></td>
                                            <td>${escapeHTML(asg.dueDate)}</td>
                                            <td>${asg.maxMarks}</td>
                                            <td>
                                                ${sub
                                                    ? `<span class="badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}">${escapeHTML(sub.status)}</span>
                                                       <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;"><i class="fa-solid fa-paperclip"></i> ${escapeHTML(sub.fileName)}</div>`
                                                    : `<span class="badge badge-danger">Pending</span>`}
                                            </td>
                                            <td>
                                                ${sub && sub.status === 'Graded'
                                                    ? `<strong>${sub.marksObtained} / ${asg.maxMarks}</strong>
                                                       <div style="font-size:12px;color:var(--text-secondary);">${escapeHTML(sub.feedback)}</div>`
                                                    : `<span style="color:var(--text-secondary);font-size:12px;">Awaiting faculty grading</span>`}
                                            </td>
                                            <td>
                                                <button class="btn ${sub ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="openAssignmentSubmitModal('${asg.id}')">
                                                    <i class="fa-solid fa-upload"></i> ${sub ? 'Resubmit' : 'Submit Work'}
                                                </button>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'materials': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-folder-open"></i> Digital Study Material Repository</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Document Title</th>
                                        <th>Course</th>
                                        <th>Resource Type</th>
                                        <th>Size</th>
                                        <th>Uploaded By</th>
                                        <th>Date</th>
                                        <th>Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.materials.map(m => `
                                        <tr>
                                            <td style="font-weight:500;"><i class="fa-regular fa-file-pdf" style="color:var(--danger);margin-right:6px;"></i> ${escapeHTML(m.title)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(m.courseId)}</span></td>
                                            <td>${escapeHTML(m.type)}</td>
                                            <td>${escapeHTML(m.size)}</td>
                                            <td>${escapeHTML(m.uploadedBy)}</td>
                                            <td>${escapeHTML(m.date)}</td>
                                            <td>
                                                <button class="btn btn-secondary btn-sm" onclick="downloadSimulatedMaterial('${escapeHTML(m.title)}', '${escapeHTML(m.courseId)}')">
                                                    <i class="fa-solid fa-download"></i> Download
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'notifications': {
                    const readList = db.readNotifications[student.id] || [];
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-bell"></i> Academic Announcements &amp; Alerts</div>
                            <button class="btn btn-secondary btn-sm" onclick="markAllAnnouncementsRead()">Mark All as Read</button>
                        </div>
                        ${db.announcements.map(ann => {
                            const isRead = readList.includes(ann.id);
                            return `
                            <div style="padding:16px;border:1px solid ${isRead ? 'var(--border-color)' : '#93C5FD'};background:${isRead ? '#FFFFFF' : '#EFF6FF'};border-radius:var(--radius);margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:14px;">
                                <div>
                                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                                        <span class="badge badge-primary">${escapeHTML(ann.courseId)}</span>
                                        <span style="font-weight:600;font-size:15px;">${escapeHTML(ann.title)}</span>
                                        ${!isRead ? `<span class="badge badge-warning">NEW</span>` : ''}
                                    </div>
                                    <p style="color:var(--text-main);margin-bottom:6px;">${escapeHTML(ann.content)}</p>
                                    <div style="font-size:12px;color:var(--text-secondary);">Posted by ${escapeHTML(ann.postedBy)} on ${escapeHTML(ann.date)}</div>
                                </div>
                                <button class="btn btn-secondary btn-sm" onclick="toggleNotificationRead('${ann.id}')">
                                    ${isRead ? 'Mark Unread' : 'Mark Read'}
                                </button>
                            </div>`;
                        }).join('')}
                    </div>`;
                }

                case 'certificates': {
                    const completedCourses = enrolledCourses.filter(c => getCourseProgressPercent(student.id, c.id, db) === 100);
                    const certCourse = completedCourses[0] || enrolledCourses[0] || db.courses[0];

                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-award"></i> Course Completion Certificates</div>
                            <button class="btn btn-primary btn-sm" onclick="window.print()">
                                <i class="fa-solid fa-print"></i> Print / Save as PDF
                            </button>
                        </div>
                        <p style="color:var(--text-secondary);margin-bottom:16px;">
                            Complete 100% of syllabus units in any course to unlock official certificate verification. Currently completed: <strong>${completedCourses.length} course(s)</strong>.
                        </p>

                        <div style="margin-bottom:20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                            <label style="font-weight:500;">Select Course Certificate to Preview:</label>
                            <select class="form-control" style="width:auto;" onchange="previewCertificateCourse(this.value)">
                                ${enrolledCourses.map(c => {
                                    const pct = getCourseProgressPercent(student.id, c.id, db);
                                    return `<option value="${c.id}" ${c.id === appState.selectedCourseId ? 'selected' : ''}>${escapeHTML(c.code)} - ${escapeHTML(c.title)} (${pct}% Complete)</option>`;
                                }).join('')}
                            </select>
                        </div>

                        ${certCourse ? `
                        <div class="certificate-frame">
                            <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">
                                ${escapeHTML(db.settings.collegeName.toUpperCase())}
                            </div>
                            <h1>Certificate of Completion</h1>
                            <div class="cert-sub">This is to certify that the student below has successfully completed the academic requirements for</div>
                            <div class="cert-student">${escapeHTML(student.name)} (${escapeHTML(student.id)})</div>
                            <div>in the course</div>
                            <div class="cert-course">${escapeHTML(certCourse.code)}: ${escapeHTML(certCourse.title)}</div>
                            <div style="font-size:13px;color:var(--text-secondary);">
                                Department of ${escapeHTML(certCourse.department)} &bull; Credits: ${certCourse.credits} &bull; Verification ID: CERT-${escapeHTML(student.id)}-${escapeHTML(certCourse.id)}-2026
                            </div>
                            <div class="certificate-signatures">
                                <div>
                                    <div style="border-top:1px solid #1E293B;padding-top:4px;font-weight:600;">${escapeHTML(certCourse.facultyName)}</div>
                                    <div style="font-size:11.5px;color:var(--text-secondary);">Course Instructor</div>
                                </div>
                                <div>
                                    <div style="border-top:1px solid #1E293B;padding-top:4px;font-weight:600;">Dean of Academics</div>
                                    <div style="font-size:11.5px;color:var(--text-secondary);">Issued: November 2026</div>
                                </div>
                            </div>
                        </div>` : ''}
                    </div>`;
                }

                case 'profile': {
                    return `
                    <div class="card" style="max-width:650px;">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-user-gear"></i> Student Profile &amp; Security Settings</div>
                        </div>
                        <form onsubmit="handleStudentProfileUpdate(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Student Roll ID (Read-Only)</label>
                                    <input type="text" class="form-control" value="${escapeHTML(student.id)}" disabled style="background:#F1F5F9;">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" id="prof-name" class="form-control" value="${escapeHTML(student.name)}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" id="prof-email" class="form-control" value="${escapeHTML(student.email)}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone Number</label>
                                    <input type="text" id="prof-phone" class="form-control" value="${escapeHTML(student.phone || '')}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Department</label>
                                    <input type="text" id="prof-dept" class="form-control" value="${escapeHTML(student.department || '')}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Current Semester</label>
                                    <input type="text" id="prof-sem" class="form-control" value="${escapeHTML(student.semester || '')}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Account Password</label>
                                <input type="text" id="prof-pass" class="form-control" value="${escapeHTML(student.password)}" required>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fa-solid fa-floppy-disk"></i> Save Profile Changes
                            </button>
                        </form>
                    </div>`;
                }
            }
            return '';
        }

        // Student Actions
        function updateCourseFilter(query, dept) {
            if (query !== null) appState.courseSearchQuery = query;
            if (dept !== null) appState.courseDeptFilter = dept;
            renderApp();
        }

        function enrollInCourse(courseId) {
            const db = getDB();
            const user = db.users.find(u => u.id === appState.currentUser.id);
            if (user && !user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                saveDB(db);
                appState.currentUser = user;
                showToast(`Enrolled in course ${courseId} successfully!`, 'success');
                renderApp();
            }
        }

        function toggleModuleCompletion(courseId, moduleId) {
            const db = getDB();
            const key = `${appState.currentUser.id}_${courseId}`;
            if (!db.moduleProgress[key]) db.moduleProgress[key] = [];
            const idx = db.moduleProgress[key].indexOf(moduleId);
            if (idx > -1) {
                db.moduleProgress[key].splice(idx, 1);
            } else {
                db.moduleProgress[key].push(moduleId);
            }
            saveDB(db);
            renderApp();
        }

        function downloadSimulatedMaterial(title, courseTitle) {
            const content = `EDUPORTAL COLLEGE LMS - STUDY MATERIAL\n=======================================\nDocument: ${title}\nCourse: ${courseTitle}\nDownloaded by: ${appState.currentUser.name} (${appState.currentUser.id})\nDate: ${new Date().toLocaleDateString()}\n\nThis file was generated from the local study repository.`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = title.replace(/\s+/g, '_') + '.txt';
            a.click();
            URL.revokeObjectURL(url);
            showToast(`Downloaded ${title}`, 'success');
        }

        function previewCertificateCourse(courseId) {
            appState.selectedCourseId = courseId;
            renderApp();
        }

        function toggleNotificationRead(annId) {
            const db = getDB();
            const uid = appState.currentUser.id;
            if (!db.readNotifications[uid]) db.readNotifications[uid] = [];
            const idx = db.readNotifications[uid].indexOf(annId);
            if (idx > -1) {
                db.readNotifications[uid].splice(idx, 1);
            } else {
                db.readNotifications[uid].push(annId);
            }
            saveDB(db);
            renderApp();
        }

        function markAllAnnouncementsRead() {
            const db = getDB();
            const uid = appState.currentUser.id;
            db.readNotifications[uid] = db.announcements.map(a => a.id);
            saveDB(db);
            showToast('All announcements marked as read.', 'success');
            renderApp();
        }

        function handleStudentProfileUpdate(e) {
            e.preventDefault();
            const db = getDB();
            const user = db.users.find(u => u.id === appState.currentUser.id);
            if (!user) return;
            user.name = document.getElementById('prof-name').value.trim();
            user.email = document.getElementById('prof-email').value.trim();
            user.phone = document.getElementById('prof-phone').value.trim();
            user.department = document.getElementById('prof-dept').value.trim();
            user.semester = document.getElementById('prof-sem').value.trim();
            user.password = document.getElementById('prof-pass').value;
            saveDB(db);
            appState.currentUser = user;
            showToast('Student profile updated in LocalStorage.', 'success');
            renderApp();
        }

        function openAssignmentSubmitModal(assignmentId) {
            const db = getDB();
            const asg = db.assignments.find(a => a.id === assignmentId);
            if (!asg) return;

            openModal(
                `Submit Assignment: ${escapeHTML(asg.title)}`,
                `<p style="color:var(--text-secondary);font-size:13px;margin-bottom:14px;">Course: <strong>${escapeHTML(asg.courseId)}</strong> | Max Marks: <strong>${asg.maxMarks}</strong></p>
                 <div class="form-group">
                    <label class="form-label">Select Solution File (PDF / ZIP / DOCX)</label>
                    <input type="file" id="sub-file-input" class="form-control">
                 </div>
                 <div class="form-group">
                    <label class="form-label">Submission Notes / GitHub Link / Summary *</label>
                    <textarea id="sub-notes-input" class="form-control" rows="4" placeholder="Describe your approach or paste solution notes here..." required></textarea>
                 </div>`,
                `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                 <button class="btn btn-primary" onclick="executeAssignmentSubmission('${asg.id}')"><i class="fa-solid fa-cloud-arrow-up"></i> Upload Submission</button>`
            );
        }

        function executeAssignmentSubmission(assignmentId) {
            const db = getDB();
            const asg = db.assignments.find(a => a.id === assignmentId);
            const fileInput = document.getElementById('sub-file-input');
            const notes = document.getElementById('sub-notes-input').value.trim();

            if (!notes) {
                showToast('Please enter submission summary notes.', 'danger');
                return;
            }

            const fileName = (fileInput && fileInput.files && fileInput.files[0])
                ? fileInput.files[0].name
                : `${appState.currentUser.id}_${asg.courseId}_Solution.pdf`;

            const existingIdx = db.submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === appState.currentUser.id);
            const submissionRecord = {
                id: existingIdx > -1 ? db.submissions[existingIdx].id : 'SUB' + Date.now(),
                assignmentId,
                courseId: asg.courseId,
                studentId: appState.currentUser.id,
                studentName: appState.currentUser.name,
                submittedDate: new Date().toISOString().split('T')[0],
                fileName,
                notes,
                status: 'Pending Evaluation',
                marksObtained: null,
                feedback: ''
            };

            if (existingIdx > -1) {
                db.submissions[existingIdx] = submissionRecord;
            } else {
                db.submissions.push(submissionRecord);
            }

            saveDB(db);
            closeModal();
            showToast('Assignment submitted! It is now visible in the Faculty Grading Center.', 'success');
            renderApp();
        }

        /* ==========================================================================
           INTERACTIVE QUIZ ENGINE (js/quiz.js)
           ========================================================================== */
        function startInteractiveQuiz(quizId) {
            const db = getDB();
            const quiz = db.quizzes.find(q => q.id === quizId);
            if (!quiz) return;

            stopQuizTimer();
            quizRuntime = {
                quiz,
                currentQuestionIndex: 0,
                selectedAnswers: {},
                remainingSeconds: quiz.durationMinutes * 60,
                timerInterval: null
            };

            appState.activeTab = 'take-quiz';
            renderApp();

            quizRuntime.timerInterval = setInterval(() => {
                quizRuntime.remainingSeconds--;
                const timerEl = document.getElementById('live-quiz-timer');
                if (timerEl) {
                    const mins = String(Math.floor(quizRuntime.remainingSeconds / 60)).padStart(2, '0');
                    const secs = String(quizRuntime.remainingSeconds % 60).padStart(2, '0');
                    timerEl.textContent = `${mins}:${secs}`;
                }
                if (quizRuntime.remainingSeconds <= 0) {
                    stopQuizTimer();
                    showToast('Time is up! Submitting your quiz automatically.', 'danger');
                    submitActiveQuiz();
                }
            }, 1000);
        }

        function renderInteractiveQuizEngine() {
            const qz = quizRuntime.quiz;
            if (!qz) return `<div class="card">No active quiz selected. <button class="btn btn-primary btn-sm" onclick="switchPortalTab('quizzes')">Go to Quizzes</button></div>`;

            const qIdx = quizRuntime.currentQuestionIndex;
            const currentQ = qz.questions[qIdx];
            const mins = String(Math.floor(quizRuntime.remainingSeconds / 60)).padStart(2, '0');
            const secs = String(quizRuntime.remainingSeconds % 60).padStart(2, '0');

            return `
            <div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                <div>
                    <span class="badge badge-primary">${escapeHTML(qz.courseId)}</span>
                    <h2 style="font-size:18px;margin-top:4px;">${escapeHTML(qz.title)}</h2>
                </div>
                <div class="timer-badge">
                    <i class="fa-regular fa-clock"></i> Time Remaining: <span id="live-quiz-timer">${mins}:${secs}</span>
                </div>
            </div>

            <div class="quiz-engine-layout">
                <div class="card">
                    <div style="display:flex;justify-content:space-between;margin-bottom:14px;color:var(--text-secondary);font-size:13px;">
                        <span><strong>Question ${qIdx + 1} of ${qz.questions.length}</strong></span>
                        <span>Marks per question: ${Math.round(qz.totalMarks / qz.questions.length)}</span>
                    </div>
                    <h3 style="font-size:16px;margin-bottom:18px;line-height:1.5;">${escapeHTML(currentQ.qText)}</h3>

                    <div>
                        ${currentQ.options.map((opt, optIndex) => {
                            const isSelected = quizRuntime.selectedAnswers[qIdx] === optIndex;
                            return `
                            <div class="quiz-option-label ${isSelected ? 'selected' : ''}" onclick="selectQuizOption(${qIdx}, ${optIndex})">
                                <input type="radio" name="quiz-opt" ${isSelected ? 'checked' : ''}>
                                <span>${escapeHTML(opt)}</span>
                            </div>`;
                        }).join('')}
                    </div>

                    <div style="display:flex;justify-content:space-between;margin-top:24px;padding-top:16px;border-top:1px solid var(--border-color);">
                        <button class="btn btn-secondary" ${qIdx === 0 ? 'disabled' : ''} onclick="jumpQuizQuestion(${qIdx - 1})">
                            <i class="fa-solid fa-arrow-left"></i> Previous
                        </button>
                        ${qIdx < qz.questions.length - 1 ? `
                            <button class="btn btn-primary" onclick="jumpQuizQuestion(${qIdx + 1})">
                                Next Question <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        ` : `
                            <button class="btn btn-success" onclick="submitActiveQuiz()">
                                <i class="fa-solid fa-check-double"></i> Submit Final Quiz
                            </button>
                        `}
                    </div>
                </div>

                <div class="card">
                    <div style="font-weight:600;margin-bottom:8px;">Question Palette</div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">
                        Answered: ${Object.keys(quizRuntime.selectedAnswers).length} / ${qz.questions.length}
                    </div>
                    <div class="palette-grid">
                        ${qz.questions.map((_, idx) => {
                            const answered = quizRuntime.selectedAnswers[idx] !== undefined;
                            const isCurr = idx === qIdx;
                            return `<button class="palette-btn ${answered ? 'answered' : ''} ${isCurr ? 'current' : ''}" onclick="jumpQuizQuestion(${idx})">${idx + 1}</button>`;
                        }).join('')}
                    </div>
                    <button class="btn btn-success btn-block" style="margin-top:24px;" onclick="submitActiveQuiz()">
                        Submit Quiz Now
                    </button>
                </div>
            </div>`;
        }

        function selectQuizOption(qIdx, optIdx) {
            quizRuntime.selectedAnswers[qIdx] = optIdx;
            renderApp();
        }

        function jumpQuizQuestion(idx) {
            quizRuntime.currentQuestionIndex = idx;
            renderApp();
        }

        function submitActiveQuiz() {
            stopQuizTimer();
            const qz = quizRuntime.quiz;
            if (!qz) return;

            let correctCount = 0;
            const answerArray = [];
            qz.questions.forEach((q, idx) => {
                const chosen = quizRuntime.selectedAnswers[idx];
                answerArray.push(chosen !== undefined ? chosen : -1);
                if (chosen === q.correctIndex) {
                    correctCount++;
                }
            });

            const score = Math.round((correctCount / qz.questions.length) * qz.totalMarks);
            const passed = score >= qz.passingMarks;

            const db = getDB();
            const attemptId = 'ATT' + Date.now();
            db.quizAttempts.push({
                id: attemptId,
                quizId: qz.id,
                studentId: appState.currentUser.id,
                studentName: appState.currentUser.name,
                score,
                totalMarks: qz.totalMarks,
                answers: answerArray,
                date: new Date().toISOString().split('T')[0],
                passed
            });

            saveDB(db);
            appState.activeQuizAttemptId = attemptId;
            appState.activeTab = 'quiz-results';
            showToast(`Quiz submitted! You scored ${score} / ${qz.totalMarks}`, passed ? 'success' : 'danger');
            renderApp();
        }

        function renderDetailedQuizBreakdown(attempt, db) {
            const qz = db.quizzes.find(q => q.id === attempt.quizId);
            if (!qz) return '';

            return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fa-solid fa-magnifying-glass-chart"></i> Detailed Answer Review: ${escapeHTML(qz.title)}</div>
                    <span class="badge ${attempt.passed ? 'badge-success' : 'badge-danger'}">Score: ${attempt.score} / ${attempt.totalMarks}</span>
                </div>
                ${qz.questions.map((q, idx) => {
                    const userChoice = attempt.answers[idx];
                    const isCorrect = userChoice === q.correctIndex;
                    return `
                    <div style="padding:14px;border:1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'};background:${isCorrect ? '#F0FDF4' : '#FEF2F2'};border-radius:var(--radius);margin-bottom:12px;">
                        <div style="font-weight:600;margin-bottom:6px;">Q${idx + 1}. ${escapeHTML(q.qText)}</div>
                        <div style="font-size:13px;">
                            <div><strong>Your Answer:</strong> ${userChoice >= 0 && q.options[userChoice] ? escapeHTML(q.options[userChoice]) : '<em>Not Answered</em>'}
                                ${isCorrect ? '<span class="badge badge-success">Correct</span>' : '<span class="badge badge-danger">Incorrect</span>'}
                            </div>
                            ${!isCorrect ? `<div style="margin-top:4px;color:var(--success);"><strong>Correct Answer:</strong> ${escapeHTML(q.options[q.correctIndex])}</div>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        }

