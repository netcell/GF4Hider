'use strict';

/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library zlib.js released under the following license :
zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License
*/
!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.JSZip=a():"undefined"!=typeof global?global.JSZip=a():"undefined"!=typeof self&&(self.JSZip=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":6}],4:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":14}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.date=null,c.compression=null},{}],6:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("zlibjs/bin/rawdeflate.min").Zlib,f=a("zlibjs/bin/rawinflate.min").Zlib;c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){var b=new e.RawDeflate(a);return b.compress()},c.uncompress=function(a){var b=new f.RawInflate(a);return b.decompress()}},{"zlibjs/bin/rawdeflate.min":19,"zlibjs/bin/rawinflate.min":20}],7:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./utils"),c.base64=a("./base64"),c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":5,"./load":8,"./object":9,"./support":12,"./utils":14}],8:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir});return this}},{"./base64":1,"./zipEntries":15}],9:[function(a,b){"use strict";var c,d,e=a("./support"),f=a("./utils"),g=a("./signature"),h=a("./defaults"),i=a("./base64"),j=a("./compressions"),k=a("./compressedObject"),l=a("./nodeBuffer");e.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(c=new TextEncoder("utf-8"),d=new TextDecoder("utf-8"));var m=function(a){if(a._data instanceof k&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===f.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},n=function(a){var b=m(a),d=f.getTypeOf(b);if("string"===d){if(!a.options.binary){if(c)return c.encode(b);if(e.nodebuffer)return l(b,"utf-8")}return a.asBinary()}return b},o=function(a){var b=m(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=i.decode(b)),b=a&&this.options.binary?A.utf8decode(b):f.transformTo("string",b),a||this.options.binary||(b=A.utf8encode(b)),b)},p=function(a,b,c){this.name=a,this._data=b,this.options=c};p.prototype={asText:function(){return o.call(this,!0)},asBinary:function(){return o.call(this,!1)},asNodeBuffer:function(){var a=n(this);return f.transformTo("nodebuffer",a)},asUint8Array:function(){var a=n(this);return f.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var q=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},r=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},s=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=r(a,h),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},t=function(a,b,c){var d=u(a),e=f.getTypeOf(b);if(d&&v.call(this,d),c=s(c),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===e)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=f.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(e||b instanceof k))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===e&&(b=f.transformTo("uint8array",b))}var g=new p(a,b,c);return this.files[a]=g,g},u=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},v=function(a){return"/"!=a.slice(-1)&&(a+="/"),this.files[a]||t.call(this,a,null,{dir:!0}),this.files[a]},w=function(a,b){var c,d=new k;return a._data instanceof k?(d.uncompressedSize=a._data.uncompressedSize,d.crc32=a._data.crc32,0===d.uncompressedSize||a.options.dir?(b=j.STORE,d.compressedContent="",d.crc32=0):a._data.compressionMethod===b.magic?d.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c)))):(c=n(a),(!c||0===c.length||a.options.dir)&&(b=j.STORE,c=""),d.uncompressedSize=c.length,d.crc32=this.crc32(c),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c))),d.compressedSize=d.compressedContent.length,d.compressionMethod=b.magic,d},x=function(a,b,c,d){var e,f,h=(c.compressedContent,this.utf8encode(b.name)),i=h!==b.name,j=b.options,k="",l="";e=j.date.getHours(),e<<=6,e|=j.date.getMinutes(),e<<=5,e|=j.date.getSeconds()/2,f=j.date.getFullYear()-1980,f<<=4,f|=j.date.getMonth()+1,f<<=5,f|=j.date.getDate(),i&&(l=q(1,1)+q(this.crc32(h),4)+h,k+="up"+q(l.length,2)+l);var m="";m+="\n\x00",m+=i?"\x00\b":"\x00\x00",m+=c.compressionMethod,m+=q(e,2),m+=q(f,2),m+=q(c.crc32,4),m+=q(c.compressedSize,4),m+=q(c.uncompressedSize,4),m+=q(h.length,2),m+=q(k.length,2);var n=g.LOCAL_FILE_HEADER+m+h+k,o=g.CENTRAL_FILE_HEADER+"\x00"+m+"\x00\x00\x00\x00\x00\x00"+(b.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+q(d,4)+h+k;return{fileRecord:n,dirRecord:o,compressedObject:c}},y=function(){this.data=[]};y.prototype={append:function(a){a=f.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}};var z=function(a){this.data=new Uint8Array(a),this.index=0};z.prototype={append:function(a){0!==a.length&&(a=f.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}};var A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new p(d.name,d._data,r(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(f.isRegExp(a)){var d=a;return this.filter(function(a,b){return!b.options.dir&&d.test(a)})}return this.filter(function(b,c){return!c.options.dir&&b===a})[0]||null}return a=this.root+a,t.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(f.isRegExp(a))return this.filter(function(b,c){return c.options.dir&&a.test(b)});var b=this.root+a,c=v.call(this,b),d=this.clone();return d.root=c.name,d},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b)if(b.options.dir)for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];else delete this.files[a];return this},generate:function(a){a=r(a||{},{base64:!0,compression:"STORE",type:"base64"}),f.checkSupport(a.type);var b,c,d=[],e=0,h=0;for(var k in this.files)if(this.files.hasOwnProperty(k)){var l=this.files[k],m=l.options.compression||a.compression.toUpperCase(),n=j[m];if(!n)throw new Error(m+" is not a valid compression method !");var o=w.call(this,l,n),p=x.call(this,k,l,o,e);e+=p.fileRecord.length+o.compressedSize,h+=p.dirRecord.length,d.push(p)}var s="";s=g.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+q(d.length,2)+q(d.length,2)+q(h,4)+q(e,4)+"\x00\x00";var t=a.type.toLowerCase();for(b="uint8array"===t||"arraybuffer"===t||"blob"===t||"nodebuffer"===t?new z(e+h+s.length):new y(e+h+s.length),c=0;c<d.length;c++)b.append(d[c].fileRecord),b.append(d[c].compressedObject.compressedContent);for(c=0;c<d.length;c++)b.append(d[c].dirRecord);b.append(s);var u=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return f.transformTo(a.type.toLowerCase(),u);case"blob":return f.arrayBuffer2Blob(f.transformTo("arraybuffer",u));case"base64":return a.base64?i.encode(u):u;default:return u}},crc32:function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==f.getTypeOf(a),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof b&&(b=0);var e=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=c?a[i]:a.charCodeAt(i),g=255&(b^h),e=d[g],b=b>>>8^e;return-1^b},utf8encode:function(a){if(c){var b=c.encode(a);return f.transformTo("string",b)}if(e.nodebuffer)return f.transformTo("string",l(a,"utf-8"));for(var d=[],g=0,h=0;h<a.length;h++){var i=a.charCodeAt(h);128>i?d[g++]=String.fromCharCode(i):i>127&&2048>i?(d[g++]=String.fromCharCode(i>>6|192),d[g++]=String.fromCharCode(63&i|128)):(d[g++]=String.fromCharCode(i>>12|224),d[g++]=String.fromCharCode(i>>6&63|128),d[g++]=String.fromCharCode(63&i|128))}return d.join("")},utf8decode:function(a){var b=[],c=0,g=f.getTypeOf(a),h="string"!==g,i=0,j=0,k=0,l=0;if(d)return d.decode(f.transformTo("uint8array",a));if(e.nodebuffer)return f.transformTo("nodebuffer",a).toString("utf-8");for(;i<a.length;)j=h?a[i]:a.charCodeAt(i),128>j?(b[c++]=String.fromCharCode(j),i++):j>191&&224>j?(k=h?a[i+1]:a.charCodeAt(i+1),b[c++]=String.fromCharCode((31&j)<<6|63&k),i+=2):(k=h?a[i+1]:a.charCodeAt(i+1),l=h?a[i+2]:a.charCodeAt(i+2),b[c++]=String.fromCharCode((15&j)<<12|(63&k)<<6|63&l),i+=3);return b.join("")}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./defaults":5,"./nodeBuffer":17,"./signature":10,"./support":12,"./utils":14}],10:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],11:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4,"./utils":14}],12:[function(a,b,c){var d=a("__browserify_process");if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer=!d.browser,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var e=new ArrayBuffer(0);try{c.blob=0===new Blob([e],{type:"application/zip"}).size}catch(f){try{var g=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,h=new g;h.append(e),c.blob=0===h.getBlob("application/zip").size}catch(f){c.blob=!1}}}},{__browserify_process:18}],13:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4}],14:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.string2Uint8Array=function(a){return c.transformTo("uint8array",a)},c.uint8Array2String=function(a){return c.transformTo("string",a)},c.string2Blob=function(a){var b=c.transformTo("arraybuffer",a);return c.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}};var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":17,"./support":12}],15:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":17,"./signature":10,"./stringReader":11,"./support":12,"./uint8ArrayReader":13,"./utils":14,"./zipEntry":16}],16:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":9,"./stringReader":11,"./utils":14}],17:[function(){},{}],18:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],19:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=n;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||b===l?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a,b){if(this.index="number"==typeof b?b:0,this.d=0,this.buffer=a instanceof(o?Uint8Array:Array)?a:new(o?Uint8Array:Array)(32768),2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&c(this)}function c(a){var b,c=a.buffer,d=c.length,e=new(o?Uint8Array:Array)(d<<1);if(o)e.set(c);else for(b=0;d>b;++b)e[b]=c[b];return a.buffer=e}function d(a){this.buffer=new(o?Uint16Array:Array)(2*a),this.length=0}function e(a,b){this.e=w,this.f=0,this.input=o&&a instanceof Array?new Uint8Array(a):a,this.c=0,b&&(b.lazy&&(this.f=b.lazy),"number"==typeof b.compressionType&&(this.e=b.compressionType),b.outputBuffer&&(this.b=o&&b.outputBuffer instanceof Array?new Uint8Array(b.outputBuffer):b.outputBuffer),"number"==typeof b.outputIndex&&(this.c=b.outputIndex)),this.b||(this.b=new(o?Uint8Array:Array)(32768))}function f(a,b){this.length=a,this.g=b}function g(a,b){function c(a,b){var c,d=a.g,e=[],f=0;c=z[a.length],e[f++]=65535&c,e[f++]=c>>16&255,e[f++]=c>>24;var g;switch(m){case 1===d:g=[0,d-1,0];break;case 2===d:g=[1,d-2,0];break;case 3===d:g=[2,d-3,0];break;case 4===d:g=[3,d-4,0];break;case 6>=d:g=[4,d-5,1];break;case 8>=d:g=[5,d-7,1];break;case 12>=d:g=[6,d-9,2];break;case 16>=d:g=[7,d-13,2];break;case 24>=d:g=[8,d-17,3];break;case 32>=d:g=[9,d-25,3];break;case 48>=d:g=[10,d-33,4];break;case 64>=d:g=[11,d-49,4];break;case 96>=d:g=[12,d-65,5];break;case 128>=d:g=[13,d-97,5];break;case 192>=d:g=[14,d-129,6];break;case 256>=d:g=[15,d-193,6];break;case 384>=d:g=[16,d-257,7];break;case 512>=d:g=[17,d-385,7];break;case 768>=d:g=[18,d-513,8];break;case 1024>=d:g=[19,d-769,8];break;case 1536>=d:g=[20,d-1025,9];break;case 2048>=d:g=[21,d-1537,9];break;case 3072>=d:g=[22,d-2049,10];break;case 4096>=d:g=[23,d-3073,10];break;case 6144>=d:g=[24,d-4097,11];break;case 8192>=d:g=[25,d-6145,11];break;case 12288>=d:g=[26,d-8193,12];break;case 16384>=d:g=[27,d-12289,12];break;case 24576>=d:g=[28,d-16385,13];break;case 32768>=d:g=[29,d-24577,13];break;default:throw"invalid distance"}c=g,e[f++]=c[0],e[f++]=c[1],e[f++]=c[2];var h,i;for(h=0,i=e.length;i>h;++h)r[s++]=e[h];u[e[0]]++,v[e[3]]++,t=a.length+b-1,n=null}var d,e,f,g,i,j,k,n,p,q={},r=o?new Uint16Array(2*b.length):[],s=0,t=0,u=new(o?Uint32Array:Array)(286),v=new(o?Uint32Array:Array)(30),w=a.f;if(!o){for(f=0;285>=f;)u[f++]=0;for(f=0;29>=f;)v[f++]=0}for(u[256]=1,d=0,e=b.length;e>d;++d){for(f=i=0,g=3;g>f&&d+f!==e;++f)i=i<<8|b[d+f];if(q[i]===l&&(q[i]=[]),j=q[i],!(0<t--)){for(;0<j.length&&32768<d-j[0];)j.shift();if(d+3>=e){for(n&&c(n,-1),f=0,g=e-d;g>f;++f)p=b[d+f],r[s++]=p,++u[p];break}0<j.length?(k=h(b,d,j),n?n.length<k.length?(p=b[d-1],r[s++]=p,++u[p],c(k,0)):c(n,-1):k.length<w?n=k:c(k,0)):n?c(n,-1):(p=b[d],r[s++]=p,++u[p])}j.push(d)}return r[s++]=256,u[256]++,a.j=u,a.i=v,o?r.subarray(0,s):r}function h(a,b,c){var d,e,g,h,i,j,k=0,l=a.length;h=0,j=c.length;a:for(;j>h;h++){if(d=c[j-h-1],g=3,k>3){for(i=k;i>3;i--)if(a[d+i-1]!==a[b+i-1])continue a;g=k}for(;258>g&&l>b+g&&a[d+g]===a[b+g];)++g;if(g>k&&(e=d,k=g),258===g)break}return new f(k,b-e)}function i(a,b){var c,e,f,g,h,i=a.length,k=new d(572),l=new(o?Uint8Array:Array)(i);if(!o)for(g=0;i>g;g++)l[g]=0;for(g=0;i>g;++g)0<a[g]&&k.push(g,a[g]);if(c=Array(k.length/2),e=new(o?Uint32Array:Array)(k.length/2),1===c.length)return l[k.pop().index]=1,l;for(g=0,h=k.length/2;h>g;++g)c[g]=k.pop(),e[g]=c[g].value;for(f=j(e,e.length,b),g=0,h=c.length;h>g;++g)l[c[g].index]=f[g];return l}function j(a,b,c){function d(a){var c=n[a][p[a]];c===b?(d(a+1),d(a+1)):--l[c],++p[a]}var e,f,g,h,i,j=new(o?Uint16Array:Array)(c),k=new(o?Uint8Array:Array)(c),l=new(o?Uint8Array:Array)(b),m=Array(c),n=Array(c),p=Array(c),q=(1<<c)-b,r=1<<c-1;for(j[c-1]=b,f=0;c>f;++f)r>q?k[f]=0:(k[f]=1,q-=r),q<<=1,j[c-2-f]=(j[c-1-f]/2|0)+b;for(j[0]=k[0],m[0]=Array(j[0]),n[0]=Array(j[0]),f=1;c>f;++f)j[f]>2*j[f-1]+k[f]&&(j[f]=2*j[f-1]+k[f]),m[f]=Array(j[f]),n[f]=Array(j[f]);for(e=0;b>e;++e)l[e]=c;for(g=0;g<j[c-1];++g)m[c-1][g]=a[g],n[c-1][g]=g;for(e=0;c>e;++e)p[e]=0;for(1===k[c-1]&&(--l[0],++p[c-1]),f=c-2;f>=0;--f){for(h=e=0,i=p[f+1],g=0;g<j[f];g++)h=m[f+1][i]+m[f+1][i+1],h>a[e]?(m[f][g]=h,n[f][g]=b,i+=2):(m[f][g]=a[e],n[f][g]=e,++e);p[f]=0,1===k[f]&&d(f)}return l}function k(a){var b,c,d,e,f=new(o?Uint16Array:Array)(a.length),g=[],h=[],i=0;for(b=0,c=a.length;c>b;b++)g[a[b]]=(0|g[a[b]])+1;for(b=1,c=16;c>=b;b++)h[b]=i,i+=0|g[b],i<<=1;for(b=0,c=a.length;c>b;b++)for(i=h[a[b]],h[a[b]]+=1,d=f[b]=0,e=a[b];e>d;d++)f[b]=f[b]<<1|1&i,i>>>=1;return f}var l=void 0,m=!0,n=this,o="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;b.prototype.a=function(a,b,d){var e,f=this.buffer,g=this.index,h=this.d,i=f[g];if(d&&b>1&&(a=b>8?(u[255&a]<<24|u[a>>>8&255]<<16|u[a>>>16&255]<<8|u[a>>>24&255])>>32-b:u[a]>>8-b),8>b+h)i=i<<b|a,h+=b;else for(e=0;b>e;++e)i=i<<1|a>>b-e-1&1,8===++h&&(h=0,f[g++]=u[i],i=0,g===f.length&&(f=c(this)));f[g]=i,this.buffer=f,this.d=h,this.index=g},b.prototype.finish=function(){var a,b=this.buffer,c=this.index;return 0<this.d&&(b[c]<<=8-this.d,b[c]=u[b[c]],c++),o?a=b.subarray(0,c):(b.length=c,a=b),a};var p,q=new(o?Uint8Array:Array)(256);for(p=0;256>p;++p){for(var r=p,s=r,t=7,r=r>>>1;r;r>>>=1)s<<=1,s|=1&r,--t;q[p]=(s<<t&255)>>>0}var u=q;d.prototype.getParent=function(a){return 2*((a-2)/4|0)},d.prototype.push=function(a,b){var c,d,e,f=this.buffer;for(c=this.length,f[this.length++]=b,f[this.length++]=a;c>0&&(d=this.getParent(c),f[c]>f[d]);)e=f[c],f[c]=f[d],f[d]=e,e=f[c+1],f[c+1]=f[d+1],f[d+1]=e,c=d;return this.length},d.prototype.pop=function(){var a,b,c,d,e,f=this.buffer;for(b=f[0],a=f[1],this.length-=2,f[0]=f[this.length],f[1]=f[this.length+1],e=0;(d=2*e+2,!(d>=this.length))&&(d+2<this.length&&f[d+2]>f[d]&&(d+=2),f[d]>f[e]);)c=f[e],f[e]=f[d],f[d]=c,c=f[e+1],f[e+1]=f[d+1],f[d+1]=c,e=d;return{index:a,value:b,length:this.length}};var v,w=2,x=[];for(v=0;288>v;v++)switch(m){case 143>=v:x.push([v+48,8]);break;case 255>=v:x.push([v-144+400,9]);break;case 279>=v:x.push([v-256+0,7]);break;case 287>=v:x.push([v-280+192,8]);break;default:throw"invalid literal: "+v}e.prototype.h=function(){var a,c,d,e,f=this.input;switch(this.e){case 0:for(d=0,e=f.length;e>d;){c=o?f.subarray(d,d+65535):f.slice(d,d+65535),d+=c.length;var h=c,j=d===e,n=l,p=l,q=l,r=l,s=l,t=this.b,u=this.c;if(o){for(t=new Uint8Array(this.b.buffer);t.length<=u+h.length+5;)t=new Uint8Array(t.length<<1);t.set(this.b)}if(n=j?1:0,t[u++]=0|n,p=h.length,q=~p+65536&65535,t[u++]=255&p,t[u++]=p>>>8&255,t[u++]=255&q,t[u++]=q>>>8&255,o)t.set(h,u),u+=h.length,t=t.subarray(0,u);else{for(r=0,s=h.length;s>r;++r)t[u++]=h[r];t.length=u}this.c=u,this.b=t}break;case 1:var v=new b(o?new Uint8Array(this.b.buffer):this.b,this.c);v.a(1,1,m),v.a(1,2,m);var y,z,A,B=g(this,f);for(y=0,z=B.length;z>y;y++)if(A=B[y],b.prototype.a.apply(v,x[A]),A>256)v.a(B[++y],B[++y],m),v.a(B[++y],5),v.a(B[++y],B[++y],m);else if(256===A)break;this.b=v.finish(),this.c=this.b.length;break;case w:var C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R=new b(o?new Uint8Array(this.b.buffer):this.b,this.c),S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(19);for(C=w,R.a(1,1,m),R.a(C,2,m),D=g(this,f),H=i(this.j,15),I=k(H),J=i(this.i,7),K=k(J),E=286;E>257&&0===H[E-1];E--);for(F=30;F>1&&0===J[F-1];F--);var U,V,W,X,Y,Z,$=E,_=F,ab=new(o?Uint32Array:Array)($+_),bb=new(o?Uint32Array:Array)(316),cb=new(o?Uint8Array:Array)(19);for(U=V=0;$>U;U++)ab[V++]=H[U];for(U=0;_>U;U++)ab[V++]=J[U];if(!o)for(U=0,X=cb.length;X>U;++U)cb[U]=0;for(U=Y=0,X=ab.length;X>U;U+=V){for(V=1;X>U+V&&ab[U+V]===ab[U];++V);if(W=V,0===ab[U])if(3>W)for(;0<W--;)bb[Y++]=0,cb[0]++;else for(;W>0;)Z=138>W?W:138,Z>W-3&&W>Z&&(Z=W-3),10>=Z?(bb[Y++]=17,bb[Y++]=Z-3,cb[17]++):(bb[Y++]=18,bb[Y++]=Z-11,cb[18]++),W-=Z;else if(bb[Y++]=ab[U],cb[ab[U]]++,W--,3>W)for(;0<W--;)bb[Y++]=ab[U],cb[ab[U]]++;else for(;W>0;)Z=6>W?W:6,Z>W-3&&W>Z&&(Z=W-3),bb[Y++]=16,bb[Y++]=Z-3,cb[16]++,W-=Z}for(a=o?bb.subarray(0,Y):bb.slice(0,Y),L=i(cb,7),P=0;19>P;P++)T[P]=L[S[P]];for(G=19;G>4&&0===T[G-1];G--);for(M=k(L),R.a(E-257,5,m),R.a(F-1,5,m),R.a(G-4,4,m),P=0;G>P;P++)R.a(T[P],3,m);for(P=0,Q=a.length;Q>P;P++)if(N=a[P],R.a(M[N],L[N],m),N>=16){switch(P++,N){case 16:O=2;break;case 17:O=3;break;case 18:O=7;break;default:throw"invalid code: "+N}R.a(a[P],O,m)}var db,eb,fb,gb,hb,ib,jb,kb,lb=[I,H],mb=[K,J];for(hb=lb[0],ib=lb[1],jb=mb[0],kb=mb[1],db=0,eb=D.length;eb>db;++db)if(fb=D[db],R.a(hb[fb],ib[fb],m),fb>256)R.a(D[++db],D[++db],m),gb=D[++db],R.a(jb[gb],kb[gb],m),R.a(D[++db],D[++db],m);else if(256===fb)break;this.b=R.finish(),this.c=this.b.length;break;default:throw"invalid compression type"}return this.b};var y=function(){function a(a){switch(m){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:throw"invalid length: "+a}}var b,c,d=[];for(b=3;258>=b;b++)c=a(b),d[b]=c[2]<<24|c[1]<<16|c[0];return d}(),z=o?new Uint32Array(y):y;a("Zlib.RawDeflate",e),a("Zlib.RawDeflate.prototype.compress",e.prototype.h);var A,B,C,D,E={NONE:0,FIXED:1,DYNAMIC:w};if(Object.keys)A=Object.keys(E);else for(B in A=[],C=0,E)A[C++]=B;for(C=0,D=A.length;D>C;++C)B=A[C],a("Zlib.RawDeflate.CompressionType."+B,E[B])}).call(this)},{}],20:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=g;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a){var b,c,d,e,f,g,i,j,k,l,m=a.length,n=0,o=Number.POSITIVE_INFINITY;for(j=0;m>j;++j)a[j]>n&&(n=a[j]),a[j]<o&&(o=a[j]);for(b=1<<n,c=new(h?Uint32Array:Array)(b),d=1,e=0,f=2;n>=d;){for(j=0;m>j;++j)if(a[j]===d){for(g=0,i=e,k=0;d>k;++k)g=g<<1|1&i,i>>=1;for(l=d<<16|j,k=g;b>k;k+=f)c[k]=l;++e}++d,e<<=1,f<<=1}return[c,n,o]}function c(a,b){switch(this.g=[],this.h=32768,this.c=this.f=this.d=this.k=0,this.input=h?new Uint8Array(a):a,this.l=!1,this.i=j,this.q=!1,(b||!(b={}))&&(b.index&&(this.d=b.index),b.bufferSize&&(this.h=b.bufferSize),b.bufferType&&(this.i=b.bufferType),b.resize&&(this.q=b.resize)),this.i){case i:this.a=32768,this.b=new(h?Uint8Array:Array)(32768+this.h+258);break;case j:this.a=0,this.b=new(h?Uint8Array:Array)(this.h),this.e=this.v,this.m=this.s,this.j=this.t;break;default:throw Error("invalid inflate mode")}}function d(a,b){for(var c,d=a.f,e=a.c,f=a.input,g=a.d,h=f.length;b>e;){if(g>=h)throw Error("input buffer is broken");d|=f[g++]<<e,e+=8}return c=d&(1<<b)-1,a.f=d>>>b,a.c=e-b,a.d=g,c}function e(a,b){for(var c,d,e=a.f,f=a.c,g=a.input,h=a.d,i=g.length,j=b[0],k=b[1];k>f&&!(h>=i);)e|=g[h++]<<f,f+=8;return c=j[e&(1<<k)-1],d=c>>>16,a.f=e>>d,a.c=f-d,a.d=h,65535&c}function f(a){function c(a,b,c){var f,g,h,i=this.p;for(h=0;a>h;)switch(f=e(this,b)){case 16:for(g=3+d(this,2);g--;)c[h++]=i;break;case 17:for(g=3+d(this,3);g--;)c[h++]=0;i=0;break;case 18:for(g=11+d(this,7);g--;)c[h++]=0;i=0;break;default:i=c[h++]=f}return this.p=i,c}var f,g,i,j,k=d(a,5)+257,l=d(a,5)+1,m=d(a,4)+4,o=new(h?Uint8Array:Array)(n.length);for(j=0;m>j;++j)o[n[j]]=d(a,3);if(!h)for(j=m,m=o.length;m>j;++j)o[n[j]]=0;f=b(o),g=new(h?Uint8Array:Array)(k),i=new(h?Uint8Array:Array)(l),a.p=0,a.j(b(c.call(a,k,f,g)),b(c.call(a,l,f,i)))}var g=this,h="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView,i=0,j=1;c.prototype.u=function(){for(;!this.l;){var a=d(this,3);switch(1&a&&(this.l=!0),a>>>=1){case 0:var b=this.input,c=this.d,e=this.b,g=this.a,k=b.length,l=void 0,m=void 0,n=e.length,o=void 0;if(this.c=this.f=0,c+1>=k)throw Error("invalid uncompressed block header: LEN");if(l=b[c++]|b[c++]<<8,c+1>=k)throw Error("invalid uncompressed block header: NLEN");if(m=b[c++]|b[c++]<<8,l===~m)throw Error("invalid uncompressed block header: length verify");if(c+l>b.length)throw Error("input buffer is broken");switch(this.i){case i:for(;g+l>e.length;){if(o=n-g,l-=o,h)e.set(b.subarray(c,c+o),g),g+=o,c+=o;else for(;o--;)e[g++]=b[c++];this.a=g,e=this.e(),g=this.a}break;case j:for(;g+l>e.length;)e=this.e({o:2});break;default:throw Error("invalid inflate mode")}if(h)e.set(b.subarray(c,c+l),g),g+=l,c+=l;else for(;l--;)e[g++]=b[c++];this.d=c,this.a=g,this.b=e;break;case 1:this.j(z,B);break;case 2:f(this);break;default:throw Error("unknown BTYPE: "+a)}}return this.m()};var k,l,m=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],n=h?new Uint16Array(m):m,o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],p=h?new Uint16Array(o):o,q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],r=h?new Uint8Array(q):q,s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t=h?new Uint16Array(s):s,u=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],v=h?new Uint8Array(u):u,w=new(h?Uint8Array:Array)(288);for(k=0,l=w.length;l>k;++k)w[k]=143>=k?8:255>=k?9:279>=k?7:8;var x,y,z=b(w),A=new(h?Uint8Array:Array)(30);for(x=0,y=A.length;y>x;++x)A[x]=5;var B=b(A);c.prototype.j=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length-258;256!==(g=e(this,a));)if(256>g)f>=k&&(this.a=f,c=this.e(),f=this.a),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f>=k&&(this.a=f,c=this.e(),f=this.a);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.t=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length;256!==(g=e(this,a));)if(256>g)f>=k&&(c=this.e(),k=c.length),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f+j>k&&(c=this.e(),k=c.length);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.e=function(){var a,b,c=new(h?Uint8Array:Array)(this.a-32768),d=this.a-32768,e=this.b;if(h)c.set(e.subarray(32768,c.length));else for(a=0,b=c.length;b>a;++a)c[a]=e[a+32768];if(this.g.push(c),this.k+=c.length,h)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];return this.a=32768,e},c.prototype.v=function(a){var b,c,d,e,f=this.input.length/this.d+1|0,g=this.input,i=this.b;return a&&("number"==typeof a.o&&(f=a.o),"number"==typeof a.r&&(f+=a.r)),2>f?(c=(g.length-this.d)/this.n[2],e=258*(c/2)|0,d=e<i.length?i.length+e:i.length<<1):d=i.length*f,h?(b=new Uint8Array(d),b.set(i)):b=i,this.b=b},c.prototype.m=function(){var a,b,c,d,e,f=0,g=this.b,i=this.g,j=new(h?Uint8Array:Array)(this.k+(this.a-32768));if(0===i.length)return h?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(b=0,c=i.length;c>b;++b)for(a=i[b],d=0,e=a.length;e>d;++d)j[f++]=a[d];for(b=32768,c=this.a;c>b;++b)j[f++]=g[b];return this.g=[],this.buffer=j},c.prototype.s=function(){var a,b=this.a;return h?this.q?(a=new Uint8Array(b),a.set(this.b.subarray(0,b))):a=this.b.subarray(0,b):(this.b.length>b&&(this.b.length=b),a=this.b),this.buffer=a},a("Zlib.RawInflate",c),a("Zlib.RawInflate.prototype.decompress",c.prototype.u);var C,D,E,F,G={ADAPTIVE:j,BLOCK:i};if(Object.keys)C=Object.keys(G);else for(D in C=[],E=0,G)C[E++]=D;for(E=0,F=C.length;F>E;++E)D=C[E],a("Zlib.RawInflate.BufferType."+D,G[D])}).call(this)},{}]},{},[7])(7)});

// ok, we're good
var readCanvasData = function(oCanvas) {
    var iWidth = parseInt(oCanvas.width);
    var iHeight = parseInt(oCanvas.height);
    return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
}

// base64 encodes either a string or an array of charcodes
var encodeData = function(data) {
    var strData = "";
    if (typeof data == "string") {
        strData = data;
    } else {
        var aData = data;
        for (var i=0;i<aData.length;i++) {
            strData += String.fromCharCode(aData[i]);
        }
    }
    return btoa(strData);
}

// creates a base64 encoded string containing BMP data
// takes an imagedata object as argument
var createBMP = function(oData) {
    var aHeader = [];

    var iWidth = oData.width;
    var iHeight = oData.height;

    aHeader.push(0x42); // magic 1
    aHeader.push(0x4D); 

    var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
    aHeader.push(iFileSize % 256);

    aHeader.push(0); // reserved
    aHeader.push(0);
    aHeader.push(0); // reserved
    aHeader.push(0);

    aHeader.push(54); // dataoffset
    aHeader.push(0);
    aHeader.push(0);
    aHeader.push(0);

    var aInfoHeader = [];
    aInfoHeader.push(40); // info header size
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iImageWidth = iWidth;
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
    aInfoHeader.push(iImageWidth % 256);

    var iImageHeight = iHeight;
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
    aInfoHeader.push(iImageHeight % 256);

    aInfoHeader.push(1); // num of planes
    aInfoHeader.push(0);

    aInfoHeader.push(24); // num of bits per pixel
    aInfoHeader.push(0);

    aInfoHeader.push(0); // compression = none
    aInfoHeader.push(0);
    aInfoHeader.push(0);
    aInfoHeader.push(0);

    var iDataSize = iWidth*iHeight*3; 
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
    aInfoHeader.push(iDataSize % 256); 

    for (var i=0;i<16;i++) {
        aInfoHeader.push(0);    // these bytes not used
    }

    var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

    var aImgData = oData.data;

    var strPixelData = "";
    var y = iHeight;
    do {
        var iOffsetY = iWidth*(y-1)*4;
        var strPixelRow = "";
        for (var x=0;x<iWidth;x++) {
            var iOffsetX = 4*x;

            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
            strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
        }
        for (var c=0;c<iPadding;c++) {
            strPixelRow += String.fromCharCode(0);
        }
        strPixelData += strPixelRow;
    } while (--y);

    var strEncoded = encodeData(aHeader.concat(aInfoHeader)) + encodeData(strPixelData);

    return strEncoded;
}

function buildBMP(oCanvas) {

    var oData = readCanvasData(oCanvas);
    var strImgData = createBMP(oData);
    return strImgData;
}

function maxhide(width, height, blockLength, infoBlockLength){
    var numberOfPixels = width * height,
        numberOfBlocks = Math.floor(numberOfPixels/blockLength),

        max_infoLength_inBits  = numberOfBlocks * infoBlockLength,
        max_infoLength_inBytes = Math.floor(max_infoLength_inBits/8),

        numberOfBlocks_max_infoLength_inBytes = Math.ceil(max_infoLength_inBytes.toString(2).length/infoBlockLength),

        binaryLength_max_infoLength_inBytes = numberOfBlocks_max_infoLength_inBytes * infoBlockLength;
    
    return max_infoLength_inBytes - binaryLength_max_infoLength_inBytes - 4;
}

// function validImage(fileName) {
//     var exp = /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/;         
//     return exp.test(fileName);  
// }

function validImage(fileName) {
    var exp = /^.*\.(jpg|jpeg|gif|bmp|BMP|png|PNG)$/;
    return exp.test(fileName);  
}

function validPng(fileName) {
    var exp = /^.*\.(png|PNG)$/;         
    return exp.test(fileName);  
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

angular.module('se10th20132App')
  .controller('MainCtrl', function ($scope, $http) {

        function visualAttack(canvas, canvasimg, canvasctx){
            canvas.width = canvasimg.width;
            canvas.height = canvasimg.height;
            canvasctx.drawImage(canvasimg, 0, 0, canvasimg.width, canvasimg.height);
            var imageData = canvasctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
            var color = [
                0,
                85,
                170,
                255
            ];
            for (var i = 0; i < data.length; i+=4) {
                data[i]   = color[((data[i] >>> 2) << 2) ^ data[i]];
                data[i+1] = color[((data[i+1] >>> 2) << 2) ^ data[i+1]];
                data[i+2] = color[((data[i+2] >>> 2) << 2) ^ data[i+2]];
            };
            canvasctx.putImageData(imageData, 0, 0);
        }

        var org = $('#org-analyze')[0],
            orgctx = org.getContext('2d'),
            res = $('#res-analyze')[0],
            resctx = res.getContext('2d'),
            orgimg = $('#org-preview')[0],
            resimg = $('#res-preview')[0];

        orgimg.onload = function(){
            visualAttack(org, orgimg, orgctx);
        };

        resimg.onload = function(){
            visualAttack(res, resimg, resctx);
        };

    $scope.algorithms = [{
        name: 'PTH(1,5,4)',
        key:  'F2',
        blockLength: 5,
        infoBlockLength: 4
    }, {
        name: 'GF4 Weak Module',
        key: 'F2Weak',
        blockLength: 4,
        infoBlockLength: 4
    }];

    $scope.selections = {};

    $scope.selections.embed_algorithm = 0;
    $scope.selections.decode_algorithm = 0;
    $scope.updateCoverMaxInfoSize = function(){};

  	$scope.notpaletted = true;
    $scope.cover_queue = [];
    $scope.info_queue  = [];

    $scope.$watch('cover', function(file){
        //$scope.cover_queue = files;
        coverHandler(file);
    });
    $scope.$watch('info', function(file){
        //$scope.info_queue = files;
        infoHandler(file);
    });

    function coverHandler(file, callback){
        // var file;
        // if (files.length) file = files.shift();
        if (file && validImage(file.name)) {
            $scope.notpaletted = false;
            var reader = new FileReader();
            reader.onload = function (loadEvent) {
                $scope.coverDataURL = loadEvent.target.result;
                var img = new Image;
                img.onload = function(){
                    var imwidth  = img.width,
                        imheight = img.height;

                    $scope.cover_width = imwidth;
                    $scope.cover_height = imheight;
                    $scope.cover_max_info_size_prefix = 'at least ';
                    if (!validPng($scope.cover_name)) {
                        var canvas = document.createElement('canvas');
                        canvas.width = imwidth;
                        canvas.height = imheight;
                        var context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0, imwidth, imheight);
                        $scope.coverDataURL = canvas.toDataURL();
                    }
                    $scope.updateCoverMaxInfoSize = function(){
                        $scope.cover_max_info_size = maxhide(imwidth, imheight, $scope.algorithms[$scope.selections.embed_algorithm].blockLength, $scope.algorithms[$scope.selections.embed_algorithm].infoBlockLength);
                        $http.post('/api/maxInfoSize', {
                            algorithm: $scope.algorithms[$scope.selections.embed_algorithm].key,
                            cover: $scope.coverDataURL,
                        }).then(function(data){
                            $scope.cover_max_info_size_prefix = '';
                            $scope.cover_max_info_size = data.data.availableSpace_ForEmbedding;
                            $scope.$apply();
                        });
                    };
                    $scope.updateCoverMaxInfoSize();
                    $scope.$apply();
                    if (callback) callback();
                };
                $scope.cover_src = $scope.coverDataURL;
                img.src = $scope.coverDataURL;
            }
            $scope.cover_name = file.name;
            reader.readAsDataURL(file);
        }
    };

    function infoHandler(file, callback){
        // var file;
        // if (files.length) file = files.shift();
        if (file) {
	    	var reader = new FileReader();
	        reader.onload = function (loadEvent) {
	            $scope.infoDataURL = loadEvent.target.result;
	            $scope.$apply();
                if (callback) callback();
	        }
        	$scope.info_name = file.name;
        	$scope.info_size = file.size;
        	reader.readAsDataURL(file);
        }
    };

    $scope.embed_tasks = [];
    $scope.avg_psnr = 0;
    function avg_psnr_fn(){
    	var result = 0, count = 0;;
    	for (var i = 0; i < $scope.embed_tasks.length; i++) {
    		if ($scope.embed_tasks[i].psnr) {
    			result += $scope.embed_tasks[i].psnr;
    			count++;
    		}
    	};
    	$scope.avg_psnr = result/count;
    	$scope.$apply();
    };

    $scope.embedZipPng = new JSZip();
    $scope.embedZipBmp = new JSZip();
    $scope.embed_tasks.processing = 0;

    $scope.$watch('embed_tasks.processing', function(){
        if ($scope.embed_tasks.processing === 0) {
            $scope.embedZipPngLink = URL.createObjectURL($scope.embedZipPng.generate({type:"blob"}));
            //$scope.embedZipBmpLink = URL.createObjectURL($scope.embedZipBmp.generate({type:"blob"}));
        }
        $scope.embedProcessingPercent = (($scope.embed_tasks.length-$scope.embed_tasks.processing)*100/$scope.embed_tasks.length)>>0;
    });

    $scope.runEmbed = function(){
        //if ($scope.cover_queue && $scope.info_queue){// && $scope.cover_queue.length === $scope.info_queue.length){
        //    coverHandler($scope.cover_queue, function(){//.shift(), function(){
        //        infoHandler($scope.info_queue, function(){//.shift(), function(){
                    $scope.embed();//function(){
                        //$scope.runEmbed();
                    //});
        //        });
        //    });
        //}
    }

    $scope.embed = function(callback){
    	if ($scope.infoDataURL && $scope.coverDataURL) {
            $scope.embedZipPngLink = false;
            $scope.embedZipBmpLink = false;
            $scope.embed_tasks.processing++;
    		var task = {
    			width: $scope.cover_width,
    			height: $scope.cover_height,
    			size: $scope.info_size,
                algorithm: $scope.algorithms[$scope.selections.embed_algorithm].name,
                org: $scope.coverDataURL,
                name: $scope.cover_name.substring(0, $scope.cover_name.length-4) + '.'+$scope.info_name.substring(0, $scope.info_name.lastIndexOf('.'))+'.'
    		}
    		$scope.embed_tasks.unshift(task);
    		if (true){//task.size < $scope.cover_max_info_size) {
	    		$http.post('/api/embed', {
	    			algorithm: $scope.algorithms[$scope.selections.embed_algorithm].key,
	    			cover: $scope.coverDataURL,
	    			cover_name: $scope.cover_name,
	    			info: $scope.infoDataURL,
	    			info_name: $scope.info_name,
                    password: $scope.s.cover_password
		    	}).then(function(data){
                    task.image_link = 'data:image/png;base64,' + data.data.data;
                    
                    if ($scope.embedZipPng.file(task.name+'png')){
                            $scope.embedZipPng.file(task.name+Date.now()+'.png', data.data.data, {base64: true});
                        } else {
                            $scope.embedZipPng.file(task.name+'png', data.data.data, {base64: true});
                        }
                    

		    		task.link = URL.createObjectURL(b64toBlob(data.data.data, 'image/png'));
                    task.paletted = data.data.paletted;
                    var img = new Image;
                    img.onload = function(){
                        var canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0, img.width, img.height);
                        var bmpLink = buildBMP(canvas);
                        if ($scope.embedZipBmp.file(task.name+'bmp')){
                            $scope.embedZipBmp.file(task.name+Date.now()+'.bmp', bmpLink, {base64: true});
                        } else {
                            $scope.embedZipBmp.file(task.name+'bmp', bmpLink, {base64: true});
                        }

                        task.bmpLink = URL.createObjectURL(b64toBlob(bmpLink, 'image/bmp'));
                        $scope.$apply();
                    }
                    task.psnr = data.data.psnr;
                    img.src = task.image_link;
		    		avg_psnr_fn();
                    $scope.embed_tasks.processing--;
		    	}, function(data){
                    $scope.embed_tasks.processing--;
		    		switch(data.data.message){
		    			case 'WRONG_FILE_TYPE':
		    			case 'NOT_PALETTED':
		    				task.fail = 'Image is not paletted png!';
		    				$scope.notpaletted = true;
		    				break;
		    			case 'INFO_TOO_LONG':
		    				task.fail = 'File is too big!';
		    				break;
		    			default:
		    				task.fail = 'Unknown error!';
		    				break;
		    		}
                    $scope.$apply();
		    	});
		    } else {
                task.fail = 'File too big!';
            }
            if (callback) callback();
            $scope.$apply();
    	}
    };
    $scope.$watch('container', containerHandler);
    function containerHandler (file){
        //var file;
        //if (files.length) file = files.shift();
        if (file && validImage(file.name)){
        	var reader = new FileReader();
            reader.onload = function (loadEvent) {
                $scope.containerDataURL = loadEvent.target.result;
                var img = new Image;
                img.onload = function(){
                	$scope.container_width = img.width;
                	$scope.container_height = img.height;
                    if (!validPng($scope.container_name)) {
                        var canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0, img.width, img.height);
                        $scope.containerDataURL = canvas.toDataURL();
                    }
                    $scope.container_src = $scope.containerDataURL;
                	$scope.$apply();
                    $scope.decode(function(){
                        containerHandler(files);
                    });
    			};
                img.src = $scope.containerDataURL;
            }
        	$scope.container_name = file.name;
        	reader.readAsDataURL(file);
        }
    };

    $scope.$watch('containerDataURL', $scope.decode);

    $scope.decode_tasks = [];
    $scope.decode = function(callback){
    	if ($scope.containerDataURL) {
    		var task = {
    			width: $scope.container_width,
    			height: $scope.container_height,
    			size: $scope.container_size,
                algorithm: $scope.algorithms[$scope.selections.decode_algorithm].name
    		}
    		$scope.decode_tasks.push(task);
            console.log($scope.s.decode_password)
    		$http.post('/api/decode', {
    			algorithm: $scope.algorithms[$scope.selections.decode_algorithm].key,
    			container: $scope.containerDataURL,
    			container_name: $scope.container_name,
                password: $scope.s.decode_password
	    	}).then(function(data){
	    		task.link = URL.createObjectURL(b64toBlob(data.data.data));
	    		task.size = data.data.size;
                task.ext = data.data.ext;
	    	}, function(data){
	    		switch(data.data.message){
	    			case 'WRONG_FILE':
                        task.fail = 'Wrong file or password or algorithm!';
                        break;
	    			case 'WRONG_FILE_TYPE':
                        task.fail = 'Wrong file type!';
                        break;
	    			case 'NOT_PALETTED':
	    				task.fail = 'Image not paletted!';
	    				break;
	    			default:
	    				task.fail = 'Unknown error!';
	    				break;
	    		}
                if (data.data.error) console.log(data.data.error)
	    	});
            if(callback) callback();
    	}
    }
    $scope.random_tasks = []
    $scope.embedZipData = new JSZip();
    $scope.random_tasks.processing = 0;
    $scope.$watch('random_tasks.processing', function(){
        if ($scope.random_tasks.processing === 0) {
            $scope.embedZipDataLink = URL.createObjectURL($scope.embedZipData.generate({type:"blob"}));
        }
        $scope.randomProcessingPercent = (($scope.random_tasks.length-$scope.random_tasks.processing)*100/$scope.random_tasks.length)>>0;
    })
    $scope.generate = function(){
        if (!isNaN(parseFloat($scope.s.random_size)) && isFinite($scope.s.random_size)) {
            $scope.random_tasks.processing++;
            var task = {
                size: $scope.s.random_size
            }
            $scope.embedZipDataLink = false;
            if (task.size < 5 * 1024 && task.size > 0) {
                $scope.random_tasks.push(task);
                $http.post('/api/randomFile', {
                    kb: task.size,
                }).then(function(data){
                    $scope.random_tasks.processing--;
                    
                    $scope.embedZipData.file('data_'+task.size+'kb.bin', data.data.file, {base64: true});
                    if ($scope.embedZipData.file('data_'+task.size+'kb.bin')){
                        $scope.embedZipData.file('data_'+task.size+'kb.'+Date.now()+'.bin', data.data.file, {base64: true});
                    } else {
                        $scope.embedZipData.file('data_'+task.size+'kb.bin', data.data.file, {base64: true});
                    }
                    task.link = URL.createObjectURL(b64toBlob(data.data.file));
                    $scope.$apply();
                }, function(data){
                    $scope.random_tasks.processing--;
                    task.fail = 'FAILED';
                    $scope.$apply();
                });
            } else task.fail = 'FAILED';
        }
        $scope.$apply();
    }
  });
