'use strict';

var doRequest = require('request');
var nodefn = require('when/node');
var _ = require('lodash');

/**
 *
 * @param baseConfig
 * @param method
 * @param depth
 * @param xml
 * @returns {Promise}
 */
function request(baseConfig, method, depth, xml) {

    var config;

    config = _.assign({}, baseConfig);
    config.headers = _.assign({}, baseConfig.headers);

    if (!baseConfig.headers || 'User-Agent' in baseConfig.headers === false) {
        config.headers['User-Agent'] = 'scrapegoat/';
    }

    if (baseConfig.auth) {
        config.auth = _.assign({}, baseConfig.auth);
        config.auth.sendImmediately = 'sendImmediately' in baseConfig.auth ? baseConfig.auth.sendImmediately : false;
    }

    config.body = xml;
    config.method = method;
    //config.headers['uri'] = 'https://dav.fruux.com/calendars/a3298237652/300cc743-fd64-4386-a3d2-d88ecf10894e/kw01.ics';
    //config.headers['If-None-Match'] = '*';
    config.headers['Content-length'] = xml.length;
    config.headers.Depth = depth;
    console.log("HEADERIS: " + JSON.stringify(config, null, 4));

    return nodefn.call(doRequest, config)
        .spread(function (res, body) {
            //console.log("RES: " + JSON.stringify(res, null, 4));

            var err;
            if (res.statusCode >= 300) {
                err = new Error('Response with status code: ' + res.statusCode);
                err.statusCode = res.statusCode;
                throw err;
            }

            return body;
        });
}

module.exports = request;