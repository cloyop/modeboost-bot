import { DataBaseManager } from "../../../handlers/db.js";
import { repler } from "../../../tools/miscellany.js";

export async function ciclePaid(interaction) {
  const [_, c_id, staffId] = interaction.customId.split(".");
  const user = interaction.user;
  if (user.id !== staffId) {
    repler(interaction, { ephemeral: true, content: "is not your button" });
    return;
  }
  try {
    await DataBaseManager.setCicleOrdersOnPaid(c_id, staffId);
    repler(interaction, {
      ephemeral: true,
      content: "pay status updated successfully",
    });
    await interaction.message.delete();
  } catch (error) {
    console.log(error);
  }
}
