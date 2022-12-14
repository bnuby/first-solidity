/**
 * @type {import('next')['default']}
 */
const next = require('next');
const routes = require('./routes');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

// with express
const express = require('express');
app.prepare().then(() => {
    express()
        .use(handler)
        .listen(3000, () => {
            console.log('Server is listen at :3000');
        });
});
