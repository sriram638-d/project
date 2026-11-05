/*
           MODULE 2: APPLICATION STATE & ROUTER (js/app.js & js/auth.js)
           ========================================================================== */
        let appState = {
            view: 'landing', // 'landing' | 'student-login' | 'faculty-login' | 'admin-login' | 'student-register' | 'portal'
            currentUser: null,
            consentStep: 0,
            activeTab: 'dashboard',
            selectedCourseId: 'CS301',
            activeQuizId: null,
            activeQuizAttemptId: null,
            mobileSidebarOpen: false,
            courseSearchQuery: '',
            courseDeptFilter: 'ALL'
        };

        // Active Quiz Runtime State
        let quizRuntime = {
            quiz: null,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            remainingSeconds: 0,
            timerInterval: null
        };

        function showToast(message, type = 'primary') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast-msg ${type}`;
            const icon = type === 'success' ? 'fa-circle-check' : (type === 'danger' ? 'fa-circle-exclamation' : 'fa-circle-info');
            toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3400);
        }

        function escapeHTML(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function openModal(title, bodyHTML, footerHTML = '', isLarge = false) {
            const backdrop = document.getElementById('universal-modal');
            const dialog = document.getElementById('universal-modal-dialog');
            document.getElementById('universal-modal-title').innerHTML = title;
            document.getElementById('universal-modal-body').innerHTML = bodyHTML;
            document.getElementById('universal-modal-footer').innerHTML = footerHTML || `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`;
            if (isLarge) {
                dialog.classList.add('modal-lg');
            } else {
                dialog.classList.remove('modal-lg');
            }
            backdrop.classList.add('open');
        }

        function closeModal() {
            document.getElementById('universal-modal').classList.remove('open');
        }

        function confirmResetDemoData() {
            openModal(
                '<i class="fa-solid fa-rotate-right"></i> Reset All LocalStorage Demo Data',
                `<p style="margin-bottom:12px;">Are you sure you want to restore all courses, users, quizzes, assignments, and grades back to the default college project seed state?</p>
                 <p style="color:var(--text-secondary);font-size:13px;">Any custom courses, quiz attempts, or graded submissions created in this browser will be reset.</p>`,
                `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                 <button class="btn btn-danger" onclick="executeResetDemoData()">Yes, Reset Data</button>`
            );
        }

        function executeResetDemoData() {
            stopQuizTimer();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
            if (appState.currentUser) {
                const db = getDB();
                appState.currentUser = db.users.find(u => u.id === appState.currentUser.id) || null;
            }
            closeModal();
            renderApp();
            showToast('LocalStorage database restored to clean default state.', 'success');
        }

        function stopQuizTimer() {
            if (quizRuntime.timerInterval) {
                clearInterval(quizRuntime.timerInterval);
                quizRuntime.timerInterval = null;
            }
        }

        function navigateToView(viewName) {
            stopQuizTimer();
            appState.view = viewName;
            appState.mobileSidebarOpen = false;
            renderApp();
            window.scrollTo(0, 0);
        }

        function switchPortalTab(tabName, extraParam = null) {
            stopQuizTimer();
            appState.activeTab = tabName;
            appState.mobileSidebarOpen = false;
            if (tabName === 'course-details' && extraParam) {
                appState.selectedCourseId = extraParam;
            }
            if (tabName === 'quiz-results' && extraParam) {
                appState.activeQuizAttemptId = extraParam;
            }
            renderApp();
            window.scrollTo(0, 0);
        }

        function logoutUser() {
            stopQuizTimer();
            appState.currentUser = null;
            appState.view = 'landing';
            showToast('Logged out successfully.', 'primary');
            renderApp();
        }

        function beginAuthenticatedSession(user, message) {
            appState.currentUser = user;
            appState.view = 'consent';
            appState.consentStep = 0;
            appState.activeTab = 'dashboard';
            showToast(message, 'success');
            renderApp();
        }

        function advanceConsent() {
            if (appState.consentStep === 0) {
                appState.consentStep = 1;
                renderApp();
                window.scrollTo(0, 0);
                return;
            }

            const db = getDB();
            db.consentRecords = db.consentRecords || [];
            db.consentRecords.push({ userId: appState.currentUser.id, acceptedAt: new Date().toISOString(), version: '2026-11-05' });
            saveDB(db);
            appState.currentUser = db.users.find(user => user.id === appState.currentUser.id) || appState.currentUser;
            appState.view = 'portal';
            appState.consentStep = 0;
            appState.activeTab = 'dashboard';
            renderApp();
            window.scrollTo(0, 0);
        }

        function declineConsent() {
            const role = appState.currentUser ? appState.currentUser.role : 'student';
            appState.currentUser = null;
            appState.view = `${role}-login`;
            appState.consentStep = 0;
            renderApp();
            showToast('You must accept the required notices to use the LMS.', 'danger');
        }

