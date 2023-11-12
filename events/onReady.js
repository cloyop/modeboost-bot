import { channelsInit } from "../handlers/channels.js";
import { UsersInit } from "../handlers/users.js";
import { newC } from "../tools/miscellany.js";

export async function onR(e) {
  try {
    await channelsInit();
    await UsersInit();
  } catch (error) {
    console.log(error);
    return;
  }
  console.log("bot is running good");
}
