const url = require("url");
const mysql = require("mysql");
const fs  = require("fs");

const auth = require("./Auth");

module.exports = 
{
    HandleRequest: function(req, res)
    {
        var path = url.parse(req.url).pathname;

        switch(path)
        {
            // Serve HTML
            case "/cLogin":
                res.writeHead(200, { 'content-type': 'text/html' })
                fs.createReadStream('../client/login.html').pipe(res);
                break;

            // APIs
            case "/login":
                auth.LoginFunc(req,res);
                break;

            default:
                InvalidRoute(req, res);
                break;
        }
    }
};

function InvalidRoute(req, res)
{
    res.writeHead(404);
    res.write("Invalid Route");
    res.end();
}