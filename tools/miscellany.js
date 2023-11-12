import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { appendFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { client } from "../index.js";
import { getUser } from "../handlers/users.js";
import { DataBaseManager } from "../handlers/db.js";
import { annoucChannel } from "../handlers/channels.js";
export const require = createRequire(import.meta.url);
export const thisCicle = require("../cicleConfig.json");

export const jsonGetter = (path) => require(path);

export async function newC(dateParam) {
  try {
    const date = new Date(dateParam);
    const id = await DataBaseManager.newCicleCreate(date.getTime());
    if (!id) return console.log(id);
    thisCicle.c_id = id;
    thisCicle.start = date.toLocaleDateString();
    await writeFile("cicleConfig.json", JSON.stringify(thisCicle));
    const c_id_parse = parseInt(id) <= 9 ? `0${id}` : id;

    await annoucChannel.send({
      embeds: [
        {
          author: {
            name: "ANNOUCEMENT",
            icon_url: client.user.avatarURL(),
          },
          title: `C-${c_id_parse}-${date.toDateString().slice(4, 10)} START`,
        },
      ],
    });
  } catch (error) {
    console.log("newC Error", error);
  }
}

export async function deleteThisMessage(channelId, message) {
  try {
    const cch = await client.channels.fetch(channelId);
    const msg = await cch.messages.delete(message);
  } catch (error) {
    return;
  }
}
export async function stringtxt(newData) {
  try {
    let str = `${newData.orderId}~${newData.requestId}~${newData.title}~${
      newData.description
    }~${newData.staff}~${newData.author}~${newData.price}~${new Date(
      newData.started
    ).toLocaleDateString()}~${new Date(newData.ended).toLocaleDateString()}~${
      newData.paid
    }~${newData.staff}~${newData.authorId}\n`;
    await appendFile("orders.txt", str);
    return;
  } catch (error) {
    return;
  }
}

export function randomId() {
  const getid = new Date().getTime().toString();
  const letters = "ABCDEFGHIJKMNOPQRSTUVWXYZ";
  let fL =
    letters[parseInt(Math.random() * letters.length.toFixed(0))].toUpperCase();
  let sL =
    letters[parseInt(Math.random() * letters.length.toFixed(0))].toUpperCase();
  let tL =
    letters[parseInt(Math.random() * letters.length.toFixed(0))].toUpperCase();

  const spliced = getid.slice(getid.length - 4);
  const orderId = `${fL}${sL}${spliced}${tL}`;
  return orderId;
}
export async function skyPublishers(message) {
  try {
    const alys = await getUser(process.env.ALYS);
    const rol = await getUser(process.env.ROL);
    const cloyo = await getUser(process.env.CLOYO);
    const aM = await alys.send(message);
    const rM = await rol.send(message);
    const cM = await cloyo.send(message);
    return [aM, rM, cM];
  } catch (error) {
    return [null, null, null];
  }
}

export const rows = {
  RAO: (source, requestId, orderId, authorId) => {
    const confirm = new ButtonBuilder({
      custom_id: `rao.${source}.1.${requestId}.${orderId}.${authorId}`,
      label: "accept",
      style: ButtonStyle.Success,
    });
    const cancel = new ButtonBuilder({
      custom_id: `rao.${source}.0.${requestId}.${orderId}.${authorId}`,
      label: "reject",
      style: ButtonStyle.Danger,
    });
    const deleter = new ButtonBuilder({
      custom_id: `deldthis`,
      label: "delete this message",
      style: ButtonStyle.Secondary,
    });
    const row = new ActionRowBuilder().addComponents(confirm, cancel, deleter);
    return row;
  },
  TOC: (source, requestId, orderId, authorId, staffId) => {
    const completeSuccessButton = new ButtonBuilder({
      custom_id: `toc.${source}.1.${requestId}.${orderId}.${authorId}.${staffId}`,
      label: "Completed",
      style: ButtonStyle.Success,
    });

    const completeFailedButton = new ButtonBuilder({
      custom_id: `toc.${source}.0.${requestId}.${orderId}.${authorId}.${staffId}`,
      label: "Canceled",
      style: ButtonStyle.Danger,
    });
    return new ActionRowBuilder().addComponents(
      completeSuccessButton,
      completeFailedButton
    );
  },
};

export async function repler(i, content) {
  try {
    await i.reply(content);
  } catch (error) {
    return;
  }
}
