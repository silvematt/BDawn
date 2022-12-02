const http = require("http");
const qs = require("querystring");
var util = require('util');

module.exports = 
{
    LoginFunc : function(req, res)
    {
        if(req.method == "POST")
        {
            var body = [];

            req.on('data', function(chunk)
            {
                body.push(chunk);
            });

            req.on('end', function()
            {
                const data = Buffer.concat(body);
                const post = qs.parse(data.toString());
                
                console.log(post['user']);
                console.log(post['password']);
            })
        }
        else
        {
            res.writeHead(200);
            res.write("Default");
            res.end();
        }
    }
}