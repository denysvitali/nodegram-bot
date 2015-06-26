var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

var fs = require('fs')
var settings = JSON.parse(fs.readFileSync(__dirname + "/../settings.json"));
var debug = require('../debug');

function Me()
{
    this.id = 0;
    this.name = "Bot name";
    this.username = "bot";

    this.getInfos = function()
    {
        var scope = this;
        return request(
            {
                url: settings.api + "/bot" + settings.token + "/getMe",
                json: true
            })
            .then(function(contents)
            {
                var json = contents[1];
                if(json.ok)
                {
                    scope.id = json.result.id;
                    scope.name = json.result.first_name;
                    scope.username = json.result.username;
                }
            })
            .catch(function(e)
            {
                debug.err(e)
            });
    }
}
module.exports = Me;