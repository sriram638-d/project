/*
           MODULE 7: ADMIN PORTAL VIEWS (js/admin.js)
           ========================================================================== */
        function renderAdminPortalView(admin, db) {
            const students = db.users.filter(u => u.role === 'student');
            const facultyList = db.users.filter(u => u.role === 'faculty');

            switch (appState.activeTab) {
                case 'dashboard': {
                    return `
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Students</h4>
                                <div class="stat-num">${students.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-user-graduate"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Faculty</h4>
                                <div class="stat-num">${facultyList.length}</div>
                            </div>
                            <div class="stat-icon green"><i class="fa-solid fa-chalkboard-user"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Active Courses</h4>
                                <div class="stat-num">${db.courses.length}</div>
                            </div>
                            <div class="stat-icon amber"><i class="fa-solid fa-book"></i></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>Total Submissions</h4>
                                <div class="stat-num">${db.submissions.length}</div>
                            </div>
                            <div class="stat-icon blue"><i class="fa-solid fa-file-Arrow-up"></i></div>
                        </div>
                    </div>

                    <div class="grid-2col">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-chart-bar"></i> Course Enrollment Distribution (HTML/CSS Bar Chart)</div>
                            </div>
                            <div class="css-bar-chart">
                                ${db.courses.map(c => {
                                    const enrolledCount = students.filter(s => (s.enrolledCourses || []).includes(c.id)).length;
                                    const pct = students.length > 0 ? Math.round((enrolledCount / students.length) * 100) : 0;
                                    return `
                                    <div class="chart-row">
                                        <div class="chart-label" title="${escapeHTML(c.title)}">${escapeHTML(c.code)}</div>
                                        <div class="progress-wrapper" style="height:12px;">
                                            <div class="progress-fill" style="width:${Math.max(pct, 12)}%;"></div>
                                        </div>
                                        <div class="chart-value">${enrolledCount} Stu</div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title"><i class="fa-solid fa-shield-halved"></i> Administrative Shortcuts</div>
                            </div>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <button class="btn btn-primary" onclick="switchPortalTab('users')">
                                    <i class="fa-solid fa-user-plus"></i> Manage Student &amp; Faculty Accounts
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('courses')">
                                    <i class="fa-solid fa-folder-plus"></i> Create New Institutional Course
                                </button>
                                <button class="btn btn-secondary" onclick="switchPortalTab('reports')">
                                    <i class="fa-solid fa-print"></i> View &amp; Print Academic Reports
                                </button>
                                <button class="btn btn-danger" onclick="confirmResetDemoData()">
                                    <i class="fa-solid fa-rotate-right"></i> Reset All LocalStorage Data
                                </button>
                            </div>
                        </div>
                    </div>`;
                }

                case 'users': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-user-plus"></i> Register New Student or Faculty Account</div>
                        </div>
                        <form onsubmit="handleAdminCreateUser(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">User ID *</label>
                                    <input type="text" id="adm-uid" class="form-control" placeholder="e.g., STU109 or FAC205" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" id="adm-uname" class="form-control" placeholder="Full Name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Role *</label>
                                    <select id="adm-urole" class="form-control">
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Official Email *</label>
                                    <input type="email" id="adm-uemail" class="form-control" placeholder="user@college.edu" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Department *</label>
                                    <input type="text" id="adm-udept" class="form-control" value="Computer Science (CSE)" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Default Password *</label>
                                    <input type="text" id="adm-upass" class="form-control" value="password123" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Create User Account</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-users-gear"></i> All Registered Portal Users</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.users.map(u => `
                                        <tr>
                                            <td><strong>${escapeHTML(u.id)}</strong></td>
                                            <td>${escapeHTML(u.name)}</td>
                                            <td>${escapeHTML(u.email)}</td>
                                            <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : (u.role === 'faculty' ? 'badge-primary' : 'badge-neutral')}">${escapeHTML(u.role.toUpperCase())}</span></td>
                                            <td>${escapeHTML(u.department || '')}</td>
                                            <td><span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}">${escapeHTML(u.status)}</span></td>
                                            <td>
                                                ${u.role !== 'admin' ? `
                                                    <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${u.id}')">
                                                        ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button class="btn btn-danger btn-sm" onclick="deleteUserAccount('${u.id}')">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                ` : '<span style="font-size:12px;color:var(--text-secondary);">Protected</span>'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'courses': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-plus"></i> Add New Institutional Course</div>
                        </div>
                        <form onsubmit="handleAdminCreateCourse(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Course Code *</label>
                                    <input type="text" id="ac-code" class="form-control" placeholder="e.g., CS-305" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Course Title *</label>
                                    <input type="text" id="ac-title" class="form-control" placeholder="e.g., Computer Networks" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Assign Faculty *</label>
                                    <select id="ac-faculty" class="form-control">
                                        ${facultyList.map(f => `<option value="${f.id}">${escapeHTML(f.name)} (${escapeHTML(f.department)})</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Department</label>
                                    <input type="text" id="ac-dept" class="form-control" value="Computer Science (CSE)" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Semester</label>
                                    <input type="text" id="ac-sem" class="form-control" value="6th Semester" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Credits</label>
                                    <input type="number" id="ac-credits" class="form-control" value="4" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Course Description</label>
                                <input type="text" id="ac-desc" class="form-control" placeholder="Overview of course objectives..." required>
                            </div>
                            <button type="submit" class="btn btn-primary">Create Course</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-book-bookmark"></i> Master Course Catalog</div>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Title</th>
                                        <th>Department</th>
                                        <th>Assigned Faculty</th>
                                        <th>Modules</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${db.courses.map(c => `
                                        <tr>
                                            <td>${escapeHTML(c.id)}</td>
                                            <td><span class="badge badge-primary">${escapeHTML(c.code)}</span></td>
                                            <td style="font-weight:600;">${escapeHTML(c.title)}</td>
                                            <td>${escapeHTML(c.department)}</td>
                                            <td>${escapeHTML(c.facultyName)}</td>
                                            <td>${c.modules.length}</td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" onclick="adminDeleteCourse('${c.id}')">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'reports': {
                    return `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-file-contract"></i> Institutional Assessment &amp; Grading Summary</div>
                            <button class="btn btn-secondary btn-sm" onclick="window.print()">
                                <i class="fa-solid fa-print"></i> Print Report
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Roll ID</th>
                                        <th>Enrolled Courses</th>
                                        <th>Quizzes Completed</th>
                                        <th>Assignments Submitted</th>
                                        <th>Standing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${students.map(s => {
                                        const qAtt = db.quizAttempts.filter(a => a.studentId === s.id);
                                        const subs = db.submissions.filter(sub => sub.studentId === s.id);
                                        return `
                                        <tr>
                                            <td style="font-weight:600;">${escapeHTML(s.name)}</td>
                                            <td>${escapeHTML(s.id)}</td>
                                            <td>${(s.enrolledCourses || []).length} Courses</td>
                                            <td>${qAtt.length} Quizzes</td>
                                            <td>${subs.length} Submissions</td>
                                            <td><span class="badge badge-success">Good Standing</span></td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;
                }

                case 'settings': {
                    return `
                    <div class="card" style="max-width:680px;">
                        <div class="card-header">
                            <div class="card-title"><i class="fa-solid fa-sliders"></i> Portal Configuration &amp; Academic Session</div>
                        </div>
                        <form onsubmit="handleSaveSystemSettings(event)">
                            <div class="form-group">
                                <label class="form-label">Institution / College Name</label>
                                <input type="text" id="set-college" class="form-control" value="${escapeHTML(db.settings.collegeName)}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Active Academic Session</label>
                                <input type="text" id="set-year" class="form-control" value="${escapeHTML(db.settings.academicYear)}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Global Top Notification Banner</label>
                                <textarea id="set-banner" class="form-control" rows="2">${escapeHTML(db.settings.systemBanner)}</textarea>
                            </div>
                            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                                <button type="submit" class="btn btn-primary">Save System Settings</button>
                                <button type="button" class="btn btn-danger" onclick="confirmResetDemoData()">
                                    Reset All LocalStorage Data to Defaults
                                </button>
                            </div>
                        </form>
                    </div>`;
                }
            }
            return '';
        }

        // Admin Action Handlers
        function handleAdminCreateUser(e) {
            e.preventDefault();
            const db = getDB();
            const id = document.getElementById('adm-uid').value.trim().toUpperCase();
            const name = document.getElementById('adm-uname').value.trim();
            const role = document.getElementById('adm-urole').value;
            const email = document.getElementById('adm-uemail').value.trim();
            const department = document.getElementById('adm-udept').value.trim();
            const password = document.getElementById('adm-upass').value;

            if (db.users.some(u => u.id === id || u.email.toLowerCase() === email.toLowerCase())) {
                showToast('User ID or Email already exists.', 'danger');
                return;
            }

            db.users.push({
                id,
                role,
                name,
                email,
                password,
                department,
                semester: role === 'student' ? '6th Semester' : undefined,
                status: 'Active',
                enrolledCourses: role === 'student' ? ['CS301'] : undefined
            });
            saveDB(db);
            showToast(`Created ${role} account for ${name}.`, 'success');
            renderApp();
        }

        function toggleUserStatus(userId) {
            const db = getDB();
            const u = db.users.find(item => item.id === userId);
            if (u) {
                u.status = u.status === 'Active' ? 'Inactive' : 'Active';
                saveDB(db);
                showToast(`Updated status for ${u.name} to ${u.status}.`, 'primary');
                renderApp();
            }
        }

        function deleteUserAccount(userId) {
            const db = getDB();
            db.users = db.users.filter(u => u.id !== userId);
            saveDB(db);
            showToast('User account deleted.', 'danger');
            renderApp();
        }

        function handleAdminCreateCourse(e) {
            e.preventDefault();
            const db = getDB();
            const code = document.getElementById('ac-code').value.trim().toUpperCase();
            const id = code.replace(/[^A-Z0-9]/g, '');
            const title = document.getElementById('ac-title').value.trim();
            const facultyId = document.getElementById('ac-faculty').value;
            const facObj = db.users.find(u => u.id === facultyId);

            db.courses.push({
                id,
                code,
                title,
                department: document.getElementById('ac-dept').value.trim(),
                semester: document.getElementById('ac-sem').value.trim(),
                credits: parseInt(document.getElementById('ac-credits').value, 10) || 4,
                facultyId,
                facultyName: facObj ? facObj.name : 'Faculty Member',
                description: document.getElementById('ac-desc').value.trim(),
                modules: [
                    { id: 'M1', title: 'Unit 1: Course Foundations & Syllabus Overview', duration: '4 Hours', videoUrl: '#', notes: 'Introductory concepts and reference material.' }
                ]
            });
            saveDB(db);
            showToast(`Course ${code} added to catalog.`, 'success');
            renderApp();
        }

        function adminDeleteCourse(courseId) {
            const db = getDB();
            db.courses = db.courses.filter(c => c.id !== courseId);
            saveDB(db);
            showToast('Course removed from catalog.', 'danger');
            renderApp();
        }

        function handleSaveSystemSettings(e) {
            e.preventDefault();
            const db = getDB();
            db.settings.collegeName = document.getElementById('set-college').value.trim();
            db.settings.academicYear = document.getElementById('set-year').value.trim();
            db.settings.systemBanner = document.getElementById('set-banner').value.trim();
            saveDB(db);
            showToast('System settings updated.', 'success');
            renderApp();
        }

