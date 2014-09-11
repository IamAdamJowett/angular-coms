angular-coms
============

A simple communication service to allow easy passing of events (with data) around an angular application. Events are broadcast from the $rootScope, making it easy to listen to events from anywhere in the application.

##Usage

####Sending signals (events)

Sending events are as easy as calling the `sendSignal` method. You pass the event string to be sent as the first parameter, and any data you wish to pass with the event as the second.

    Coms.sendSignal('signal:foo', { id: getId(), arr: [1, 2, 3] });
    Coms.onSignal('signal:foo', function (event, dataObj) {
        console.log(dataObj);
    }, $scope);
    
    Coms.sendSignal(Events.FOO_EVENT, fooVar);
    Coms.onSignal(Events.FOO_EVENT, function (event, foo) {
        console.log('FOO_EVENT received with fooVar value of: ' + foo);
    }, $scope);

####Listening for signals (events)

To listen for an event, you can use the onSignal method, which takes a signal string as the first parameter, a function to listen to the event and a scope to automatically remove the listener if the scope is destroyed (handy for controlling memory leaks).

    Coms.onSignal('signal:foo', function (event, data) {
        console.log('id received: ' + data.id);
    }, $scope);
    
####Deregistering event listeners

Like native angular events, the `onSignal` method returns the de-registering function as part of the call. Simply assign this to a variable and you can call it late to manually remove a listener.
    
    var fooListener = Coms.onSignal(Events.FOO_EVENT, function (event, data) {
        console.log('FOO_EVENT received with fooVar value of: ' + data);
    }, $scope);
    
    elem.$on('$destroy', function () {
        fooListener();
    });

