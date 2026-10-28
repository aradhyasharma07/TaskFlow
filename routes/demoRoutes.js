//GUNIT KI DOCUMENTS




const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const path = require('path');

// Explicit allowlist of permissible demo scripts
const ALLOWLISTED_DEMOS = {
    'event-loop': path.join(__dirname, '..', 'node-demos', '01_event_loop.js'),
    'streams': path.join(__dirname, '..', 'node-demos', '02_buffers_streams.js'),
    'emitter': path.join(__dirname, '..', 'node-demos', '03_event_emitter.js'),
    'fs': path.join(__dirname, '..', 'node-demos', '04_fs_path.js'),
    'modules': path.join(__dirname, '..', 'node-demos', '06_es_module.mjs')
};

router.get('/node/:topic', (req, res) => {
    const topic = req.params.topic;

    // Strict validation: Only exact allowlist keys allowed
    if (!Object.prototype.hasOwnProperty.call(ALLOWLISTED_DEMOS, topic)) {
        return res.status(404).json({
            success: false,
            error: `Unauthorized demo topic: '${topic}'. Permitted: ${Object.keys(ALLOWLISTED_DEMOS).join(', ')}`
        });
    }

    const scriptPath = ALLOWLISTED_DEMOS[topic];

    // Safely execute using execFile with no shell interpolation
    execFile(process.execPath, [scriptPath], { timeout: 5000, shell: false }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
                stderr
            });
        }

        res.json({
            success: true,
            topic: topic,
            command: `node node-demos/${path.basename(scriptPath)}`,
            output: stdout
        });
    });
});

module.exports = router;