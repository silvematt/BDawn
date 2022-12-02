const http = require("http");
const url = require("url");

const routing = require("./Routing")
const mymodule = require("./mymod");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(routing.HandleRequest);

server.listen(port, hostname, () => 
{
  console.log(`Server running at http://${hostname}:${port}/`);
});