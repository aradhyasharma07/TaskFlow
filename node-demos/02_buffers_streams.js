// ==============================================================================
// Lecture 33: Buffers & Streams in Node.js
// File: node-demos/02_buffers_streams.js
// 
// HOW TO RUN:
//   node node-demos/02_buffers_streams.js
// 
// PURPOSE FOR VIVA:
//   - A Buffer is a fixed-size chunk of raw binary memory allocated outside V8 heap.
//   - A Stream is an abstract interface for handling streaming data chunk by chunk,
//     conserving memory instead of loading the whole file into RAM at once.
// ==============================================================================

const fs = require('fs');
const path = require('path');

console.log("=== Part 1: Node.js Buffers Demo ===");

// 1. Allocate a Buffer of 10 bytes (initialized with zeros)
const buf1 = Buffer.alloc(10);
console.log("Allocated Buffer (10 bytes):", buf1);

// 2. Create a Buffer from a String (UTF-8 encoding)
const message = "TaskFlow Student System";
const buf2 = Buffer.from(message, 'utf-8');
console.log(`Buffer from "${message}":`, buf2);
console.log("Buffer length in bytes:", buf2.length);
console.log("Converted back to string:", buf2.toString('utf-8'));
console.log("Hex representation:", buf2.toString('hex'));

console.log("\n=== Part 2: Node.js Streams & Pipe Demo ===");

const demoDir = path.join(__dirname, 'temp_streams');
if (!fs.existsSync(demoDir)) fs.mkdirSync(demoDir);

const sourceFilePath = path.join(demoDir, 'source.txt');
const destFilePath = path.join(demoDir, 'destination.txt');

// Create sample data for streaming
const sampleData = "Stream Chunk 1: TaskFlow Lecture 33 Streams.\n" +
                   "Stream Chunk 2: Efficient data piping without RAM spikes.\n" +
                   "Stream Chunk 3: End of Stream Demonstration.\n";

fs.writeFileSync(sourceFilePath, sampleData, 'utf-8');

// Create Readable Stream
const readableStream = fs.createReadStream(sourceFilePath, { encoding: 'utf-8', highWaterMark: 32 });

// Create Writable Stream
const writableStream = fs.createWriteStream(destFilePath);

// Listen to stream events: 'data', 'end', 'error'
readableStream.on('data', (chunk) => {
    console.log(`[Stream Event 'data'] Received chunk (${chunk.length} characters):\n  --> "${chunk.trim()}"`);
});

readableStream.on('end', () => {
    console.log("[Stream Event 'end'] All data successfully read from stream!");
    
    // Demonstrate Pipe: readable.pipe(writable)
    console.log("Now piping source into destination file via .pipe()...");
    const readForPipe = fs.createReadStream(sourceFilePath);
    const writeForPipe = fs.createWriteStream(destFilePath);
    
    readForPipe.pipe(writeForPipe);
    
    writeForPipe.on('finish', () => {
        console.log("✓ Pipe complete! Destination file written successfully.");
        // Cleanup demo files
        fs.unlinkSync(sourceFilePath);
        fs.unlinkSync(destFilePath);
        fs.rmdirSync(demoDir);
        console.log("✓ Cleaned up temporary stream files.");
    });
});
