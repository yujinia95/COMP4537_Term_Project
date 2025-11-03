/**
 * @file AddApiCallService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Login service for user authentication.
 */

import bcrypt                   from "bcrypt";
import jwt                      from "jsonwebtoken"
import db                       from "../../db/db.js";
import { LOGIN_SERVICE_CONSTS } from "../../utils/consts.js";




export class AddApiCallService {
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || LOGIN_SERVICE_CONSTS.JWT_EXPIRES_IN) {

        this.db         = db;
        this.secret     = secret;
        this.expiresIn  = expiresIn;
    }

    async AddApiCallService({ email }){

        if (!email) {
            throw new Error("email is required");
        }

        const [result] = await this.db.query(`
        UPDATE users
        SET api_usage_count = api_usage_count + 1
        WHERE email = ?    
        `, [email]);

        if (!result || result.affectedRows === 0){
            throw new Error(`NO USER WITH THE EMAIL ${email}`);
        }

        return { affectedRows: result.affectedRows };
    }


}