// ==UserScript==
// @name         图说数据获取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        <$URL$>
// @grant        none
// @include      https://tushuo.baidu.com/wave*
// ==/UserScript==
(function () {
    'use strict';
    setTimeout(() => {
        let getter = document.createElement('div');
        getter.setAttribute('data-cpt', "type:'button',name: 'previewBtn',viewModel: {css: ['dtm-btn', 'dtm-head-btn', 'dtm-preview-btn']}");
        getter.className = 'cpt cpt-btn dtm-btn dtm-head-btn dtm-preview-btn';
        getter.innerHTML = "获取数据";

        getter.addEventListener('click', function (e) {
            let root = [];
            let rows = document.getElementsByClassName('htCore')[0].children[2].children
            for (let i = 0; i < rows.length; i++) {
                const tr = rows[i];
                for (let j = 0; j < tr.children.length; j++) {
                    const td = tr.children[j];
                    if (i == 0 && j > 0 && td.innerText) {
                        root.push({ Title: td.innerText, Values: [] });
                    } else {
                        if (j > 1 && td.innerText) {
                            let itm = { Key: tr.children[1].innerText, Value: td.innerText };
                            root[j - 2].Values.push(itm);
                        }
                    }
                }
            }
            console.log(JSON.stringify(root));
        });

        let rows = document.querySelector('.dtm-mfhdr-btns');
        rows.style.width = "420px";
        rows.appendChild(getter);
    }, 3000);

})();