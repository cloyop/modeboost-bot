import { DataBaseManager } from "../../../handlers/db.js";
import { client } from "../../../index.js";
import { repler } from "../../../tools/miscellany.js";
export async function checkHistory(i) {
  const user = i.user;
  try {
    const showed = await DataBaseManager.getMyHistory(user.id);
    if (showed.length === 0) {
      repler(i, { ephemeral: true, content: "no orders complete yet" });
      return;
    }
    let ammount = 0;
    let embeds = [];
    let fields = [];

    showed?.forEach((el) => {
      ammount += el.price;
      fields.push({
        name: new Date(el.ended_date).toDateString(),
        value: `${el.order_id} - $${el.price}`,
        inline: true,
      });
    });
    const title =
      "Total: " + ammount.toFixed(1) + "$" + " in " + fields.length + " orders";
    const author = {
      name: `Pending orders for ${user.userName || user.globalName}`,
      icon_url: client.user.avatarURL(),
    };
    const color = 5763719;
    const timestamp = new Date().toISOString();

    if (fields.length < 25) {
      embeds.push({
        author,
        title,
        fields,
        color,
        timestamp,
      });
    } else if (fields.length < 49) {
      embeds.push(
        {
          author,
          title,
          fields: fields.slice(0, 24),
          color,
        },
        {
          fields: fields.slice(24, fields.length),
          color,
          timestamp,
        }
      );
    } else {
      embeds.push(
        {
          author,
          title,
          fields: fields.slice(0, 24),
          color,
        },
        {
          fields: fields.slice(24, 48),
          color,
        },
        {
          fields: fields.slice(48, fields.length),
          color,
          timestamp,
        }
      );
    }
    repler(i, { ephemeral: true, embeds });
    return;
  } catch (error) {
    console.log(error);
  }
}
