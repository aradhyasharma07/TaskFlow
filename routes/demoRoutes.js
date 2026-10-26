// ==============================================================================
// CHO FA2 Unified Dashboard - Node.js Demo Execution Endpoint
// File: routes/demoRoutes.js
// 
// PURPOSE:
//   Allows the unified web dashboard to run Node.js fundamental scripts
//   (Lectures 31-36) and display real execution output live on the page.
// ==============================================================================

const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

const demos = {
    'event-loop': path.join(__dirname, '..', 'node-demos', '01_event_loop.js'),
    'streams': path.join(__dirname, '..', 'node-demos', '02_buffers_streams.js'),
    'emitter': path.join(__dirname, '..', 'node-demos', '03_event_emitter.js'),
    'fs': path.join(__dirname, '..', 'node-demos', '04_fs_path.js'),
    'modules': path.join(__dirname, '..', 'node-demos', '06_es_module.mjs')
};

router.get('/node/:topic', (req, res) => {
    const scriptPath = demos[req.params.topic];

    if (!scriptPath) {
        return res.status(404).json({
            success: false,
            error: `Demo '${req.params.topic}' not found. Available: ${Object.keys(demos).join(', ')}`
        });
    }

    // Execute the Node.js demo script safely
    exec(`node "${scriptPath}"`, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
                stderr
            });
        }

        res.json({
            success: true,
            topic: req.params.topic,
            command: `node node-demos/${path.basename(scriptPath)}`,
            output: stdout
        });
    });
});

module.exports = router;
