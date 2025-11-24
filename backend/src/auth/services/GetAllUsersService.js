/**
 * @file LoginService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description Login service for user authentication.
 */

import bcrypt                   from "bcrypt";
import jwt                      from "jsonwebtoken"
import db                       from "../../db/db.js";
import { LOGIN_SERVICE_CONSTS } from "../../utils/consts.js";




export class GetAllUsersService {
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || LOGIN_SERVICE_CONSTS.JWT_EXPIRES_IN) {

        this.db         = db;
        this.secret     = secret;
        this.expiresIn  = expiresIn;
    }

    async GetAllUsers(){

        const rows = await this.db.query(
            "SELECT * FROM users"
        );
        if (!rows.length){
            throw new Error("NO USERS IN DATABASE");
        }

        return { rows };
    }


}