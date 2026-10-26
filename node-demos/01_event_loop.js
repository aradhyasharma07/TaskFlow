// ==============================================================================
// Lecture 31-32: Event Loop, Call Stack, Callback Queue, & Non-blocking I/O
// File: node-demos/01_event_loop.js
// 
// HOW TO RUN:
//   node node-demos/01_event_loop.js
// 
// PURPOSE FOR VIVA:
//   Demonstrates the exact execution order of:
//   1. Synchronous code (Call Stack)
//   2. process.nextTick (Microtask queue - highest priority in Node.js)
//   3. Promise.then (Microtask queue)
//   4. setTimeout (Timers phase of Event Loop)
//   5. setImmediate (Check phase of Event Loop)
// ==============================================================================

console.log("=== Node.js Event Loop Execution Order Demonstration ===");

// 1. Synchronous execution enters the Call Stack immediately
console.log("1. [SYNCHRONOUS] Call Stack executes this first.");

// 2. Timers phase: Macrotask scheduled to fire after 0ms
setTimeout(() => {
    console.log("5. [MACROTASK - setTimeout] Timers phase executed.");
}, 0);

// 3. Check phase: Macrotask scheduled for the 'check' phase
setImmediate(() => {
    console.log("6. [MACROTASK - setImmediate] Check phase executed.");
});

// 4. Microtask: process.nextTick runs BEFORE any other microtask or phase transition
process.nextTick(() => {
    console.log("3. [MICROTASK - process.nextTick] Highest priority microtask!");
});

// 5. Microtask: Promise.resolve().then() executes after nextTick microtasks
Promise.resolve().then(() => {
    console.log("4. [MICROTASK - Promise] Microtask queue executed.");
});

// 6. Another synchronous statement to prove call stack finishes first
console.log("2. [SYNCHRONOUS] Call Stack executes this before resolving any async queue.");

// ==============================================================================
// VIVA EXPLANATION:
// Q: What is the V8 engine?
// A: Google's open-source JavaScript engine (written in C++) that compiles JS directly 
//    into native machine code for high performance.
//
// Q: Why is Node.js called "single-threaded non-blocking"?
// A: Node runs user JS on a single thread (Event Loop), but offloads heavy I/O operations 
//    (file system, network) to libuv worker threads, notifying the main thread via callbacks.
// ==============================================================================
