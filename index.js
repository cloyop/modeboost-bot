import { Client } from "discord.js";
import { config } from "dotenv";
import { interactionCreate } from "./events/interactionCreate/index.js";
import { messageCreate } from "./events/messageCreate/index.js";
import { usersMap } from "./handlers/users.js";
import { onR } from "./events/onReady.js";


config();
export const client = new Client({ intents: 3276799 });

client.on("messageCreate", messageCreate);
client.on("interactionCreate", interactionCreate);
client.on("guildMemberAdd", async (i) => {
  usersMap.set(i.user.id, i.user);
});

client.on("ready", onR);
client.login(process.env.TOKEN);
