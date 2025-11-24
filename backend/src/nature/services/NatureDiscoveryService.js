/**
 * @file NatureDiscoveryService.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description
 */

import db from "../../db/db.js";
import { NATURE_DISCOVERY_SERVICE_CONSTS } from "../../utils/consts.js";

/**
 * This class is used to handle nature discovery operations
 * Mainly create user's discovered nature data into nature database for achievement functionality.
 */
export class NatureDiscoveryService {

  // Constructor
  constructor() {
    this.db = db;
  }


  /**
   * Adding a label to the 'user_nature_inventory' database.
   *
   * @param {*} param0 JSON object containing userId, category, label
   */
  async addLabel({ userId, category, label }) {
    // Validate input (all fields are required)
    if (!userId || !category || !label) {
      throw new Error("All fields are required");
    }

    // Insert row only if user_id does not exist (INSERT IGNORE skips duplicates)
    await this.db.query(NATURE_DISCOVERY_SERVICE_CONSTS.ENSURE_USER_ROW, [
      userId,
    ]);

    // Picking correct query statements based on category
    let query;

    switch (category) {
      case "flowers":
        query = NATURE_DISCOVERY_SERVICE_CONSTS.ADD_FLOWER;
        break;
      case "trees":
        query = NATURE_DISCOVERY_SERVICE_CONSTS.ADD_TREE;
        break;
      case "rocks":
        query = NATURE_DISCOVERY_SERVICE_CONSTS.ADD_ROCK;
        break;
      default:
        throw new Error("Invalid category");
    }

    // First label = the value want to add in db
    // Third label = to check if label already exists in db
    // db.query returns the result object for UPDATE statements (not an array),
    // so do not destructure here.
    const result = await this.db.query(query, [label, userId, label]);

    const changed =
      result && result.affectedRows ? result.affectedRows > 0 : false;

    return {
      success: true,
      category,
      label,
      alreadyExists: !changed,
    };
  }


  /**
   * Get counts of each category for a user.
   *
   * @param {*} userId user ID
   * @returns counts of each category
   */
  async getSummary(userId) {
    // Validate input (if no userId, throw error)
    if (!userId) {
      throw new Error("userId is required");
    }

    try {
        
        // Executing query statement to get counts by user ID
        const rows = await this.db.query(
            NATURE_DISCOVERY_SERVICE_CONSTS.GET_COUNTS_BY_USER_ID, [userId]
        );

        // To find rows, length of rows must be greater than 0 else treat as empty arrays
        const row = rows && rows.length > 0 ? rows[0] : {
            flowers: "[]",
            trees: "[]",
            rocks: "[]",
        };

        const parseJsonArray = (value) => {
            
            // if no value, return empty array
            if (!value) {
                return [];
            }

            // if value is already an array, return it
            if (Array.isArray(value)) {
                return value;
            }

            // if value is a buffer, convert to string
            if (Buffer.isBuffer(value)) {
            value = value.toString("utf8");
            }

            // if value is not a string, convert to string
            if (typeof value !== "string") {
            value = String(value);
            }

            try {
                const parsed = JSON.parse(value);
                // Ensure the parsed value is an array else return empty array
                return Array.isArray(parsed) ? parsed : [];

            } catch (err) {
            return [];
            }
        };

        // Parsing JSON arrays from database values
        const flowers = parseJsonArray(row.flowers);
        const trees   = parseJsonArray(row.trees);
        const rocks   = parseJsonArray(row.rocks);

        // Counts the number of items in each category (needed to show how many plants that user has discovered)
        const flowerCount = flowers.length;
        const treeCount   = trees.length;
        const rockCount   = rocks.length;

        // Max labels constant 
        const max = NATURE_DISCOVERY_SERVICE_CONSTS.MAX_LABELS_PER_CATEGORY;

        return {
            counts: {
            flower: flowerCount,
            tree  : treeCount,
            rock  : rockCount,
            },
            achievements: {
            flower: flowerCount >= max,
            tree  : treeCount >= max,
            rock  : rockCount >= max,
            },
        };

    } catch (err) {
    throw err;
   }
  }
}
