// All methods require a JSDoc comment describing it.
// http://usejsdoc.org/
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
     * Pad a number with a character
     * @param {Number} number - The number to pad
     * @param [padCharacter='0'] - The character to pad with
     * @param {Number} [padLength=2] - The amount of characters to pad
     * @param {Boolean} [padLengthMax=true] - padLength will also be the max length of output string
     * @returns {string}
     */
    pad(number, padCharacter = '0', padLength = 2, padLengthMax = true) {
        if (!padCharacter) padCharacter = '0';
        if (padLengthMax) padLength -= number.toString().length;
        const padString = _.times(padLength, n => padCharacter).join('');
        return padString + number;
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
     * @param {string} path - The path to the property within the object
     * @param {*} value - The value to set
     * @param {Boolean} [onlyIfNotExists=true] - Will only set the property if it doesn't already exist
     */
    set(object, path, value, onlyIfNotExists = true) {
        if (onlyIfNotExists) {
            Util.get(object, path, value);
            return;
        }
        _.set(object, path, value);
    },
    
    /**
     * Checks if the value is an object or function
     * @param {*} value - The value to check
     * @returns {Boolean}
     */
    isObject(value) {
        if (value === null) return false;
        return typeof value === 'function' || typeof value === 'object';
    },
    
    /**
     * Returns a HTML formatted string with the style applied
     * @param {Object|string} style - Either a colour string or an object with CSS properties
     * @param {...string} text - The text to format
     * @returns {string}
     */
    dye(style, ...text) {
        const msg = text.join(' ');
        if (Util.isObject(style)) {
            let css = '';
            const format = key => css += `${key}: ${style[key]};`;
            _.forEach(Object.keys(style), format);
            return `<span style="${css}">${msg}</span>`;
        }
        if (style) {
            return `<span style="color: ${style}">${msg}</span>`;
        }
        return msg;
    },
    
    /**
     * Logs an error to console
     * @param {string} message - A string describing the error
     * @param {*} [entityWhere] - The entity where the error was caused
     */
    logError(message, entityWhere) {
        const msg = Util.dye(CRAYON.error, message);
        if (entityWhere) {
            Util.trace('error', entityWhere, msg);
        } else {
            console.log(msg);
        }
    },
    
    /**
     * Log text as a system message showing a "referrer" as a label
     * @param {string} roomName - The name of the room being logged from
     * @param {string} message - The message to log
     */
    logSystem(roomName, message) {
        const text = Util.dye(CRAYON.system, roomName);
        console.log(Util.dye(CRAYON.system, `<a href="/a/#!/room/${roomName}">${text}</a> &gt; `) + message );
    },
    
    /**
     * Trace an error or debug statement
     * @param {string} category - The error category
     * @param {*} entityWhere - The entity where the error was caused
     * @param {Object|string} message - A string or object describing the error
     */
    trace(category, entityWhere, ...message) {
        function reduceMemoryWhere(result, value, key) {
            const setting = Memory.debugTrace[key];
            if (!Reflect.has(Memory.debugTrace, key)) {
                return result;
            } else if (result) {
                return setting === value || (!value && setting === `${value}`);
            }
            return false;
        }
        function noMemoryWhere(e) {
            const setting = Memory.debugTrace.no[e[0]];
            return setting === true || e[0] in Memory.debugTrace.no &&
                (setting === e[1] || (!e[1] && setting === `${e[1]}`));
        }
        if (!(Memory.debugTrace[category] === true || _(entityWhere).reduce(reduceMemoryWhere, 1) === true)) return;
        if (Memory.debugTrace.no && _(entityWhere).pairs().some(noMemoryWhere) === true) return;
        
        let msg = message;
        let key;
        if (message.length === 0 && category) {
            let leaf = category;
            do {
                key = leaf;
                leaf = entityWhere[leaf];
            } while (entityWhere[leaf] && leaf !== category);
            
            if (leaf && leaf !== category) {
                if (typeof leaf === 'string') {
                    msg = [leaf];
                } else {
                    msg = [key, '=', leaf];
                }
            }
        }
        
        console.log(Game.time, Util.dye(CRAYON.error, category), ...msg, Util.dye(CRAYON.birth, JSON.stringify(entityWhere)));
    },
    
    toLocalData(date) {
        if (!date) date = new Date();
        let offset = TIME_ZONE;
        if (USE_SUMMERTIME && isSummerTime(date)) offset++;
        return new Date(date.getTime() + (3600000 * offset));
    },
    
    toDateTimeString(date) {
        const pad = Util.pad;
        return pad(date.getFullYear(), 0, 4) + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + Util.toTimeString(date);
    },
    
    toTimeString(date) {
        const pad = Util.pad;
        return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
    },
    
    isSummerTime(date) {
        Date.prototype.stdTimezoneOffset = function() {
            const jan = new Date(this.getFullYear(), 0, 1);
            const jul = new Date(this.getFullYear(), 6, 1);
            return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        };
        Object.defineProperty(Date.prototype, 'dst', {
            get: function() {
                return this.getTimezoneOffset() < this.stdTimezoneOffset();
            },
            configurable: true,
        });
        
        return date.dst;
    },
    
    addById(array, id) {
        if (!array) array = [];
        const obj = Game.getObjectById(id);
        if (obj) array.push(obj);
        return array;
    },
    
    processReports() {
        if (!_.isUndefined(Memory.statistics) && !_.isUndefined(Memory.statistics.reports) && Memory.statistics.reports.length) {
            let mails;
            if (Memory.statistics.reports.length <= REPORTS_PER_LOOP) {
                mails = Memory.statistics.reports;
                Memory.statistics.reports = [];
            } else {
                mails = Memory.statistics.reports.splice(0, REPORTS_PER_LOOP);
            }
            const send = Game.notify;
            _.forEach(mails, send);
        }
    },
    
    routeRange(fromRoom, toRoom) {
        if (fromRoom === toRoom) return 0;
        
        return Util.get(Memory, `routeRange.${fromRoom}.${toRoom}`, (function() {
            let room = fromRoom instanceof Room ? fromRoom : Game.rooms[fromRoom];
            if (!room) return Room.roomDistance(fromRoom, toRoom, false);
            
            let route = room.findroute(toRoom, false, false);
            if (!route) return Room.roomDistance(fromRoom, toRoom, false);
            
            return route === ERR_NO_PATH ? Infinity : route.length;
        })());
    }
};