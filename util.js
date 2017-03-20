module.exports = {
    /**
     * formats an integer into a readable value
     * @param {Number} number
     * @returns {string}
     */
    formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(2) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    },
    
    /**
     * Gets a property from an object and optionally sets the default
     * @param {Object} object - The object
     * @param {string} path - The path to the property within the object
     * @param {*} defaultValue - The default value if property doesn't exist
     * @param {Boolean} [setDefault=true] - Will set the property to the default value if property doesn't exist
     * @returns {*}
     */
    get(object, path, defaultValue, setDefault = true) {
        const r = _.get(object, path);
        if (!r && !_.isUndefined(defaultValue) && setDefault) {
            _.set(object, path, defaultValue);
            return defaultValue;
        }
        return r;
    },
    
    /**
     * Sets a property on an object, optionally if the property doesn't already exist
     * @param {Object} object - The object
     * @param {string} path = The path to the property within the object
     * @param {*} value - The value to set
     * @param {Boolean} onlyIfNotExists - Will only set the property if it doesn't already exist
     */
    set(object, path, value, onlyIfNotExists = true) {
        if (onlyIfNotExists) {
            Util.get(object, path, value);
            return;
        }
        _.set(object, path, value);
    }
};