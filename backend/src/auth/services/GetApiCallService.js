/**
 * @file GetApiCallService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description Login service for user authentication.
 */

import bcrypt                   from "bcrypt";
import jwt                      from "jsonwebtoken"
import db                       from "../../db/db.js";
import { LOGIN_SERVICE_CONSTS } from "../../utils/consts.js";




export class GetApiCallService {
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || LOGIN_SERVICE_CONSTS.JWT_EXPIRES_IN) {

        this.db         = db;
        this.secret     = secret;
        this.expiresIn  = expiresIn;
    }

    async getApiCallCount({ userId }) {
        if (!userId) {
            throw new Error("userId is required");
        }

        const rows = await this.db.query(`
        SELECT api_usage_count
        FROM users
        WHERE id = ?
        `, [userId]);

    // rows = [] means no user found
    if (!rows || rows.length === 0) {
        throw new Error(`No user found with id: ${userId}`);
    }

    return { amount: rows[0].api_usage_count };
    }


}