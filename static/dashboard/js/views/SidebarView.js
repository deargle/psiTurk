// Generated by CoffeeScript 1.6.1
(function() {
  var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
    function ctor() {
      this.constructor = child;
    }
    for (var key in parent) __hasProp.call(parent, key) && (child[key] = parent[key]);
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define([ "backbone", "text!templates/aws-info.html", "text!templates/overview.html", "text!templates/hit-config.html", "text!templates/database.html", "text!templates/server-params.html", "text!templates/expt-info.html", "views/validators", "views/HITView", "models/HITModel", "collections/HITCollection" ], function(Backbone, AWSInfoTemplate, OverviewTemplate, HITConfigTemplate, DatabaseTemplate, ServerParamsTemplate, ExptInfoTemplate, Validators, HITView, HIT, HITs) {
    var SideBarView, _this = this;
    return SideBarView = function(_super) {
      function SideBarView() {
        var _this = this;
        this.render = function() {
          return SideBarView.prototype.render.apply(_this, arguments);
        };
        return SideBarView.__super__.constructor.apply(this, arguments);
      }
      __extends(SideBarView, _super);
      SideBarView.prototype.save = function(event) {
        var configData, inputData, section, _this = this;
        event.preventDefault();
        section = $(event.target).data("section");
        inputData = {};
        configData = {};
        $.each($("#myform").serializeArray(), function(i, field) {
          return inputData[field.name] = field.value;
        });
        configData[section] = inputData;
        this.options.config.save(configData);
        $("li").removeClass("selected");
        $("#overview").addClass("selected");
        $.when(this.options.config.fetch(), this.options.ataglance.fetch().then(function() {
          var hit_view, overview;
          overview = _.template(OverviewTemplate, {
            input: {
              balance: _this.options.ataglance.get("balance"),
              debug: _this.options.config.get("Server Parameters").debug === "True" ? "checked" : "",
              using_sandbox: _this.options.config.get("HIT Configuration").using_sandbox === "True" ? "checked" : ""
            }
          });
          $("#content").html(overview);
          hit_view = new HITView({
            collection: new HITs
          });
          return $("#tables").html(hit_view.render().el);
        }));
        $.ajax({
          url: "/monitor_server"
        });
        return this.render();
      };
      SideBarView.prototype.pushstateClick = function(event) {
        return event.preventDefault();
      };
      SideBarView.prototype.events = {
        "click a": "pushstateClick",
        "click .save_data": "save",
        "click #aws-info-save": "save",
        "click #server-parms-save": "serverParamsSave",
        "click input#debug": "saveDebugState",
        "click input#using_sandbox": "saveUsingSandboxState"
      };
      SideBarView.prototype.serverParamsSave = function() {
        var configResetPromise;
        this.save();
        configResetPromise = this.options.config.fetch();
        return configResetPromise.done(function() {
          var domain, url, url_pattern;
          url = this.options.config.get("HIT Configuration").question_url + "/shutdown";
          url_pattern = /^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i;
          domain = url.match(url_pattern)[0] + this.options.config.get("Server Parameters").port + "/shutdown";
          return $.ajax({
            url: domain,
            type: "GET",
            data: {
              hash: this.options.config.get("Server Parameters").hash
            }
          });
        });
      };
      SideBarView.prototype.saveDebugState = function() {
        var debug;
        debug = $("input#debug").is(":checked");
        return this.options.config.save({
          "Server Parameters": {
            debug: debug
          }
        });
      };
      SideBarView.prototype.saveUsingSandboxState = function() {
        var using_sandbox, _this = this;
        using_sandbox = $("input#using_sandbox").is(":checked");
        return this.options.config.save({
          "HIT Configuration": {
            using_sandbox: using_sandbox
          }
        }, {
          complete: function() {
            return $.when(_this.options.config.fetch(), _this.options.ataglance.fetch().done(function() {
              var hit_view, overview;
              overview = _.template(OverviewTemplate, {
                input: {
                  balance: _this.options.ataglance.get("balance"),
                  debug: _this.options.config.get("Server Parameters").debug === "True" ? "checked" : "",
                  using_sandbox: _this.options.config.get("HIT Configuration").using_sandbox === "True" ? "checked" : ""
                }
              });
              $("#content").html(overview);
              hit_view = new HITView({
                collection: new HITs
              });
              return $("#tables").html(hit_view.render().el);
            }));
          }
        }, {
          error: function(error) {
            return console.log("error");
          }
        });
      };
      SideBarView.prototype.initialize = function() {
        return this.render();
      };
      SideBarView.prototype.getCredentials = function() {
        var _this = this;
        $("#aws-info-modal").modal("show");
        return $(".save").click(function(event) {
          event.preventDefault();
          _this.save(event);
          return $("#aws-info-modal").modal("hide");
        });
      };
      SideBarView.prototype.getExperimentStatus = function() {
        return $.ajax({
          url: "/get_hits",
          type: "GET",
          success: function(data) {
            if (data.hits.length > 0) {
              $("#experiment_status").css({
                color: "green"
              });
              return $("#run").css({
                color: "grey"
              });
            }
            $("#experiment_status").css({
              color: "grey"
            });
            return $("#run").css({
              color: "orange"
            });
          }
        });
      };
      SideBarView.prototype.loadOverview = function() {
        var _this = this;
        return $.when(this.options.config.fetch(), this.options.ataglance.fetch().then(function() {
          var hit_view, overview;
          overview = _.template(OverviewTemplate, {
            input: {
              balance: _this.options.ataglance.get("balance"),
              debug: _this.options.config.get("Server Parameters").debug === "True" ? "checked" : "",
              using_sandbox: _this.options.config.get("HIT Configuration").using_sandbox === "True" ? "checked" : ""
            }
          });
          $("#content").html(overview);
          hit_view = new HITView({
            collection: new HITs
          });
          return $("#tables").html(hit_view.render().el);
        }));
      };
      SideBarView.prototype.render = function() {
        var awsInfo, database, exptInfo, hitConfig, hit_view, serverParams, updateExperimentStatus, updateOverview, validator, _this = this;
        $("li").on("click", function() {
          $("li").removeClass("selected");
          return $(this).addClass("selected");
        });
        $.when(this.options.config.fetch(), this.options.ataglance.fetch().done(function() {
          if (_this.options.config.get("AWS Access").aws_access_key_id === "YourAccessKeyId" || _this.options.config.get("AWS Access").aws_secret_access_key === "YourSecretAccessKey") return _this.getCredentials();
        }, awsInfo = _.template(AWSInfoTemplate, {
          input: {
            aws_access_key_id: this.options.config.get("AWS Access").aws_access_key_id,
            aws_secret_access_key: this.options.config.get("AWS Access").aws_secret_access_key
          }
        }), hitConfig = _.template(HITConfigTemplate, {
          input: {
            title: this.options.config.get("HIT Configuration").title,
            description: this.options.config.get("HIT Configuration").description,
            keywords: this.options.config.get("HIT Configuration").keywords,
            question_url: this.options.config.get("HIT Configuration").question_url,
            max_assignments: this.options.config.get("HIT Configuration").max_assignments,
            hit_lifetime: this.options.config.get("HIT Configuration").hit_lifetime,
            reward: this.options.config.get("HIT Configuration").reward,
            duration: this.options.config.get("HIT Configuration").duration,
            us_only: this.options.config.get("HIT Configuration").us_only,
            approve_requirement: this.options.config.get("HIT Configuration").approve_requirement,
            using_sandbox: this.options.config.get("HIT Configuration").using_sandbox
          }
        }), database = _.template(DatabaseTemplate, {
          input: {
            database_url: this.options.config.get("Database Parameters").database_url,
            table_name: this.options.config.get("Database Parameters").table_name
          }
        }), serverParams = _.template(ServerParamsTemplate, {
          input: {
            host: this.options.config.get("Server Parameters").host,
            port: this.options.config.get("Server Parameters").port,
            cutoff_time: this.options.config.get("Server Parameters").cutoff_time,
            support_ie: this.options.config.get("Server Parameters").support_ie
          }
        }), exptInfo = _.template(ExptInfoTemplate, {
          input: {
            code_version: this.options.config.get("Task Parameters").code_version,
            num_conds: this.options.config.get("Task Parameters").num_conds,
            num_counters: this.options.config.get("Task Parameters").num_counters
          }
        }), validator = new Validators, $("#overview").off("click").on("click", function() {
          $("li").removeClass("selected");
          $("#overview").addClass("selected");
          return _this.loadOverview();
        }), $("#aws-info").on("click", function() {
          $("#content").html(awsInfo);
          return validator.loadValidators();
        }), $("#hit-config").on("click", function() {
          $("#content").html(hitConfig);
          return validator.loadValidators();
        }), $("#database").on("click", function() {
          $("#content").html(database);
          return validator.loadValidators();
        }), $("#server-params").on("click", function() {
          $("#content").html(serverParams);
          return validator.loadValidators();
        }), $("#expt-info").on("click", function() {
          $("#content").html(exptInfo);
          return validator.loadValidators();
        })));
        hit_view = new HITView({
          collection: new HITs
        });
        $("#tables").html(hit_view.render().el);
        $(document).on("click", ".save_data", function(event) {
          event.preventDefault();
          return _this.save(event);
        });
        $(document).on("click", "input#using_sandbox", function() {
          return _this.saveUsingSandboxState();
        });
        $(document).on("click", "input#debug", function() {
          return _this.saveDebugState();
        });
        $(document).on("click", "#aws-info-save", function() {
          return _this.save();
        });
        $(document).on("click", "#server-parms-save", function() {
          return _this.serverParamsSave();
        });
        updateExperimentStatus = _.bind(this.getExperimentStatus, this);
        updateOverview = _.bind(this.loadOverview, this);
        $(document).on("click", ".extend", function() {
          return "blah";
        });
        $(document).on("click", ".expire", function() {
          var data;
          $("#expire-modal").modal("show");
          data = JSON.stringify({
            mturk_request: "expire_hit",
            hitid: $(this).attr("id")
          });
          return $("#expire-btn").on("click", function() {
            $.ajax({
              contentType: "application/json; charset=utf-8",
              url: "/mturk_services",
              type: "POST",
              dataType: "json",
              data: data,
              complete: function() {
                updateExperimentStatus();
                return updateOverview();
              },
              error: function(error) {
                return console.log("failed to update status");
              }
            });
            return $("#expire-modal").modal("hide");
          });
        });
        return $(document).on("click", ".extend", function() {
          var data;
          $("#extend-modal").modal("show");
          data = JSON.stringify({
            mturk_request: "extend_hit",
            hitid: $(this).attr("id")
          });
          return $("#expire-btn").on("click", function() {
            return $("#expire-modal").modal("hide");
          });
        });
      };
      return SideBarView;
    }(Backbone.View);
  });
}).call(this);