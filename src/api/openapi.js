import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import personSchema from "./schemas/person.js";
import channelSchema from "./schemas/channel.js";
import conversationSchema from "./schemas/conversation.js";
import messageSchema from "./schemas/message.js";

export const definition = {
  openapi: "3.0.0",
  info: {
    title: "Demo Project",
    version: "0.0.1",
    description: "A REST+JSON API service",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      Person: personSchema,
      Channel: channelSchema,
      Conversation: conversationSchema,
      Message: messageSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;
