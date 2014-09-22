/**
AutoBits.js

autoBits.js is licensed under The MIT license

The MIT License (MIT)

Copyright (c) 2013 ResonanceMultimedia LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@author John Reading - Resonance Multimedia LLC
@version 1.2

autoBits.js is a simple binary (base 2) bitwise library. You can use it to send lots an lots of boolean values in a little package. No dependencies.

@example optimusPrime = autoBits();
@param   {Object}        options   bits, map, debug
*/

var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
};

this.AutoBits = (function() {
    var extend, setPreference, unsetPreference, _max_bits;

    function AutoBits(opts) {
        /**
        * Default configuration.
        *
        * @private
        */
        var defaults;
        defaults = {
            bits: 0,
            map: [],
            debug: false
        };

        /**
        * Options passed in during instantiation.
        */
        this.options = extend({}, defaults, opts);
        this.options.map_ordered_keys = this.getOrderedKeyMap();
    }


    /**
    * Returns whether or not a bit is set in an integer.
    *
    * @this {autoBits}
    * @return {Boolean} Bit is set.
    */
    AutoBits.prototype.isSet = function(name) {
        var bit_pos, mask, num_bits, _options, _ref;
        if (!(name in this.options.map_ordered_keys)) {
            this.log("isSet: " + name + " not found in map");
            return false;
        }
        _ref = this.options.map_ordered_keys[name], bit_pos = _ref[0], num_bits = _ref[1], _options = _ref[2];
        mask = this.getBinaryVariableBits(num_bits) << bit_pos;
        return ((this.options.bits & mask) >> bit_pos) > 0;
    };


    /**
    * Returns the preference option that is set in the bit mask.
    *
    * @this {autoBits}
    * @return The value set for the preference (default is true/false/on/off)
    */
    AutoBits.prototype.getPreference = function(name) {
        var bit_pos, mask, num_bits, value, _options, _ref;
        if (!(name in this.options.map_ordered_keys)) {
            throw new Error("Invalid preference name");
        }
        _ref = this.options.map_ordered_keys[name], bit_pos = _ref[0], num_bits = _ref[1], _options = _ref[2];
        mask = this.getBinaryVariableBits(num_bits) << bit_pos;
        value = (this.options.bits & mask) >> bit_pos;
        return _options[value];
    };


    /**
    * Returns an array of bit values. Length determined by map length.
    *
    * @this {autoBits}
    * @return {Array} Array of bit values.
    */
    AutoBits.prototype.getBooleans = function() {
        var arr, booleanArr, name, _ref;
        booleanArr = [];
        _ref = this.options.map_ordered_keys;
        for (name in _ref) {
            arr = _ref[name];
            booleanArr.push((this.isSet(name) ? 1 : 0));
        }
        return booleanArr;
    };


    /**
    * Returns bit integer.
    *
    * @this {autoBits}
    * @return {integer} Bit integer.
    */
    AutoBits.prototype.getBits = function() {
        this.log("bits: " + this.options.bits);
        return this.options.bits;
    };


    /**
    * Adds a bit to integer based on named value from map.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer.
    * @return {autobits} Returns autobits instance if bit already exists or not found in map.
    */
    AutoBits.prototype.addBit = function(value) {
        return this.addPreference(value);
    };


    /**
    * Sets a value for the preference name in the bitmap. Value must be present in
    * the map's set of allowable options for the preference, if it is not, then a value
    * of false will be assigned. If a value is not provided, it is assumed you want it
    * "turned on" and thus set to true.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer
    * @return {autobits} Returns autobits instance if bit already exists or not found in map.
    */
    AutoBits.prototype.addPreference = function(name, value) {
        var bit_pos, mask, num_bits, position, xmask, _options, _ref;
        if (value == null) {
            value = true;
        }
        this.log("addPreference: " + name + " = " + value);
        if (!(name in this.options.map_ordered_keys)) {
            this.log("addPreference: Invalid preference name " + name);
            return this;
        }
        if (this.getPreference(name) === value) {
            this.log("addPreference: Preference " + name + " already has value " + value + " set");
            return this;
        }
        _ref = this.options.map_ordered_keys[name], bit_pos = _ref[0], num_bits = _ref[1], _options = _ref[2];
        mask = this.getBinaryVariableBits(num_bits) << bit_pos;
        xmask = this.getBinaryVariableBits(this.getMaximumNumberOfBits()) ^ mask;
        position = _options.indexOf(value);
        this.options.bits = (xmask & this.options.bits) + (mask & (position << bit_pos));
        return this.options.bits;
    };


    /**
    * Alias for addPreference
    */
    AutoBits.prototype.setPreference = AutoBits.prototype.addPreference;


    /**
    * Removes a bit from integer based on named value from map.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer.
    * @return {autobits} Returns autobits instance if bit doesn't exists or not found in map.
    */
    AutoBits.prototype.removeBit = function(value) {
        return this.removePreference(value);
    };


    /**
    * Unsets a value for the preference name in the bitmap. Value must be present in
    * the map's set of allowable options for the preference, if it is not, then a value
    * of false will be assigned. If a value is not provided, it is assumed you want it
    * "turned on" and thus set to true.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer
    * @return {autobits} Returns autobits instance if bit already exists or not found in map.
    */
    AutoBits.prototype.removePreference = function(name) {
        var bit_pos, mask, num_bits, xmask, _ref;
        this.log("removePreference: " + name);
        if (!(name in this.options.map_ordered_keys)) {
            this.log("removePreference: Invalid preference name " + name);
            return this;
        }
        if (this.getPreference(name) === false) {
            this.log("removePreference: Preference " + name + " already unset");
            return this;
        }
        _ref = this.options.map_ordered_keys[name], bit_pos = _ref[0], num_bits = _ref[1];
        mask = this.getBinaryVariableBits(num_bits) << bit_pos;
        xmask = this.getBinaryVariableBits(this.getMaximumNumberOfBits()) ^ mask;
        this.options.bits = xmask & this.options.bits;
        return this.options.bits;
    };


    /**
    * Alias for removePreference
    */
    AutoBits.prototype.unsetPreference = AutoBits.prototype.removePreference;


    /**
    * TODO: Randomizes the bits based on the map.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer.
    */
    AutoBits.prototype.randomize = function() {
        this.log("randomize: " + this.options.bits);
        return this.options.bits;
    };


    /**
    * TODO: Remaps the bits based on the bits entered.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer.
    */
    AutoBits.prototype.remap = function() {
        this.log("remap: " + this.options.bits);
        return this.options.bits;
    };


    /**
    * Clears the bit integer.
    *
    * @this {autoBits}
    * @return {integer} Returns bit integer (0).
    */
    AutoBits.prototype.clear = function() {
        this.options.bits = 0;
        return this.options.bits;
    };


    /**
    * Creates a lookup map of the property name if the original map
    * takes advantage of the multi-bit feature.
    *
    * @private
    * @return {object} Returns a lookup map of propertyValue -> [bit_pos, num_bits, options]
    */
    AutoBits.prototype.getOrderedKeyMap = function() {
        var bit_pos, i, ordered, x, _name, _num_bits, _options, _ref;
        if (this.options.map.length) {
            ordered = {};
            bit_pos = 0;
            for (i in this.options.map) {
                x = this.options.map[i];
                if (typeof x === 'string') {
                    _ref = [x, 1, [false, true]], _name = _ref[0], _num_bits = _ref[1], _options = _ref[2];
                } else {
                    _name = x[0], _num_bits = x[1], _options = x[2];
                }
                if (_options.length > Math.pow(2, _num_bits)) {
                    console.error("autobits: You didn't reserve enough bits. I'm gonna kill you.");
                }
                ordered[_name] = [bit_pos, _num_bits, _options];
                bit_pos += _num_bits;
                if (bit_pos > this.getMaximumNumberOfBits()) {
                    throw new Error("Your map has exceeded the safest maximum size of " + (this.getMaximumNumberOfBits()));
                }
            }
            return ordered;
        }
    };


    /**
    * Gets the binary value of the named value in the map.
    *
    * @private
    * @return {integer} Returns bit value.
    */
    AutoBits.prototype.getBinary = function(value) {
        return Math.pow(2, value);
    };


    /**
    * Gets the binary value of the number of bits.
    * If a preference takes up 5 bits, this will create the integer for '11111'.
    *
    * @private
    * @return {integer} Returns bit value.
    */
    AutoBits.prototype.getBinaryVariableBits = function(num_bits) {
        return parseInt(Array(num_bits + 1).join('1'), 2);
    };


    _max_bits = undefined;

    /**
    * Returns the maximum number of bits allowed in a single map (unsigned).
    *
    * @private
    * @return {integer} Returns in integer.
    */
    AutoBits.prototype.getMaximumNumberOfBits = function() {
        if (_max_bits != null) {
            return _max_bits;
        }
        _max_bits = Math.log(Number.MAX_SAFE_INTEGER) / Math.log(2);
        return _max_bits;
    };


    /**
    * Console log messages based on debug option.
    *
    * @private
    */
    AutoBits.prototype.log = function() {
        if (this.options.debug && window.console && window.console.log) {
            return console.log("[autobits] ", arguments);
        }
    };


    /**
    * Extends objects to provide defaults and options.
    *
    * @private
    */
    extend = function(obj) {
        var args, i, prop;
        args = Array.prototype.slice.call(arguments, 1);
        i = 0;
        while (i < args.length) {
            if (args[i]) {
                for (prop in args[i]) {
                    obj[prop] = args[i][prop];
                }
            }
            i++;
        }
        return obj;
    };

    return AutoBits;
})();


/**
* Alias `AutoBits` to `autobits`
*/
this.autobits = (function() {
    __extends(autobits, this.AutoBits);
    function autobits() {
        autobits.__super__.constructor.apply(this, arguments);
    }
    return autobits;
})();


/**
* Alias `AutoBits` to `autoBits` fr compatibility with existing clients
*/
this.autoBits = (function() {
    __extends(autoBits, this.AutoBits);
    function autoBits() {
        autoBits.__super__.constructor.apply(this, arguments);
    }
    return autoBits;
})();
