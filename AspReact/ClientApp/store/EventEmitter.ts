const EventEmitter = require('events');

let contextClass : any = EventEmitter;

const LocalEventEmitter = (function () {
  var instance: typeof EventEmitter;

  function createInstance() : typeof EventEmitter {
      let object : typeof EventEmitter = new contextClass();
      return object;
  }

  return {
      getInstance: function () {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      }
  };
})();
