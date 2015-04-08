/**
 * Communications service to allow easy communications between modules, controllers and directives.
 *
 * __Example usage__:
 *
 *      // STANDARD USAGE
 *      Coms.sendSignal('signal:foo', { 'id': getId() });
 *      Coms.onSignal('signal:foo', function (event, data) {
 *          console.log('id received: ' + data.id);
 *      }, $scope);
 *
 *      // DELAYED EVENT SENDING
 *      Coms.sendSignal('signal:foo', 'random string', 400);
 *      Coms.onSignal('signal:foo', function (event, data) {
 *          console.log('I received the ' + data + ' after a 400ms delay');
 *      }, $scope);
 *
 * @module      coms
 *
 * @class       Coms
 * @constructor
 *
 *
 * @requires    $rootScope
 * @requires    $timeout
 * @param       {angular.Provider} $rootScope       The root scope of the object that is shared across all elements
 * @param       {angular.Provider} $timeout         Angular interfact to the standard JS timeout function
 *
 * @return      {Object}
 */
angular
.module('angular.coms', [])
.factory('Coms', ['$rootScope', '$timeout', Coms]);

function Coms($rootScope, $timeout) {
    'use strict';

    /**
	 * The object passed around to listeners and dispatchers
	 * @property msgBus
	 * @type Object
	 * @private
	 */
    var _api = {
        sendSignal: sendSignal,
        onSignal: onSignal
    };

    return _api;

    /**
	 * sendSignal dispatches an event carrying defined data. Data can be of any type.
	 *
	 * @method  sendSignal
     * @throws  Will throw an error if no msg is passed to identify the event
	 * @param   {String} msg       The event string that identifies the event
	 * @param   {Object} data      Optional data to be carried by the signal, can be of any type
	 * @param   {Number} delay     The time to wait before sending the event (defaults to immediate)
	 */
    function sendSignal(msg, data, delay) {
        msg = typeof msg === 'undefined' ? new Error('A message string is needed to identify the event') : msg;
        delay = typeof delay === 'undefined' ? -1 : delay;

        /**
		 * The data object to be passed to any listeners
		 * @property signalData
		 * @type Object
		 * @private
		 */
        var signalData = typeof data === 'undefined' ? {} : data;

        // if a delay is needed before sending the signal
        if (delay > -1) {
            if (delay === 0) { // delay until the after the current $digest cycle
                $rootScope.$evalAsync(function ($rootScope) {
                    $rootScope.$emit(msg, signalData);
                });
            } else { // send after the designated delay in milliseconds
                $timeout(function () {
                    $rootScope.$emit(msg, signalData);
                }, delay, true);
            }
        } else { // send immediately
            $rootScope.$emit(msg, signalData);
        }
    }

    /**
	 * onSignal is what can be listened to to receive dispatched events
	 *
	 * @method  onSignal
	 * @param   {String} msg    The event string to listen to
	 * @param   {Function} func The function to invoke when message is received
	 * @param   {Object} scope  The scope of where the signal is listened from, this is included to allow easy cleanup and to avoid memory leaks
	 */
    function onSignal(msg, func, scope) {
        /**
		 * Holds the scope the signal is dispatched to for cleanup
		 * @property unbind
		 * @type Object
		 * @private
		 */
        var unbind = $rootScope.$on(msg, func);
        if (scope) {
            scope.$on('$destroy', unbind);
        }

        // return the unregister function to the listener for manual deregistering before the scope is destroyed
        return unbind;
    }
}
