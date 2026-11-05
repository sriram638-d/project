/*
           MODULE 3: LANDING PAGE & 3 INDEPENDENT LOGIN PORTALS (js/auth.js)
           ========================================================================== */
        function renderLandingPage() {
            const db = getDB();
            return `
            <div class="landing-wrapper">
                <header class="landing-header">
                    <div class="brand-logo" onclick="navigateToView('landing')">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <div>
                            <div>EduPortal LMS</div>
                            <div style="font-size:11px;font-weight:400;color:var(--text-secondary);">${escapeHTML(db.settings.collegeName)}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        <button class="btn btn-secondary btn-sm" onclick="navigateToView('student-login')">
                            <i class="fa-solid fa-user-graduate"></i> Student Login
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="navigateToView('faculty-login')">
                            <i class="fa-solid fa-chalkboard-user"></i> Faculty Login
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="navigateToView('admin-login')">
                            <i class="fa-solid fa-user-shield"></i> Admin Login
                        </button>
                    </div>
                </header>

                <main class="landing-hero">
                    <div class="hero-banner">
                        <div class="hero-content">
                            <span class="badge badge-primary" style="margin-bottom:10px;">Academic Session: ${escapeHTML(db.settings.academicYear)}</span>
                            <h1 class="hero-title">Student Learning Management System</h1>
                            <p class="hero-subtitle">
                                A unified academic portal for course syllabus tracking, study material distribution, timed online quizzes, assignment evaluation, and automated course completion certificates.
                            </p>
                            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                                <button class="btn btn-primary" onclick="navigateToView('student-login')">
                                    <i class="fa-solid fa-right-to-bracket"></i> Enter Student Portal
                                </button>
                                <button class="btn btn-secondary" onclick="openArchitectureModal()">
                                    <i class="fa-solid fa-code"></i> View Multi-File Project Structure
                                </button>
                            </div>
                        </div>
                        <div style="background:#F8FAFC;border:1px solid var(--border-color);border-radius:var(--radius);padding:18px;min-width:260px;">
                            <div style="font-weight:600;margin-bottom:10px;font-size:13px;color:var(--text-main);">
                                <i class="fa-solid fa-server" style="color:var(--primary);"></i> System Snapshot (Live LocalStorage)
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12.5px;">
                                <div style="padding:8px;background:#fff;border:1px solid var(--border-color);border-radius:4px;">
                                    <div style="color:var(--text-secondary);">Active Courses</div>
                                    <div style="font-size:18px;font-weight:700;">${db.courses.length}</div>
                                </div>
                                <div style="padding:8px;background:#fff;border:1px solid var(--border-color);border-radius:4px;">
                                    <div style="color:var(--text-secondary);">Registered Users</div>
                                    <div style="font-size:18px;font-weight:700;">${db.users.length}</div>
                                </div>
                                <div style="padding:8px;background:#fff;border:1px solid var(--border-color);border-radius:4px;">
                                    <div style="color:var(--text-secondary);">Active Quizzes</div>
                                    <div style="font-size:18px;font-weight:700;">${db.quizzes.length}</div>
                                </div>
                                <div style="padding:8px;background:#fff;border:1px solid var(--border-color);border-radius:4px;">
                                    <div style="color:var(--text-secondary);">Study Resources</div>
                                    <div style="font-size:18px;font-weight:700;">${db.materials.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 style="font-size:18px;margin-bottom:16px;font-weight:600;">Select Role-Based Portal</h2>
                    <div class="portal-grid">
                        <!-- Student Portal Card -->
                        <div class="portal-card">
                            <div>
                                <div class="portal-icon"><i class="fa-solid fa-user-graduate"></i></div>
                                <h3>Student Portal</h3>
                                <p>Access enrolled courses, complete syllabus modules, take timed quizzes, upload assignments, and download verifiable certificates.</p>
                                <div class="portal-cred-box">
                                    <div><strong>Demo ID / Email:</strong> STU101 or student@college.edu</div>
                                    <div><strong>Password:</strong> password123</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn btn-primary btn-block" onclick="navigateToView('student-login')">Student Login</button>
                                <button class="btn btn-secondary" onclick="quickDemoLogin('student')" title="Instant 1-Click Login">1-Click Demo</button>
                            </div>
                        </div>

                        <!-- Faculty Portal Card -->
                        <div class="portal-card">
                            <div>
                                <div class="portal-icon"><i class="fa-solid fa-chalkboard-user"></i></div>
                                <h3>Faculty Portal</h3>
                                <p>Manage courses &amp; syllabus units, upload study PDFs, create multiple-choice quizzes, post assignments, and grade student submissions.</p>
                                <div class="portal-cred-box">
                                    <div><strong>Demo ID / Email:</strong> FAC201 or faculty@college.edu</div>
                                    <div><strong>Password:</strong> password123</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn btn-primary btn-block" onclick="navigateToView('faculty-login')">Faculty Login</button>
                                <button class="btn btn-secondary" onclick="quickDemoLogin('faculty')" title="Instant 1-Click Login">1-Click Demo</button>
                            </div>
                        </div>

                        <!-- Admin Portal Card -->
                        <div class="portal-card">
                            <div>
                                <div class="portal-icon"><i class="fa-solid fa-user-shield"></i></div>
                                <h3>Admin Portal</h3>
                                <p>Monitor institutional metrics, manage student &amp; faculty accounts, assign faculty to courses, view pass-rate reports, and configure settings.</p>
                                <div class="portal-cred-box">
                                    <div><strong>Admin Email:</strong> admin@college.edu</div>
                                    <div><strong>Password:</strong> admin123</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="btn btn-primary btn-block" onclick="navigateToView('admin-login')">Admin Login</button>
                                <button class="btn btn-secondary" onclick="quickDemoLogin('admin')" title="Instant 1-Click Login">1-Click Demo</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>`;
        }

        function renderLoginPortal(roleType) {
            const config = {
                'student': {
                    title: 'Student Portal Login',
                    subtitle: 'Sign in with your Student Roll ID or College Email',
                    icon: 'fa-user-graduate',
                    idLabel: 'Student ID or Email Address',
                    placeholder: 'e.g., STU101 or student@college.edu',
                    demoUser: 'STU101',
                    demoEmail: 'student@college.edu',
                    demoPass: 'password123'
                },
                'faculty': {
                    title: 'Faculty Portal Login',
                    subtitle: 'Sign in with your Faculty ID or Official Email',
                    icon: 'fa-chalkboard-user',
                    idLabel: 'Faculty ID or Email Address',
                    placeholder: 'e.g., FAC201 or faculty@college.edu',
                    demoUser: 'FAC201',
                    demoEmail: 'faculty@college.edu',
                    demoPass: 'password123'
                },
                'admin': {
                    title: 'Administrator Login',
                    subtitle: 'Academic Cell & System Administration Access',
                    icon: 'fa-user-shield',
                    idLabel: 'Admin Email Address',
                    placeholder: 'ADM001 or admin@college.edu',
                    demoUser: 'ADM001',
                    demoEmail: 'admin@college.edu',
                    demoPass: 'admin123'
                }
            }[roleType];

            return `
            <div class="landing-wrapper">
                <header class="landing-header">
                    <div class="brand-logo" onclick="navigateToView('landing')">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>EduPortal LMS</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="navigateToView('landing')">
                        <i class="fa-solid fa-arrow-left"></i> Back to All Portals
                    </button>
                </header>

                <div class="auth-page">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="portal-icon" style="margin:0 auto;"><i class="fa-solid ${config.icon}"></i></div>
                            <h2>${config.title}</h2>
                            <p>${config.subtitle}</p>
                        </div>

                        <div class="demo-login-helper">
                            <div class="demo-login-helper-header">
                                <span><i class="fa-solid fa-key"></i> LocalStorage Demo Account</span>
                                <button type="button" class="btn btn-primary btn-sm" onclick="fillDemoCredentials('${config.demoEmail}', '${config.demoPass}')">
                                    Auto-Fill Demo
                                </button>
                            </div>
                            <div><strong>ID / Email:</strong> ${config.demoUser} / ${config.demoEmail}</div>
                            <div><strong>Password:</strong> ${config.demoPass}</div>
                        </div>

                        <form onsubmit="handleRoleLogin(event, '${roleType}')">
                            <div class="form-group">
                                <label class="form-label">${config.idLabel}</label>
                                <input type="text" id="login-identifier" class="form-control" placeholder="${config.placeholder}" required>
                            </div>
                            <div class="form-group">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <label class="form-label">Password</label>
                                    <a href="javascript:void(0)" onclick="openForgotPasswordModal('${roleType}')" style="font-size:12px;">Forgot password?</a>
                                </div>
                                <input type="password" id="login-password" class="form-control" placeholder="Enter password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block" style="margin-top:8px;">
                                <i class="fa-solid fa-right-to-bracket"></i> Sign In to ${roleType.charAt(0).toUpperCase() + roleType.slice(1)} Portal
                            </button>
                        </form>

                        ${roleType === 'student' ? `
                        <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border-color);text-align:center;font-size:13px;">
                            New student? <a href="javascript:void(0)" onclick="navigateToView('student-register')" style="font-weight:600;">Create Student Account</a>
                        </div>` : ''}

                        <div style="margin-top:14px;text-align:center;font-size:11.5px;color:var(--text-secondary);">
                            Note: Authentication is simulated locally in browser <code>localStorage</code> for academic evaluation.
                        </div>
                    </div>
                </div>
            </div>`;
        }

        function renderStudentRegister() {
            return `
            <div class="landing-wrapper">
                <header class="landing-header">
                    <div class="brand-logo" onclick="navigateToView('landing')">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>EduPortal LMS</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="navigateToView('student-login')">
                        <i class="fa-solid fa-arrow-left"></i> Back to Student Login
                    </button>
                </header>

                <div class="auth-page" style="max-width:540px;">
                    <div class="auth-card">
                        <div class="auth-header">
                            <h2>Student Registration</h2>
                            <p>Register a new student profile in local storage</p>
                        </div>
                        <form onsubmit="handleStudentRegister(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" id="reg-name" class="form-control" placeholder="e.g., Karthik Reddy" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Student Roll ID *</label>
                                    <input type="text" id="reg-id" class="form-control" placeholder="e.g., STU105" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">College Email Address *</label>
                                <input type="email" id="reg-email" class="form-control" placeholder="karthik@college.edu" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Department *</label>
                                    <select id="reg-dept" class="form-control">
                                        <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                                        <option value="Electronics (ECE)">Electronics (ECE)</option>
                                        <option value="Information Technology (IT)">Information Technology (IT)</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Semester *</label>
                                    <select id="reg-sem" class="form-control">
                                        <option value="2nd Semester">2nd Semester</option>
                                        <option value="4th Semester">4th Semester</option>
                                        <option value="6th Semester" selected>6th Semester</option>
                                        <option value="8th Semester">8th Semester</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Create Password *</label>
                                <input type="password" id="reg-pass" class="form-control" placeholder="Minimum 6 characters" minlength="6" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Complete Student Registration</button>
                        </form>
                    </div>
                </div>
            </div>`;
        }

        function fillDemoCredentials(email, pass) {
            const idInput = document.getElementById('login-identifier');
            const passInput = document.getElementById('login-password');
            if (idInput && passInput) {
                idInput.value = email;
                passInput.value = pass;
            }
        }

        function quickDemoLogin(roleType) {
            const db = getDB();
            const demoIds = { student: 'STU101', faculty: 'FAC201', admin: 'ADM001' };
            const user = db.users.find(u => u && String(u.id).toUpperCase() === demoIds[roleType] && String(u.role).toLowerCase() === roleType);
            if (user && user.status === 'Active') {
                beginAuthenticatedSession(user, `Signed in as ${user.name} (${roleType.toUpperCase()})`);
            } else {
                showToast('The demo account is unavailable or inactive. Restore demo data and try again.', 'danger');
            }
        }

        function handleRoleLogin(e, expectedRole) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            const identifierInput = document.getElementById('login-identifier');
            const passwordInput = document.getElementById('login-password');
            if (!identifierInput || !passwordInput) {
                showToast('Login form could not be loaded. Refresh the page and try again.', 'danger');
                return false;
            }

            const identifier = String(identifierInput.value || '').trim().toLowerCase();
            const password = String(passwordInput.value || '');
            if (!identifier || !password) {
                showToast('Enter both your ID/email and password.', 'danger');
                return false;
            }

            // getDB() also repairs missing demo accounts and restores their published demo credentials.
            const db = getDB();
            const role = String(expectedRole || '').trim().toLowerCase();
            const matchedUser = (Array.isArray(db.users) ? db.users : []).find(user => {
                if (!user) return false;
                const userRole = String(user.role || '').trim().toLowerCase();
                const userEmail = String(user.email || '').trim().toLowerCase();
                const userId = String(user.id || '').trim().toLowerCase();
                return userRole === role && (userEmail === identifier || userId === identifier) && String(user.password ?? '') === password;
            });

            if (!matchedUser) {
                showToast('Login failed. Check your ID/email, password, and selected portal.', 'danger');
                passwordInput.value = '';
                passwordInput.focus();
                return false;
            }
            if (String(matchedUser.status || 'Active').toLowerCase() !== 'active') {
                showToast('This account has been deactivated by the Administrator.', 'danger');
                return false;
            }

            beginAuthenticatedSession(matchedUser, `Welcome back, ${matchedUser.name}!`);
            return false;
        }

        function handleStudentRegister(e) {
            e.preventDefault();
            const db = getDB();
            const id = document.getElementById('reg-id').value.trim().toUpperCase();
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const department = document.getElementById('reg-dept').value;
            const semester = document.getElementById('reg-sem').value;
            const password = document.getElementById('reg-pass').value;

            if (db.users.some(u => u.id.toUpperCase() === id || u.email.toLowerCase() === email.toLowerCase())) {
                showToast('Student ID or Email already exists in database.', 'danger');
                return;
            }

            const newStudent = {
                id,
                role: 'student',
                name,
                email,
                password,
                department,
                semester,
                phone: '+91 90000 00000',
                status: 'Active',
                enrolledCourses: ['CS301', 'CS304']
            };

            db.users.push(newStudent);
            saveDB(db);
            beginAuthenticatedSession(newStudent, 'Registration successful! Please review the required notices.');
        }

        function openForgotPasswordModal(roleType) {
            openModal(
                'Password Recovery Assistance',
                `<p style="margin-bottom:12px;">Enter your registered College Email or Roll/Faculty ID to reset your local password:</p>
                 <div class="form-group">
                    <label class="form-label">Registered Email or ID</label>
                    <input type="text" id="reset-ident" class="form-control" placeholder="e.g., student@college.edu or STU101">
                 </div>
                 <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" id="reset-newpass" class="form-control" placeholder="Enter new password">
                 </div>`,
                `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                 <button class="btn btn-primary" onclick="executePasswordReset('${roleType}')">Update Password</button>`
            );
        }

        function executePasswordReset(roleType) {
            const ident = document.getElementById('reset-ident').value.trim().toLowerCase();
            const newPass = document.getElementById('reset-newpass').value;
            if (!ident || !newPass) {
                showToast('Please provide both identifier and new password.', 'danger');
                return;
            }
            const db = getDB();
            const user = db.users.find(u => u.role === roleType && (u.email.toLowerCase() === ident || u.id.toLowerCase() === ident));
            if (!user) {
                showToast('No matching account found in this portal.', 'danger');
                return;
            }
            user.password = newPass;
            saveDB(db);
            closeModal();
            showToast(`Password updated for ${user.name}. You can now log in.`, 'success');
        }

