/**
 * @file swagger_server.js
 * @author Yujin Jeong, Evan Vink, Brian Diep, ChatGPT, Claude
 * @version 1.0
 * @description Swagger/OpenAPI specification for the Nature Discovery backend API.
 */
export const serverInfo = {
  openapi: "3.0.0",
  info: {
    title: "Nature Discovery API",
    version: "1.0.0",
    description: "API documentation for the Nature Discovery backend.",
  },
  servers: [
    {
      url: "https://termproject.yujinjeong-comp4537-labs-0.com",
      description: "Production Backend",
    },
    {
      url: "http://localhost:3000",
      description: "Local Development",
    }
  ],

  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Validation error" }
        }
      }
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user & return JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login success" },
          401: { description: "Invalid credentials" }
        }
      }
    },

    "/api/auth/current-user": {
      get: {
        tags: ["Auth"],
        summary: "Get authenticated user info",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User data returned" },
          401: { description: "Unauthorized" }
        }
      }
    },

    "/api/auth/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users (Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Users list returned" },
          401: { description: "Unauthorized or not admin" }
        }
      }
    },

    "/api/auth/add": {
      post: {
        tags: ["Auth"],
        summary: "Increment API usage count for user",
        requestBody: {
          required: false,
        },
        security: [],
        responses: {
          200: { description: "API usage incremented" },
          404: { description: "User not found" }
        }
      }
    },

    "/api/auth/get": {
      get: {
        tags: ["Auth"],
        summary: "Get API usage count for user",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "User ID"
          }
        ],
        responses: {
          200: { description: "Usage amount returned" },
          400: { description: "ID missing" },
          404: { description: "User not found" }
        }
      }
    },

    "/api/auth/admin-dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Admin dashboard access",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Admin data returned" },
          401: { description: "Unauthorized or not admin" }
        }
      }
    },

    "/api/ai/item": {
      post: {
        tags: ["Nature Discovery"],
        summary: "Add a new nature discovery item",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  category: {
                    type: "string",
                    enum: ["flowers", "trees", "rocks"],
                  },
                  label: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Discovery added" },
          400: { description: "Invalid payload" }
        }
      }
    },

    "/api/ai/naturedex": {
      get: {
        tags: ["Nature Discovery"],
        summary: "Get summary of discoveries (flowers, trees, rocks…) for user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Summary returned" },
          401: { description: "Unauthorized" }
        }
      }
    }
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      }
    }
  }
};