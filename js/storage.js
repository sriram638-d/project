
        /* ==========================================================================
           MODULE 1: LOCAL STORAGE & INITIAL SEED DATA (js/storage.js)
           Manages all persistent entities: Users, Courses, Quizzes, Assignments, etc.
           ========================================================================== */
        const STORAGE_KEY = 'EDU_LMS_COLLEGE_PROJECT_V1';

        const DEFAULT_SEED_DATA = {
            settings: {
                collegeName: 'State Institute of Engineering & Technology',
                academicYear: '2026 - 2027 (Odd Semester)',
                systemBanner: 'Mid-Semester Online Quiz Window is now open for Computer Science & Electronics departments.',
                allowRegistration: true
            },
            users: [
                // Demo Students
                {
                    id: 'STU101',
                    role: 'student',
                    name: 'Aarav Sharma',
                    email: 'student@college.edu',
                    password: 'password123',
                    department: 'Computer Science (CSE)',
                    semester: '6th Semester',
                    phone: '+91 98765 43210',
                    status: 'Active',
                    enrolledCourses: ['CS301', 'CS302', 'CS304']
                },
                {
                    id: 'STU102',
                    role: 'student',
                    name: 'Priya Nair',
                    email: 'priya.nair@college.edu',
                    password: 'password123',
                    department: 'Computer Science (CSE)',
                    semester: '6th Semester',
                    phone: '+91 98765 11223',
                    status: 'Active',
                    enrolledCourses: ['CS301', 'CS302']
                },
                {
                    id: 'STU103',
                    role: 'student',
                    name: 'Rohan Verma',
                    email: 'rohan.v@college.edu',
                    password: 'password123',
                    department: 'Electronics (ECE)',
                    semester: '4th Semester',
                    phone: '+91 98111 22334',
                    status: 'Active',
                    enrolledCourses: ['EC201', 'CS301']
                },
                // Demo Faculty
                {
                    id: 'FAC201',
                    role: 'faculty',
                    name: 'Prof. Rajesh Iyer',
                    email: 'faculty@college.edu',
                    password: 'password123',
                    department: 'Computer Science (CSE)',
                    designation: 'Associate Professor',
                    status: 'Active'
                },
                {
                    id: 'FAC202',
                    role: 'faculty',
                    name: 'Dr. Meera Krishnan',
                    email: 'meera.k@college.edu',
                    password: 'password123',
                    department: 'Electronics (ECE)',
                    designation: 'Professor & HOD',
                    status: 'Active'
                },
                // Demo Admin
                {
                    id: 'ADM001',
                    role: 'admin',
                    name: 'System Administrator',
                    email: 'admin@college.edu',
                    password: 'admin123',
                    department: 'Academic Cell',
                    status: 'Active'
                }
            ],
            courses: [
                {
                    id: 'CS301',
                    code: 'CS-301',
                    title: 'Database Management Systems',
                    department: 'Computer Science (CSE)',
                    semester: '6th Semester',
                    credits: 4,
                    facultyId: 'FAC201',
                    facultyName: 'Prof. Rajesh Iyer',
                    description: 'Core relational database concepts, ER modeling, SQL queries, normalization (1NF to BCNF), transaction processing, and indexing.',
                    modules: [
                        { id: 'M1', title: 'Unit 1: Introduction to DBMS & ER Modeling', duration: '4 Hours', videoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', notes: 'Covers Database System Architecture, Data Independence, and Entity-Relationship diagrams.' },
                        { id: 'M2', title: 'Unit 2: Relational Algebra & SQL Queries', duration: '6 Hours', videoUrl: '#', notes: 'DDL, DML, DCL commands, Joins, Nested Subqueries, Aggregations and Views.' },
                        { id: 'M3', title: 'Unit 3: Functional Dependencies & Normalization', duration: '5 Hours', videoUrl: '#', notes: '1NF, 2NF, 3NF, BCNF, Lossless Join and Dependency Preserving Decomposition.' },
                        { id: 'M4', title: 'Unit 4: Transaction Management & Concurrency Control', duration: '5 Hours', videoUrl: '#', notes: 'ACID Properties, Serializability, Two-Phase Locking (2PL), Deadlock Handling.' }
                    ]
                },
                {
                    id: 'CS302',
                    code: 'CS-302',
                    title: 'Operating SystemsPrinciples',
                    department: 'Computer Science (CSE)',
                    semester: '6th Semester',
                    credits: 4,
                    facultyId: 'FAC201',
                    facultyName: 'Prof. Rajesh Iyer',
                    description: 'Process management, CPU scheduling algorithms, process synchronization, deadlocks, virtual memory paging, and file systems.',
                    modules: [
                        { id: 'M1', title: 'Unit 1: OS Structures & System Calls', duration: '4 Hours', videoUrl: '#', notes: 'Kernel architectures, dual-mode operation, system calls and process control blocks (PCB).' },
                        { id: 'M2', title: 'Unit 2: CPU Scheduling & Synchronization', duration: '6 Hours', videoUrl: '#', notes: 'FCFS, SJF, Round Robin, Priority Scheduling, Semaphores, Classic Synchronization Problems.' },
                        { id: 'M3', title: 'Unit 3: Deadlocks & Memory Management', duration: '5 Hours', videoUrl: '#', notes: 'Banker Algorithm, Paging, Segmentation, Page Replacement Algorithms (LRU, Optimal).' }
                    ]
                },
                {
                    id: 'CS304',
                    code: 'CS-304',
                    title: 'Web Technologies & Architecture',
                    department: 'Computer Science (CSE)',
                    semester: '6th Semester',
                    credits: 3,
                    facultyId: 'FAC201',
                    facultyName: 'Prof. Rajesh Iyer',
                    description: 'Semantic HTML5, responsive CSS3 layouts, modern ES6+ JavaScript DOM manipulation, Web Storage APIs, and HTTP protocols.',
                    modules: [
                        { id: 'M1', title: 'Unit 1: Semantic HTML5 & Forms', duration: '3 Hours', videoUrl: '#', notes: 'Document structure, accessibility attributes, form validation.' },
                        { id: 'M2', title: 'Unit 2: CSS3 Flexbox, Grid & Responsive Design', duration: '4 Hours', videoUrl: '#', notes: 'Box model, media queries, fluid layouts without external frameworks.' },
                        { id: 'M3', title: 'Unit 3: ES6+ JavaScript & Browser APIs', duration: '5 Hours', videoUrl: '#', notes: 'DOM manipulation, Event delegation, LocalStorage, Fetch API.' }
                    ]
                },
                {
                    id: 'EC201',
                    code: 'EC-201',
                    title: 'Digital Logic & Microprocessors',
                    department: 'Electronics (ECE)',
                    semester: '4th Semester',
                    credits: 4,
                    facultyId: 'FAC202',
                    facultyName: 'Dr. Meera Krishnan',
                    description: 'Boolean algebra, Karnaugh maps, combinational and sequential circuits, 8085/8086 microprocessor architecture and instruction sets.',
                    modules: [
                        { id: 'M1', title: 'Unit 1: Number Systems & K-Map Minimization', duration: '4 Hours', videoUrl: '#', notes: 'Logic gates, SOP/POS forms, 4-variable Karnaugh maps.' },
                        { id: 'M2', title: 'Unit 2: Flip-Flops, Counters & Registers', duration: '5 Hours', videoUrl: '#', notes: 'SR, JK, D, T Flip-Flops, Synchronous & Asynchronous counters.' }
                    ]
                }
            ],
            // Tracks completed module IDs per student & course: key = "STU101_CS301": ["M1", "M2"]
            moduleProgress: {
                'STU101_CS301': ['M1', 'M2', 'M3'],
                'STU101_CS302': ['M1', 'M2'],
                'STU101_CS304': ['M1', 'M2', 'M3'],
                'STU102_CS301': ['M1', 'M2']
            },
            materials: [
                { id: 'MAT1', courseId: 'CS301', title: 'SQL Cheat Sheet & Normalization Workbook.pdf', type: 'PDF Document', size: '1.8 MB', uploadedBy: 'Prof. Rajesh Iyer', date: '2026-10-12' },
                { id: 'MAT2', courseId: 'CS301', title: 'ER Diagram Case Studies - University DB.pdf', type: 'Lecture Slides', size: '2.4 MB', uploadedBy: 'Prof. Rajesh Iyer', date: '2026-10-15' },
                { id: 'MAT3', courseId: 'CS302', title: 'CPU Scheduling Numericals Solved.pdf', type: 'PDF Document', size: '1.2 MB', uploadedBy: 'Prof. Rajesh Iyer', date: '2026-10-18' },
                { id: 'MAT4', courseId: 'CS304', title: 'Vanilla JS ES6 DOM Reference Guide.pdf', type: 'Reference Notes', size: '950 KB', uploadedBy: 'Prof. Rajesh Iyer', date: '2026-10-22' },
                { id: 'MAT5', courseId: 'EC201', title: '8086 Pin Diagram & Addressing Modes.pdf', type: 'Lecture Slides', size: '3.1 MB', uploadedBy: 'Dr. Meera Krishnan', date: '2026-10-25' }
            ],
            quizzes: [
                {
                    id: 'QZ101',
                    courseId: 'CS301',
                    title: 'Mid-Term Quiz: SQL & Normalization',
                    durationMinutes: 10,
                    totalMarks: 40,
                    passingMarks: 20,
                    questions: [
                        {
                            qText: 'Which normal form eliminates transitive functional dependencies?',
                            options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Unnormalized Form'],
                            correctIndex: 2
                        },
                        {
                            qText: 'Which SQL keyword is used to filter groups created by the GROUP BY clause?',
                            options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
                            correctIndex: 1
                        },
                        {
                            qText: 'In ACID properties of database transactions, what does the letter "I" stand for?',
                            options: ['Integrity', 'Indexing', 'Isolation', 'Inheritance'],
                            correctIndex: 2
                        },
                        {
                            qText: 'Which relational algebra operator selects a subset of columns (attributes) from a relation?',
                            options: ['Selection (σ)', 'Projection (π)', 'Cartesian Product (×)', 'Natural Join (⋈)'],
                            correctIndex: 1
                        }
                    ]
                },
                {
                    id: 'QZ102',
                    courseId: 'CS302',
                    title: 'Unit Test: CPU Scheduling & Deadlocks',
                    durationMinutes: 10,
                    totalMarks: 30,
                    passingMarks: 15,
                    questions: [
                        {
                            qText: 'Which CPU scheduling algorithm is provably optimal in terms of minimum average waiting time?',
                            options: ['First-Come First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Multilevel Queue'],
                            correctIndex: 2
                        },
                        {
                            qText: 'Banker\'s Algorithm is used in Operating Systems for which purpose?',
                            options: ['Deadlock Prevention', 'Deadlock Avoidance', 'Page Replacement', 'Disk Scheduling'],
                            correctIndex: 1
                        },
                        {
                            qText: 'Which phenomenon occurs in First-Come First-Served (FCFS) scheduling when a CPU-bound process holds up short I/O processes?',
                            options: ['Belady\'s Anomaly', 'Thrashing', 'Convoy Effect', 'Internal Fragmentation'],
                            correctIndex: 2
                        }
                    ]
                },
                {
                    id: 'QZ103',
                    courseId: 'CS304',
                    title: 'Assessment: HTML5, CSS3 & ES6 Fundamentals',
                    durationMinutes: 8,
                    totalMarks: 30,
                    passingMarks: 15,
                    questions: [
                        {
                            qText: 'Which browser Web Storage API persists key-value data even after the browser window is closed?',
                            options: ['sessionStorage', 'localStorage', 'window.tempStore', 'document.cookiesOnly'],
                            correctIndex: 1
                        },
                        {
                            qText: 'Which array method in ES6 returns a new array containing only elements that pass a test condition?',
                            options: ['Array.prototype.map()', 'Array.prototype.forEach()', 'Array.prototype.filter()', 'Array.prototype.reduce()'],
                            correctIndex: 2
                        },
                        {
                            qText: 'In CSS Flexbox, which property aligns items along the main axis?',
                            options: ['align-items', 'justify-content', 'flex-wrap', 'display-direction'],
                            correctIndex: 1
                        }
                    ]
                }
            ],
            quizAttempts: [
                {
                    id: 'ATT1',
                    quizId: 'QZ103',
                    studentId: 'STU101',
                    studentName: 'Aarav Sharma',
                    score: 30,
                    totalMarks: 30,
                    answers: [1, 2, 1],
                    date: '2026-10-28',
                    passed: true
                },
                {
                    id: 'ATT2',
                    quizId: 'QZ101',
                    studentId: 'STU102',
                    studentName: 'Priya Nair',
                    score: 30,
                    totalMarks: 40,
                    answers: [2, 1, 2, 0],
                    date: '2026-10-29',
                    passed: true
                }
            ],
            assignments: [
                {
                    id: 'ASG1',
                    courseId: 'CS301',
                    title: 'Design ER Schema & SQL DDL for Hospital Management',
                    dueDate: '2026-11-15',
                    maxMarks: 50,
                    description: 'Submit normalized table definitions (up to 3NF) along with 10 SQL join and aggregate queries.'
                },
                {
                    id: 'ASG2',
                    courseId: 'CS302',
                    title: 'Simulate Round Robin & SJF CPU Scheduling',
                    dueDate: '2026-11-18',
                    maxMarks: 50,
                    description: 'Calculate turnaround time and waiting time for the given set of 5 processes with Gantt chart.'
                },
                {
                    id: 'ASG3',
                    courseId: 'CS304',
                    title: 'Responsive College LMS Frontend Prototype',
                    dueDate: '2026-11-10',
                    maxMarks: 100,
                    description: 'Build a semantic HTML5, CSS3, and Vanilla JS interactive web interface using LocalStorage.'
                }
            ],
            submissions: [
                {
                    id: 'SUB1',
                    assignmentId: 'ASG3',
                    courseId: 'CS304',
                    studentId: 'STU101',
                    studentName: 'Aarav Sharma',
                    submittedDate: '2026-11-01',
                    fileName: 'Aarav_STU101_LMS_Project.zip',
                    notes: 'Implemented Student, Faculty, and Admin portals using pure HTML5, CSS3 and ES6 LocalStorage.',
                    status: 'Graded',
                    marksObtained: 94,
                    feedback: 'Excellent modular structure and clean UI without external frameworks.'
                },
                {
                    id: 'SUB2',
                    assignmentId: 'ASG1',
                    courseId: 'CS301',
                    studentId: 'STU102',
                    studentName: 'Priya Nair',
                    submittedDate: '2026-11-02',
                    fileName: 'Priya_Hospital_ER_SQL.pdf',
                    notes: 'Included BCNF decomposition proof and 12 tested SQL queries.',
                    status: 'Pending Evaluation',
                    marksObtained: null,
                    feedback: ''
                }
            ],
            announcements: [
                {
                    id: 'ANN1',
                    title: 'Submission Guidelines for Final Semester Mini-Project',
                    content: 'All 6th Semester CSE students must upload their project report and source code archive before November 15th.',
                    courseId: 'ALL',
                    postedBy: 'Prof. Rajesh Iyer',
                    date: '2026-11-01'
                },
                {
                    id: 'ANN2',
                    title: 'DBMS Lab Internal Assessment Schedule',
                    content: 'Practical examination on SQL Joins, Views, and Triggers will be conducted in Lab 3 on Friday at 10:00 AM.',
                    courseId: 'CS301',
                    postedBy: 'Prof. Rajesh Iyer',
                    date: '2026-11-03'
                }
            ],
            readNotifications: {
                'STU101': ['ANN1']
            }
        };

        // Load or Initialize Database in LocalStorage
        function getDB() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    const freshDB = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshDB));
                    return freshDB;
                }

                const savedDB = JSON.parse(raw);
                if (!savedDB || typeof savedDB !== 'object' || Array.isArray(savedDB)) {
                    throw new Error('Saved LMS data is invalid.');
                }

                // Preserve existing student-created data, but restore missing built-in demo accounts.
                savedDB.users = Array.isArray(savedDB.users) ? savedDB.users : [];
                DEFAULT_SEED_DATA.users.forEach(demoUser => {
                    const existing = savedDB.users.find(user => user && String(user.id).toUpperCase() === demoUser.id.toUpperCase());
                    if (!existing) {
                        savedDB.users.push({ ...demoUser });
                    } else {
                        // Keep the published demo credentials usable even if stale local data changed them.
                        existing.email = demoUser.email;
                        existing.password = demoUser.password;
                        existing.role = demoUser.role;
                        if (!existing.status) existing.status = 'Active';
                    }
                });

                // Older saved versions may not contain collections added by newer app versions.
                Object.keys(DEFAULT_SEED_DATA).forEach(key => {
                    if (key !== 'users' && (savedDB[key] === undefined || savedDB[key] === null)) {
                        savedDB[key] = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA[key]));
                    }
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDB));
                return savedDB;
            } catch (err) {
                console.error('LocalStorage data could not be loaded; restoring demo data:', err);
                const freshDB = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(freshDB)); } catch (storageErr) {
                    console.error('Could not initialize LMS local storage:', storageErr);
                }
                return freshDB;
            }
        }

        function saveDB(dbData) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData));
            } catch (err) {
                console.error('Failed to save to LocalStorage:', err);
            }
        }

