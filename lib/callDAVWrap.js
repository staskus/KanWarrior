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
                //console.log(calendar);
                lists.push({name: calendar.displayName, description: calendar.description});
            }
        });
        callback(lists);
    });
}

Wrapper.prototype.sendCalendars = function (callback) {

    var xhr = new dav.transport.Basic(
        new dav.Credentials({
            username: 'b3297510659',
            password: '62hz43n0jw5q'
        })
    );
    var req = dav.request.basic({
        method: 'PUT',
        //data: 'BEGIN:VCALENDAR\nEND:VCALENDAR'
        //etag: 'https://dav.fruux.com/calendars/a3298237652/300cc743-fd64-4386-a3d2-d88ecf10894e/'
    });

// req instanceof dav.Request

    xhr.send(req, 'https://dav.fruux.com/calendars/a3298237652/42320941-db99-4e3f-ab71-8c15d58baab2/')
        .then(function(response) {
            console.log(response);
            // response instanceof XMLHttpRequest
        }, function(err) {
                    console.log("nop " + err);
                        //console.log(obj);
    });
    //var client = new dav.Client(xhr);
    //
    //client.createAccount({
    //    server: 'https://dav.fruux.com',
    //    accountType: 'caldav',
    //    loadObjects: true
    //})
    //
    ////dav.createAccount({
    ////    server: 'https://dav.fruux.com',
    ////    xhr: xhr,
    ////    loadObjects: true
    ////})
    //    .then(function (account) {
    //    account.calendars.some(function(calendar) {
    //        if(calendar.components == 'VTODO')
    //        {
    //            console.log("create");
    //            //calendar.displayName = "Nu B/LL";
    //            console.log(calendar.displayName);
    //            //'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:https://dav.fruux.com/principals/uid/a3298237652/\nDTSTAMP:19970610T172345Z\nDTSTART:19970714T170000Z\nDTEND:19970715T040000Z\n SUMMARY:Bastille Day Party\nEND:VEVENT\nEND:VCALENDAR',
    //            dav.deleteCalendarObject(calendar, {
    //                xhr: xhr
    //            }).then(function (obj) {
    //                console.log("cal ");
    //            }, function(err) {
    //                console.log("nop " + err);
    //                    //console.log(obj);
    //            });
    //            //dav.createCalendarObject(calendar, {
    //            //    filename: 'tkanasest.ics',
    //            //    //data: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
    //            //    data: 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:https://dav.fruux.com/principals/uid/a3298237652/\nDTSTART:20170714T170000Z\nDTEND:20180715T040000Z\nSUMMARY:Bastille Day Party\nEND:VEVENT\nEND:VCALENDAR',
    //            //    xhr: xhr
    //            //}).then(function (obj) {
    //            //    console.log("cal ");
    //            //}, function(err) {
    //            //    console.log("nop " + err);
    //            //        //console.log(obj);
    //            //});
    //            //console.log(JSON.stringify(cal, null, 4));
    //            //console.log("cal outside: " + cal.toSource());
    //            console.log("cal outside: " + calendar.objects);
    //            console.log("cal ");
    //            ////dav.syncCalendar(calendar, {
    //            ////    syncMethod: 'basic',
    //            ////    xhr: xhr
    //            ////});
    //            //
    //            //var synced = dav.syncCaldavAccount(account, { xhr: xhr }, function(){
    //            //    console.log(synced.calendars);
    //            //});
    //            return true;
    //        }
    //    });
    //});
}

module.exports = new Wrapper();