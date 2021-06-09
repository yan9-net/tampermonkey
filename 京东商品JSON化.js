// ==UserScript==
// @name         京东助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        <$URL$>
// @grant        none
// @include      *jd.com*
// ==/UserScript==
(function () {
    'use strict';
    // var jq = document.createElement("script");
    // jq.type = "text/javascript";
    // jq.src = "https://mat1.gtimg.com/libs/jquery2/2.2.0/jquery2.min.js";
    // document.body.appendChild(jq);

    var insertElement = document.createElement("li");
    insertElement.id = "temp_get_list_texst";
    insertElement.className = "";
    insertElement.innerHTML = '<div class="dt cw-icon ui-areamini-text-wrap" style="">				<i class="iconfont"></i>				<span class="ui-areamini-text" data-id="22" title="">获取</span> 			</div>	';
    insertElement.onclick = function (f) {
        var goods = document.getElementsByClassName('gl-item');
        const datas = [];
        const classify = document.getElementsByClassName("trigger")[1].innerText.trim();
        var sql = '';
        for (let i = 0; i < goods.length; i++) {
            if (i >= 10) break;
            const gl = goods[i];
            const data = {};
            data.name = gl.getElementsByClassName("p-name")[0].getElementsByTagName('em')[0].innerText.replace('京东国际', '').trim();
            data.Log = gl.getElementsByClassName("p-img")[0].getElementsByTagName('img')[0].src.trim();
            data.url = gl.getElementsByClassName("p-img")[0].getElementsByTagName('a')[0].href.trim();
            data.price = gl.getElementsByClassName("p-price")[0].getElementsByClassName("J_price")[0].getElementsByTagName('i')[0].innerText.trim();
            var vip = gl.getElementsByClassName("p-price")[0].getElementsByClassName("price-plus-1");
            if (vip && vip.length > 0) {
                data.vip_price = gl.getElementsByClassName("p-price")[0].getElementsByClassName("price-plus-1")[0].getElementsByTagName('em')[0].innerText.trim();
            } else {
                data.vip_price = '0.00';
            }

            var names = data.name.split(' ');
            var reg = RegExp(/】|\]|\)\}/);
            if (names[0].match(reg)) {
                names = data.name.replace(/.+?[】|\]|\)\}]/, '').split(' ');
            }
            data.brand = names[0];
            datas.push(data);
            sql = sql + `EXEC [dbo].[GoodsSkuInsert] @ClassifyName = N'${classify}',@BrandName = N'${data.brand}',@SkuName = N'${data.name}',@GoodsSkuLog = N'${data.Log}';\r\n`;
        }
        console.log(sql);

    }
    document.getElementById('ttbar-home').appendChild(insertElement);
})();