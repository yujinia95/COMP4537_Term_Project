/**
 * @file functionz.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description Utility functions for the application.
 */

import jwt from "jsonwebtoken";

export class UtilFunctionz {
    
    /**
     * Verifies a JWT token.
     * Why static: So that it can be called without instantiating the class.
     * 
     * @param {*} token  
     * @param {*} secret 
     * @returns 
     */
    static verifyToken(token, secret = process.env.JWT_SECRET) {
        try {
            return jwt.verify(token, secret);
        } catch {
            return null;
        }
    }
}