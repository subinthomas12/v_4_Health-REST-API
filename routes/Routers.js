const express = require('express');
const db = require('../utils/db')
const multer = require('multer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { setupImageUpload } = require('../utils/commonUtils')

// middleware
const router = express.Router();
const upload = multer();
const uploadIMG = setupImageUpload();

const { createSloatAmount, addQuestion, addImage, staffInsertion, createDesignation, addPrivilege, addDepartment, createLanguage, addDoctors, addPatient, createMedicine, createExtraCharge } = require('../controllers/Controllers')



//POST REQUESTS


// sloat_amounts:


// Endpoint for creating sloat_amounts
router.post(
    '/sloatAmount',
    upload.none(),
    [
        body('minute').isInt({ min: 0, max: 255 }).withMessage('Minute must be an integer between 0 and 255'),
        body('amount').isInt({ min: 0, max: 65535 }).withMessage('Amount must be an integer between 0 and 65535'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { minute, amount } = req.body;

            const result = await createSloatAmount({ minute, amount });

            if (result) {
                res.status(201).json({ message: 'Sloat amount created successfully' });
            } else {
                res.status(500).json({ message: 'Failed to create sloat amount' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);




// questionnaire :


// Endpoint for creating a questionnaire
router.post(
    '/questionnaire',
    upload.none(),
    [
        body('question')
            .isString().withMessage('Question must be a string')
            .notEmpty().withMessage('Question is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { question } = req.body;

            const result = await addQuestion({ question });

            res.status(201).json({ message: 'Question added successfully', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// images :


// Endpoint for image upload
router.post(
    '/images',
    uploadIMG.single('img'),
    [
        // for any validation needed
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if no file is uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Extract filename
            const filename = req.file.filename;

            // Call the controller function for image upload
            const result = await addImage(filename);

            if (result.affectedRows > 0) {
                res.status(201).json({ message: 'Image uploaded successfully' });
            } else {
                res.status(500).json({ message: 'Failed to upload image' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// v4_staffs :


// route for staff creation
router.post(
    '/v4_staffs',
    upload.none(),
    [
        body('name')
            .isString().withMessage('Name must be a string')
            .notEmpty().withMessage('Name is required'),

        body('username')
            .isString().withMessage('Username must be a string')
            .notEmpty().withMessage('Username is required'),

        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, username, password } = req.body;

            // Check if the username already exists in the controller
            const { existingStaff, result } = await staffInsertion({ name, username, password });

            if (existingStaff) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate JWT token
            const token = jwt.sign({ username }, 'SecretKey_v4_staffs', { expiresIn: '1h' });

            res.status(201).json({ message: 'Data inserted successfully', result, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// designations :


// Endpoint for creating a designation
router.post(
    '/designations',
    upload.none(),
    [
        body('designation')
            .trim()
            .notEmpty().withMessage('Designation is required.')
            .isString().withMessage('Invalid designation. It should contain only letters and spaces.'),
    ],

    async (req, res) => {
        try {
            console.log('Request Body:', req.body);  // Add this line for logging

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { designation } = req.body;
            const { result } = await createDesignation({ designation });

            res.status(201).json({ message: 'Designation created successfully', designationId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// all_privileges :


// Endpoint for creating all_privileges
router.post(
    '/all_privileges',
    upload.none(),
    [
        body('privilege').trim().escape().notEmpty().withMessage('Privilege is required').isString(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { privilege } = req.body;

            const result = await addPrivilege(privilege);

            if (result) {
                res.status(201).json({ message: 'Privilege added successfully' });
            } else {
                res.status(500).json({ message: 'Failed to add privilege' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// departments :



// Endpoint for creating departments
router.post(
    '/departments',
    upload.none(),
    [
        body('department').trim()
            .notEmpty().withMessage('Department is required.')
            .isString().withMessage('Invalid department. It should contain only letters and spaces.'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { department } = req.body;

            const result = await addDepartment(department);

            if (result) {
                res.status(201).json({ message: 'Department added successfully' });
            } else {
                res.status(500).json({ message: 'Failed to add department' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// languages :


// Endpoint for creating languages
router.post(
    '/languages',
    upload.none(),
    [
        body('language').trim().escape().notEmpty().withMessage('Language name is required').isString(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { language } = req.body;

            const result = await createLanguage(language);

            if (result) {
                res.status(201).json({ message: 'Language created successfully' });
            } else {
                res.status(500).json({ message: 'Failed to create language' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// doctors :


// Endpoint for adding a patient
router.post(
    '/doctors',
    uploadIMG.single('imgage'),
    [
        body('name')
            .isString().withMessage('Name must be a string')
            .notEmpty().withMessage('Name is required'),

        body('username')
            .isString().withMessage('Username must be a string')
            .notEmpty().withMessage('Username is required'),

        body('password')
            .isString().withMessage('Password must be a string')
            .notEmpty().withMessage('Password is required'),

        body('email').isEmail().withMessage('Invalid email format')
            .notEmpty().withMessage('Email is required'),

        body('other_contact')
            .optional().trim().isNumeric().withMessage('Other contact must be numeric'),

        body('experience')
            .isInt().withMessage('Experience must be an integer'),

        body('status')
            .isInt().withMessage('Status must be an integer'),
    ],
    async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Get the uploaded image filename from the request
            const image = req.file ? req.file.filename : null;

            const { name, username, password, email, other_contact, experience, status } = req.body;

            // Hash the password in the router
            const hashedPassword = await bcrypt.hash(password, 10);

            // Token generation in the router
            const token = jwt.sign({ username, email }, 'secret-key-doctors', { expiresIn: '1h' });

            const { result } = await addDoctors({
                name,
                username,
                password: hashedPassword,
                email,
                other_contact,
                image,
                experience,
                status
            });

            res.status(201).json({ message: 'Doctor added successfully', result, token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);




// patients :


// Endpoint for adding a patient
router.post(
    '/patients',
    uploadIMG.single('imgage'),
    [
        body('name')
            .isString().withMessage('Name must be a string')
            .notEmpty().withMessage('Name is required'),

        body('username')
            .isString().withMessage('Username must be a string')
            .notEmpty().withMessage('Username is required'),

        body('password')
            .isString().withMessage('Password must be a string')
            .notEmpty().withMessage('Password is required'),

        body('email').isEmail().withMessage('Invalid email format')
            .notEmpty().withMessage('Email is required'),

        body('other_contact')
            .optional().trim().isNumeric().withMessage('Other contact must be numeric'),

        body('status')
            .isInt().withMessage('Status must be an integer'),
    ],
    async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Get the uploaded image filename from the request
            const image = req.file ? req.file.filename : null;

            const { name, username, password, email, other_contact, status } = req.body;

            // Hash the password in the router
            const hashedPassword = await bcrypt.hash(password, 10);

            // Token generation in the router
            const token = jwt.sign({ username, email }, 'patient-secret-key', { expiresIn: '1h' });

            const { result } = await addPatient({
                name,
                username,
                password: hashedPassword,
                email,
                other_contact,
                image,
                status
            });
            res.status(201).json({ message: 'Patient added successfully', result, token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);




// medicines :

// Endpoint for creating medicines
router.post(
    '/medicines',
    upload.none(),
    [
        body('name').trim().escape().notEmpty().withMessage('Medicine name is required').isString(),
        body('base_price')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Base price is required')
            .isNumeric()
            .withMessage('Base price must be a number'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, base_price } = req.body;

            const result = await createMedicine({ name, base_price });

            if (result) {
                res.status(201).json({ message: 'Medicine created successfully' });
            } else {
                res.status(500).json({ message: 'Failed to create medicine' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);



// extra_charges :



// Endpoint for creating extra_charges

router.post(
    '/extra_charges',
    upload.none(),
    [
        body('charge_type').notEmpty().withMessage('Charge type is required'),
        body('amount').isInt({ min: 0 }).withMessage('Amount must be a non-negative integer'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { charge_type, amount } = req.body;
            const result = await createExtraCharge(charge_type, amount);

            res.status(201).json({ message: 'Extra charge created successfully', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
);


module.exports = router;