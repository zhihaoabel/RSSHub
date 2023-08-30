module.exports = (router) => {
    router.get('/hot-list/:category/:date/:page', require('./hot-list'));
    router.get(/([\w-/]+)?/, require('./index'));
};
