export let requestTable = new Map();
export let ordersRequesters = new Map();
export let ordersStates = new Map();

export function removeOrderRequester(orderId, id) {
  if (!ordersRequesters.has(orderId)) ordersRequesters.set(orderId, []);
  let item = ordersRequesters.get(orderId);
  let newItem = item.filter((el) => el !== id);
  ordersRequesters.set(orderId, newItem);
}
