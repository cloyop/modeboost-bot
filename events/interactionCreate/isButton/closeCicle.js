import { client } from "../../../index.js";
import {
  deleteThisMessage,
  newC,
  repler,
  thisCicle,
} from "../../../tools/miscellany.js";
import { DataBaseManager } from "../../../handlers/db.js";
import { getUser, userSend } from "../../../handlers/users.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { annoucChannel, staffChannel } from "../../../handlers/channels.js";

export async function closeCicle(interaction) {
  if (interaction.user.id !== process.env.CLOYO) return;
  const rrn = new Date();
  if (rrn.getTime() - new Date(thisCicle.start).getTime() < 432000000) {
    repler(interaction, { ephemeral: true, content: "not enough days" });
    // return;
  }
  const [_, id] = interaction.customId.split(".");
  const rnDate = new Date(rrn.toLocaleDateString());
  const pDate = new Date(rnDate.getTime() + 259200000);

  const authorMap = new Map();
  const staffMap = new Map();
  let pq = 0;
  let oq = 0;
  try {
    const r = await DataBaseManager.getCicleOrders(id);
    if (r.length === 0) {
      repler(interaction, { ephemeral: true, content: "no orders this cicle" });
      return;
    }
    r?.forEach((el) => {
      if (!authorMap.has(el.author_id)) {
        authorMap.set(el.author_id, { totalP: 0, totalO: 0, fields: [] });
      }
      if (!staffMap.has(el.staff_id)) {
        staffMap.set(el.staff_id, { totalP: 0, totalO: 0, fields: [] });
      }

      const mape = authorMap.get(el.author_id);
      const mapeS = staffMap.get(el.staff_id);
      oq++;
      pq += el.price;
      mape.totalP += el.price;
      mape.totalO++;
      mape.fields.push({
        name: el.order_id,
        value: `${el.price}$`,
        inline: true,
      });

      mapeS.totalP += el.price;
      mapeS.totalO++;
      mapeS.fields.push({
        name: el.order_id,
        value: `${el.price}$ to ${el.author}`,
        inline: true,
      });
    });

    await DataBaseManager.closeCicle(
      id,
      rnDate.getTime(),
      pDate.getTime(),
      oq,
      pq,
      false
    );
    const c_id_parse = parseInt(id) <= 9 ? `0${id}` : `${id}`;
    await annoucChannel.send({
      embeds: [
        {
          author: {
            name: "ANNOUCEMENT",
            icon_url: client.user.avatarURL(),
          },
          title: `C-${c_id_parse}-${rnDate.toDateString().slice(4, 10)} CLOSE`,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }

  newC(rnDate.toLocaleDateString());
  const timestamp = rnDate.toISOString().slice(0, 25);
  const color = 12745742;
  const author = { name: "Cicle Close", icon_url: client.user.avatarURL() };
  for (const [key, value] of authorMap) {
    const embeds = [];

    if (value.fields.length <= 24) {
      embeds.push({
        author,
        title: `Total: ${value.totalP}$`,
        fields: value.fields,
        timestamp,
        color,
        footer: { text: `Cicle_id: ${id}` },
      });
    } else if (value.fields.length <= 48) {
      embeds.push(
        {
          author,
          title: `Total: ${value.totalP}$`,
          color,
          fields: value.fields.slice(0, 24),
        },
        {
          fields: value.fields.slice(24, value.fields.length),
          color,
          footer: { text: `Cicle_id: ${id}` },
          timestamp,
        }
      );
    } else {
      embeds.push(
        {
          author,
          title: `Total: ${value.totalP}$`,

          color,
          fields: value.fields.slice(0, 24),
        },
        {
          fields: value.fields.slice(24, 48),
          color,
        },
        {
          fields: value.fields.slice(48, value.fields.length),
          color,
          footer: { text: `Cicle_id: ${id}` },
          timestamp,
        }
      );
    }
    userSend(key, { embeds });
  }

  deleteThisMessage(interaction.channelId, interaction.message.id);

  for (const [key, value] of staffMap) {
    const embeds = [];
    const u = await getUser(key);
    const uName = u.globalName || u.userName;
    if (value.fields.length <= 24) {
      embeds.push({
        author,
        title: `Total: ${value.totalP}$`,

        fields: value.fields,
        timestamp,
        color,
        footer: { text: `Cicle_id: ${id}` },
      });
    } else if (value.fields <= 48) {
      embeds.push(
        {
          author,
          title: `Total: ${value.totalP}$`,

          color,
          fields: value.fields.slice(0, 24),
        },
        {
          fields: value.fields.slice(24, value.fields.length),
          color,
          footer: { text: `Cicle_id: ${id}` },
          timestamp,
        }
      );
    } else {
      embeds.push(
        {
          author,
          title: `Total: ${value.totalP}$`,
          color,
          fields: value.fields.slice(0, 24),
        },
        {
          fields: value.fields.slice(24, 48),
          color,
          footer: { text: `Cicle_id: ${id}` },
          timestamp,
        },
        {
          fields: value.fields.slice(48, value.fields.length),
          color,
          footer: { text: `Cicle_id: ${id}` },
          timestamp,
        }
      );
    }
    const button = new ButtonBuilder({
      custom_id: `cp.${id}.${key}`,
      label: `${uName} paid`,
      style: ButtonStyle.Success,
    });
    const row = new ActionRowBuilder().addComponents(button);
    try {
      staffChannel.send({
        content: `${uName} debt`,
        embeds,
        components: [row],
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }
}
