/*
           MODULE 8: MULTI-FILE PROJECT STRUCTURE & SOURCE CODE EXPORTER
           Allows the student to view/download separated files for college submission
           ========================================================================== */
        const VIRTUAL_PROJECT_FILES = {
            'README.md': `# Student Learning Management System (LMS) - College Academic Project

## Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Persistence:** Browser LocalStorage API (\`EDU_LMS_COLLEGE_PROJECT_V1\`)
- **Icons:** Font Awesome 6 CDN
- **Frameworks Used:** None (Zero external JS/CSS frameworks)

## Folder Structure
student-lms/
├── index.html
├── student-login.html
├── faculty-login.html
├── admin-login.html
├── css/
│   ├── style.css
│   ├── auth.css
│   └── dashboard.css
└── js/
    ├── storage.js
    ├── auth.js
    ├── student.js
    ├── faculty.js
    ├── admin.js
    └── quiz.js

## Demo Login Credentials
1. **Student Portal:** ID: \`STU101\` or \`student@college.edu\` | Password: \`password123\`
2. **Faculty Portal:** ID: \`FAC201\` or \`faculty@college.edu\` | Password: \`password123\`
3. **Admin Portal:** Email: \`admin@college.edu\` | Password: \`admin123\``,

            'css/style.css': `/* css/style.css - Core Variables, Typography, Buttons, Tables & Cards */
:root {
    --primary: #2563EB;
    --sidebar-bg: #1E293B;
    --bg-body: #F8FAFC;
    --bg-card: #FFFFFF;
    --text-main: #1E293B;
    --text-secondary: #64748B;
    --success: #16A34A;
    --danger: #DC2626;
}
/* Full CSS rules are embedded in the application stylesheet */`,

            'js/storage.js': `// js/storage.js - LocalStorage Database Seed & Helper Methods
const STORAGE_KEY = 'EDU_LMS_COLLEGE_PROJECT_V1';

export function getDB() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SEED_DATA;
}

export function saveDB(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}`,

            'js/auth.js': `// js/auth.js - Role-Based Login & Registration Logic (Student, Faculty, Admin)
export function authenticateUser(identifier, password, role, db) {
    return db.users.find(u =>
        u.role === role &&
        (u.email.toLowerCase() === identifier.toLowerCase() || u.id.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    );
}`,

            'js/student.js': `// js/student.js - Student Dashboard, Course Enrollment, Module Tracker & Assignments
export function getCourseProgressPercent(studentId, courseId, db) {
    const course = db.courses.find(c => c.id === courseId);
    if (!course || !course.modules.length) return 0;
    const done = db.moduleProgress[studentId + '_' + courseId] || [];
    return Math.round((done.length / course.modules.length) * 100);
}`,

            'js/quiz.js': `// js/quiz.js - Interactive Timed Multiple-Choice Quiz Engine & Auto-Grading
export function calculateQuizScore(quiz, selectedAnswers) {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
    });
    return Math.round((correct / quiz.questions.length) * quiz.totalMarks);
}`,

            'js/faculty.js': `// js/faculty.js - Course Module Builder, Quiz Creator & Submission Grading Center
export function gradeSubmission(submissionId, marks, feedback, db) {
    const sub = db.submissions.find(s => s.id === submissionId);
    if (sub) {
        sub.marksObtained = marks;
        sub.feedback = feedback;
        sub.status = 'Graded';
    }
}`,

            'js/admin.js': `// js/admin.js - User CRUD, Master Course Assignment & System Settings
export function toggleUserActiveStatus(userId, db) {
    const user = db.users.find(u => u.id === userId);
    if (user && user.role !== 'admin') {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    }
}`
        };

        let selectedVirtualFile = 'README.md';

        function openArchitectureModal() {
            renderArchitectureModalContent();
        }

        function renderArchitectureModalContent() {
            const fileKeys = Object.keys(VIRTUAL_PROJECT_FILES);
            const codeContent = VIRTUAL_PROJECT_FILES[selectedVirtualFile] || '';

            openModal(
                `<i class="fa-solid fa-folder-tree" style="color:var(--primary);"></i> Multi-File Project Architecture &amp; Source Export`,
                `<p style="color:var(--text-secondary);font-size:13px;margin-bottom:14px;">
                    This interactive LMS runs directly in your browser and is organized into modular sections matching your college project directory structure (<code>css/</code>, <code>js/</code>, and role portals). Inspect the modules below or download the complete HTML/CSS/JS source.
                 </p>
                 <div class="code-explorer-layout">
                    <div class="file-tree-sidebar">
                        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;margin-bottom:8px;">student-lms/</div>
                        ${fileKeys.map(fname => `
                            <div class="file-tree-item ${selectedVirtualFile === fname ? 'active' : ''}" onclick="selectVirtualFileItem('${fname}')">
                                <i class="fa-regular fa-file-code"></i>
                                <span>${escapeHTML(fname)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="code-preview-pane" id="virtual-code-box">${escapeHTML(codeContent)}</div>
                 </div>`,
                `<button class="btn btn-secondary" onclick="copyCurrentVirtualFile()"><i class="fa-regular fa-copy"></i> Copy Selected File</button>
                 <button class="btn btn-primary" onclick="downloadCompleteHTMLSource()"><i class="fa-solid fa-download"></i> Download Full Application Source</button>
                 <button class="btn btn-secondary" onclick="closeModal()">Close</button>`,
                true
            );
        }

        function selectVirtualFileItem(fname) {
            selectedVirtualFile = fname;
            renderArchitectureModalContent();
        }

        function copyCurrentVirtualFile() {
            const text = VIRTUAL_PROJECT_FILES[selectedVirtualFile] || '';
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
            showToast(`Copied ${selectedVirtualFile} to clipboard!`, 'success');
        }

        function downloadCompleteHTMLSource() {
            const fullSource = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
            const blob = new Blob([fullSource], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'student-lms-complete.html';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Downloaded complete LMS source file!', 'success');
        }

        function renderConsentPage() {
            const isPrivacyStep = appState.consentStep === 0;
            const userName = appState.currentUser ? appState.currentUser.name : 'LMS user';
            const title = isPrivacyStep ? 'Privacy & Data Use Notice' : 'Academic Use Agreement';
            const content = isPrivacyStep ? `
                <p>Welcome, <strong>${escapeHTML(userName)}</strong>. EduPortal stores your account profile, course activity, quiz attempts, assignment submissions, and consent receipt in this browser's local storage for this demonstration.</p>
                <ul><li>Use the LMS only for your own academic work.</li><li>Do not enter sensitive personal or financial information.</li><li>Clearing browser storage can remove locally saved LMS records.</li></ul>
                <p>This demo has no server-side account service or backup. Your institution should publish its official privacy contact and retention policy before production use.</p>` : `
                <p>By continuing, you agree to use course materials, quizzes, and assignments for authorized learning activities and to respect your institution's academic integrity rules.</p>
                <p>You understand that this browser-based demo is for learning and evaluation. Local demo credentials and data are not protected like a production LMS account.</p>
                <label class="consent-check"><input id="consent-accept" type="checkbox" required> I have read and agree to the privacy notice and academic use agreement.</label>`;

            return `<div class="landing-wrapper">
                <header class="landing-header"><div class="brand-logo"><i class="fa-solid fa-graduation-cap"></i><span>EduPortal LMS</span></div><span class="badge badge-primary">Required notice ${appState.consentStep + 1} of 2</span></header>
                <main class="auth-page"><section class="auth-card consent-card" aria-labelledby="consent-title">
                    <div class="auth-header"><div class="portal-icon" style="margin:0 auto;"><i class="fa-solid ${isPrivacyStep ? 'fa-shield-halved' : 'fa-file-signature'}"></i></div><h2 id="consent-title">${title}</h2><p>Please review before entering the LMS portal.</p></div>
                    <div class="consent-copy">${content}</div>
                    <div class="consent-actions">${isPrivacyStep ? `<button class="btn btn-danger" type="button" onclick="declineConsent()">Decline &amp; Sign Out</button><button class="btn btn-primary" type="button" onclick="advanceConsent()">Continue <i class="fa-solid fa-arrow-right"></i></button>` : `<button class="btn btn-danger" type="button" onclick="declineConsent()">Decline &amp; Sign Out</button><button class="btn btn-primary" type="button" onclick="if(document.getElementById('consent-accept').checked) advanceConsent(); else showToast('Please check the agreement box to continue.', 'danger')">Accept &amp; Enter LMS</button>`}</div>
                </section></main>
            </div>`;
        }

        /* ==========================================================================
           MASTER RENDER FUNCTION
           ========================================================================== */
        function renderApp() {
            const root = document.getElementById('app-root');
            if (!root) return;

            if (appState.view === 'landing') {
                root.innerHTML = renderLandingPage();
            } else if (appState.view === 'student-login') {
                root.innerHTML = renderLoginPortal('student');
            } else if (appState.view === 'faculty-login') {
                root.innerHTML = renderLoginPortal('faculty');
            } else if (appState.view === 'admin-login') {
                root.innerHTML = renderLoginPortal('admin');
            } else if (appState.view === 'student-register') {
                root.innerHTML = renderStudentRegister();
            } else if (appState.view === 'consent' && appState.currentUser) {
                root.innerHTML = renderConsentPage();
            } else if (appState.view === 'portal' && appState.currentUser) {
                root.innerHTML = renderPortalShell();
            } else {
                root.innerHTML = renderLandingPage();
            }
        }

        // Initialize application on window load
        window.onload = function () {
            getDB(); // Ensure seed data is initialized
            renderApp();
        };
    
