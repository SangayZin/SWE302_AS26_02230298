const { PostgreSqlContainer } = require('@testcontainers/postgresql');

let container;
let pool;
let studentService;

beforeAll(async () => {
    // Start a temporary PostgreSQL container
    container = await new PostgreSqlContainer('postgres:16')
        .start();

    // Configure database connection using the container details
    process.env.DB_HOST = container.getHost();
    process.env.DB_PORT = container.getPort();
    process.env.DB_NAME = container.getDatabase();
    process.env.DB_USER = container.getUsername();
    process.env.DB_PASSWORD = container.getPassword();

    // Load the database connection after environment variables are configured
    pool = require('../../src/db/database');
    studentService = require('../../src/services/studentService');

    // Create the students table
    await pool.query(`
        CREATE TABLE students (
            id SERIAL PRIMARY KEY,
            student_id VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL
        )
    `);
}, 120000);

afterAll(async () => {
    // Close database connection
    if (pool) {
        await pool.end();
    }

    // Stop the temporary PostgreSQL container
    if (container) {
        await container.stop();
    }
}, 120000);

describe('Student CRUD Integration Tests', () => {

    beforeEach(async () => {
        await pool.query('DELETE FROM students');
    });

    test('should create a student', async () => {
        const student = await studentService.createStudent(
            'R1',
            'Sonam Dorji',
            'sonam@example.com'
        );

        expect(student.student_id).toBe('R1');
        expect(student.name).toBe('Sonam Dorji');
        expect(student.email).toBe('sonam@example.com');
    });

    test('should retrieve a student by student ID', async () => {
        await studentService.createStudent(
            'R2',
            'Pema Wangchuk',
            'pema@example.com'
        );

        const student = await studentService.getStudent('R2');

        expect(student).not.toBeNull();
        expect(student.student_id).toBe('R2');
        expect(student.name).toBe('Pema Wangchuk');
    });

    test('should retrieve all students', async () => {
        await studentService.createStudent(
            'R3',
            'Karma Dorji',
            'karma@example.com'
        );

        await studentService.createStudent(
            'R4',
            'Tashi Wangmo',
            'tashi@example.com'
        );

        const students = await studentService.getAllStudents();

        expect(students).toHaveLength(2);
        expect(students[0].student_id).toBe('R3');
        expect(students[1].student_id).toBe('R4');
    });

    test('should update a student', async () => {
        await studentService.createStudent(
            'R5',
            'Original Name',
            'original@example.com'
        );

        const updatedStudent = await studentService.updateStudent(
            'R5',
            'Updated Name',
            'updated@example.com'
        );

        expect(updatedStudent).not.toBeNull();
        expect(updatedStudent.name).toBe('Updated Name');
        expect(updatedStudent.email).toBe('updated@example.com');
    });

    test('should reject duplicate student ID', async () => {
        await studentService.createStudent(
            'R6',
            'Student One',
            'student1@example.com'
        );

        await expect(
            studentService.createStudent(
                'R6',
                'Student Two',
                'student2@example.com'
            )
        ).rejects.toThrow('Student already exists');
    });

    test('should return null for a non-existent student', async () => {
        const student = await studentService.getStudent('R999');

        expect(student).toBeNull();
    });

    test('should delete a student', async () => {
        await studentService.createStudent(
            'R7',
            'Delete Student',
            'delete@example.com'
        );

        const deletedStudent = await studentService.deleteStudent('R7');

        expect(deletedStudent).not.toBeNull();
        expect(deletedStudent.student_id).toBe('R7');

        const student = await studentService.getStudent('R7');

        expect(student).toBeNull();
    });
});