const { spawn } = require('child_process');
const stabilize = require('./stabilize-env');

// Pass through all arguments to next dev
const args = ['dev', ...process.argv.slice(2)];
const dev = spawn('next', args, { stdio: 'inherit', shell: true });

function cleanup() {
  // Small delay to ensure Next.js has finished any final writes to next-env.d.ts
  setTimeout(() => {
    stabilize();
    process.exit();
  }, 500);
}

// Cleanup on termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

dev.on('exit', (code) => {
  cleanup();
});
