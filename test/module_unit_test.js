(function() {
  "use strict";

  function Module() {
    this.constructed = true;
  }

  Module.prototype = {
    constructor: Module,
    init: function(data) {
      this.inited = true;
      this.initData = data;
    },

    start: function(data) {
      this.started = true;
      this.startData = data;
    },

    stop: function() {
      this.stopped = true;
    }
  };

  module("appcore/module", {
    setup: function() {
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

    ok(module.constructed, "module has been constructed");
    ok(module.inited, "module has been inited");
    ok(module.initData === initData, "initData passed in on start");

    ok(module.started, "module has been started");
    ok(module.startData === startData, "startData passed in on start");

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
    var module = AppCore.module.start("service");
    AppCore.module.stop("service");

    ok(module.stopped, "module has been stopped");
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

  test("restart a module that was stopped", function() {
    AppCore.module.register("service", Module);
    var module = AppCore.module.start("service");
    AppCore.module.stop("service");
    var module2 = AppCore.module.start("service");

    strictEqual(module, module2, "only one module instance ever created");
  });

  test("stopAll after starting multiple modules", function() {
    AppCore.module.register("service", Module);
    AppCore.module.register("service2", Module);

    var module = AppCore.module.start("service");
    var module2 = AppCore.module.start("service2");

    AppCore.module.stopAll();

    equal(module.stopped, true, "first module stopped");
    equal(module2.stopped, true, "second module stopped");
  });

}());

