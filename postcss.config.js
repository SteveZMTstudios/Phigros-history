module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        "ie >= 9",
        "iOS >= 7",
        "Android >= 4.0",
        "Safari >= 7",
        "Firefox >= 30",
        "Chrome >= 30",
        "> 0.2%",
        "last 10 versions"
      ]
    })
  ]
};
