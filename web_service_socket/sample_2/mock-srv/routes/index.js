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

export default async function (fastify) {
  fastify.get("/", async function (request, reply) {
    return data;
  })}
