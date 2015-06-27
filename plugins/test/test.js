var methods = require("../../methods");
var debug = require("../../debug");

var test = {};

test.parseTextMsg = function(message)
{
	if(message.text == "/test" || message.text == "/test@"+test._globals.me.username)
	{
		methods.sendMessage(message.chat.id, "Your test worked perfectly!", null, message.message_id);
	}
}

test._globals = {};
test.setGlobals = function(globals)
{
	this._globals = globals;
}

test.properties = {
    name: "Test",
    friendlyName: "test",
    description: "Most simple plugin ever",
    usage: "Type /test to reply with a test message",
    version: "1.0.0"
}

module.exports = test;