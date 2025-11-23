/**
 * @file NatureDiscoveryController.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Controller for handling nature discovery operations.
 */

import { NatureDiscoveryService } from "../services/NatureDiscoveryService.js";

export class NatureDiscoveryController {

  // Constructor
  constructor() {
    this.natureDiscoveryService = new NatureDiscoveryService();
  }


  /**
   * Reads JSON body from the request.
   *
   * @param {*} request request object
   * @returns parsed JSON body
   */
  async #getJsonBody(request) {
    return new Promise((resolve, reject) => {
      let body = "";

      request.on("data", (chunk) => (body += chunk.toString()));

      request.on("end", () => {
        try {
          // If body is empty, return an empty object
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(error);
        }
      });
      request.on("error", reject);
    });
  }


  /**
   * Adds a new nature discovery entry.
   *
   * @param {*} request request object
   * @param {*} response response object
   * @returns 200 if successful, 400 if bad request
   */
  async addDiscovery(request, response) {
    try {
      const body = await this.#getJsonBody(request);

      // Extract label and category from the request body
      const { userId, category, label } =  body;

      // Validate input. If no label or category, return 400
      if (!userId || !label || !category) {
        response.writeHead(400, { "Content-Type": "application/json" });
        return response.end(
          JSON.stringify({
            message: "userId, label, and category are required",
          })
        );
      }

      // Map category to database column
      const categoryMap = {
        flowers : "flowers",
        trees   : "trees",
        rocks   : "rocks",
      };

      const mappedCategory = categoryMap[category];

      // If invalid category, return 400. (Must be flowers, trees, or rocks)
      if (!mappedCategory) {
        response.writeHead(400, { "Content-Type": "application/json" });
        return response.end(
          JSON.stringify({
            message: "Invalid category",
          })
        );
      }

      const result = await this.natureDiscoveryService.addLabel({
        userId,
        category: mappedCategory,
        label,
      });

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify(result));
    
    } catch (error) {
        // This catch is for unexpected server errors

        console.error("Error in addDiscovery. Check NatureDiscoveryController.js", error);
    
        response.writeHead(500, { "Content-Type": "application/json" });
        return response.end(
          JSON.stringify({
            message: "Internal server error",
          })
        );
    }
  }


  async getDiscoverySummary(request, response, user) {
    try {
        const userId = user.sub ?? user.userId;
        const data   = await this.natureDiscoveryService.getSummary(userId);
    
        response.writeHead(200, { "Content-Type": "application/json" });
        return response.end(JSON.stringify(data));

    } catch (error) {

        response.writeHead(500, { "Content-Type": "application/json" });
        
        return response.end(
          JSON.stringify({
            message: "Internal server error",
          })
        );
      }
    }

}
