var onHeadersReceived = function(resp){
    console.log(resp.tabId);

    if (resp.tabId != -1){
        // do not intercept request from tabs
        return;
    }

    var headers = {};

    for (var i=0; i<resp.responseHeaders.length; i++){
        var h = resp.responseHeaders[i];
        console.log(sprintf("%s: %s", h.name, h.value));
        headers[h.name] = h.value;
    }

    if (headers.status == '302 Found' && headers.location){
        return {
            redirectUrl: sprintf("data:application/json;charset=utf-8,%s", 
                encodeURIComponent(JSON.stringify({url: headers.location}))
            )
        };
    }
};

var onMessage = function(request, sender, sendResponse){
    if (!request.imgurl)
        return;

    var searchuri = sprintf(
        'https://images.google.com/searchbyimage?image_url=%s&image_content=&filename=',
        encodeURIComponent(request.imgurl)
    );

    // searchuri += "&q=site%3Ataobao.com&oq=site%3Ataobao.com";

    $.get(searchuri).done(function(resp){
        var Q = $(resp);

        var result = Q.find('div.srg li.g h3.r a');

        if (result.length == 0)
            return;


        var not_pinkoi_links = [];
        for (var i=0; i<result.length; i++){
            var r = $(result[i]);
            r = {
                text: r.text(),
                href: r.attr('href')
            };
            console.log(sprintf("%s - %s", r.text, r.href));

            if (r.href.indexOf('pinkoi') < 0){
                console.log('not pinkoi related link');
                not_pinkoi_links.push(r);
            }
        }

        sendResponse({result: not_pinkoi_links});
        /*
        if (not_pinkoi_links.length > 0){
        }
        */

        // debugger

        /*
        if (!resp.url){
            return;
        }

        $.get(resp.url + "&q=site%3Ataobao.com&oq=site%3Ataobao.com").done(function(resp){
            debugger
        });
        */
    }).fail(function(err){
        debugger
    });
};

/*
chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceived, 
    {urls: ["*://images.google.com/*"]}, // filter
    ["responseHeaders", "blocking"] // extra options
);
*/

chrome.runtime.onMessage.addListener(onMessage);
