(function() {
  "use strict";

  function Module() {}

  Module.prototype = {
    constructor: Module,
    init: function(config) {
      this.el = $(config.el);
    },

    start: function(data) {
      this.el.text("started");
    },

    stop: function() {
      this.el.text("stopped");
    }
  };


  AppCore.module.register("module1", Module, { el: "#module1" });
  AppCore.module.register("module2", Module, { el: "#module2" });

  $(".start").click(function(event) {
    event.preventDefault();

    var forWhich = $(event.target).attr("for");
    AppCore.module.start(forWhich);
  });

  $(".stop").click(function(event) {
    event.preventDefault();

    var forWhich = $(event.target).attr("for");
    AppCore.module.stop(forWhich);
  });

  $("#stopAll").click(function(event) {
    event.preventDefault();

    AppCore.module.stopAll();
  });

}());
