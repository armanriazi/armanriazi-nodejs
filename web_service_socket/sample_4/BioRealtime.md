#  Realtime two directional to bio (server to client)

`Completed bio-directional is sample of 4`

## Server-side WebSocket API 

```bash
 npm install @fastify/websocket
 ```

 ```js
 import websocket from "@fastify/websocket";
```

 ```js
 "use strict";

export default async function (fastify, opts) {
  fastify.get(
    "/:category",
    { websocket: true },
    async ({ socket }, request) => {
      socket.send(JSON.stringify({ id: "A1", total: 3 }));
    }
  )};
```  

### Plugin

Node.js streams represent continuous data and have quite a vast API. There are readable streams, writable streams, and hybrid streams that are both readable and writable (duplex, transform, and passthrough streams). One very useful characteristic of readable streams is they are async iterables, which means we can use the same for await of loops on them that we use in the WebSocket route handler in mock-srv/routes/orders/index.mjs. A Node passthrough stream sends any writes straight to its readable side with no modifications. We can use the PassThrough constructor to create a passthrough stream to represent the continuous flow of orders that can be sent via POST requests to the /orders/{id} route. For more information on Node streams see the following resources:        

Check out:

* [Node.js Documentation](https://nodejs.org/docs/latest-v18.x/api/stream.html)
* ["Stream.PassThrough"](https://nodejs.org/docs/latest-v18.x/api/stream.html#class-streampassthrough).
* ["Streams Compatibility with async Generators and async Iterators"](https://nodejs.org/docs/latest-v18.x/api/stream.html#streams-compatibility-with-async-generators-and-async-iterators).


```js
import { PassThrough } from "node:stream";
// Delete LOC Promisify setTimeout
 // Create a stream of orders
const orderStream = new PassThrough({ objectMode: true });

// Simulate real-time orders
async function* realtimeOrdersSimulator() {
  for await (const { id, total } of orderStream) {
    yield JSON.stringify({ id, total });
  }
} 
```

### Route

The entire "happy-path" for this new feature is as follows:

Once a client establishes a WebSocket connection with the server, it receives all the current order totals for the selected category. Then the for await of loop in the /orders/{category} WebSocket route handler begins waiting for a new serialized order object to be yielded from the async iterable returned from fastify.realtimeOrders. If a valid POST request is then made to /orders/{ID} for a particular ID (one corresponding to a product in the currently selected category within the web app) then the amount indicated in the POST request is added to the order tally for that item.

The async iterable returned from the fastify.realtimeOrders async generator function which is being awaited in the /orders/{category} WebSocket route handler will then yield a serialized object containing the new total and the product ID, which will then be written to the socket instance. The client will receive this serialized object, parse it and then add the new total to the corresponding order slot of the <product-item> element in the web app.

The for await of loop in the /orders/{category} WebSocket route handler will then again be waiting for the next serialized order object to be yielded from the async iterable. The reason the async iterable returned from realtimeOrders yields the new total as a result of the POST request's given amount is that the addOrders function calls the write method of the orderStream passthrough stream. The passthrough stream is itself an async iterable, and the realtimeOrders async generator function is using a for await of loop to asynchronously iterate through each object that is written to orderStream so that it can yield the id and total properties in a serialized object.

## Recap
If the prior explanation is a little unclear, it may become clearer by trying out the functionality and then re-reading it afterward. Let's start our server and web app by running npm run dev in the mock-srv folder and npm run static in the project root. If we navigate to http://localhost:5050 and select the Electronics category, we will see our two products with order counts of 3 and 7, respectively. If we now run the following command in a third terminal window, we can execute a POST request to add Vacuum Cleaner orders:

```bash
node -e "http.request('http://localhost:3000/orders/A1', { method:'POST', headers: {'content-type': 'application/json'}}, (res) => res.pipe(process.stdout)).end(JSON.stringify({amount: 10}))"
```

> Or you can use curl to make the request from the terminal:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"amount": 10}' http://localhost:3000/orders/A1
```

This makes a POST request to http://localhost:3000/orders/A1 with a JSON payload of {"amount": 10}.

This command should output {"ok":true} (which is the HTTP response body) to the terminal and exit. The web app should then look as follows: