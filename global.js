let mod = {};
module.exports = mod;
// base class for events
mod.LiteEvent = function() {
    // registered subscribers
    this.handlers = [];
    // register a new subscriber
    this.on = function(handler) {
        this.handlers.push(handler);
    }
    // remove a registered subscriber
    this.off = function(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    // call all registered subscribers
    this.trigger = function(data) {
        try{
            this.handlers.slice(0).forEach(h => h(data));
        } catch(e){
            global.logError('Error in LiteEvent.trigger: ' + (e.stack || e));
        }
    }
};
// Flag colors, used throughout the code
//COLOR_RED
mod.FLAG_COLOR = {
    invade: { // destroy everything enemy in the room
        color: COLOR_RED,
        secondaryColor: COLOR_RED,
        filter: {'color': COLOR_RED, 'secondaryColor': COLOR_RED },
        exploit: { // send privateers to exploit sources
            color: COLOR_RED,
            secondaryColor: COLOR_GREEN,
            filter: {'color': COLOR_RED, 'secondaryColor': COLOR_GREEN }
        },
        robbing: { // take energy from foreign structures
            color: COLOR_RED,
            secondaryColor: COLOR_YELLOW,
            filter: {'color': COLOR_RED, 'secondaryColor': COLOR_YELLOW }
        },
        attackController: { // attack enemy controller and then claim
            color: COLOR_RED,
            secondaryColor: COLOR_CYAN,
            filter: {'color': COLOR_RED, 'secondaryColor': COLOR_CYAN },
        }
    },
    //COLOR_PURPLE - Reserved labs
    //COLOR_BLUE - Reserved (internal use)
    //COLOR_CYAN - Reserved (build related)
    //COLOR_GREEN
    claim: { // claim this room, then build spawn at flag
        color: COLOR_GREEN,
        secondaryColor: COLOR_GREEN,
        filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_GREEN },
        spawn: { // send pioneers & build spawn here
            color: COLOR_GREEN,
            secondaryColor: COLOR_WHITE,
            filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_WHITE }
        },
        pioneer: { // send additional pioneers
            color: COLOR_GREEN,
            secondaryColor: COLOR_RED,
            filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_RED }
        },
        reserve: { // reserve this room
            color: COLOR_GREEN,
            secondaryColor: COLOR_GREY,
            filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_GREY },
        },
        mining: {
            color: COLOR_GREEN,
            secondaryColor: COLOR_BROWN,
            filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_BROWN}
        },
        delivery: { // rob energy from friendly rooms and deliver here
            color: COLOR_GREEN,
            secondaryColor: COLOR_YELLOW,
            filter: {'color': COLOR_GREEN, 'secondaryColor': COLOR_YELLOW}
        },
    },
    //COLOR_YELLOW
    defense: { // point to gather troops
        color: COLOR_YELLOW,
        secondaryColor: COLOR_YELLOW,
        filter: {'color': COLOR_YELLOW, 'secondaryColor': COLOR_YELLOW }
    },
    //COLOR_ORANGE
    destroy: { // destroy whats standing here
        color: COLOR_ORANGE,
        secondaryColor: COLOR_ORANGE,
        filter: {'color': COLOR_ORANGE, 'secondaryColor': COLOR_ORANGE },
        dismantle: {
            color: COLOR_ORANGE,
            secondaryColor: COLOR_YELLOW,
            filter: {'color': COLOR_ORANGE, 'secondaryColor': COLOR_YELLOW }
        },
    },
    //COLOR_BROWN
    pavementArt: {
        color: COLOR_BROWN,
        secondaryColor: COLOR_BROWN,
        filter: {'color': COLOR_BROWN, 'secondaryColor': COLOR_BROWN },
    },
    // COLOR_GREY
    command: { // command api
        color: COLOR_WHITE,
        drop: { // haulers drop energy in a pile here
            color: COLOR_WHITE,
            secondaryColor: COLOR_YELLOW,
            filter: {'color': COLOR_WHITE, 'secondaryColor': COLOR_YELLOW }
        }
    },
};
mod.DECAY_AMOUNT = {
    'rampart': RAMPART_DECAY_AMOUNT, // 300
    'road': ROAD_DECAY_AMOUNT, // 100
    'container': CONTAINER_DECAY, // 5000
};
mod.DECAYABLES = [
    STRUCTURE_ROAD,
    STRUCTURE_CONTAINER,
    STRUCTURE_RAMPART];
mod.LAB_IDLE = 'idle';
mod.LAB_BOOST = 'boost';
mod.LAB_SEED = 'seed';
mod.LAB_MASTER = 'master';
mod.LAB_SLAVE_1 = 'slave_1';
mod.LAB_SLAVE_2 = 'slave_2';
mod.LAB_SLAVE_3 = 'slave_3';
mod.REACTOR_TYPE_FLOWER = 'flower';
mod.REACTOR_MODE_IDLE = 'idle';
mod.REACTOR_MODE_BURST = 'burst';
mod.LAB_REACTIONS = {};
for(let a in REACTIONS){
    for(let b in REACTIONS[a]){
        mod.LAB_REACTIONS[REACTIONS[a][b]] = [a,b];
    }
}
/**
 * @deprecated Use {@link Util.translateErrorCode}
 */
mod.translateErrorCode = Util.translateErrorCode;
// manipulate log output
// simply put a color as "style"
// or an object, containing any css
/**
 * @deprected Use {@link Util.dye}
 */
mod.dye = Util.dye;
// predefined log colors
mod.CRAYON = {
    death: { color: 'black', 'font-weight': 'bold' },
    birth: '#e6de99',
    error: '#e79da7',
    system: { color: '#999', 'font-size': '10px' }
};
// log an error for a creeps action, given an error code
/**
 * @deprecated Use {@link Util#logErrorCode}
 *
 */
mod.logErrorCode = Util.logErrorCode;
// log some text as error
/**
 * @deprecated Use {@link Util#logError}
 */
mod.logError = Util.logError;
// trace an error or debug statement
/**
 * @deprecated Use {@link Util#trace}
 */
mod.trace = Util.trace;
// log some text as "system message" showing a "referrer" as label
/**
 * @deprecated Use {@link Util#logSystem}
 */
mod.logSystem = Util.logSystem;
/**
 * @deprecated Use {@link Util#isObject}
 */
mod.isObj = Util.isObject;
// for notify mails: transform server time to local
/**
 * @deprecated Use {@link Util#toLocalDate}
 */
mod.toLocalDate = Util.toLocalDate;
// for notify mails: format dateTime (as date & time)
/**
 * @deprecated Use {@link Util#toDateTimeString}
 */
mod.toDateTimeString = Util.toDateTimeString;
// for notify mails: format dateTime (as time only)
/**
 * @deprecated Use {@link Util#toTimeString}
 */
mod.toTimeString = Util.toTimeString;
// prefix 1 digit numbers with an 0
/**
 * @deprecated Use {@link Util#pad}
 */
mod.len = function(number){
    return ("00" + number).slice(-2);
};
// determine if a given dateTime is within daylight saving time (DST)
// you may need to adjust that to your local summer time rules
// default: Central European Summer Time (CEST)
/**
 * @deprecated Use {@link Util#isSummerTime}
 */
mod.isSummerTime = Util.isSummerTime;
// add a game object, obtained from its id, to an array
/**
 * @deprecated Use {@link Util#addById}
 */
mod.addById = Util.addById;
// send up to REPORTS_PER_LOOP notify mails, which are cached in memory
/**
 * @deprecated Use {@link Util#processReports}
 */
mod.processReports = Util.processReports;
// get movement range between rooms
// respecting environmental walls
// uses memory to cache for ever
/**
 * @deprecated Use {@link Util#routeRange}
 */
mod.routeRange = Util.routeRange;
// turn brown flags into wall construction sites
// save positions in memory (to ignore them for repairing)
/**
 * @deprecated Use {@link Util#pave}
 */
mod.pave = Util.pave;
/**
 * @deprecated Use {@link Util#unpave}
 */
mod.unpave = Util.unpave;
/**
 * @deprecated Use {@link Util#guid}
 */
mod.guid = Util.guid;
/**
 * @deprecated Use {@link Util#memoryUsage}
 */
mod.memoryUsage = Util.memoryUsage;
mod.profiler = null;
/**
 * @deprecated Use {@link Util#resetProfiler}
 */
mod.resetProfiler = Util.resetProfiler;
/**
 * @deprecated Use {@link Util#loadProfiler}
 */
mod.loadProfiler = Util.loadProfiler;
/**
 * @deprecated Use {@link Util#startProfiling}
 */
mod.startProfiling = Util.startProfiling;
mod = _.bindAll(mod);
