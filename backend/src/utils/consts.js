/**
 * @file consts.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description Constants for all javascript files in the backend.
 */

// Signup Service Constants
export const SIGNUP_SERVICE_CONSTS = {
    CHECK_EMAIL_EXISTS_QUERY         : "SELECT * FROM users WHERE email = ?",
    CHECK_EMAIL_EXISTS_RESULT_LENGTH : 0,
    PASSWORD_SALT_ROUNDS             : 10, 
    PROCESS_SIGNUP_QUERY             : "INSERT INTO users (username, email, password, role, api_usage_count) VALUES (?, ?, ?, 'user', 0)",
    DEFAULT_ROLE                     : "user",
    DEFAULT_API_USAGE_COUNT          : 0
};

// Login Service Constants
export const LOGIN_SERVICE_CONSTS = {
    CHECK_EMAIL_EXISTS_QUERY         : "SELECT id, username, email, password, role FROM users WHERE email = ?",
    CHECK_EMAIL_EXISTS_RESULT_LENGTH : 0,
    JWT_EXPIRES_IN                   : "1h"
};

// Auth Controller Constants
export const AUTH_CONTROLLER_CONSTS = {
    INITIAL_REQUEST_BODY  : "",
    AUTH_IN_JWT_HEADER    : "authorization",
    SPLIT_BEARER          : " ",
    MIN_TOKEN_PARTS       : 2,
    GET_AUTH_SCHEME_INDEX : 0,
    TYPE_OF_AUTH_SCHEME   : "Bearer",
    CREDENTIAL_PART       : 1
};

// Nature Discovery Service Constants
export const NATURE_DISCOVERY_SERVICE_CONSTS = {
    ENSURE_USER_ROW         : "INSERT IGNORE INTO user_nature_inventory (user_id) VALUES (?)",
    ADD_FLOWER              : "UPDATE user_nature_inventory SET flowers = JSON_ARRAY_APPEND(flowers, '$', ?) WHERE user_id = ? AND JSON_CONTAINS(flowers, JSON_QUOTE(?), '$') = 0",
    ADD_TREE                : "UPDATE user_nature_inventory SET trees = JSON_ARRAY_APPEND(trees, '$', ?) WHERE user_id = ? AND JSON_CONTAINS(trees, JSON_QUOTE(?), '$') = 0",
    ADD_ROCK                : "UPDATE user_nature_inventory SET rocks = JSON_ARRAY_APPEND(rocks, '$', ?) WHERE user_id = ? AND JSON_CONTAINS(rocks, JSON_QUOTE(?), '$') = 0",
    GET_COUNTS_BY_USER_ID   : "SELECT flowers, trees, rocks FROM user_nature_inventory WHERE user_id = ?", 
    MAX_LABELS_PER_CATEGORY : 5
};