const url = require("url");
const mysql = require("mysql");

module.exports = 
{
    HandleRequest: function(req, res)
    {
        res.writeHead(200, {"Content-Type" : "text/plain"});

        var path = url.parse(req.url).pathname;

        switch(path)
        {
            case "/":
                res.writeHead(200);
                res.write("Default");
                res.end();
                break;

            default:
                res.writeHead(404);
                res.write("Invalid Route");
                res.end();
                break;
        }
    }
};