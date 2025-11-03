/**
 * @file SignupService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Signup service for user registration.
 */

import bcrypt                    from "bcrypt";
import db                        from "../../db/db.js";
import { SIGNUP_SERVICE_CONSTS } from "../../utils/consts.js";

/**
 * This class is used to handle the signup process.
 */
export class SignupService {

    // Constructor
    constructor() {
        this.db = db;
    }


    /**
     * This function is used to execute the signup process.
     * 
     * @param {*} username  - The username of the user.
     * @param {*} email     - The email of the user.
     * @param {*} password  - The password of the user.
     * @returns             - The result of the signup process.
     */
    async executeSignup({ username, email, password }) {


        const checkEmailExists = await this.db.query(SIGNUP_SERVICE_CONSTS.CHECK_EMAIL_EXISTS_QUERY, [email]);

        // If the email already exists, throw an error
        if (checkEmailExists.length > SIGNUP_SERVICE_CONSTS.CHECK_EMAIL_EXISTS_RESULT_LENGTH) {
            throw new Error("Email_IN_USE");
        }

        // Hash the password.
        // What is salt rounds? The number of times the hashing algorithm is applied.
        const hashedPassword = await bcrypt.hash(password, SIGNUP_SERVICE_CONSTS.PASSWORD_SALT_ROUNDS);

        // process signup to the database
        const result = await this.db.query(SIGNUP_SERVICE_CONSTS.PROCESS_SIGNUP_QUERY, [username, email, hashedPassword]);

        return { id : result.insertId, username, email, role: SIGNUP_SERVICE_CONSTS.DEFAULT_ROLE, api_usage_count: SIGNUP_SERVICE_CONSTS.DEFAULT_API_USAGE_COUNT };
    }
}