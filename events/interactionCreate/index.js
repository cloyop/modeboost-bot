import { closeOpenOrder } from "./isButton/closeOpenOrder.js";
import { requestAnOrder } from "./isButton/requestAnOrder.js";
import { requestResponse } from "./isButton/requestResponse.js";
import { oldCOOFixer } from "./isButton/oldCloseOpenOrderFixer.js";
import { mythicPlusRunAssembler } from "./isCommand/mythicPlusRunAssembler.js";
import { checkHistory } from "./isCommand/checkHistory.js";
import { deleteThisMessage, repler } from "../../tools/miscellany.js";
import { closeCicle } from "./isButton/closeCicle.js";
import { ciclePaid } from "./isButton/ciclePaid.js";

export async function interactionCreate(interaction) {
  if (
    interaction.guildId !== null &&
    interaction.guildId !== process.env.MODE_BOOST_ID
  )
    return;

  if (interaction.isChatInputCommand()) {
    if (interaction.channelId !== process.env.OPEN_ORDERS_CHANNEL)
      return repler(interaction, { ephemeral: true, content: "wrong channel" });
    const c_Name = interaction.commandName;

    if (c_Name === "all_complete") {
      all_complete(interaction);
      return;
    }
    if (c_Name === "check_history") {
      checkHistory(interaction);
      return;
    }
    if (c_Name === "mythic_run_assembler") {
      mythicPlusRunAssembler(interaction);
      return;
    }
  }
  if (interaction.isButton()) {
    const customId = interaction.customId;
    console.log(customId);
    if (customId === "deldthis") {
      deleteThisMessage(interaction.channelId, interaction.message.id);
      return;
    }
    if (customId.startsWith("thoc.c")) {
      oldCOOFixer(interaction);
      return;
    }
    if (customId.startsWith("or")) {
      requestAnOrder(interaction);
      return;
    }
    if (customId.startsWith("rao")) {
      requestResponse(interaction);
      return;
    }
    if (customId.startsWith("toc")) {
      closeOpenOrder(interaction);
      return;
    }
    if (customId.startsWith("cc")) {
      closeCicle(interaction);
      return;
    }
    if (customId.startsWith("cp")) {
      ciclePaid(interaction);
      return;
    }
  }
}
