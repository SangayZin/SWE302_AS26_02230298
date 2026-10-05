// src/services/studentService.js
const pool = require('../db/database');

/**
 * Create a new student.
 */
async function createStudent(studentId, name, email) {
    if (!studentId || !name || !email) {
        throw new Error('Student ID, name and email are required');
    }

    try {
        const result = await pool.query(
            `INSERT INTO students (student_id, name, email)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [studentId, name, email]
        );

        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            throw new Error('Student already exists');
        }

        throw error;
    }
}

/**
 * Retrieve a student by student ID.
 */
async function getStudent(studentId) {
    const result = await pool.query(
        `SELECT * FROM students
         WHERE student_id = $1`,
        [studentId]
    );

    return result.rows[0] || null;
}

/**
 * Retrieve all students.
 */
async function getAllStudents() {
    const result = await pool.query(
        `SELECT * FROM students
         ORDER BY id`
    );

    return result.rows;
}

/**
 * Update an existing student.
 */
async function updateStudent(studentId, name, email) {
    const result = await pool.query(
        `UPDATE students
         SET name = $1, email = $2
         WHERE student_id = $3
         RETURNING *`,
        [name, email, studentId]
    );

    return result.rows[0] || null;
}

/**
 * Delete a student.
 */
async function deleteStudent(studentId) {
    const result = await pool.query(
        `DELETE FROM students
         WHERE student_id = $1
         RETURNING *`,
        [studentId]
    );

    return result.rows[0] || null;
}

module.exports = {
    createStudent,
    getStudent,
    getAllStudents,
    updateStudent,
    deleteStudent
};