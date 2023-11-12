import { client } from "../../../index.js";
import { getUser } from "../../../handlers/users.js";
import { ordersRequesters, requestTable } from "../../../handlers/data.js";
import {
  deleteThisMessage,
  repler,
  rows,
  skyPublishers,
} from "../../../tools/miscellany.js";

export async function requestAnOrder(interaction) {
  const [_, source, orderId, staff] = interaction.customId.split(".");
  const author = interaction.user;

  const usersRequestedListed = ordersRequesters.has(orderId)
    ? ordersRequesters.get(orderId)
    : [];
  if (usersRequestedListed.includes(author.id)) {
    repler(interaction, {
      content: "already applied",
      ephemeral: true,
    });
    return;
  }
  usersRequestedListed.push(author.id);

  repler(interaction, {
    content: "request sent",
    ephemeral: true,
  });
  const requestId = `r${new Date().getTime()}`;
  const privateEmbed = interaction.message.embeds[0].data || null;
  if (privateEmbed === null || privateEmbed === undefined) {
    repler(interaction, {
      content: "theres not embed",
      ephemeral: true,
    });
    deleteThisMessage(interaction.channelId, interaction.message);
    return;
  }
  privateEmbed.author.name = `Order Requested by : ${
    author.globalName || author.userName || "CannotName"
  }`;
  privateEmbed.timestamp = new Date().toISOString() || "TimeNull";
  privateEmbed.thumbnail = {
    url: author.avatarURL() || client.user.avatarURL(),
  };
  privateEmbed.footer = { text: requestId };

  const row = rows.RAO(source, requestId, orderId, author.id);
  try {
    if (source === "1") {
      let messageObject = { embeds: [privateEmbed], components: [row] };
      const pMs = await skyPublishers(messageObject);
      if (pMs.includes(null))
        throw Error("problems sending message to Managers");
      requestTable.set(requestId, { rMessages: pMs });
    }
    if (source === "2") {
      let messageObject = { embeds: [privateEmbed], components: [row] };
      const publisher = await getUser(staff);
      const pM = await publisher.send(messageObject);
      if (!pM) throw Error("problems sending message to Manager");
      requestTable.set(requestId, { rMessages: [pM] });
    }
    ordersRequesters.set(orderId, usersRequestedListed);
  } catch (error) {
    console.log(error);
    await interaction.channel.send(`Error ${error}`);
  }
}
