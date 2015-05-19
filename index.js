var path = require('path');
var notifier = require('node-notifier');
var defaults = require('lodash.defaults');
var assign = require('object-assign');

var WebpackNotifierPlugin = module.exports = function(options, events) {
    if (typeof options !== 'object') options = {};
    this.options = defaults(options, WebpackNotifierPlugin.DEFAULT_OPTIONS);
    this.events = this.prepareDefaults(events, this.options);
    this.lastBuildSucceeded = false;
};

WebpackNotifierPlugin.DEFAULT_OPTIONS = {
    title: 'Webpack',
    contentImage: path.join(__dirname, 'logo.png')
};

WebpackNotifierPlugin.DEFAULT_EVENTS = {
    error: true,
    warning: true,
    success: {message: 'Build successful'},
    rebuild: false
};

WebpackNotifierPlugin.prototype.prepareDefaults = function(events, options) {
    options = options || WebpackNotifierPlugin.DEFAULT_OPTIONS;
    events = defaults(events || {}, WebpackNotifierPlugin.DEFAULT_EVENTS);
    Object.keys(events).forEach(function (event) {
        var eventDefaults = WebpackNotifierPlugin.DEFAULT_EVENTS[event];
        if (events[event] === false) return;
        if (typeof events[event] !== 'object') events[event] = {};
        if (typeof eventDefaults !== 'object') eventDefaults = {};
        events[event] = defaults(events[event], eventDefaults, options);
    });
    return events;
};

WebpackNotifierPlugin.prototype.formatErrorMessage = function (error) {
    var message;
    if (error.module && error.module.rawRequest)
        message = error.module.rawRequest + '\n';
    if (error.error)
        message += error.error.toString();
    else if (error.warning)
        message += error.warning.toString();
    return {
        message: message
    };
};

WebpackNotifierPlugin.prototype.compileMessage = function(stats) {
    var error;
    var notifyOptions;

    if (stats.hasErrors()) {
        this.lastBuildSucceeded = false;
        if (this.events.error) notifyOptions = assign(
            this.formatErrorMessage(stats.compilation.errors[0]),
            this.events.error
        );
    } else if (stats.hasWarnings()) {
        this.lastBuildSucceeded = false;
        if (this.events.warning) notifyOptions = assign(
            this.formatErrorMessage(stats.compilation.warnings[0]),
            this.events.warning
        );
    } else if (!this.lastBuildSucceeded) {
        this.lastBuildSucceeded = true;
        notifyOptions = this.events.success;
    } else {
        if (this.events.rebuild) notifyOptions = assign(
            {message: 'rebuild'},
            this.events.rebuild
        );
    }
    return notifyOptions;
};

WebpackNotifierPlugin.prototype.compilationDone = function(stats) {
    var msg = this.compileMessage(stats);
    if (msg) {
        notifier.notify(msg);
    }
};

WebpackNotifierPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', this.compilationDone.bind(this));
};
