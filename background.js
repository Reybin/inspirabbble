chrome.app.runtime.onLaunched.addListener(function() {

    var width = 300,
        height = 300;

    chrome.app.window.create('app.html', {
        frame: 'chrome',
        width: width,
        height: height,
        minWidth: width,
        minHeight: height
    });

});