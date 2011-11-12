(function() {
  "use strict";

  var moduleConstructed = false,
      moduleInited = false,
      moduleInitData,
      moduleStarted = false,
      moduleStartData,
      moduleStopped = false;

  function Module() {
    moduleConstructed = true;
  }

  Module.prototype = {
    constructor: Module,
    init: function(data) {
      moduleInited = true; 
      moduleInitData = data;
    },

    start: function(data) {
      moduleStarted = true;
      moduleStartData = data;
    },

    stop: function() {
      moduleStopped = true;
    }
  };

  module("core/module", {
    setup: function() {
      moduleConstructed = moduleInited = moduleStarted = moduleStopped = false;
      moduleStartData = moduleInitData = undefined;
      AppCore.module.reset();
    },

    teardown: function() {
      AppCore.module.reset();
    }
  });

  test("register a module with no constructor throws an exception", function() {
    var error;

    try {
      AppCore.module.register("service");
    } catch(e) {
      error = e;
    }

    equal(error, "module constructor missing for service", "exception correctly thrown");
  });


  test("register a module", function() {
    AppCore.module.register("service", Module);
    strictEqual(AppCore.module.getModule("service"), Module, "register->getModule are same module");
  });

  test("start a module that has not been registered throws exception", function() {
    var error;

    try {
      AppCore.module.start("service");
    } catch(e) {
      error = e;  
    }

    equal(error, "module not registered for service", "exception correctly thrown");
  });

  test("start a module that is registered", function() {
    var initData = { initField: true };
    AppCore.module.register("service", Module, initData);

    var startData = { someField: true };
    var module = AppCore.module.start("service", startData);

    ok(moduleConstructed, "module has been constructed");
    ok(moduleInited, "module has been inited");
    ok(moduleInitData === initData, "initData passed in on start");

    ok(moduleStarted, "module has been started");
    ok(moduleStartData === startData, "startData passed in on start");

    ok(module, "module returned on start");
  });

  test("stop a module that has not been started throws exception", function() {
    AppCore.module.register("service", Module);

    var error;
    try {
      AppCore.module.stop("service");
    } catch(e) {
      error = e;
    }

    equal(error, "module not started for service", "exception correctly thrown");
  });

  test("stop a module that is running", function() {
    AppCore.module.register("service", Module);
    AppCore.module.start("service");
    AppCore.module.stop("service");

    ok(moduleStopped, "module has been stopped");
  });

  test("start a module that is already started", function() {
    AppCore.module.register("service", Module);
    AppCore.module.start("service");

    var error;

    try {
      AppCore.module.start("service");
    } catch(e) {
      error = e;
    }

    equal(error, "module already running for service", "exception correctly thrown");
  });

  test("restart a module that was stopped, ", function() {
    AppCore.module.register("service", Module);
    var module = AppCore.module.start("service");
    AppCore.module.stop("service");
    var module2 = AppCore.module.start("service");

    strictEqual(module, module2, "only one module instance ever created");
  });
}());

