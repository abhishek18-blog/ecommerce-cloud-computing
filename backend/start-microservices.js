import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'Product Service', script: 'productService.js', color: '\x1b[34m' }, // Blue
  { name: 'Order Service', script: 'orderService.js', color: '\x1b[32m' },   // Green
];

services.forEach((service) => {
  console.log(`Starting ${service.name}...`);
  const child = spawn('node', [path.join(__dirname, service.script)], {
    stdio: 'pipe',
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`${service.color}[${service.name}] \x1b[0m${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[31m[${service.name} ERROR] \x1b[0m${data}`);
  });

  child.on('close', (code) => {
    console.log(`\x1b[33m[${service.name}] process exited with code ${code}\x1b[0m`);
  });
});

console.log('All services are starting up...');
