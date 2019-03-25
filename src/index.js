const htcap = require('htcrawl');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const _ = require('lodash');

function getLinks(dom) {
  const tags = dom.window.document.querySelectorAll('a');

  if (!tags || !tags.length) {
    return [];
  }

  console.log(tags.length);

  const links = [];

  for (let i = 0; i < tags.length; i++) {
    links.push(tags[i].href);
  }

  return _.uniq(links).filter(link => link.substr(0, 1) === '/').map(link => ({
    url: link,
    isPassed: false
  }));
}

async function crawl(url) {
  const crawler = await htcap.launch(url, {maxExecTime: 3000});
  await crawler.start();
  await crawler.on('domcontentloaded');

  const selector = 'body';
  const html = await crawler.page().$eval(selector, node => node.innerHTML);
  const dom = new JSDOM(html);
  crawler.browser().close();

  return getLinks(dom);
}

async function runCrawler(host, url, links) {
  console.log('[runCrawler]', host, url);

  if (!links) {
    links = [];
  }

  links.push(url);

  // if (!links || !links.length) {
  //   return [];
  // }

  // crawler.on('xhr', e => {
  //   console.log('XHR to ' + e.params.request.url);
  // });

  // crawler.on('domcontentloaded', async (e) => {
  //   console.log('domcontentloaded');
  //   const selector = 'body';
  //   // const crwl = await domcontentloaded();
  //   const html = await crawler.page().$eval(selector, node => node.innerHTML);
  //   const dom = new JSDOM(html);
  //   newLinks = getLinks(dom);
  //   // crawler.browser().close();
  // });

  const newLinks = await crawl(`${host}${url}`);

  const emptyLinks

  links = newLinks;

  return links;

  // if (newLinks.length) {
  //
  // }
  //
  //
  //
  // const diff = links.length ? _.difference(links, newLinks) : _.uniq(newLinks);
  //
  // console.log('[newLinks]', newLinks.length, diff.length);
  //
  // if (diff.length) {
  //   return await runCrawler(host, diff[0]);
  // }
  //
  // console.log('[started]', newLinks.length, links.length);
  // crawler.browser().close();
  //
  // return links;
}

const host = 'https://weblocale.net';

(async () => {
  const links = await runCrawler(host, '/');

  console.log('[links]', links.length);

  for (let link of links) {
    console.log('LINK to ' + link.url);
  }
})();

// crawler.on('newdom', async function(e, crawler){
//   console.log('newdom');
//   const selector = e.params.rootNode;
//   const html = await crawler.page().$eval(selector, node => node.innerHTML);
//   const dom = new JSDOM(html);
//   links = [...links, ...getLinks(dom)];
// });
