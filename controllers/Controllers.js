const db = require('../utils/db')

const { queryAsync } = require('../utils/commonUtils')





// sloat_amounts:


// Function for creation sloat_amounts
async function createSloatAmount({ minute, amount }) {
    try {
        const query = 'INSERT INTO sloat_amounts (minute, amount) VALUES (?, ?)';
        const values = [minute, amount];

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`Failed to create sloat amount: ${error.message}`);
    }
}


// questionnaire :


// Function for questionnaire creation
async function addQuestion({ question }) {
    try {
        const query = 'INSERT INTO questionnaire (question) VALUES (?)';
        const values = [question];

        const result = await queryAsync(query, values);

        return result;
    } catch (error) {
        throw new Error(`Failed to add question: ${error.message}`);
    }
}



// images :


// Function for image upload in the controller
async function addImage(filename) {
    try {
        const sql = 'INSERT INTO images (img) VALUES (?)';
        const result = await queryAsync(sql, [filename]);
        return result;
    } catch (error) {
        throw new Error(`Failed to upload image to the database: ${error.message}`);
    }
}



// v4_staffs :


// Function for staff creation
async function staffInsertion({ name, username, password }) {

    try {
        // Check if the username already exists
        const existingStaff = await getStaffByUsername(username);
        if (existingStaff) {
            return { existingStaff, result: null };
        }

        // Insert staff data into the database
        const query = 'INSERT INTO v4_staffs (name, username, password) VALUES (?, ?, ?)';
        const values = [name, username, password];
        const result = await queryAsync(query, values);

        return { existingStaff: null, result };
    }
    catch (error) {
        throw new Error(`Failed to insert data: ${error.message}`);
    }
}


// Function to get staff by username
async function getStaffByUsername(username) {
    const query = 'SELECT * FROM v4_staffs WHERE username = ?';
    const values = [username];

    try {
        const result = await queryAsync(query, values);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(`Failed to retrieve data: ${error.message}`);
    }
}



// designations :

// Function for designations creation
async function createDesignation({ designation }) {
    try {
        const query = 'INSERT INTO designations (designation) VALUES (?)';
        const values = [designation];

        const result = await queryAsync(query, values);

        return { result };
    } catch (error) {
        throw new Error(`Failed to insert designation: ${error.message}`);
    }
}



// all_privileges


// Function for all_privileges creation
async function addPrivilege(privilege) {
    try {
        const query = 'INSERT INTO all_privileges (privilege) VALUES (?)';
        const values = [privilege];

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`Failed to add privilege: ${error.message}`);
    }
}



// departments :


// Function for create department 
async function addDepartment(department) {
    try {
        const query = 'INSERT INTO departments (department) VALUES (?)';
        const values = [department];

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`Failed to add department: ${error.message}`);
    }
}



// languages :


// Function for create languages 
async function createLanguage(language) {
    try {
        const query = 'INSERT INTO languages (language) VALUES (?)';
        const values = [language];

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`Failed to create language: ${error.message}`);
    }
}



// doctors :

// Function for adding a new patient
async function addDoctors({ name, username, password, email, other_contact, image, experience, status }) {

    try {
        // Check if the username or email already exists
        const existingDoctor = await getDoctorByUsernameOrEmail(username, email);
        if (existingDoctor) {
            throw new Error('Username or email already exists');
        }

        const query = 'INSERT INTO doctors (name, username, password, email, other_contact, image, experience, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, username, password, email, other_contact, image, experience, status];

        const result = await queryAsync(query, values)

        // Return the result
        return { result };

    } catch (error) {
        throw new Error(`Failed to insert data: ${error.message}`);
    }
}


// Function to get staff by username or email

async function getDoctorByUsernameOrEmail(username, email) {
    const query = 'SELECT * FROM doctors WHERE username = ? OR email = ?'
    const values = [username, email]

    try {
        const result = await queryAsync(query, values);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(`Failed to retrieve data: ${error.message}`);
    }
}



// patients :


// Function for adding a new patient
async function addPatient({ name, username, password, email, other_contact, image, status }) {

    try {
        // Check if the username or email already exists
        const existingPatient = await getPatientByUsernameOrEmail(username, email);
        if (existingPatient) {
            throw new Error('Username or email already exists');
        }

        const query = 'INSERT INTO patients (name, username, password, email, other_contact, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [name, username, password, email, other_contact, image, status];

        const result = await queryAsync(query, values);

        // Return only the result, as token generation is moved to the router
        return { result };

    } catch (error) {
        throw new Error(`Failed to insert data: ${error.message}`);
    }
}

// Function to get staff by username or email

async function getPatientByUsernameOrEmail(username, email) {
    const query = 'SELECT * FROM patients WHERE username = ? OR email = ?'
    const values = [username, email]

    try {
        const result = await queryAsync(query, values);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(`Failed to retrieve data: ${error.message}`);
    }
}



// medicines :


// Function for create medicines 

async function createMedicine({ name, base_price }) {
    try {
        const query = 'INSERT INTO medicines (name, base_price) VALUES (?, ?)';
        const values = [name, base_price];

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error(`Failed to create medicine: ${error.message}`);
    }
}



// extra_charges :


// Function for extra_charges creation
async function createExtraCharge(charge_type, amount) {
    try {
        const query = 'INSERT INTO extra_charges (charge_type, amount) VALUES (?, ?)';
        const values = [charge_type, amount];

        const result = await queryAsync(query, values);

        return result;
    } catch (error) {
        throw new Error(`Failed to create extra charge: ${error.message}`);
    }
}





module.exports = { createSloatAmount, addQuestion, addImage, staffInsertion, createDesignation, addPrivilege, addDepartment, createLanguage, addDoctors, addPatient, createMedicine, createExtraCharge }