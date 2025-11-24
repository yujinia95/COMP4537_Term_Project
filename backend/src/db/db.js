/**
 * @file db.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description In this file, we define the Database class that is used to create a database connection pool.
 */

import mysql  from 'mysql2/promise';
import dotenv from 'dotenv';

// Load database environment variables from .env file
dotenv.config();


/**
 * This class is used to create a database connection pool.
 * It is a singleton class, so only one instance of the class will be created.
 */
class Database {

    // Constructor for the Database class
    constructor() {

        if (Database.instance) return Database.instance;
        
        this.pool = mysql.createPool({
            host              : process.env.DB_HOST,
            port              : process.env.DB_PORT,
            user              : process.env.DB_USER, 
            password          : process.env.DB_PASSWORD,
            database          : process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit   : 5,
            //! Might wanna take a look later => queueLimit:
        });

        Database.instance = this;
    }

    /**
     * This function is used to execute a SQL query on the database.
     * 
     * @param {*} sql    - The SQL query to execute.
     * @param {*} params - The parameters to pass to the SQL query.
     * @returns          - The result of the SQL query.
     */
    async query(sql, params = []) {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }
}

    //! Needs to implement api usage increment function.

// Export one instance of the Database class
const db = new Database();
export default db;