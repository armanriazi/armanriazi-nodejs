"use strict";
import fastify from "fastify";
import fp from "fastify-plugin";
import { PassThrough } from "node:stream"; 


const orders = {
  A1: { total: 3 },
  A2: { total: 7 },
  B1: { total: 101 },
};

const catToPrefix = {
  electronics: "A",
  confectionery: "B",
};


/*
Node.js streams represent continuous data and have quite a vast API. There are readable streams, writable streams, and hybrid streams that are both readable and writable (duplex, transform, and passthrough streams). One very useful characteristic of readable streams is they are async iterables, which means we can use the same for await of loops 
*/
 // Create a stream of orders
 const orderStream = new PassThrough({ objectMode: true });

 // Simulate real-time orders
 async function* realtimeOrdersSimulator() {
   for await (const { id, total } of orderStream) {
     yield JSON.stringify({ id, total });
   }
 } 
 /// we check that the incoming amount is an integer using Number.isInteger. This is useful in also weeding out NaN, Infinity and -Infinity which would all have a type of number. It does not enforce positive numbers, so it's possible to reduce the order count as well with this implementation. If the amount value is not an integer an error is thrown with a 400 status code
 // Add order to stream and update total
 function addOrder(id, amount) {
  if (orders.hasOwnProperty(id) === false) {
    const err = new Error(`Order ${id} not found`);
    err.status = 404;
    throw err;
  }
  if (Number.isInteger(amount) === false) {
    const err = new Error('Supplied amount must be an integer');
    err.status = 400;
    throw err;
  }
  orders[id].total += amount;
  const { total } = orders[id]
  console.log("Adding order: %o", { id, total });
  orderStream.write({ id, total });
} 
//This time we will add a synchronous generator function:
function* currentOrders(category) {
  const idPrefix = catToPrefix[category];
  if (!idPrefix) return;
  const ids = Object.keys(orders).filter((id) => id[0] === idPrefix);
  for (const id of ids) {
    yield JSON.stringify({ id, ...orders[id] });
  }
}



const calculateID = (idPrefix, data) => {
  const sorted = [...new Set(data.map(({ id }) => id))];
  const next = Number(sorted.pop().slice(1)) + 1;
  return `${idPrefix}${next}`;
};

export default fp(async function (fastify, opts) {
  fastify.decorate("currentOrders", currentOrders);
  fastify.decorate("realtimeOrders", realtimeOrdersSimulator);
  fastify.decorate("addOrder", addOrder);
  fastify.decorate("mockDataInsert", function (request, category, data) {
    const idPrefix = catToPrefix[category];
    const id = calculateID(idPrefix, data);
    data.push({ id, ...request.body });
    return data
  });
});