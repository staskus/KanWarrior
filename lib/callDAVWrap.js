var dav = require('dav');

var Wrapper = function() {};

Wrapper.prototype.login = function () {
    console.log("login");


    var xhr = new dav.transport.Basic(
        new dav.Credentials({
            username: 'b3297510659',
            password: '62hz43n0jw5q'
        })
    );

    var client = new dav.Client(xhr);
// No transport arg
//    dav.debug.enabled = true;

    client.createAccount({
        server: 'https://dav.fruux.com',
        accountType: 'caldav'
    })
    .then(function(account) {
        account.calendars.forEach(function(calendar) {
            //if(calendar.components == 'VTODO')
            //{
                console.log('\nCalendar ' + calendar.objects);
                console.log('data: %j', calendar.objects);
                //console.log(calendar.account);
                console.log("description: " + calendar.description);
                //console.log(calendar.timezone);
                //console.log(calendar.url);
                console.log("ctag: " + calendar.ctag);
                console.log("name: " + calendar.displayName);
                console.log("components: " + calendar.components);
                console.log("resourcetype:" + calendar.resourcetype);
                console.log("syncToken" + calendar.syncToken);
                console.log("-------------------\n");
            //}
        });
    })
    .then(function(account) {
            console.log("then");
        dav.createCalendarObject(calendar, options);
    });
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
};

module.exports = new Wrapper();