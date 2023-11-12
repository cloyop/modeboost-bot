import { ActionRowBuilder, ButtonStyle, ComponentType } from "discord.js";
import { client } from "../../../index.js";
import { repler } from "../../../tools/miscellany.js";

export async function oldCOOFixer(interaction) {
  try {
    const [_, __, rId, staff, booster] = await interaction.customId.split(".");
    const thisEmbed = await interaction.message.embeds[0].data;

    thisEmbed.timestamp = new Date().toISOString();
    thisEmbed.thumbnail = { url: client.user.avatarURL() };
    thisEmbed.author = {
      name: "Open Order",
      icon_url: client.user.avatarURL(),
    };
    thisEmbed.footer = { text: rId };
    const completeSuccessButton = {
      custom_id: `toc.1.1.${rId}.${thisEmbed.fields[3].value}.${booster}`,
      label: "complete",
      style: ButtonStyle.Success,
      type: ComponentType.Button,
    };
    const completeFailedButton = {
      custom_id: `toc.1.0.${rId}.${thisEmbed.fields[3].value}.${booster}`,
      label: "rejected",
      style: ButtonStyle.Danger,
      type: ComponentType.Button,
    };
    const row = new ActionRowBuilder().addComponents(
      completeSuccessButton,
      completeFailedButton
    );
    const newMsg = interaction.channel.send({
      embeds: [thisEmbed],
      components: [row],
    });
    if (!newMsg) throw Error("error sending msg");

    const cch = await client.channels.fetch(interaction.message.channelId);
    const msg = await cch.messages.fetch(interaction.message.id);
    msg.delete();
    return;
  } catch (error) {
    console.log(error);
    if (error === "error sending msg") {
      repler(interaction, {
        content: error,
        ephemeral: true,
      });
    }
  }
}
