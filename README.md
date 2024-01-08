
# Event demultiplexing
Is the best method for I/O bounds than Non-blocking/Blockhing I/O.
Some handler data in one thread and lower Idle times.

```js
watchedList.add(socketA, FOR_READ);                           // (1)
watchedList.add(fileB, FOR_READ);
while ((events = demultiplexer.watch(watchedList))) {         // (2)
  // event loop
  for (event of events) {                                     // (3)
    // This read will never block and will always return data
    data = event.resource.read();
    if (data === RESOURCE_CLOSED) {
      // the resource was closed, remove it from the watched list
      demultiplexer.unwatch(event.resource);
    } else {
      // some actual data was received, process it
      consumeData(data);
    }
  }
}
```

Let’s see what’s happening in the preceding pseudocode:

    The resources are added to a data structure, associating each one of them with a specific operation (in our example, a read operation).

    The demultiplexer is set up with the group of resources to be watched. The call to demultiplexer.watch() is synchronous and blocks until any of the watched resources are ready for read. When this occurs, the event demultiplexer returns from the call and a new set of events is available to be processed.

    Each event returned by the event demultiplexer is processed. At this point, the resource associated with each event is guaranteed to be ready to read and to not block during the operation. When all the events are processed, the flow will block again on the event demultiplexer until new events are again available to be processed. This is called the event loop.


# Reactor pattern
We can now introduce the reactor pattern, which is a specialization of the algorithms presented in the previous sections. The main idea behind the reactor pattern is to have a handler associated with each I/O operation. A handler in Node.js is represented by a callback (or cb for short) function.
Each operating system has its own interface for the event demultiplexer: epoll on Linux, kqueue on macOS, and the I/O completion port (IOCP) API on Windows. 

[reactor](~/nodejs/reactor.jpg)

Here’s what happens in an application using the reactor pattern:

    The application generates a new I/O operation by submitting a request to the Event Demultiplexer. The application also specifies a handler, which is invoked when the operation completes. Submitting a new request to the Event Demultiplexer is a non-blocking call and it immediately returns control to the application.

    When a set of I/O operations completes, the Event Demultiplexer pushes a set of corresponding events into the Event Queue.

    At this point, the Event Loop iterates over the items of the Event Queue.

    For each event, the associated handler is invoked.

    The handler, which is part of the application code, gives back control to the Event Loop when its execution completes (5a). While the handler executes, it can request new asynchronous operations (5b), causing new items to be added to the Event Demultiplexer (1).

    When all the items in the Event Queue are processed, the Event Loop blocks again on the Event Demultiplexer, which then triggers another cycle when a new event is available.


> Note: A Node.js application will exit when there are no more pending operations in the event demultiplexer, and no more events to be processed inside the event queue.

We can now define the pattern at the heart of Node.js:

> Note: The reactor pattern handles I/O by blocking until new events are available from a set of observed resources, and then reacts by dispatching each event to an associated handler.

# Libuv
*All these inconsistencies across and within the different operating systems required a higher-level abstraction to be built for the event demultiplexer*. This is exactly why the Node.js core team created a native library called libuv, with the objective to make Node.js compatible with all the major operating systems and normalize the non-blocking behavior of the different types of resource. libuv represents the **low-level I/O engine of Node.js** and is probably the most important component that Node.js is built on.

## The recipe for Node.js

Other than abstracting the underlying system calls, libuv also implements the reactor pattern, therefore providing an API for creating event loops, managing the event queue, running asynchronous I/O operations, and queuing other types of tasks.

• A set of bindings responsible for wrapping and exposing libuv and other low-level functionalities to JavaScript.

• V8, the JavaScript engine originally developed by Google for the Chrome browser. This is one of the reasons why Node.js is so fast and efficient. V8 is acclaimed for its revolutionary design, its speed, and its efficient memory management.

• A core JavaScript library that implements the high-level Node.js API.

[Core Components](~/nodejs/nodejs.jpg)