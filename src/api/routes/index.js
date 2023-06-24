import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import personRouter from "./person.js";
import channelRouter from "./channel.js";
import conversationRouter from "./conversation.js";
import messageRouter from "./message.js";
import urls from "../urls.js";
import spec from "../openapi.js";

const router = Router();

// Swagger API docs
const swaggerSpecPath = `${urls.swagger.path}/${urls.swagger.spec}`;
const swaggerUIOptions = {
  swaggerOptions: {
    url: swaggerSpecPath,
  },
};
router.get(swaggerSpecPath, (req, res) => res.json(spec));
router.use(
  urls.swagger.path,
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions)
);

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// CRUD API
router.use(urls.apiPrefix + urls.person.path, personRouter);
router.use(urls.apiPrefix + urls.channel.path, channelRouter);
router.use(urls.apiPrefix + urls.conversation.path, conversationRouter);
router.use(urls.apiPrefix + urls.message.path, messageRouter);

// Redirect browsers from index to API docs
router.get("/", (req, res, next) => {
  if (req.accepts("text/html")) {
    res.redirect(urls.swagger.path);
  } else {
    next();
  }
});

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;
