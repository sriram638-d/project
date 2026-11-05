/*
           MODULE 4: PORTAL SHELL (Sidebar + Header + Role Dispatcher)
           ========================================================================== */
        function renderPortalShell() {
            const user = appState.currentUser;
            const db = getDB();

            // Refresh currentUser from DB
            const freshUser = db.users.find(u => u.id === user.id) || user;
            appState.currentUser = freshUser;

            const navItems = getSidebarItemsForRole(freshUser.role);
            let mainViewHTML = '';

            if (freshUser.role === 'student') {
                mainViewHTML = renderStudentPortalView(freshUser, db);
            } else if (freshUser.role === 'faculty') {
                mainViewHTML = renderFacultyPortalView(freshUser, db);
            } else if (freshUser.role === 'admin') {
                mainViewHTML = renderAdminPortalView(freshUser, db);
            }

            const currentTabObj = navItems.find(i => i.id === appState.activeTab) || { label: 'Portal View' };

            return `
            <div class="app-shell">
                <!-- Sidebar Navigation -->
                <aside class="sidebar ${appState.mobileSidebarOpen ? 'mobile-open' : ''}">
                    <div class="sidebar-brand">
                        <div class="sidebar-brand-title">
                            <i class="fa-solid fa-graduation-cap" style="color:#60A5FA;"></i>
                            <span>EduPortal</span>
                        </div>
                        <span class="sidebar-role-tag">${freshUser.role}</span>
                    </div>

                    <div class="sidebar-user-box">
                        <div class="sidebar-user-name">${escapeHTML(freshUser.name)}</div>
                        <div class="sidebar-user-meta">${escapeHTML(freshUser.id)} &bull; ${escapeHTML(freshUser.department || '')}</div>
                    </div>

                    <ul class="sidebar-nav">
                        ${navItems.map(item => `
                            <li class="sidebar-nav-item ${appState.activeTab === item.id ? 'active' : ''}"
                                onclick="switchPortalTab('${item.id}')">
                                <div class="sidebar-nav-item-left">
                                    <i class="fa-solid ${item.icon}"></i>
                                    <span>${item.label}</span>
                                </div>
                                ${item.badge ? `<span class="badge badge-primary" style="font-size:10px;padding:1px 6px;">${item.badge}</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>

                    <div class="sidebar-footer">
                        <button class="btn btn-danger btn-block btn-sm" onclick="logoutUser()">
                            <i class="fa-solid fa-power-off"></i> Sign Out
                        </button>
                    </div>
                </aside>

                <!-- Main Area -->
                <div class="main-area">
                    <header class="main-header">
                        <div class="main-header-left">
                            <button class="mobile-menu-btn" onclick="toggleMobileSidebar()">
                                <i class="fa-solid fa-bars"></i>
                            </button>
                            <h1 class="page-heading">${escapeHTML(currentTabObj.label)}</h1>
                        </div>
                        <div class="main-header-right">
                            <span class="badge badge-neutral" style="display:none;md:inline-block;">${escapeHTML(db.settings.academicYear)}</span>
                            <button class="btn btn-secondary btn-sm" onclick="logoutUser()">
                                <i class="fa-solid fa-right-from-bracket"></i> Logout
                            </button>
                        </div>
                    </header>

                    <main class="main-content">
                        ${db.settings.systemBanner ? `
                        <div style="background-color:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;padding:10px 16px;border-radius:var(--radius);margin-bottom:20px;font-size:13px;display:flex;align-items:center;gap:10px;">
                            <i class="fa-solid fa-bullhorn"></i>
                            <span><strong>Notice:</strong> ${escapeHTML(db.settings.systemBanner)}</span>
                        </div>` : ''}

                        ${mainViewHTML}
                    </main>
                </div>
            </div>`;
        }

        function toggleMobileSidebar() {
            appState.mobileSidebarOpen = !appState.mobileSidebarOpen;
            renderApp();
        }

        function getSidebarItemsForRole(role) {
            const db = getDB();
            if (role === 'student') {
                const unreadCount = db.announcements.filter(a => {
                    const readList = db.readNotifications[appState.currentUser.id] || [];
                    return !readList.includes(a.id);
                }).length;

                return [
                    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
                    { id: 'courses', label: 'My Courses & Catalog', icon: 'fa-book-open' },
                    { id: 'course-details', label: 'Course Syllabus View', icon: 'fa-list-check' },
                    { id: 'quizzes', label: 'Online Quizzes', icon: 'fa-clock' },
                    { id: 'quiz-results', label: 'Quiz Results', icon: 'fa-chart-simple' },
                    { id: 'assignments', label: 'Assignments', icon: 'fa-file-arrow-up' },
                    { id: 'materials', label: 'Study Materials', icon: 'fa-folder-open' },
                    { id: 'notifications', label: 'Announcements', icon: 'fa-bell', badge: unreadCount || '' },
                    { id: 'certificates', label: 'Certificates', icon: 'fa-award' },
                    { id: 'profile', label: 'My Profile', icon: 'fa-user-gear' }
                ];
            }
            if (role === 'faculty') {
                const pendingCount = db.submissions.filter(s => s.status !== 'Graded').length;
                return [
                    { id: 'dashboard', label: 'Faculty Dashboard', icon: 'fa-gauge-high' },
                    { id: 'manage-courses', label: 'Manage Courses & Notes', icon: 'fa-book' },
                    { id: 'manage-quizzes', label: 'Manage Quizzes', icon: 'fa-list-ol' },
                    { id: 'create-quiz', label: 'Create New Quiz', icon: 'fa-circle-plus' },
                    { id: 'manage-assignments', label: 'Manage Assignments', icon: 'fa-clipboard-list' },
                    { id: 'submissions', label: 'Student Submissions', icon: 'fa-check-double', badge: pendingCount || '' },
                    { id: 'students', label: 'Enrolled Students', icon: 'fa-users' },
                    { id: 'announcements', label: 'Post Announcements', icon: 'fa-bullhorn' }
                ];
            }
            if (role === 'admin') {
                return [
                    { id: 'dashboard', label: 'System Overview', icon: 'fa-chart-pie' },
                    { id: 'users', label: 'Manage Users', icon: 'fa-users-gear' },
                    { id: 'courses', label: 'Manage All Courses', icon: 'fa-book-bookmark' },
                    { id: 'reports', label: 'Academic Reports', icon: 'fa-file-contract' },
                    { id: 'settings', label: 'System Settings', icon: 'fa-sliders' }
                ];
            }
            return [];
        }

