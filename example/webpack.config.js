var WebpackNotifierPlugin = require('..');

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    plugins: [
        new WebpackNotifierPlugin(null, {
          success: {sound: true},
          rebuild: true,
          error: {sound: true}
        })
    ]
};
