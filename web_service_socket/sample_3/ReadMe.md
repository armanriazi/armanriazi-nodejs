# Towards Realtime one directional to bio (server to client)

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

An async function produces a promise. A generator function produces an iterable. This is an object with a next function that can be called to make the function progress to the next yield keyword in that function and returns the value of whatever is yielded. An iterable can be looped over with a for of loop. An async generator function is a combination of both async functions and generator functions, and it is useful for asynchronously producing continuous state changes. It returns an async iterable, which is an object with a next function that returns a promise which resolves to the value of whatever is yielded from the async function generator. Async iterables can be looped over with a for await of loop. See [JavaScript Demo: Statement - For Await...Of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#iterating_over_async_generators) for more insight. 

The upshot is we can use the async generator function here to output a randomly incremented total for a randomly selected order every 1500 milliseconds. We do this by awaiting the timeout function, passing 1500 to it at the end of the infinite while loop. Just above that, we yield a stringified object containing the product ID and the new total. We also keep a running total by modifying the orders object each time; this means **we can provide consistent totals for each product to every WebSocket client.**

Since each item total is randomly incremented, we need a way for a client to get all the current order totals so it can populate the initial values (instead of each order count staging "pending" until it's randomly incremented).

---

The currentOrders generator function takes a category name and maps it to an ID prefix. Then it gets all products in the orders object with that ID prefix, loops over them, and yields a serialized object containing the ID and order total for that ID. By spreading the object in the orders[id] object (...orders[id]) into the object being stringified, every key in the orders[id] object is copied. Currently, there is only a totals key, but the objects in the order object could be extended, and any extra properties would also be in the JSON string that's yielded from currentOrders. If, for any reason, an unknown category was passed to currentOrders it would have no corresponding ID prefix and, therefore would finish without yielding any values at all.

For more information on non-async generators, see the following article, [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).


### Route

We have updated the async handler function so that it uses a for of loop to iterate through each stringified object yielded from fastify.currentOrders based on the requested category. Each of these stringified objects is sent to the client over the WebSocket. Under the for of loop, we have also added a for await of loop to asynchronously iterate over the real time orders, and send each asynchronous yielded stringified object to the client. This results in the client side updating one product item's orders approximately every 1.5 seconds.


## ReCap

To explain the full flow: when the Electronics category is selected, this triggers the input event listener of the category element. This, in turn, calls the realtimeOrders function passing electronics as the argument. The realtimeOrders function creates a WebSocket connection to ws://localhost:3000/orders/electronics, which triggers the WebSocket route handler in mock-srv/routes/orders/index.mjs on the server side. 

All the current order totals are looped over and sent from the server to the client over the WebSocket connection in the form of a stringified JSON object containing id and total properties. The client side is listening for WebSocket messages, so each time a stringified object is received by the client it is parsed and the id and total values are extracted. The id is used to get a DOM reference to the corresponding <product-item> custom element for that product. The order slot value within the <product-item> element is then updated to the latest total. Meanwhile the server is asynchronously iterating values that are yielded from fastify.realtimeOrders. Every 1500 milliseconds a stringified object containing a product item ID and an updated total is yielded. It is then sent to the client, which updates the order slot of the corresponding <product-item> element. The async iterable returned from fastify.realtimeOrders is never done, so this loop continues until the socket has closed (when socket.readyState is greater than socket.CLOSING the socket has closed), at which point the break keyword is used to terminate the asynchronous loop.

Now if we start our server (npm run dev in the mock-srv folder) and serve the static assets (npm run static in the project root), then navigate to the http://localhost:5050 and select any category we should see the orders of all items frequently updating. If we add another item, this should also begin receiving order updates, with the orders initially set to 0.

We have now implemented real-time updates with mock data from server to client. In the next section, we will look at bidirectional communication by extending our server to listen for and respond to real-time messages from the client.


## Function of realtimeOrders 

Now there is only ever one socket. This client-side code should also include socket reconnection logic in a production approach. However, our client-side code is to support the understanding of server-side aspects, so we are keeping it as minimally viable as possible regarding learning purposes.

The first time a category is selected via the web app, the WebSocket connection is still established to a particular endpoint that corresponds to the selected category. The next time that category is selected, a stringified object containing a cmd property set to 'update-category' and a payload property set to the newly selected category is sent over the real-time connection.

We have added two functions: monitorMessages and sendCurrentOrders. The sendCurrentOrders function just factors out the for of loop that was in the body of the route handler function because the same logic is now used in the route handler function and in the monitorMessages function. The monitorMessages function accepts the socket instance as an argument and attaches a message listener to it. The listener function will be called every time the client calls the send method of the client-side WebSocket instance. The incoming data is parsed, and the cmd and payload properties are extracted. If the cmd argument is valid (which in this case means if it is the string 'update-category') then the sendCurrentOrders function is called with the value of payload.category. As discussed in the prior section, any unrecognized categories will not cause any issues in fastify.currentOrders generator function, it will just end without yielding any values (so the for of loop will end with zero iterations). The monitorMessages function does guard against corrupt JSON data coming over the WebSocket by wrapping the JSON.parse call in a try/catch block. In the event of an error, we use Fastify's built-in logger to output that error. This could be useful in debugging any problems if the web app is to be further extended in the future.