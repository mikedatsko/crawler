const Crawler = require('crawler');
const resultList = [];

function RunCrawler(url) {
    const c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                // console.log('res', res);
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server

                const aList = $('a')
                    .map(function() {
                        // console.log('a', a);
                        return {
                            href: $(this).attr('href'),
                            title: $(this).text()
                        };
                    })
                    .get()
                    .filter(link => link.href && link.href.toString().substr(0, url.length) === url);

                if (aList.length) {
                    aList.forEach(a => {
                        resultList.push(a.href);
                    });
                }

                console.log(res.options.uri, $('title').text(), aList.length);
                console.log(resultList);

                // aList.forEach(a => {
                //     resultList.push(a.href);
                // });
            }

            done();
        }
    });

    // Queue just one URL, with default callback
    // c.queue('http://www.amazon.com');
    c.queue(url);

    // Queue a list of URLs
    // c.queue(['http://www.google.com/','http://www.yahoo.com', 'https://www.blog.wordpress.com']);

    // Queue URLs with custom callbacks & parameters
    // c.queue([{
    //     uri: 'http://parishackers.org/',
    //     jQuery: false,
    //
    //     // The global callback won't be called
    //     callback: function (error, res, done) {
    //         if(error){
    //             console.log(error);
    //         }else{
    //             console.log('Grabbed', res.body.length, 'bytes');
    //         }
    //         done();
    //     }
    // }]);

    // Queue some HTML code directly without grabbing (mostly for tests)
    // c.queue([{
    //     html: '<title>Test</title><p>This is a <strong>test</strong> <a href="test.html">test link</a></p>'
    // }]);
}



RunCrawler('https://en.blog.wordpress.com');
