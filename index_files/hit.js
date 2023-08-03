
if (!WebPlatform.onReady) {
  WebPlatform.documentReadyRequests = [];
  WebPlatform.onReady = function (request) {
    if (WebPlatform.documentReadyRequests === null)
      request();
    else
      WebPlatform.documentReadyRequests.push(request);
  };
}

WebPlatform.collectPageStats = function () {
  if (WebPlatform._pageStatsCollected === true) {
    return;
  }
  var isPreview = WebPlatform.getUrlQueryParameter(window.location.href, 'preview') !== '';
  if (!WebPlatform.areSystemAnalyticsEnabled() || window.location.pathname.indexOf('/_preview') === 0 || isPreview || WebPlatform.pageForbidden === true)
    return;
  WebPlatform._pageStatsCollected = true;
  var who = (function () {
    var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return ['Internet Explorer', (tem[1] || '')];
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null) {
        tem = tem.slice(1);
        for (var i = 0; i < tem.length; ++i)
          tem[i] = tem[i].replace('OPR', 'Opera');
        return tem;
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem !== null)
      M.splice(1, 1, tem[1]);
    return M;
  })();

  var data = {
    browser: who[0],
    browserVersion: who[1],
    url: window.location.pathname,
    query: window.location.search,
    title: document.title,
    referrer: document.referrer.indexOf(location.protocol + "//" + location.host) === 0 ? '' : document.referrer,
    screenWidth: screen.width || windowWidth,
    screenHeight: screen.height || windowHeight,
    funnelVar: WebPlatform.Funnels && WebPlatform.Funnels.variant ? WebPlatform.Funnels.variant : '',
    _r: (new Date()).getTime()
  };
  var ignore = function () {};
  $.post('/hit', data).done(ignore).fail(ignore);
};      
// Report stats
WebPlatform.onReady(WebPlatform.collectPageStats);