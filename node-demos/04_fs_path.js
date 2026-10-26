// ==============================================================================
// Lecture 33: File System (fs) & Path Modules
// File: node-demos/04_fs_path.js
// 
// HOW TO RUN:
//   node node-demos/04_fs_path.js
// 
// PURPOSE FOR VIVA:
//   - 'path' provides utilities for cross-platform file path resolution (Windows \ vs POSIX /).
//   - 'fs' provides both synchronous (blocking) and asynchronous (non-blocking Promise-based) methods.
// ==============================================================================

const path = require('path');
const fs = require('fs').promises; // Use Promise-based fs for modern async code

console.log("=== Part 1: Path Module Utilities ===");

// 1. path.join: Joins segments using the operating system's specific separator
const filePath = path.join(__dirname, '..', 'data', 'tasks.json');
console.log("path.join result:", filePath);

// 2. path.resolve: Resolves an absolute path
console.log("path.resolve result:", path.resolve('data', 'tasks.json'));

// 3. path.extname: Extracts file extension
console.log("File extension:", path.extname(filePath)); // .json

// 4. path.basename: Returns filename
console.log("Base filename:", path.basename(filePath)); // tasks.json

// 5. path.dirname: Returns directory name
console.log("Directory:", path.dirname(filePath));

console.log("\n=== Part 2: Asynchronous File Operations (fs.promises) ===");

async function demonstrateFs() {
    const demoFile = path.join(__dirname, 'demo_sample.txt');
    
    try {
        // 1. Write file asynchronously
        console.log("1. Writing file asynchronously...");
        await fs.writeFile(demoFile, "TaskFlow - Node.js File System Demonstration\nCreated asynchronously via fs.promises.", 'utf-8');
        console.log("✓ File written successfully!");

        // 2. Append to file
        console.log("2. Appending data to file...");
        await fs.appendFile(demoFile, "\nAppended line: Verified non-blocking write.", 'utf-8');
        console.log("✓ Data appended!");

        // 3. Read file asynchronously
        console.log("3. Reading file contents...");
        const contents = await fs.readFile(demoFile, 'utf-8');
        console.log("File Content:\n---\n" + contents + "\n---");

        // 4. File stats (size, modified time)
        const stats = await fs.stat(demoFile);
        console.log(`File Size: ${stats.size} bytes`);
        console.log(`Created Time: ${stats.birthtime}`);

        // 5. Clean up demo file
        await fs.unlink(demoFile);
        console.log("✓ Demo file cleaned up (deleted) successfully.");
    } catch (error) {
        console.error("❌ fs operation error:", error.message);
    }
}

demonstrateFs();
