/*global angular*/
/**
 * Communications service to allow easy communications between modules, controllers and directives.
 *
 * __Example usage__:
 *
 *      Coms.sendSignal('signal:foo', { 'id': getId() });
 *      Coms.onSignal('signal:foo', function (event, data) {
 *          console.log('id received: ' + data.id);
 *      }, $scope);
 *
 *      Coms.sendSignal(Events.FOO_EVENT, fooVar);
 *      Coms.onSignal(Events.FOO_EVENT, function (event, data) {
 *          console.log('FOO_EVENT received with fooVar value of: ' + data);
 *      }, $scope);
 *
 * @module      pcApp
 *
 * @class       Coms
 * @constructor
 *
 *
 * @requires    $rootScope
 * @param       {Object} $rootScope     The root scope of the object that is shared across all elements
 *
 * @return      {Object}
 */
angular
    .module('coms', [])
    .factory('Coms', ['$rootScope', '$timeout', Coms]);

function Coms($rootScope, $timeout) {
    'use strict';

    /**
     * The object passed around to listeners and dispatchers
     * @property msgBus
     * @type Object
     * @private
     */
    var msgBus = {
        sendSignal: sendSignal,
        onSignal: onSignal
    };

    return msgBus;

    /**
     * sendSignal dispatches an event carrying defined data. Data can be of any type.
     *
     * @method  sendSignal
     * @param   {String} msg    The event string
     * @param   {Object} data   Data to be carried by the signal, can be of any type
     */
    function sendSignal(msg, data, delay) {
        delay = typeof delay === 'undefined' ? -1 : delay;

        /**
         * The data object to be passed to any listeners
         * @property signalData
         * @type Object
         * @private
         */
        var signalData = typeof data === 'undefined' ? {} : data;

        if (delay > -1) {
            $timeout(function () {
                $rootScope.$emit(msg, signalData);
            }, delay, true);
        } else {
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
