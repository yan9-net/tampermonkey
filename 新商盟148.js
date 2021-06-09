// ==UserScript==
// @name         新商盟订单解析148
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        <$URL$>
// @grant        none
// @include      */eciop/orderForCC/cgtListForCC.htm*
// @include      */eciop/orderForCC/myCoDetailForCC*
// @include      *://www.xinshangmeng.com/xsm2/*
// ==/UserScript==

(function () {
    'use strict';
    //引入VUE和VANT
    let vantcss = document.createElement("link");
    vantcss.rel = "stylesheet";
    vantcss.href = "https://cdn.jsdelivr.net/npm/vant@2.9/lib/index.css";

    let vue = document.createElement("script");
    vue.src = "https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js";
    let vantjs = document.createElement("script");
    vantjs.src = "https://cdn.jsdelivr.net/npm/vant@2.9/lib/vant.min.js";

    let initVued = false;

    function initVue() {
        try {
            if (initVued) return;
            new Vue({
                el: 'body',
                created() {
                    const _this = this;
                    if (document.URL.indexOf("/eciop/orderForCC/cgtListForCC.htm") > -1) {
                        var theform = $('.order-time');
                        $('<span id="show_total_num" class="iconfont" data-headstatus="down" title="查询可定量" xsm-log="direct"></span>').appendTo(theform);
                        $("#show_total_num").on("click", _this.onCheckClick);
                    } else if (document.URL.indexOf("/eciop/orderForCC/myCoDetailForCC") > -1) {
                        var theform = $("div[class='f14 lineh40 pl10 textmg']");
                        $('<a id="output_data" style="margin-left:20px" >导出数据</a>').appendTo(theform);
                        $("#output_data").on("click", _this.onOutputClick);
                    } else if (document.URL.indexOf("http://www.xinshangmeng.com/xsm2/") === 0) {
                        $('#username').val('510105205148');
                        setTimeout(() => {
                            $('#mcmm').val('$801105gujiagen');
                            setTimeout(() => {
                                $('#btn-login').click();
                            }, 300);
                        }, 300);
                    }
                },
                methods: {
                    onOutputClick() {
                        this.$toast({
                            type: 'loading',
                            overlay: true, //显示遮罩
                            forbidClick: true,
                            message: '加载中...',
                        });

                        const orderInfo = document.getElementsByClassName("f14 lineh40 pl10 textmg")[0];
                        let orderNo = orderInfo.firstElementChild.firstElementChild.innerText;
                        let orderTime = orderInfo.childNodes[3].firstElementChild.innerText;

                        let order = {
                            OrderNo: orderNo,
                            OrderTime: orderTime,
                            Quantity: 0,
                            Amount: 0,
                            List: []
                        };

                        const table = document.getElementById("cgt");
                        if (!table) {
                            return;
                        }
                        const tbody = table.getElementsByTagName("tbody");
                        if (!tbody || tbody.length == 0) {
                            return;
                        }
                        const rows = tbody[0].getElementsByTagName("tr");
                        if (!rows || rows.length == 0) {
                            return;
                        }
                        for (let index = 0; index < rows.length; index++) {
                            const row = rows[index];
                            const tds = row.getElementsByTagName("td");

                            const url = tds[1].firstChild.href;

                            let item = {
                                No: tds[0].innerText,
                                Code: url.substr(url.indexOf("=") + 1),
                                Name: tds[1].innerText,
                                BuyPrice: tds[2].innerText,
                                SallPrice: tds[3].innerText,
                                Quantity: tds[5].innerText
                            };
                            order.Quantity += Number(item.Quantity);
                            order.Amount += Math.round(Number(item.BuyPrice) * 1000) * Number(item.Quantity);
                            order.List.push(item);
                        }
                        order.Amount = order.Amount / 1000;
                        console.log(order);
                        setTimeout(() => {
                            this.$toast.clear();
                        }, 3000);
                    },
                    onCheckClick() {
                        var _rthis = this;
                        _rthis.$toast({
                            type: 'loading',
                            overlay: true, //显示遮罩
                            forbidClick: true,
                            message: '加载中...',
                        });
                        var list = $('#newul').children();
                        var curTime = new Date;
                        var count = list.length;
                        for (var i = 0; i < list.length; i++) {
                            var _this = list[i];
                            var now = $(_this).find('.xsm-order-list-shuru-input')[0]; //_this.children('.xsm-order-list-shuru-input');
                            var max = $(_this).find('.cgt-col-qtl-lmt')[0]; // _this.children('.cgt-col-qtl-lmt');
                            if (max.innerText === '--') {
                                var cgt_code = $(now).attr("data-cgt-code");
                                var cur_code = $(now).attr("data-cur-code");

                                var url = getlink + "order/cgtCo.do?method=getBusiCgtLmt&orgCode=" + porgCode + "&custCode=" + pcustCode + "&cgtCode=" + cgt_code + "&orderId=&orderDate=" + porderDate + "&zone=" + porgCode + "&v=" + curTime.getTime();
                                getBusiCgtLmt(url, cur_code, function (data, rowCode) {
                                    if (data.length > 0) {
                                        data = data[0];
                                    } else {
                                        return;
                                    }
                                    var itm = document.getElementById('qty_lmt_' + data.CGT_CARTON_CODE);
                                    if (itm) {
                                        itm.innerHTML = '' + data.QTY_LMT;
                                    }
                                    count--;
                                    if (count <= 0) {
                                        _rthis.$toast.clear();
                                    }
                                });
                            }
                        }
                    }
                }
            });
            initVued = true;
            console.log('vue ok');
        } catch (err) {
            return;
        }
    }
    document.head.appendChild(vue);
    document.head.appendChild(vantcss);
    document.head.appendChild(vantjs);

    function loadVue() {
        console.log('loading vue!');
        initVue();
        setTimeout(function () {
            if (!initVued) {
                loadVue();
            }
        }, 500);
    }
    loadVue();
})();