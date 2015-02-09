var imgurl = $('.primaryzoom').attr('href');
var extensionID = 'clpfgehdclceblmaknjjeidhbjcdpkpj';

if (imgurl){
    /*
    chrome.runtime.sendMessage(extensionID, {imgurl: imgurl}, null, function(resp){
        console.log(resp);
        debugger;
    });
    */

    var searchuri = sprintf(
        'https://images.google.com/searchbyimage?image_url=%s&image_content=&filename=',
        encodeURIComponent(imgurl)
    );

    $('#photo').append('<div id="pkcp" style="padding: 10px; background-color: gray;"><h3 style="color:white;">正在自動搜尋是否有非 Pinkoi 網站也使用這張圖</h3></div>')

    // searchuri += "&q=site%3Ataobao.com&oq=site%3Ataobao.com";
    $.get(searchuri).done(function(resp){
        var Q = $(resp);

        var result = [];
        Q.find('div.srg li.g').each(function(idx, elem){
            var r = $($(elem).find('h3.r a')[0]);
            if (r.attr('href').indexOf('pinkoi') < 0){
                result.push({
                    text: r.text(),
                    href: r.attr('href'),
                    type: $(elem).find('img').length
                });
            }
        });

        var html;
        if (result.length > 0){
            html = '<div id="pkcp" style="padding: 10px; background-color: black;"><h3 style="color:#fd6072;">有非 Pinkoi 網站也使用這張圖</h3><ul>%s</ul><br><br><div style="text-align: right; color: #aaa;">Powered by <a href="%s" target="_blank">Googe Image Search</a></div></div>';
            var li_list = "";
            for (var i=0; i<result.length; i++){
                var l = result[i];
                li_list += sprintf(
                    '<li><a href="%s" target="_blank">[%s] %s</a></li>', 
                    l.href, 
                    l.type>0 ? '相同':'類似', l.text
                );
            }
            html = sprintf(html, li_list, searchuri);

        }else{
            html = sprintf('<div id="pkcp" style="padding: 10px; background-color: #ccc;"><h3 style="color:#fd6072;">沒有其它網站也使用這張圖</h3><br><br><div style="text-align: right; color: #aaa;">Powered by <a href="%s" target="_blank">Googe Image Search</a></div></div>', searchuri);
        }
        $('#pkcp').remove();
        $('#photo').append($(html));
    }).fail(function(err){
        console.log(err);
        debugger
    });
}
