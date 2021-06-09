// ==UserScript==
// @name         小说下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        <$URL$>
// @grant        none
// @include      *www.va-etong.com*
// ==/UserScript==

var Protocol = window.location.protocol.split(':')[0];
var ymurl = Protocol + "://" + window.location.host;

function get_content(bookid, chapterid, callback) {
    var xid = Math.floor(bookid / 1000)
    var url_get_data = `${ymurl}/files/article/html555/${xid}/${bookid}/${chapterid}.html`;
    $.ajax({
        type: "GET",
        url: url_get_data,
        dataType: "text",
        cache: true,
        success: function (msg) {
            msg = eval(msg);
            msg = msg.replace(/&nbsp;/g, ' ');
            msg = msg.replace(/<br><br>/g, '\r\n');
            callback && callback(msg);
        }
    });
}

function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}

function download(name, data) {
    var urlObject = window.URL || window.webkitURL || window;

    var downloadData = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
    save_link.download = name;
    fake_click(save_link);
}
(function () {
    'use strict';
    var insertElement = document.createElement("a");
    insertElement.className = "border-btn";
    insertElement.href = "#";
    insertElement.innerHTML = '下载全书';
    insertElement.onclick = function (f) {
        insertElement.innerHTML = "下载中……";
        insertElement.disabled = true;
        var zliets = document.getElementsByClassName('cf')[3];
        var zs = zliets.children;
        const datas = [];
        var total = zs.length;
        for (let i = 0; i < zs.length; i++) {
            const gl = zs[i];
            var title = gl.innerText;
            var ds = gl.firstElementChild.href.split('/');
            var url = ds[ds.length - 1];

            var j = url.indexOf(".");
            url = url.substr(0, j);

            get_content(158348, url, function (msg) {
                datas.push({ id: i, title: gl.innerText, url: url, content: msg });
                total--;
                insertElement.innerHTML = `下载中,${total}…`;
                if (total == 0) {
                    datas.sort((a, b) => a.id - b.id);

                    insertElement.innerHTML = '下载全书';
                    var books = "";
                    datas.forEach(w => {
                        books += w.title + "\r\n" + w.content + "\r\n\r\n"
                    });
                    download("save.txt", books);
                }
            });
        }
    }
    document.getElementsByClassName('btn')[0].appendChild(insertElement);
})();