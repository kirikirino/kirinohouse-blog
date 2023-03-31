/* global hexo */

/*
{% animes %}
- title: #main title
  url: #link of title
  poster: #anime poster (nullable)
  year: #anime year (nullable)
  category: #anime category (nullable)
  model: #model (nullable)
{% endanimes %}

{% animesfile [path] %}
*/

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const url = require('url');

function animesGrid(args, content) {
  const theme = hexo.theme.config;

  if(!args[0] && !content) {
    return
  }

  if(args[0]) {
    const filepath = path.join(hexo.source_dir, args[0]);
    if(fs.existsSync(filepath)) {
      content = fs.readFileSync(filepath);
    }
  }

  if (!content) {
    return
  }

  const titleHost = url.parse(hexo.config.url).hostname || hexo.config.url;

  const list = yaml.load(content);

  var result = ''

  list.forEach(item => {
    if(!item.url || !item.title) {
      return;
    }

    var urlparam = {};

    if(item.url) {
      urlparam = url.parse(item.url);
    }

    var item_poster = item.poster || theme.images + '/404.png';

    if (!item_poster.startsWith('//') && !item_poster.startsWith('http')) {
      item_poster = theme.statics + item_poster;
    }

    if (item.year.indexOf("春")!=-1){
      var item_color = "spring"
    }else if(item.year.indexOf("夏")!=-1){
      var item_color = "summer"
    }else if(item.year.indexOf("秋")!=-1){
      var item_color = "fall"
    }else if(item.year.indexOf("冬")!=-1){
      var item_color = "winter"
    }else{
      var item_color = "random"
    }

    if (item.category.indexOf("原创")!=-1){
      var item_category = "original"
    }else if(item.category.indexOf("漫画")!=-1){
      var item_category = "comics"
    }else if(item.category.indexOf("小说")!=-1){
      var item_category = "novel"
    }else if(item.category.indexOf("游戏")!=-1){
      var item_category = "game"
    }else{
      var item_category = "random"
    }

    item.color = item.color? ` style="--block-color:"${item.color}";"` : '';

    result += `<div class="item ${item_color}" title="${item.title}"${item.color}>`;

    if (urlparam.protocol && urlparam.hostname !== titleHost) {
      var durl = Buffer.from(item.url).toString('base64');
      result += `<span class="exturl image ${item.model || "list"}" data-url="${durl}" data-background-image="${item_poster}"></span>
          <div class="info">
          <span class="exturl title" data-url="${durl}">${item.title}</span>
          <p class="year ${item_color}">${item.year || "XXXX年秋"}</p>
          <p class="category ${item_category}">${item.category || "未知类型"}</p>
          </div></div>`;
    } else {
      result += `<a href="${item.url}" class="image ${item.model || "list"}" data-background-image="${item_poster}"></a>
          <div class="info">
          <a href="${item.url}" class="title">${item.title}</a>
          <p class="year ${item_color}">${item.year || "XXXX年秋"}</p>
          <p class="category ${item_category}">${item.category || "未知类型"}</p>
          </div></div>`;
    }
  });

  return `<div class="animes">${result}</div>`;

}

hexo.extend.tag.register('animes', animesGrid, {ends: true});
hexo.extend.tag.register('animesfile', animesGrid, {ends: false, async: true})
