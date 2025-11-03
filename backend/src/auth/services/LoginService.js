/**
 * @file LoginService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Login service for user authentication.
 */

import bcrypt                   from "bcrypt";
import jwt                      from "jsonwebtoken"
import db                       from "../../db/db.js";
import { LOGIN_SERVICE_CONSTS } from "../../utils/consts.js";

/**
 * This class is used to handle the login process.
 */
export class LoginService {

    // Constructor
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || LOGIN_SERVICE_CONSTS.JWT_EXPIRES_IN) {

        this.db         = db;
        this.secret     = secret;
        this.expiresIn  = expiresIn;
    }

    /**
     * Executes the login process.
     * 
     * @param {*} param0 - The login credentials.
     * @returns {Promise<{ jwt: string, user: { id: number, username: string, email: string } }>} - The JWT and user information.
     */
    async executeLogin({ email, password }) {

        // Check if email exists
        const rows = await this.db.query(
            LOGIN_SERVICE_CONSTS.CHECK_EMAIL_EXISTS_QUERY, [email]
        );
        if (!rows.length) {
            throw new Error("BAD_CREDENTIALS");
        }

        // Check if password matches
        const user          = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("BAD_CREDENTIALS");
        }

        // Generate JWT token
        const token = jwt.sign(
            { sub: user.id, username: user.username, email: user.email, role: user.role },
            this.secret,
            { expiresIn: this.expiresIn}
        );
    

        return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role }};
    }
}