import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";
import {
  channelsMap,
  openOrdersChannel,
  retailOrderChannel,
} from "../../../handlers/channels.js";
import { client } from "../../../index.js";
import { randomId, repler, rows } from "../../../tools/miscellany.js";

let darkNavy = 2899536;
export async function mythicPlusRunAssembler(i) {
  const user = i.user;
  if (
    user.id !== process.env.ALYS &&
    user.id !== process.env.ROL &&
    user.id !== process.env.CLOYO &&
    user.id !== process.env.CIVO
  )
    return repler(i, { ephemeral: true, content: "not allowed" });

  let source = 2;
  const quantity = (await i.options.get("quantity")?.value) || null;
  const level = (await i.options.get("level")?.value) || null;
  const faction = await i.options.get("faction")?.value.toUpperCase();
  const title = (await i.options.get("title")?.value) || "MYTHIC 11-25";
  const desc = (await i.options.get("description")?.value) || " ";
  const startDate = (await i.options.get("start_date")?.value) || "asap";
  const deadLine = (await i.options.get("dead_line")?.value) || "asap";
  const buyerP = (await i.options.get("buyer_participation")?.value) || "False";
  const express = (await i.options.get("express")?.value) || false;
  const price = (await i.options.get("price")?.value) || "00.00";
  const stack = (await i.options.get("stack")?.value) || false;
  const traders = (await i.options.get("traders")?.value) || 4;
  const author = (await i.options.get("order_taker")?.value) || false;
  const orderId = randomId();

  //

  repler(i, { ephemeral: true, content: "assembling" });
  try {
    if (author === false) {
      const embed = {
        title,
        author: {
          name: "NEW ORDER AVAILABLE",
        },
        description: `${
          express ? "EXPRESS || " : ""
        }${faction} ; M+ ${level} x ${quantity} ;  ${desc}`,
        thumbnail: { url: client.user.avatarURL() },
        fields: [
          {
            name: "Start date",
            value: startDate || "any",
            inline: true,
          },
          {
            name: "Dead line",
            value: deadLine || "any",
            inline: true,
          },
          {
            name: "Buyer Participation",
            value: buyerP,
            inline: true,
          },
          {
            name: "OrderID",
            value: orderId,
            inline: true,
          },
          {
            name: "Express Order",
            value: express,
            inline: true,
          },
          {
            name: "Price",
            value: `$${price}`,
            inline: true,
          },
          {
            name: "Armor Stack",
            value: stack ? `${stack} Stack x ${traders} Traders` : "Nulo",
            inline: true,
          },
        ],
        color: darkNavy,
        timestamp: new Date().toISOString(),
      };
      const buttonR = new ActionRowBuilder().addComponents(
        new ButtonBuilder({
          custom_id: `or.${source}.${orderId}.${user.id
            .replace("<", "")
            .replace(">", "")
            .replace("@", "")}`,
          label: "Get Order",
          style: ButtonStyle.Primary,
        })
      );
      await retailOrderChannel.send({
        embeds: [embed],
        components: [buttonR],
      });
    } else {
      let requestId = `r${new Date().getTime()}`;
      const embed = {
        title,
        author: {
          name: "Open Order",
          icon_url: client.user.avatarURL(),
        },
        description: `${
          express ? "EXPRESS || " : ""
        }${faction} ; M+ ${level} x ${quantity} ;  ${desc}`,
        thumbnail: { url: client.user.avatarURL() },
        fields: [
          {
            name: "Start date",
            value: startDate || "any",
            inline: true,
          },
          {
            name: "Dead line",
            value: deadLine || "any",
            inline: true,
          },
          {
            name: "Buyer Participation",
            value: buyerP,
            inline: true,
          },
          {
            name: "OrderID",
            value: orderId,
            inline: true,
          },
          {
            name: "Express Order",
            value: express,
            inline: true,
          },
          {
            name: "Price",
            value: `$${price}`,
            inline: true,
          },
          {
            name: "Armor Stack",
            value: stack ? `${stack} Stack x ${traders} Traders` : "Nulo",
            inline: true,
          },
        ],
        color: darkNavy,
        timestamp: new Date().toISOString(),
        footer: { text: requestId },
      };
      const thread = await openOrdersChannel.threads.create({
        name: `#${orderId}, ${embed.title.slice(0, 25)}`,
        autoArchiveDuration: 10080,
        type: ChannelType.PrivateThread,
        reason: `${requestId}`,
      });
      if (!thread) throw Error("Problem Solving threads, please do it again");
      channelsMap.set(thread.id, thread);
      thread.members.add(user);
      thread.members.add(author);

      const row = rows.TOC(source, requestId, orderId, author, user.id);
      thread.send({ embeds: [embed], components: [row] });
    }
    //
  } catch (error) {
    console.log(error);
  }
}
