import { client } from "../index.js";
export let usersMap = new Map();

export async function UsersInit() {
  const guild = await client.guilds.fetch(process.env.MODE_BOOST_ID);

  const users = await guild.members.fetch();

  users?.forEach((element) => {
    if (usersMap.has(element.user.id)) return null;
    return usersMap.set(element.user.id, element.user);
  });
}
export async function getUser(id) {
  if (usersMap.has(id)) return usersMap.get(id);
  const u = await client.users.fetch(id);
  usersMap.set(u.id, u);
  return u;
}
export async function userSend(id, obj) {
  const u = await getUser(id);
  try {
    return await u.send(obj);
  } catch (error) {
    return null;
  }
}
