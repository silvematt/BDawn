const url = require("url");
const mysql = require("mysql");

const auth = require("./Auth")

module.exports = 
{
    HandleRequest: function(req, res)
    {
        var path = url.parse(req.url).pathname;

        switch(path)
        {
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