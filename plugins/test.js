var test = {};

test.parseTextMsg = function(message)
{
	console.log("Parsing message from plugin!");
	console.log(message.text);
}

module.exports = test;