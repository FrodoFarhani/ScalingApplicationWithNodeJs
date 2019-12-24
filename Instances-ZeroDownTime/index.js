const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('this is the master process: ', process.pid);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    console.log(`worker process ${process.pid} had died!`);
    console.log(`Only ${Object.keys(cluster.workers).length} remain!`);
    console.log(`Start new worker.............`);
    cluster.fork();
    console.log(
      `Number of current processes : ${Object.keys(cluster.workers).length}`
    );
  });
} else {
  console.log(`starter worker at pid: ${process.pid}...`);
  http
    .createServer((req, res) => {
      const message = `worker ${process.pid}...`;
      console.log(message);
      res.end(`process: ${process.pid}`);

      if (req.url === '/kill') {
        process.exit();
      } else {
        console.log(`working on request  ${process.pid}`);
      }
    })
    .listen(3000);
}
