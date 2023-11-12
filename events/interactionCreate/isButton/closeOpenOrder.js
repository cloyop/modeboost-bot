import { getUser, userSend } from "../../../handlers/users.js";
import { client } from "../../../index.js";
import { repler, stringtxt, thisCicle } from "../../../tools/miscellany.js";
import { DataBaseManager } from "../../../handlers/db.js";
export async function closeOpenOrder(interaction) {
  const [_, source, responseInt, requestId, orderId, authorId, staff] =
    await interaction.customId.split(".");

  const user = interaction.user;
  if (user.id !== staff) {
    repler(interaction, {
      content: "not allowed",
      ephemeral: true,
    });
    return;
  }
  if (responseInt === "0") {
    try {
      await interaction.channel.delete();
      return;
    } catch (error) {
      return;
    }
  }
  if (thisCicle.c_id === 0)
    return repler(interaction, "No Valid Cicle Running");
  const publicEmbed = interaction.message.embeds[0].data || null;
  if (publicEmbed === null || publicEmbed === undefined) {
    repler(interaction, {
      content: "theres not embed",
      ephemeral: true,
    });
    return;
  }

  publicEmbed.author.name = "Order Complete";
  const author = await getUser(authorId);
  const privateEmbed = {};
  privateEmbed.title = publicEmbed.title;
  privateEmbed.description = publicEmbed.description;
  privateEmbed.author = {
    name: `Order Complete by ${author.userName || author.globalName}`,
    icon_url: client.user.avatarURL(),
  };
  privateEmbed.thumbnail = {
    url: author.avatarURL() || client.user.avatarURL(),
  };
  privateEmbed.timestamp = new Date().toISOString();
  privateEmbed.color = publicEmbed.color;
  privateEmbed.footer = publicEmbed.footer;
  privateEmbed.fields = publicEmbed.fields.map((el) => el);
  privateEmbed.fields.push({
    name: "Author",
    value: author.userName || author.globalName,
    inline: true,
  });

  let price = parseFloat(publicEmbed.fields[5].value.replace("$", "")).toFixed(
    1
  );
  const data = {
    requestId,
    author: author.userName || author.globalName,
    orderId,
    title: publicEmbed.title.replaceAll(";", "~"),
    description: publicEmbed.description.replaceAll(";", "~"),
    staff: user.userName || user.globalName,
    price: price,
    started: new Date(publicEmbed.timestamp).getTime(),
    ended: new Date().getTime(),
    paid: false,
    staffId: staff,
    authorId: authorId,
    c_id: thisCicle.c_id,
  };

  try {
    await DataBaseManager.newOrderComplete(data);
  } catch (error) {
    console.log(error);
    return interaction.reply(error?.sqlMessage.slice(0, 32));
  }
  stringtxt(data);
  console.log("Order", orderId, "Has Been Complete Succesfully");
  try {
    const m1 = await userSend(authorId, { embeds: [publicEmbed] });
    const m2 = await userSend(user.id, { embeds: [privateEmbed] });
    if (!m1 || !m2)
      throw Error("Issue sending record messages. but close succesfully");
    await interaction.channel.delete();
    return;
  } catch (error) {
    return;
  }
}
