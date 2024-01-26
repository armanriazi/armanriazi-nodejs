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


JavaScript is an asynchronous single-threaded language, it can only do one thing at a time because it has one call stack, this call stack is present in the JS engine and all the code of the JS is executed in the call stack. Node.js event loop architecture is single threaded so it can only perform one task at a time. For each application, there is only one thread so all the users accessing to your Node.js application,500 users or 5 million users use the same thread. So if user Adam makes a request to your Node.js app for a synchronous code and then user Mike also makes a request for a synchronous code,user Mike has to wait until Node.js processes user Adam's request. This means if you have a synchronous function in your code that takes 1 second to run, the second user who makes a request has to wait 2 seconds, and the third user,3 seconds, and so on. This is very bad. To avoid this problem we can use asynchronous code for the tasks that will take time to finish in your code. Node.js internally uses a library called! Libuv which handles operating system-related tasks. Like Input/Output tasks, networking etc. Ukuv sets a thread pool of four threads by default to perform OS-related tasks by utilizing the power of all the CPU cores. So if you have a 4-core CPU, each thread from the pool is assigned to every core so one thread for every core. We can change the number of threads in the libuv thread pool. 

## Call stack
Call stack is a section in memory where function calls are stored and synchronous functions are executed. Whenever we call a sync function, the function gets added onto the call stack where it is executed. All the code in JS is executed in the call stack so we need to put the callback functions of async functions into the call stack and that is what the event loop does for us. 

## Event loop 
It checks the call stack and the callback Queue, if the call stack is empty and there is/are callback functions in the Callback queue, event loop pushes those callback functions in the callback queue to the call stack where the callback functions will run. 


## Reactor pattern
We can now introduce the reactor pattern, which is a specialization of the algorithms presented in the previous sections. The main idea behind the reactor pattern is to have a handler associated with each I/O operation. A handler in Node.js is represented by a callback (or cb for short) function.
Each operating system has its own interface for the event demultiplexer: epoll on Linux, kqueue on macOS, and the I/O completion port (IOCP) API on Windows. 

![Reactor](/assets/images/reactor.jpg)

![Nodejs Cycle](/assets/images/nodejs_cycle.png)

![Nodejs Cycle 2](/assets/images/nodejs_cir.png)

![Nodejs Gif](/assets/images/nodejs_gif.gif)

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


## NodeJS Process

### Thread 
thread is a worker lives in a process, thread can execute JavaScript code , it consumes fewer resources. 
**Threads do not have their own memory**. Threads can share process's memory and share data with each other. 

### Task
It is the module(.js file) where the code is run as a thread. 

#### Process
A program becomes a process when launched into memory, process means **a program is in execution**, it can **contain multiple threads** all executing at the same time. Process consume more resources than a thread.***Process doesn't share data.** 

### Process vs worker
A process has its own memory and resources. A worker uses the same memory and resources of the process from which it is created. 

### Application
It is the main thread in a process.

A module: It is a .js file.

Node.js implements the **libuv library that provides four extra threads(can be changed)** to a Node.js process. In addition to those four threads, the V8 engine provides two threads for handling automatic garbage collection. As a result total number of threads in a process is seven, **one main thread, four Node.js threads, aid(GC) two V8 threads.** 
The I/O operations make use of Node.js hidden threads. Async functions or promises do not provide any mechanism to make CPU-bound tasks non blocking, you need to use worker_threads module to offload a CPU-bound task into separate thread. So, **do not use worker_threads for I/O.** worker_threads use to operations in **parallel**.

`Can Node.js process heavy data that requires high CPU usage?If yes, How is this done?`

Node.js uses one thread to run the code and has a thread pool(libuv) to handle the 10 operations such as network and database calls. This architecture works fine when there are lots of tasks that require a short process. But if there is heavy data processing as a result of high CPU usage such as running a long while loop or calculating the Fibonacci of a big number is a problem in the main thread. Why? Because Node.js only uses a single thread of your CPU no matter how many cores/threads you have. So it is a good practice to move the CPU-intensive task to another thread or process so that the main thread is not blocked. There are multiple ways to achieve this: 

- [x] Splitting up tasks with setImmediate
- [x] Spawning a child process
- [x] Using cluster
- [x] Using worker threads 

### I/O (Input-output) 

refers to reading/ writing files, talking to databases, or network operations. Node.js is designed for I/O operations which for the most part does not block the main thread. 
The problem: Doing Input-Output operations like responding to an HTTP request or talking to a database or other servers are what Node.js is good at because Node.js is single threaded which makes it possible to handle many requests quickly with low system resource consumption. *If we run heavy CPU-bound operations in the context of a web application, the single thread of node will be blocked so the web server will not be able to respond to any request* because it is busy running a heavy calculation or a huge while loop or image processing, compression algorithms, heavy crypto operations, matrix multiplications, etc.. So CPU-intensive tasks are blocking the main thread. 

### What is child process and cluster used for?

`Demonstrate how "fork" function is used in child_process and cluster`

child_process and cluster modules are used to create new processes. **The child_process has 3 essential functions.** 

- [x] Spawn: It **runs a command in a new process**. The data that gets returned after running a command will be in the form of **streams**. There is no limit in the size of the response because it is **sent back in chunks**.
- [x] Exec: Exec also **runs a command in a process** but the response is in the form of **buffer**. If the size of the response after running a command is greater than the buffer, your application will crash. **A shell is spawned and command is executed.**
- [x] Fork: Is a special case of spawn. **Spawns a new Node.js process** like any of the previous methods. The communication **channel is established to the child process** when using fork, so *we can use a function called send on the forked process* to **exchange messages between the parent and the forked processes.** 


### What is a process

A process is an instance of the program you run on a system. When you open up a browser, for example, a process is created for that program. When you run node app.js, a Node.js process is created. Each process will have its own memory and resources. You can access the process information by using the process object. This object has details related to the application, OS, and much more. 

### Worker threads
module enables the use of threads that execute JavaScript in parallel. Worker threads have isolated contexts. They exchange information with the main thread using PostMessage which allows the worker thread to communicate with the main thread. Worker threads live in the same process so they use a lot **less memory than a process cluster setup**. Worker threads could **utilize multiple CPU cores in a single Node.js process**. Use workerData to pass data to the worker thread when creating a worker. 

worker_threads can **share memory unlike child_process or cluster(data is cloned to another process)**. We can also split expensive requests to parts that are run in parallel in separate worker threads and thus complete the request faster. When you transfer data from a worker thread to the main thread, the data gets copied. **To prevent copying of the data, you have to use either ArrayBuffer or SharedArrayBuffer for threads to share the same memory.**

Usecase of workerpool npm package are also welcome.

to run a long-term processes or benchmark of a loop of worker threads, we use follow commands:

```bash
conda activate base
autocannon -c 5 http://localhost:5000/heavy
```

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