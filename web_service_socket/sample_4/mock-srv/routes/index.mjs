"use strict";
const data = [
  {
    id: "A1",
    name: "Default Vacuum Cleaner",
    rrp: "99.99",
    info: "Default The suckiest vacuum in the world.",
  },
  {
    id: "A2",
    name: "Default Leaf Blower",
    rrp: "303.33",
    info: "Default This product will blow your socks off.",
  },
];

/*
export default async function (fastify, opts) {
  fastify.get(
    "/:category",
    { websocket: true },
    async ({ socket }, request) => {
      socket.send(JSON.stringify({ id: "A1", total: 3 }));
    }
  )};*/

  export default async function (fastify, opts) {
    fastify.get(
      "/:category",
      { websocket: true },
      async ({ socket }, request) => {
        for (const order of fastify.currentOrders(request.params.category)) {
          socket.send(order);
        }
        for await (const order of fastify.realtimeOrders()) {
          if (socket.readyState >= socket.CLOSING) break;
          socket.send(order);
        }
      }
    );
  } 


  