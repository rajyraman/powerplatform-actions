module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(351);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 366:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
const lib_1 = __webpack_require__(806);
const path = __webpack_require__(622);
const process_1 = __webpack_require__(765);
const validSolutionTypes = new Set(['unmanaged', 'managed', 'both']);
core.startGroup('pack-solution:');
const solutionZipFile = core.getInput('solution-file', { required: true });
const solutionType = core.getInput('solution-type', { required: false }) || 'Unmanaged';
if (!validSolutionTypes.has(solutionType.toLowerCase())) {
    core.setFailed(`Unknown solution type "${solutionType}"; must be one of: "Unmanaged", "Managed", "Both"`);
    process_1.exit();
}
const workingDir = process.cwd();
const solutionFolderCand = core.getInput('solution-folder', { required: true });
const solutionFolder = path.isAbsolute(solutionFolderCand) ? solutionFolderCand : path.resolve(workingDir, solutionFolderCand);
core.info(`pack solution: ${solutionZipFile} (${solutionType}) from: ${solutionFolder}`);
const logger = new lib_1.ActionLogger();
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(() => __awaiter(void 0, void 0, void 0, function* () {
    const sopa = new lib_1.SopaRunner(workingDir, logger);
    const packArgs = ['/action:pack', `/packageType:${solutionType}`, `/zipFile:${solutionZipFile}`, `/folder:${solutionFolder}`];
    yield sopa.run(packArgs);
    core.info(`packed solution into: ${solutionZipFile}`);
    core.endGroup();
}))().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 434:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
function getInputAsBool(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? defaultValue : textValue.toLowerCase() === 'true';
}
exports.getInputAsBool = getInputAsBool;
function getWorkingDirectory(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? (defaultValue !== null && defaultValue !== void 0 ? defaultValue : process.cwd()) : textValue;
}
exports.getWorkingDirectory = getWorkingDirectory;

//# sourceMappingURL=actionInput.js.map


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionLogger = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __webpack_require__(186);
class ActionLogger {
    info(...args) {
        core.info(args.join());
    }
    warn(...args) {
        core.warning(args.join());
    }
    error(...args) {
        core.error(args.join());
    }
}
exports.ActionLogger = ActionLogger;

//# sourceMappingURL=actionLogger.js.map


/***/ }),

/***/ 21:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RunnerError = exports.ExeRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const child_process_1 = __webpack_require__(129);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
class ExeRunner {
    constructor(_workingDir, logger, exeName, exeRelativePath) {
        this._workingDir = _workingDir;
        this.logger = logger;
        const platform = os.platform();
        if (platform !== 'win32') {
            throw Error(`Unsupported Action runner os: '${platform}'; for the time being, only Windows runners are supported (cross-platform support work is in progress)`);
        }
        if (exeRelativePath) {
            exeRelativePath.push(exeName);
            this._exePath = path.resolve(this.outDirRoot, ...exeRelativePath);
        }
        else {
            this._exePath = exeName;
        }
    }
    get workingDir() {
        return this._workingDir;
    }
    get outDirRoot() {
        if (!this._outDirRoot) {
            // in mocha, __dirname resolves to the src folder of the .ts file,
            // but when running the .js file directly, e.g. from the /dist folder, it will be from that folder
            const dirname = path.resolve(__dirname);
            const parentDir = path.dirname(dirname);
            // /dist/actions/<action-name>/index.js:
            // /out/actions/<action-name>/index.js:
            if (path.basename(parentDir) === 'actions') {
                this._outDirRoot = path.resolve(path.dirname(parentDir));
            }
            else if (path.basename(parentDir) === 'src' || path.basename(parentDir) === 'out') {
                this._outDirRoot = path.resolve(parentDir, '..', 'out');
            }
            else {
                throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${dirname}`);
            }
        }
        return this._outDirRoot;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const stdout = new Array();
                const stderr = new Array();
                this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
                const pac = child_process_1.spawn(this._exePath, args, { cwd: this.workingDir });
                pac.stdout.on('data', (data) => stdout.push(...data.toString().split(os.EOL)));
                pac.stderr.on('data', (data) => stderr.push(...data.toString().split(os.EOL)));
                pac.on('close', (code) => {
                    if (code === 0) {
                        this.logger.info(`success: ${stdout.join(os.EOL)}`);
                        resolve(stdout);
                    }
                    else {
                        const allOutput = stderr.concat(stdout);
                        this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                        reject(new RunnerError(code, allOutput.join()));
                    }
                });
            });
        });
    }
    runSync(args) {
        var _a;
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
        const proc = child_process_1.spawnSync(this._exePath, args, { cwd: this.workingDir });
        if (proc.status === 0) {
            const output = proc.output
                .filter(line => !!line) // can have null entries
                .map(line => line.toString());
            this.logger.info(`success: ${output.join(os.EOL)}`);
            return output;
        }
        else {
            const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
            this.logger.error(`error: ${proc.status}: ${allOutput}`);
            throw new RunnerError((_a = proc.status) !== null && _a !== void 0 ? _a : 99999, allOutput);
        }
    }
}
exports.ExeRunner = ExeRunner;
class RunnerError extends Error {
    constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
    }
}
exports.RunnerError = RunnerError;

//# sourceMappingURL=exeRunner.js.map


/***/ }),

/***/ 973:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
class GitRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'git');
    }
}
exports.GitRunner = GitRunner;

//# sourceMappingURL=gitRunner.js.map


/***/ }),

/***/ 806:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SopaRunner = exports.RunnerError = exports.PacAccess = exports.GitRunner = exports.ActionLogger = exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var actionInput_1 = __webpack_require__(434);
Object.defineProperty(exports, "getInputAsBool", ({ enumerable: true, get: function () { return actionInput_1.getInputAsBool; } }));
Object.defineProperty(exports, "getWorkingDirectory", ({ enumerable: true, get: function () { return actionInput_1.getWorkingDirectory; } }));
var actionLogger_1 = __webpack_require__(970);
Object.defineProperty(exports, "ActionLogger", ({ enumerable: true, get: function () { return actionLogger_1.ActionLogger; } }));
var gitRunner_1 = __webpack_require__(973);
Object.defineProperty(exports, "GitRunner", ({ enumerable: true, get: function () { return gitRunner_1.GitRunner; } }));
var pacAccess_1 = __webpack_require__(399);
Object.defineProperty(exports, "PacAccess", ({ enumerable: true, get: function () { return pacAccess_1.PacAccess; } }));
var exeRunner_1 = __webpack_require__(21);
Object.defineProperty(exports, "RunnerError", ({ enumerable: true, get: function () { return exeRunner_1.RunnerError; } }));
var sopaRunner_1 = __webpack_require__(653);
Object.defineProperty(exports, "SopaRunner", ({ enumerable: true, get: function () { return sopaRunner_1.SopaRunner; } }));

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 399:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PacAccess = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
class PacAccess extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'pac.exe', ['pac', 'tools']);
    }
}
exports.PacAccess = PacAccess;

//# sourceMappingURL=pacAccess.js.map


/***/ }),

/***/ 653:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SopaRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __webpack_require__(21);
class SopaRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'SolutionPackager.exe', ['sopa', 'content', 'bin', 'coretools']);
    }
}
exports.SopaRunner = SopaRunner;

//# sourceMappingURL=sopaRunner.js.map


/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 765:
/***/ ((module) => {

module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(366);
/******/ })()
;