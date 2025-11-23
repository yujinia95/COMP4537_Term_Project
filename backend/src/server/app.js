/**
 * @file app.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description Main entry point for the backend server.
 */

import http from "http";
import { URL } from "url";
import { AuthController } from "../auth/controllers/AuthController.js";
import { NatureDiscoveryController } from "../nature/controllers/NatureDiscoveryController.js";
import dotenv from "dotenv";
dotenv.config();

const authController            = new AuthController();
const natureDiscoveryController = new NatureDiscoveryController();
const PORT = process.env.PORT;

class Server {

  // Constructor
  constructor(controller) {
    this.controller = controller;
    this.server = http.createServer(this.#handleRequest.bind(this)); // Why bind(this)? To ensure the correct 'this' context
  }

  /**
   * Setup CORS headers for the response.
   *
   * @param {\} response - HTTP response object.
   */
  #setCorsHeaders(response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  /**
   * Handle preflight OPTIONS requests.
   *
   * @param {*} request - HTTP request object.
   * @param {*} response - HTTP response object.
   */
  #handleOptions(request, response) {
    response.writeHead(204);
    response.end();
  }

  /**
   * Handle 404 Not Found responses.
   *
   * @param {*} response - HTTP response object.
   */
  #sendPageNotFound(response) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "404 Not Found" }));
  }

  /**
   * Main request handler for incoming HTTP requests.
   *
   * @param {*} request - HTTP request object.
   * @param {*} response - HTTP response object.
   */
  async #handleRequest(request, response) {
    this.#setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      return this.#handleOptions(request, response);
    }

    const requestUrl = new URL(request.url, "http://localhost"); //! Need to be updated for production
    const pathname = requestUrl.pathname;

    // Server health check
    if (request.method === "GET" && pathname === "/") {
      response.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
      response.end(
        "<h1>SERVER IS RUNNING!!!! PLEASE RUN WITHOUT ANY PROBLEMS</h1>"
      );
      return;
    }

    // Post for signup
    if (request.method === "POST" && pathname === "/api/auth/signup") {
      return this.controller.signup(request, response);
    }

    // Post for login
    if (request.method === "POST" && pathname === "/api/auth/login") {
      return this.controller.login(request, response);
    }

    // Get current user
    if (request.method === "GET" && pathname === "/api/auth/current-user") {
      const user = this.controller.getJwtPayloadFromRequestHeader(request);

      // If user is not authorized with valid token BYEEEE
      if (!user) {
        response.writeHead(401, { "Content-Type": "application/json" });
        return response.end(JSON.stringify({ message: "Unauthorized" }));
      }

      return this.controller.getCurrentUser(request, response, user);
    }

    // Get all users (admin only)
    if (request.method === "GET" && pathname === "/api/auth/users") {

      const adminUser = this.controller.getAdmin(request, response);

      // If not admin or unauthorized BYEEEE
      if (!adminUser) {
        return;
      }

      const data = this.controller.getAllUsers(request, response);

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify(data));
    }

    // Add API usage
    if (request.method === "POST" && pathname === "/api/auth/add") {
      return this.controller.addApiUsage(request, response);
    }

    if (request.method === "GET" && pathname.startsWith("/api/auth/get")){
      return this.controller.getApiUsage(request, response);
    }


    // Get admin dashboard
    if (request.method === "GET" && pathname === "/api/auth/admin-dashboard") {
      const adminUser = this.controller.getAdmin(request, response);

      // If not admin or unauthorized BYEEEE
      if (!adminUser) {
        return;
      }

      const payload = {
        message: `Welcome to the admin dashboard!`,
        user: {
          id: adminUser.sub,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      };

      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify(payload));
    }

    // Add nature discovery entry
    if (request.method === "POST" && pathname === "/api/ai/item") {

      return natureDiscoveryController.addDiscovery(request, response);
    }

    // Get nature discovery summary (count of flowers, trees, rocks from database)
    if (request.method === "GET" && pathname === "/api/ai/naturedex") {

      const user = this.controller.getJwtPayloadFromRequestHeader(request);

        if (!user) {
          response.writeHead(401, { "Content-Type": "application/json" });
          return response.end(JSON.stringify({ message: "Unauthorized" }));
        }


      return natureDiscoveryController.getDiscoverySummary(request, response, user);
    }



    // If no route matched, return 404
    return this.#sendPageNotFound(response);
  }

  /**
   * Starts the HTTP server on the specified port.
   */
  startServer() {
    this.server.listen(PORT, () => {
      console.log(`Port: ${PORT}`);
    });
  }
}

new Server(authController).startServer();
