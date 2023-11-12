import { config } from "dotenv";
import { client } from "../index.js";
config();
export let channelsMap = new Map();
export let retailOrderChannel;
export let hardcoreOrderChannel;
export let clasicOrderChannel;
export let lolOrderChannel;
export let openOrdersChannel;
export let staffChannel;
export let annoucChannel;

export async function getChannel(id) {
  if (channelsMap.has(id)) return channelsMap.get(id);
  const c = await client.channels.fetch(id);
  channelsMap.set(c.id, c);
  return c;
}

export async function channelsInit() {
  const g = await client.guilds.fetch(process.env.MODE_BOOST_ID);

  retailOrderChannel = await g.channels.fetch(process.env.R_ORDERS_CHANNEL);
  hardcoreOrderChannel = await g.channels.fetch(process.env.H_ORDERS_CHANNEL);
  clasicOrderChannel = await g.channels.fetch(process.env.C_ORDERS_CHANNEL);
  lolOrderChannel = await g.channels.fetch(process.env.L_ORDERS_CHANNEL);
  staffChannel = await g.channels.fetch(process.env.STAFF_CHANNEL);
  annoucChannel = await g.channels.fetch(process.env.ANNOUNC_CHANNEL);
  openOrdersChannel = await g.channels.fetch(process.env.OPEN_ORDERS_CHANNEL);

  const m = await openOrdersChannel.messages.fetch();
  m.forEach((el) => {
    try {
      el.delete();
    } catch (error) {
      return;
    }
  });
}
