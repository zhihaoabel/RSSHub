module.exports = (router) => {
    router.get('/hot-list/([\\w-/]+)?/', require('./hot-list'));
    router.get(/([\w-/]+)?/, require('./index'));
};
