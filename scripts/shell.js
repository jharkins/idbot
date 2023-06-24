import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import mongoInit from "../src/models/init.js";
import User from "../src/models/user.js";
import Person from "../src/models/person.js";
import Channel from "../src/models/channel.js";
import Conversation from "../src/models/conversation.js";
import Message from "../src/models/message.js";
import UserService from "../src/services/user.js";
import PersonService from "../src/services/person.js";
import ChannelService from "../src/services/channel.js";
import ConversationService from "../src/services/conversation.js";
import MessageService from "../src/services/message.js";

const main = async () => {
  await mongoInit(config.DATABASE_URL);
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    Person,
    Channel,
    Conversation,
    Message,
  };
  r.context.services = {
    UserService,
    PersonService,
    ChannelService,
    ConversationService,
    MessageService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
