# Project Index
## Web Socket/Service

- [Simple Webservice](web_service_socket/sample_1/SimpleWebservice.md)
- [FastifyAPI Scaffolder](web_service_socket/sample_2/FastifyAPI.md)
- [Oneway Realtime](web_service_socket/sample_3/OnewayRealtime.md)
- [Biolateral Realtime](web_service_socket/sample_4/BioRealtime.md)

# NodeJS core architecture

## Event demultiplexing
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

`Let’s see what’s happening in the preceding pseudocode:`

The resources are added to a data structure, associating each one of them with a specific operation (in our example, a read operation).

The demultiplexer is set up with the group of resources to be watched. The call to demultiplexer.watch() is synchronous and blocks until any of the watched resources are ready for read. When this occurs, the event demultiplexer returns from the call and a new set of events is available to be processed.

Each event returned by the event demultiplexer is processed. At this point, the resource associated with each event is guaranteed to be ready to read and to not block during the operation. When all the events are processed, the flow will block again on the event demultiplexer until new events are again available to be processed. This is called the event loop.


## Reactor pattern
We can now introduce the reactor pattern, which is a specialization of the algorithms presented in the previous sections. The main idea behind the reactor pattern is to have a handler associated with each I/O operation. A handler in Node.js is represented by a callback (or cb for short) function.
Each operating system has its own interface for the event demultiplexer: epoll on Linux, kqueue on macOS, and the I/O completion port (IOCP) API on Windows. 

![Reactor](/assets/images/reactor.jpg)

![Nodejs Cycle](/assets/images/nodejs_cycle.png)

Here’s what happens in an application using the reactor pattern:

- [x] The application generates a new I/O operation by submitting a request to the Event Demultiplexer. The application also specifies a handler, which is invoked when the operation completes. Submitting a new request to the Event Demultiplexer is a non-blocking call and it immediately returns control to the application.

- [x] When a set of I/O operations completes, the Event Demultiplexer pushes a set of corresponding events into the Event Queue.
- [x] At this point, the Event Loop iterates over the items of the Event Queue.

> For each event, the associated handler is invoked.

- [x] The handler, which is part of the application code, gives back control to the Event Loop when its execution completes (5a). While the handler executes, it can request new asynchronous operations (5b), causing new items to be added to the Event Demultiplexer (1).
- [x] When all the items in the Event Queue are processed, the Event Loop blocks again on the Event Demultiplexer, which then triggers another cycle when a new event is available.


> Note: A Node.js application will exit when there are no more pending operations in the event demultiplexer, and no more events to be processed inside the event queue.

`We can now define the pattern at the heart of Node.js:`

Note: The reactor pattern handles I/O by blocking until new events are available from a set of observed resources, and then reacts by dispatching each event to an associated handler.

# Libuv
*All these inconsistencies across and within the different operating systems required a higher-level abstraction to be built for the event demultiplexer*. This is exactly why the Node.js core team created a native library called libuv, with the objective to make Node.js compatible with all the major operating systems and normalize the non-blocking behavior of the different types of resource. libuv represents the **low-level I/O engine of Node.js** and is probably the most important component that Node.js is built on.

## The recipe for Node.js
Other than abstracting the underlying system calls, libuv also implements the reactor pattern, therefore providing an API for creating event loops, managing the event queue, running asynchronous I/O operations, and queuing other types of tasks.

- [x] A set of bindings responsible for wrapping and exposing libuv and other low-level functionalities to JavaScript.
- [x] V8, the JavaScript engine originally developed by Google for the Chrome browser. This is one of the reasons why Node.js is so fast and efficient. V8 is acclaimed for its revolutionary design, its speed, and its efficient memory management.
- [x] A core JavaScript library that implements the high-level Node.js API.

![Core Components](/assets/images/nodejs.jpg)

---

# NodeJS extra features
## Stream
There are four types of streams:

- [x] Readable
- [x] Writable
- [x] Duplex : Readable + Writable
- [x] Transform: Manipulate the data while it is being read/written

## REPL
REPL stands for Read Eval Print Loop and it represents a computer environment like a window console or unix/linux shell where a command is entered, and system responds with an output.

`REPL performs the following desired tasks:`

- [x] Read - Reads user's input, parses the input into JavaScript data-structure and stores in memory.
- [x] Eval - Takes and evaluates the data structure.
- [x] Print- Prints the result  
- [x] Loop - Loops the above command until user presses ctrl-c twice 

## Control Flow
Control Flow function is a piece of code which runs in between several asynchronous function calls.

`The Control Flow does the following jobs:` 

- [x] Control the order of execution.
- [x] Collect data
- [x] Limit concurrency
- [x] Call the next step in a program.

![Fork Spawn](/assets/images/fork_spawn.png)

## Buffer class
Buffer class stores raw data similar to an array of integers but corresponds to a raw memory allocation outside the V8 heap.
Buffer class is used because pure JavaScript is not compatible with binary data.

## Piping

Piping is a mechanism to connect output of one stream to another stream.
It is normally used to get data from one stream and to pass output of that stream to another stream.

## File access

- [x] r- Open file for reading. An exception occurs if the file does not exist.
- [x] r+ Open file for reading and writing. An exception occurs if the file does not exist.
- [x] w- Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
- [x] w+ - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
- [x] a- Open file for appending. The file is created if it does not exist.
- [x] a+ Open file for reading & appending. The file is created if it does not exist.


## Schedule code

Timers module is provided by Node.js which contains various functions for executing the code after a specified period of time. Various functions that are provided by this module:

- [x] setTimeout/clearTimeout - Used to schedule code execution after a designated amount of milliseconds.
- [x] setInterval/clearInterval - Used to execute a block of code multiple times.
- [x] setImmediate/clearImmediate - Used to execute code at the end of the current event loop cycle.

## Environment

```bash
export NODE_ENV= production
```