/**
 * Created by Tong on 2018/4/19.
 */
; (function (win, doc) {
  var rem = doc.documentElement.clientWidth / 7.2;
  win.globalWidth = doc.documentElement.clientWidth;
  doc.documentElement.style.fontSize = rem + 'px';
  if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
    handleFontSize();
  } else {
    document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
  }
  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
    });
  }
  win.addEventListener('resize', function () {
    rem = doc.documentElement.clientWidth / 7.2;
    doc.documentElement.style.fontSize = rem + 'px';
    win.globalWidth = doc.documentElement.clientWidth;
  }, false);
  
})(window, document);
