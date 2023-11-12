import { ChannelType } from "discord.js";
import {
  ordersRequesters,
  removeOrderRequester,
  requestTable,
} from "../../../handlers/data.js";
import { getUser } from "../../../handlers/users.js";
import { channelsMap, openOrdersChannel } from "../../../handlers/channels.js";
import { client } from "../../../index.js";
import { deleteThisMessage, rows } from "../../../tools/miscellany.js";

export async function requestResponse(interaction) {
  const staff = await interaction.user;
  const publicEmbed = await interaction.message.embeds[0].data;
  const [_, source, responseInt, requestId, orderId, authorId] =
    await interaction.customId.split(".");
  const requestInfo = requestTable.has(requestId)
    ? requestTable.get(requestId)
    : requestTable.set(requestId, { rMessages: [interaction.message] });
  if (responseInt === "0") {
    removeOrderRequester(orderId, authorId);
    deleteThisMessage(interaction.channelId, interaction.message);
    return;
  }
  const author = await getUser(authorId);
  publicEmbed.timestamp = new Date().toISOString();
  publicEmbed.thumbnail.url = client.user.avatarURL();
  publicEmbed.author.name = "Open Order";
  try {
    const thread = await openOrdersChannel.threads.create({
      name: `#${orderId}, ${publicEmbed.title.slice(0, 25)}`,
      autoArchiveDuration: 10080,
      type: ChannelType.PrivateThread,
      reason: `${requestId}`,
    });
    if (!thread) throw Error("Problem Solving threads, please do it again");
    requestInfo.rMessages?.forEach((e) => deleteThisMessage(e.channelId, e));
    await thread.members.add(staff);
    await thread.members.add(author);
    channelsMap.set(thread.id, thread);
    const row = rows.TOC(source, requestId, orderId, authorId, staff.id);
    await thread.send({ embeds: [publicEmbed], components: [row] });
    removeOrderRequester(orderId, authorId);
  } catch (error) {
    console.log(error);
  }
}
