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

  return _.uniq(links).filter(link => link.substr(0, 1) === '/');
}

async function crawl(url) {
  try {
    const crawler = await htcap.launch(url, {maxExecTime: 3000});
    await crawler.start();
    await crawler.on('domcontentloaded');

    const selector = 'body';
    const html = await crawler.page().$eval(selector, node => node.innerHTML);
    const dom = new JSDOM(html);
    crawler.browser().close();

    return getLinks(dom);
  } catch(error) {
    console.log('error', error);
    return [];
  }
}

async function runCrawler(host, url, limit, links, resultLinks) {
  if (!links) {
    links = [];
  }

  if (!resultLinks) {
    resultLinks = [];
  }

  resultLinks.push(url);

  console.log('[runCrawler]', host, url, limit, links.length, resultLinks.length);

  if (resultLinks.length === limit) {
    console.log('Done', host, url, limit, links.length, resultLinks.length);
    return resultLinks;
  }

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

  if (links.length + resultLinks.length >= limit) {
    console.log('Limit', limit, links.length, resultLinks.length);
    return runCrawler(host, links.shift(), limit, links, resultLinks);
  }

  const crawledLinks = await crawl(`${host}${url}`);
  links = _.uniq([...links, ...crawledLinks]).filter(cl => !resultLinks.includes(cl));

  if (links.length) {
    console.log('New links', limit, links.length, resultLinks.length);
    return runCrawler(host, links.shift(), limit, links, resultLinks);
  }

  // const emptyLinks =

  return resultLinks;

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

function formatDuration(sourceDuration) {
  const value = Math.floor(sourceDuration / 1000);
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value - hours * 3600) / 60);
  const seconds = value - hours * 3600 - minutes * 60;
  const duration = [hours, minutes, seconds];

  if (duration[0] === 0) {
    duration.shift();
  }

  return duration.map(d => `0${d}`.substr(-2)).join(':');
}

const host = 'https://github.com';

(async () => {
  const startTime = new Date().getTime();
  const links = await runCrawler(host, '/', 100);

  console.log('[links]', links.length);

  for (let link of links) {
    console.log('LINK to ' + link);
  }

  console.log('Execution time:', formatDuration(new Date().getTime() - startTime));
})();

// crawler.on('newdom', async function(e, crawler){
//   console.log('newdom');
//   const selector = e.params.rootNode;
//   const html = await crawler.page().$eval(selector, node => node.innerHTML);
//   const dom = new JSDOM(html);
//   links = [...links, ...getLinks(dom)];
// });
