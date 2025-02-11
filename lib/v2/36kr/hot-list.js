const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');

const { rootUrl } = require('./utils');

const categories = {
    24: {
        title: '24小时热榜',
        key: 'homeData.data.hotlist.data',
    },
    renqi: {
        title: '资讯人气榜',
        key: 'hotListData.topList',
    },
    zonghe: {
        title: '资讯综合榜',
        key: 'hotListData.hotList',
    },
    shoucang: {
        title: '资讯综合榜',
        key: 'hotListData.collectList',
    },
};

module.exports = async (ctx) => {
    let category = ctx.params.category ?? 'zonghe';
    category = categories[category] ?? 'zonghe';

    const currentUrl = category === '24' ? rootUrl : `${rootUrl}/hot-list/catalog`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const getProperty = (object, key) => key.split('.').reduce((o, k) => o && o[k], object);
    const data = getProperty(JSON.parse(response.data.match(/window.initialState=({.*})/)[1]), categories[category].key);

    const items = data
        .slice(0, ctx.query.limit ? parseInt(ctx.query.limit) : 30)
        .filter((item) => item.templateType !== 0)
        .map((item) => {
            item = item.templateMaterial ?? item;
            return {
                title: item.widgetTitle.replace(/<\/?em>/g, ''),
                author: item.authorName,
                pubDate: parseDate(item.publishTime),
                link: `${rootUrl}/p/${item.itemId}`,
                description: item.summary,
                image: item.widgetImage,
            };
        });

    ctx.state.data = {
        title: `36氪 - ${categories[category].title}`,
        link: currentUrl,
        item: items,
    };
};
