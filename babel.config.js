let presetEnv;
try {
  presetEnv = require('@babel/preset-env');
} catch (e) {
  presetEnv = require('C:/Users/stevezmt/AppData/Roaming/npm/node_modules/@babel/preset-env');
}

module.exports = {
  presets: [
    [
      presetEnv,
      {
        targets: {
          ie: "9",
          ios: "7",
          android: "4.0",
          safari: "7",
          chrome: "30",
          firefox: "30"
        }
      }
    ]
  ],
  generatorOpts: {
    jsescOption: {
      minimal: true
    }
  }
};
