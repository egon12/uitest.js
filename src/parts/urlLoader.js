uitest.define('urlLoader', ['urlParser', 'global'], function(urlParser, global) {

    var REFRESH_URL_ATTRIBUTE = 'uitr',
        WINDOW_ID = 'uitestwindow',
        frameElement,
        remoteWindow,
        openCounter = 0;

    function navigateWithReloadTo(win, url) {
        var parsedUrl = urlParser.parseUrl(url);
        urlParser.setOrReplaceQueryAttr(parsedUrl, REFRESH_URL_ATTRIBUTE, openCounter++);
        win.location.href = urlParser.serializeUrl(parsedUrl);
    }

    function open(config) {
        if (!remoteWindow) {
            if (config.loadMode === 'popup') {
                remoteWindow = global.open('', WINDOW_ID);
            } else if (config.loadMode === 'iframe') {
                frameElement = global.document.createElement("iframe");
                frameElement.name = WINDOW_ID;
                frameElement.setAttribute("src", "");
                frameElement.setAttribute("style", "position: absolute; bottom: 0px; width: " + window.innerWidth + "px; height: " + window.innerHeight + "px");
                global.document.body.appendChild(frameElement);

                remoteWindow = global.frames[WINDOW_ID];
            }
        }
        navigateWithReloadTo(remoteWindow, config.url);
        return remoteWindow;
    }

    function close() {
        if (remoteWindow) {
            if (frameElement) {
                frameElement.parentElement.removeChild(frameElement);
                frameElement = null;
            } else {
                remoteWindow.close();
            }
            remoteWindow = null;
        }
    }

    return {
        open: open,
        navigateWithReloadTo: navigateWithReloadTo,
        close: close
    };
});