var methods = require("../../methods");
var debug = require("../../debug");

var version = {};

version.parseTextMsg = function(message)
{
	if(message.text == "/version")
	{
		var formatted_version = "";
		formatted_version += "nodegram-bot\n";
		formatted_version += "Version: "+this._globals.nodegramV+"\n";
		formatted_version += this._globals.githubUrl
		methods.sendMessage(message.chat.id, formatted_version, null, message.message_id);
	}
}

version._globals = {};
version.setGlobals = function(globals)
{
	this._globals = globals;
}

module.exports = version;