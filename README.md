#angular-coms

A communication service to allow easy passing and listening of events (with optionaldata) around an angular application. Events are broadcast from the $rootScope, making it easy to listen to events from anywhere in your application.

## Installation

There are two easy ways to install the Coms service:

####npm

    npm install @iamadamjowett/angular-coms

#### Bower

To install via Bower, run:

    bower install angular-coms

#### Manual download

Download the `coms.service.js` file, and include it in your index.html file with something like:

    <script type="text/javascript" src="/path/to/coms.service.js"></script>

Also be sure to include the module in your app.js file with:

    angular.module('yourAppName', ['angular-coms'])

## Usage

#### Sending signals (events)

Sending events are as easy as calling the `sendSignal` method. You pass the event string to be sent as the first parameter, and any data you wish to pass with the event as the second.

    Coms.sendSignal('signal:foo', { id: getId(), arr: [1, 2, 3] });
    Coms.onSignal('signal:foo', function (event, dataObj) {
        console.log(dataObj);
    }, $scope);

Sometimes with the async nature of AngularJS, you need to delay the sending of a call until something else is ready. This can be done as follows, in this case, delaying the sending of the event by 400ms:

    Coms.sendSignal('signal:foo', 'random string', 400);
    Coms.onSignal('signal:foo', function (event, data) {
        console.log('I received the ' + data + ' after a 400ms delay');
    }, $scope);

#### Listening for signals (events)

To listen for an event, you can use the onSignal method, which takes a signal string as the first parameter, a function to listen to the event and a scope to automatically remove the listener if the scope is destroyed (handy for controlling memory leaks).

    Coms.onSignal('signal:foo', function (event, data) {
        console.log('id received: ' + data.id);
    }, $scope);

#### Deregistering event listeners

Like native angular events, the `onSignal` method returns the de-registering function as part of the call. You can assign this to a variable and call it later to manually remove a listener. Listeners are de-registed automatically when the scope is destroyed as long as you pass the scope as the last parameter of the listener.

    var fooListener = Coms.onSignal(Events.FOO_EVENT, function (event, data) {
        console.log('FOO_EVENT received with fooVar value of: ' + data);
    }, $scope);

    elem.$on('$destroy', function () {
        fooListener();
    });
