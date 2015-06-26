var methods = require("../../methods");
var debug = require("../../debug");

var test = {};

test.parseTextMsg = function(message)
{
	if(message.text == "/test")
	{
		methods.sendMessage(message.chat.id, "Your test worked perfectly!", null, message.message_id);
	}
}

module.exports = test;