import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { staffChannel } from "../../handlers/channels.js";
import { client } from "../../index.js";
import { newC, repler, thisCicle } from "../../tools/miscellany.js";
import { DataBaseManager } from "../../handlers/db.js";

export async function messageCreate(m) {
  if (
    m.author.id !== process.env.CLOYO ||
    m.guildId !== process.env.MODE_BOOST_ID ||
    m.channelId !== process.env.STAFF_CHANNEL
  )
    return;
  let c = m.content.toLowerCase();
  if (c === "!unpaid") {
    DataBaseManager.setCicleOrdersOnNotPaid(thisCicle.c_id);
  }
  if (c === "!cc") {
    repler(m, `${thisCicle.c_id}`);
  }
  if (c === "!ncf") {
    newC(new Date().toLocaleDateString());
    repler(m, "Done");
  }
  if (c === "!newc") {
    try {
      let embed = {
        author: { name: "Currect Cicle", icon_url: client.user.avatarURL() },
        title: `started: ${new Date(thisCicle.start).toDateString()}`,
      };
      const b = new ButtonBuilder({
        custom_id: `cc.${thisCicle.c_id}`,
        label: "close cicle",
        style: ButtonStyle.Primary,
      });
      const row = new ActionRowBuilder().addComponents(b);

      await staffChannel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log(error);
    }
  }
}
