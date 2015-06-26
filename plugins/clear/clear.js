var methods = require("../../methods");
var debug = require("../../debug");

var clear = {};

clear.parseTextMsg = function(message)
{
    if (message.text == "/clear")
    {
        var text = "";
        for (i = 0; i < 50; i++)
        {
            text += '\u200d' + "\n";
        }
        methods.sendMessage(message.chat.id, text);
    }
}

clear.usage = function()
{
    var msg = "";
    msg += "This plugins clears the chat\n"
    msg += "Type /clear to invoke Mr.Clean"
    return msg;
}	


module.exports = clear;