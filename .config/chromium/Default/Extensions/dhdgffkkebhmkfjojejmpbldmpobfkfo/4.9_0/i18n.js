(function(){Registry.require(["helper","promise"],function(){var p={},q={},e=null,h=[],k=Registry.get("helper"),n=Registry.get("promise"),r=function(b){var a=b,c=Array.prototype.slice.call(arguments,1);1==c.length&&"Array"===k.toType(c[0])&&(c=c[0]);for(var d=/(^|_)0[a-zA-Z]+0(_|$)/,f=0;f<c.length;f++){var g=a.match(d);if(!g){console.log("getMessage(): wrong argument count!!!");break}a=a.replace(d,(g[1]?" ":"")+c[f]+(g[2]?" ":""))}return a.replace(/_/g," ")},y=function(b,a){var c=b.message;1==a.length&&
"Array"===k.toType(a[0])&&(a=a[0]);b.placeholders&&Object.keys(b.placeholders).forEach(function(d){try{var f=Number(b.placeholders[d].content.replace(/^\$/,""))-1,g;f<a.length?(g=a[f],c=c.replace("$"+d+"$",g)):console.log("i18n: invalid argument count on processing '"+c+"' with args "+JSON.stringify(a))}catch(e){console.log("i18n: error processing '"+c+"' with args "+JSON.stringify(a))}});return c},t=function(b){var a=[arguments[0]],c=[],d=function(a){for(var b=0;b<a.length;b++)"Array"===k.toType(a[b])?
d(a[b]):c.push(String(a[b]))};d(Array.prototype.slice.call(arguments,1));c.length&&a.push(c);return rea.i18n.getMessage.apply(this,a)},u=function(b){var a=n();Registry.getRaw("_locales/"+b+"/messages.json",function(c){try{if(c)return a.resolve(JSON.parse(c))}catch(d){console.log("i18n: parsing locale "+b+" failed!")}a.reject()});return a.promise()},v=function(b){var a=n();b=b.concat("en");var c=-1,d=function(){c++;if(c<b.length){var f=b[c];if(!f||-1===z.indexOf(f))return d();u(f).then(function(a){p=
a;if(!l&&"en"!=f)return u("en").then(function(a){q=a||{}})}).then(function(){a.resolve(f)}).fail(function(){d()})}else a.resolve()};d();return a.promise()},m=function(b){return b?k.map(b.replace(/-/g,"_").split("_"),function(a,b){return b?a.toUpperCase():a.toLowerCase()}).join("_"):b},w=function(b,a){var c,d;a=a||(e?[e,e.split("_")[0]].concat(h).filter(function(a){return a}):h);k.each(a,function(a,g){k.each(b,function(b,e){var h=m(b),k=h.split(/_/)[0];if(h==a)return d=e,!1;k==a&&(void 0===c||g<c)&&
(d=e,c=g)});if(void 0!==d)return!1});return d},x=[{name:"Arabic - \u200e\u202b\u0627\u0644\u0639\u0631\u0628\u064a\u0629\u202c\u200e",value:"ar"},{name:"Chinese (Simplified) - \u4e2d\u6587\uff08\u7b80\u4f53\u4e2d\u6587\uff09",value:"zh_CN"},{name:"Chinese (Traditional) - \u4e2d\u6587\uff08\u7e41\u9ad4\uff09",value:"zh_TW"},{name:"Croatian - hrvatski",value:"hr"},{name:"Czech - \u010de\u0161tina",value:"cs"},{name:"English",value:"en"},{name:"French - fran\u00e7ais",value:"fr"},{name:"German - Deutsch",
value:"de"},{name:"Hindi - \u0939\u093f\u0928\u094d\u0926\u0940",value:"hi"},{name:"Hungarian - magyar",value:"hu"},{name:"Indonesian - Indonesia",value:"id"},{name:"Italian - italiano",value:"it"},{name:"Japanese - \u65e5\u672c\u8a9e",value:"ja"},{name:"Korean - \ud55c\uad6d\uc5b4",value:"ko"},{name:"Norwegian - norsk",value:"nb"},{name:"Polish - polski",value:"pl"},{name:"Portuguese (Brazil) - portugu\u00eas (Brasil)",value:"pt_BR"},{name:"Portuguese (Portugal) - portugu\u00eas (Portugal)",value:"pt_PT"},
{name:"Russian - \u0440\u0443\u0441\u0441\u043a\u0438\u0439",value:"ru"},{name:"Serbian - \u0441\u0440\u043f\u0441\u043a\u0438",value:"sr"},{name:"Slovak - sloven\u010dina",value:"sk"},{name:"Spanish - espa\u00f1ol",value:"es"},{name:"Turkish - T\u00fcrk\u00e7e",value:"tr"},{name:"Ukrainian - \u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",value:"uk"},{name:"Vietnamese - Ti\u1ebfng Vi\u1ec7t",value:"vi"}],z=x.map(function(b){return b.value}),l="undefined"!==typeof rea?rea.i18n.native_support:
!1;Registry.register("i18n","6095",{init:function(){var b=function(){var a=n();e||l?a.resolve():v(h).then(function(a){e=a}).always(a.resolve);return a.promise()},a=m(l?rea.i18n.getUILanguage():navigator.language);if(a){var c=[a],d=a.split(/_/);d[0]!==a&&c.push(d[0]);c.forEach(function(a){h.unshift(a)})}b().then(function(){l&&rea.i18n.getAcceptLanguages(function(a){a.forEach(function(a){h.push(m(a))});return b()})})},getMessage:function(b){var a;return e&&(a=p[b]||q[b])?y(a,Array.prototype.slice.call(arguments,
1)):l&&(a=t.apply(this,arguments))?a:Registry.isDevVersion("helper")?(a="#"+r.apply(this,arguments).replace(/ /g,"#")+"#",console.warn("i18n:"+a),a):r.apply(this,arguments)},getOriginalMessage:t,normalizeLocale:m,getTranslation:function(b,a){var c,d;if(b&&(d=b[a+"_i18n"])){b[a]&&(d=k.copy(d,{en:b[a]}));var e=Object.keys(d),g;void 0!==(g=w(e))&&(c=d[e[g]])}return c||b[a]},setLocale:function(b){var a=n();"null"===b&&(b=null);b&&(b=m(b));!b&&l?(e=b,a.resolve()):b!==e?v([b].concat(h).concat([e])).done(function(a){e=
a;e!=b&&console.log("i18n: retrieving locale "+b+" failed!")}).always(a.resolve):a.resolve();return a.promise()},getLocale:function(){return e},getUiLocale:function(){return m(e||l?rea.i18n.getUILanguage():h[0]||navigator.language||"en")},getBestLocale:w,supported:x})})})();
