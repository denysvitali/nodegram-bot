var Promise = require("bluebird");
var getIP =  Promise.promisify(require('external-ip')());
var utils = {};

utils.generateHash = function()
{
    //Credit to @Blender: http://stackoverflow.com/a/12635919
    String.prototype.pick = function(min, max)
    {
        var n, chars = '';

        if (typeof max === 'undefined')
        {
            n = min;
        }
        else
        {
            n = min + Math.floor(Math.random() * (max - min));
        }

        for (var i = 0; i < n; i++)
        {
            chars += this.charAt(Math.floor(Math.random() * this.length));
        }

        return chars;
    };


    // Credit to @Christoph: http://stackoverflow.com/a/962890/464744
    String.prototype.shuffle = function()
    {
        var array = this.split('');
        var tmp, current, top = array.length;

        if (top)
            while (--top)
            {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }

        return array.join('');
    };

    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    var all = lowercase + uppercase + numbers;

    var hash = '';
    hash += all.pick(14, 27);
    return hash.shuffle();
}

utils.getIp = function()
{
    return getIP();
}

module.exports = utils;