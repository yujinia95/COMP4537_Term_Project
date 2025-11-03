/**
 * @file AuthController.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Authentication controller for handling signup and login.
 */

import { GetAllUsersService }     from "../services/GetAllUsersService.js";
import { LoginService }           from "../services/LoginService.js";
import { SignupService }          from "../services/SignupService.js";
import { UtilFunctionz }          from "../../utils/functionz.js";
import { AUTH_CONTROLLER_CONSTS } from "../../utils/consts.js";

export class AuthController {

    // Constructor
    constructor() {
        this.signupService = new SignupService();
        this.loginService  = new LoginService();
        this.getAllUsersService = new GetAllUsersService();
        this.jwtSecret     = process.env.JWT_SECRET;
    }

    /**
     * Sends a JSON response.
     * '#' means private method
     *   - Why private: So that it cannot be accessed outside of this class.
     * 
     * @param {*} res response object
     * @param {*} statusCode HTTP status code 
     * @param {*} data data to send in the response 
     */
    #sendJson(res, statusCode, data) {
        const json = JSON.stringify(data);
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(json);
    }

    /**
     * Reads JSON data from the request body.
     * Why promise: To handle asynchronous data reading.
     * 
     * @param {*} req request object
     * @returns parsed JSON data
     */
    async #readJson(req) {
        
        return new Promise((resolve) => {

            let body = AUTH_CONTROLLER_CONSTS.INITIAL_REQUEST_BODY;

            // Collect data chunks from the request
            req.on("data", (chunkData) => {
                body += chunkData;
            });

            // Handle the end of the data stream
            req.on("end", () => {
                
                // 
                if(!body.trim()) {
                    return resolve({});
                }

                try {
                    const parsedData = JSON.parse(body);
                    resolve(parsedData);
                } catch {
                    resolve({});
                }
            });

            req.on("error", () => {
                resolve({});
            });
        });
    }

    /**
     * Extracts the JWT token from the Authorization header.
     * 
     * @param {*} req - The request object.
     * @returns The JWT token or null if not found.
     */
    #getTokenFromHeader(req) {
        const authHeader = req.headers[AUTH_CONTROLLER_CONSTS.AUTH_IN_JWT_HEADER];
        
        // Missing Authorization header BYE!
        if (!authHeader) {
            return null;
        }

        // This header into parts ( Bearer abcd123 -> [ 'Bearer', 'abcd123' ] )
        const tokenParts = authHeader.split(AUTH_CONTROLLER_CONSTS.SPLIT_BEARER);

        // Invalid Authorization header format BYE! (Must be 2 parts and first part must be 'Bearer')
        if (tokenParts.length !== AUTH_CONTROLLER_CONSTS.MIN_TOKEN_PARTS || 
            tokenParts[AUTH_CONTROLLER_CONSTS.GET_AUTH_SCHEME_INDEX] !== AUTH_CONTROLLER_CONSTS.TYPE_OF_AUTH_SCHEME) {
            return null;
        }

        // Return the token part 'abcd123'.
        return tokenParts[AUTH_CONTROLLER_CONSTS.CREDENTIAL_PART];
    }


    /**
     * Gets the JWT payload from the request header.
     * 
     * @param {*} req - The request object.
     * @returns JWT payload or null if invalid
     */
    getJwtPayloadFromRequestHeader(req) {

        // Get token from Authorization header
        const token = this.#getTokenFromHeader(req);
        if (!token) {
            return null;
        }

        // Verify the token and extract the payload
        return UtilFunctionz.verifyToken(token, this.jwtSecret);
    }

    /**
     * Handles user signup.
     * Why arrow function?
     *      When methods are used as callbacks, the value of 'this' may change.
     *      Using an arrow function ensures that 'this' always refers to the class instance.
     *      So that we can access 'this.#sendJson(), this.signupService' inside this method.
     * 
     * @param {*} req - The request object.
     * @param {*} res - The response object.
     * @returns new user info or error
     */
    signup = async (req, res) => {

        const { username, email, password } = await this.#readJson(req);

        // No username, email, or password provided then BYE!
        if (!username || !email || !password) {
            return this.#sendJson(res, 400, { error: "Missing required fields." });
        }

        try {

            const newUser = await this.signupService.executeSignup({ username, email, password });
            
            return this.#sendJson(res, 201, newUser);
        
        } catch (error) {

            // If email is already in use return 409 Conflict
            if (error.message === "Email_IN_USE") {
                return this.#sendJson(res, 409, { error: "Email already in use." });
            }

            // If server error return 500 Internal Server Error
            return this.#sendJson(res, 500, { error: "Internal server error." });
        }
    }

    /**
     * Handles user login.
     * Why arrow function?
     *      When methods are used as callbacks, the value of 'this' may change.
     *      Using an arrow function ensures that 'this' always refers to the class instance.
     *      So that we can access 'this.#sendJson(), this.loginService' inside this method.
     * 
     * @param {*} req - The request object.
     * @param {*} res - The response object.
     * @returns user token and info or error
     */
    login = async (req, res) => {

        const { email, password } = await this.#readJson(req);

        // No email or password provided then BYE!
        if (!email || !password) {
            return this.#sendJson(res, 400, { error: "Missing required fields." });
        }

        try {

            const result = await this.loginService.executeLogin({ email, password });

            return this.#sendJson(res, 200, { token: result.token, user: result.user });

        } catch (error) {
            
            // If bad credentials return 401 Unauthorized
            if (error.message === "BAD_CREDENTIALS") {
                return this.#sendJson(res, 401, { error: "Invalid email or password." });
            }

            // If server error return 500 Internal Server Error
            return this.#sendJson(res, 500, { error: "Internal server error." });
        }
    };

    /**
     * Gets the current authenticated user.
     *      Why _req?
     *        - To indicate that the req parameter is not used in the function body.
     *      Why user.sub?
     *        - To get the unique identifier of the user from the JWT payload.
     * 
     * @param {*} _req unused request object
     * @param {*} res response object 
     * @param {*} user JWT payload of the authenticated user
     * @returns current user info
     */
    getCurrentUser = async (_req, res, user) => {
        return this.#sendJson(res, 200, {
            id      : user.sub,
            username: user.username,
            email   : user.email,
            role    : user.role
         });
    }

    /**
     * Gets the admin user from the request.
     * 
     * @param {*} req - The request object.
     * @param {*} res - The response object. 
     * @returns admin user or null 
     */
    getAdmin = (req, res) => {
        const user = this.getJwtPayloadFromRequestHeader(req);

        // If user is not authorized with valid token BYEEEE
        if (!user) {
            this.#sendJson(res, 401, { error: "Unauthorized" });
            return null;
        }

        // If user is not admin BYEEEE
        if (user.role !== "admin") {
            this.#sendJson(res, 403, { error: "Forbidden: Admins only" });
            return null;
        }
        return user;
    }


    getAllUsers = async (req, res) => {
        const user = this.getJwtPayloadFromRequestHeader(req);

        if (!user) {
            this.#sendJson(res, 401, { error: "Unauthorized" });
            return null;
        }

        // If user is not admin BYEEEE
        if (user.role !== "admin") {
            this.#sendJson(res, 403, { error: "Forbidden: Admins only" });
            return null;
        }

        const result = await this.getAllUsersService.getAllUsers();

        return this.#sendJson(res, 200, { result });
    }



}