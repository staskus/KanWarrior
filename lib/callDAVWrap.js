var dav = require('dav');

var Wrapper = function() {};

//var account;

//Wrapper.prototype.login = function (callback) {
//    var xhr = new dav.transport.Basic(
//        new dav.Credentials({
//            username: 'b3297510659',
//            password: '62hz43n0jw5q'
//        })
//    );
//
//    var client = new dav.Client(xhr);
//
//   var account = client.createAccount({
//        server: 'https://dav.fruux.com',
//        accountType: 'caldav'
//    });
//    callback(account);
//};

Wrapper.prototype.getCalendars = function (callback) {
    var lists = [];

    var xhr = new dav.transport.Basic(
        new dav.Credentials({
            username: 'b3297510659',
            password: '62hz43n0jw5q'
        })
    );

    var client = new dav.Client(xhr);

   client.createAccount({
        server: 'https://dav.fruux.com',
        accountType: 'caldav'
    }).then(function(account) {
        account.calendars.forEach(function(calendar) {
            if(calendar.components == 'VTODO')
            {
                lists.push({name: calendar.displayName, description: calendar.description});
            }
        });
        callback(lists);
    });
    //.then(function(account) {
    //        console.log("then");
    //    dav.createCalendarObject(calendar, options);
    //});
    //data: res,
    //    account: account,
    //    description: res.props.calendarDescription,
    //    timezone: res.props.calendarTimezone,
    //    url: url.resolve(account.rootUrl, res.href),
    //    ctag: res.props.getctag,
    //    displayName: res.props.displayname,
    //    components: res.props.supportedCalendarComponentSet,
    //    resourcetype: res.props.resourcetype,
    //    syncToken: res.props.syncToken
}

module.exports = new Wrapper();