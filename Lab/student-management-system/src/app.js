// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validationService = require('./services/validationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ---------- Student Management API (in-memory) ----------
let students = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "CS" },
    { id: 2, name: "Bob Smith",     email: "bob@example.com",   course: "IT" },
    { id: 3, name: "Carol White",   email: "carol@example.com", course: "SE" }
];
let nextId = 4;

// GET /students — list all
app.get('/students', (req, res) => {
    res.json(students);
});

// GET /students/:id — get one
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
});

// POST /students — create new
app.post('/students', (req, res) => {
    const { name, email, course } = req.body;
    if (!name || !email || !course) {
        return res.status(400).json({ error: "name, email and course are required" });
    }
    const newStudent = { id: nextId++, name, email, course };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PUT /students/:id — update
app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    const { name, email, course } = req.body;
    if (name)   student.name = name;
    if (email)  student.email = email;
    if (course) student.course = course;
    res.json(student);
});

// DELETE /students/:id — remove
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: "Student not found" });
    const removed = students.splice(idx, 1)[0];
    res.json({ deleted: removed });
});

// POST /students/reset — restore original data (for repeatable tests)
app.post('/students/reset', (req, res) => {
    students = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "CS" },
        { id: 2, name: "Bob Smith",     email: "bob@example.com",   course: "IT" },
        { id: 3, name: "Carol White",   email: "carol@example.com", course: "SE" }
    ];
    nextId = 4;
    res.json({ message: "Students reset", count: students.length });
});
// ---------------------------------------------------------

// Routes

// Home Page - Login
app.get('/', (req, res) => {
    res.render('login', { error: null, success: null });
});

// Login Validation (R1, R2, R3, R4)
app.post('/login', (req, res) => {
    const { studentId, password } = req.body;
    
    // Validate Student ID (R1, R2)
    const idValidation = validationService.validateStudentId(studentId);
    if (!idValidation.valid) {
        return res.render('login', { 
            error: idValidation.message, 
            success: null 
        });
    }
    
    // Validate Password (R3, R4)
    const passValidation = validationService.validatePassword(password);
    if (!passValidation.valid) {
        return res.render('login', { 
            error: passValidation.message, 
            success: null 
        });
    }
    
    res.render('login', { 
        error: null, 
        success: 'Login successful! Welcome ' + studentId 
    });
});

// Registration Page
app.get('/register', (req, res) => {
    res.render('register', { 
        error: null, 
        success: null,
        modules: ['SWE301', 'SWE302', 'SWE303', 'SWE304']
    });
});

// Registration Validation (R5, R6, R7, R8)
app.post('/register', (req, res) => {
    const { 
        studentId, 
        moduleCode, 
        paymentVerified, 
        drugTestVerified,
        registrationOpen 
    } = req.body;
    
    const registeredModules = ['SWE301']; // Simulated existing registrations
    
    const validation = validationService.validateRegistrationConditions(
        paymentVerified === 'true',
        drugTestVerified === 'true',
        registrationOpen === 'true',
        registeredModules,
        moduleCode
    );
    
    if (!validation.allowed) {
        return res.render('register', {
            error: validation.message,
            success: null,
            modules: ['SWE301', 'SWE302', 'SWE303', 'SWE304']
        });
    }
    
    res.render('register', {
        error: null,
        success: 'Registration successful for ' + moduleCode,
        modules: ['SWE301', 'SWE302', 'SWE303', 'SWE304']
    });
});

// Payment Upload Page
app.get('/payment', (req, res) => {
    res.render('payment', { error: null, success: null });
});

// Payment Validation (R10, R11, R12, R13)
app.post('/payment', (req, res) => {
    const { transactionNumber, screenshotFile } = req.body;
    
    // Validate Screenshot (R10)
    const screenshotValidation = validationService.validatePaymentScreenshot(screenshotFile);
    if (!screenshotValidation.valid) {
        return res.render('payment', {
            error: screenshotValidation.message,
            success: null
        });
    }
    
    // Validate Transaction Number (R11)
    const transactionValidation = validationService.validateTransactionNumber(transactionNumber);
    if (!transactionValidation.valid) {
        return res.render('payment', {
            error: transactionValidation.message,
            success: null
        });
    }
    
    // Payment verification (R12, R13)
    const isVerified = transactionNumber.startsWith('123-');
    
    if (isVerified) {
        res.render('payment', {
            error: null,
            success: 'Payment verified! Receipt generated successfully (R12)'
        });
    } else {
        res.render('payment', {
            error: 'Payment could not be verified. Registration remains incomplete (R13)',
            success: null
        });
    }
});

// Results Page (R14, R15)
app.get('/results', (req, res) => {
    const studentId = req.query.studentId || '02230298';
    
    // Check if student is registered (R14)
    const isRegistered = studentId === '02230298'; // Simulated check
    
    const validation = validationService.validateResultViewing(isRegistered);
    
    if (!validation.valid) {
        return res.render('results', {
            error: validation.message,
            results: null,
            canDownload: false
        });
    }
    
    // Display results (R15)
    const results = [
        { moduleCode: 'SWE301', moduleTitle: 'Software Engineering', grade: 'A' },
        { moduleCode: 'SWE302', moduleTitle: 'Software Testing & QA', grade: 'B+' },
        { moduleCode: 'SWE303', moduleTitle: 'Web Development', grade: 'A-' }
    ];
    
    res.render('results', {
        error: null,
        results: results,
        canDownload: true
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;