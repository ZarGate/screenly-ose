// Generated by CoffeeScript 1.6.3
/* screenly-ose ui*/


(function() {
  var API, App, Asset, AssetRowView, Assets, AssetsView, EditAssetView, date_to, delay, get_filename, get_mimetype, get_template, insertWbr, mimetypes, now, url_test, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    _this = this,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  API = (window.Screenly || (window.Screenly = {}));

  API.date_to = date_to = function(d) {
    var dd;
    dd = moment(new Date(d));
    return {
      string: function() {
        return dd.format('MM/DD/YYYY hh:mm:ss A');
      },
      date: function() {
        return dd.format('MM/DD/YYYY');
      },
      time: function() {
        return dd.format('hh:mm A');
      }
    };
  };

  now = function() {
    return new Date();
  };

  get_template = function(name) {
    return _.template(($("#" + name + "-template")).html());
  };

  delay = function(wait, fn) {
    return _.delay(fn, wait);
  };

  mimetypes = [['jpg jpeg png pnm gif bmp'.split(' '), 'image'], ['avi mkv mov mpg mpeg mp4 ts flv'.split(' '), 'video']];

  get_mimetype = function(filename) {
    var ext, mt;
    ext = (_.last(filename.split('.'))).toLowerCase();
    mt = _.find(mimetypes, function(mt) {
      return __indexOf.call(mt[0], ext) >= 0;
    });
    if (mt) {
      return mt[1];
    } else {
      return null;
    }
  };

  url_test = function(v) {
    return /(http|https):\/\/[\w-]+(\.?[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(v);
  };

  get_filename = function(v) {
    return (v.replace(/[\/\\\s]+$/g, '')).replace(/^.*[\\\/]/g, '');
  };

  insertWbr = function(v) {
    return (v.replace(/\//g, '/<wbr>')).replace(/\&/g, '&amp;<wbr>');
  };

  Backbone.emulateJSON = true;

  API.Asset = Asset = (function(_super) {
    __extends(Asset, _super);

    function Asset() {
      this.defaults = __bind(this.defaults, this);
      _ref = Asset.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Asset.prototype.idAttribute = "asset_id";

    Asset.prototype.fields = 'name mimetype uri start_date end_date duration channel'.split(' ');

    Asset.prototype.defaults = function() {
      return {
        name: '',
        mimetype: 'webpage',
        uri: '',
        start_date: now(),
        end_date: (moment().add('days', 7)).toDate(),
        duration: default_duration,
        is_enabled: 0,
        nocache: 0
      };
    };

    return Asset;

  })(Backbone.Model);

  API.Assets = Assets = (function(_super) {
    __extends(Assets, _super);

    function Assets() {
      _ref1 = Assets.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Assets.prototype.url = "/api/assets";

    Assets.prototype.model = Asset;

    return Assets;

  })(Backbone.Collection);

  EditAssetView = (function(_super) {
    __extends(EditAssetView, _super);

    function EditAssetView() {
      this.displayAdvanced = __bind(this.displayAdvanced, this);
      this.toggleAdvanced = __bind(this.toggleAdvanced, this);
      this.updateMimetype = __bind(this.updateMimetype, this);
      this.updateYouTubeMimetype = __bind(this.updateYouTubeMimetype, this);
      this.updateFileUploadMimetype = __bind(this.updateFileUploadMimetype, this);
      this.updateUriMimetype = __bind(this.updateUriMimetype, this);
      this.clickTabNavYoutube = __bind(this.clickTabNavYoutube, this);
      this.clickTabNavUpload = __bind(this.clickTabNavUpload, this);
      this.clickTabNavUri = __bind(this.clickTabNavUri, this);
      this.cancel = __bind(this.cancel, this);
      this.validate = __bind(this.validate, this);
      this.change = __bind(this.change, this);
      this.save = __bind(this.save, this);
      this.viewmodel = __bind(this.viewmodel, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      this.$fv = __bind(this.$fv, this);
      this.$f = __bind(this.$f, this);
      _ref2 = EditAssetView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    EditAssetView.prototype.$f = function(field) {
      return this.$("[name='" + field + "']");
    };

    EditAssetView.prototype.$fv = function() {
      var field, val, _ref3;
      field = arguments[0], val = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref3 = this.$f(field)).val.apply(_ref3, val);
    };

    EditAssetView.prototype.initialize = function(options) {
      var _this = this;
      this.edit = options.edit;
      ($('body')).append(this.$el.html(get_template('asset-modal')));
      (this.$('input.time')).timepicker({
        minuteStep: 5,
        showInputs: true,
        disableFocus: true,
        showMeridian: true
      });
      (this.$('input[name="nocache"]')).prop('checked', this.model.get('nocache'));
      (this.$('.modal-header .close')).remove();
      (this.$el.children(":first")).modal();
      this.model.bind('change', this.render);
      this.render();
      this.validate();
      _.delay((function() {
        return (_this.$f('uri')).focus();
      }), 300);
      return false;
    };

    EditAssetView.prototype.render = function() {
      var d, f, field, which, _i, _j, _k, _len, _len1, _len2, _ref3, _ref4, _ref5;
      this.undelegateEvents();
      if (this.edit) {
        _ref3 = 'mimetype uri file_upload'.split(' ');
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          f = _ref3[_i];
          (this.$(f)).attr('disabled', true);
        }
        (this.$('#modalLabel')).text("Edit Asset");
        (this.$('.asset-location')).hide();
        (this.$('.asset-location.edit')).show();
      }
      (this.$('.duration')).toggle((this.model.get('mimetype')) !== 'video' && (this.model.get('mimetype')) !== 'youtube');
      if ((this.model.get('mimetype')) === 'webpage') {
        this.clickTabNavUri();
      }
      _ref4 = this.model.fields;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        field = _ref4[_j];
        if ((this.$fv(field)) !== this.model.get(field)) {
          this.$fv(field, this.model.get(field));
        }
      }
      (this.$('.uri-text')).html(insertWbr(this.model.get('uri')));
      _ref5 = ['start', 'end'];
      for (_k = 0, _len2 = _ref5.length; _k < _len2; _k++) {
        which = _ref5[_k];
        d = date_to(this.model.get("" + which + "_date"));
        this.$fv("" + which + "_date_date", d.date());
        (this.$f("" + which + "_date_date")).datepicker({
          autoclose: true
        });
        (this.$f("" + which + "_date_date")).datepicker('setValue', d.date());
        this.$fv("" + which + "_date_time", d.time());
      }
      this.displayAdvanced();
      this.delegateEvents();
      return false;
    };

    EditAssetView.prototype.viewmodel = function() {
      var field, which, _i, _j, _len, _len1, _ref3, _ref4, _results;
      _ref3 = ['start', 'end'];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        which = _ref3[_i];
        this.$fv("" + which + "_date", (new Date((this.$fv("" + which + "_date_date")) + " " + (this.$fv("" + which + "_date_time")))).toISOString());
      }
      _ref4 = this.model.fields;
      _results = [];
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        field = _ref4[_j];
        if (!(this.$f(field)).prop('disabled')) {
          _results.push(this.model.set(field, this.$fv(field), {
            silent: true
          }));
        }
      }
      return _results;
    };

    EditAssetView.prototype.events = {
      'submit form': 'save',
      'click .cancel': 'cancel',
      'change': 'change',
      'keyup': 'change',
      'click .tabnav-uri': 'clickTabNavUri',
      'click .tabnav-file_upload': 'clickTabNavUpload',
      'click .tabnav-youtube': 'clickTabNavYoutube',
      'click .tabnav-file_upload, .tabnav-uri': 'displayAdvanced',
      'click .advanced-toggle': 'toggleAdvanced',
      'paste [name=uri]': 'updateUriMimetype',
      'change [name=file_upload]': 'updateFileUploadMimetype'
    };

    EditAssetView.prototype.save = function(e) {
      var save,
        _this = this;
      e.preventDefault();
      this.viewmodel();
      save = null;
      this.model.set('nocache', (this.$('input[name="nocache"]')).prop('checked') ? 1 : 0);
      if ((this.$('#tab-file_upload')).hasClass('active')) {
        if (!this.$fv('name')) {
          this.$fv('name', get_filename(this.$fv('file_upload')));
        }
        (this.$('.progress')).show();
        this.$el.fileupload({
          url: this.model.url(),
          progressall: function(e, data) {
            if (data.loaded && data.total) {
              return (_this.$('.progress .bar')).css('width', "" + (data.loaded / data.total * 100) + "%");
            }
          }
        });
        save = this.$el.fileupload('send', {
          fileInput: this.$f('file_upload')
        });
      } else {
        if (!this.model.get('name')) {
          if (get_mimetype(this.model.get('uri'))) {
            this.model.set({
              name: get_filename(this.model.get('uri'))
            }, {
              silent: true
            });
          } else {
            this.model.set({
              name: this.model.get('uri')
            }, {
              silent: true
            });
          }
        }
        save = this.model.save();
      }
      (this.$('input, select')).prop('disabled', true);
      save.done(function(data) {
        _this.model.id = data.asset_id;
        if (!_this.model.collection) {
          _this.collection.add(_this.model);
        }
        (_this.$el.children(":first")).modal('hide');
        _.extend(_this.model.attributes, data);
        if (!_this.edit) {
          return _this.model.collection.add(_this.model);
        }
      });
      save.fail(function() {
        (_this.$('.progress')).hide();
        return (_this.$('input, select')).prop('disabled', false);
      });
      return false;
    };

    EditAssetView.prototype.change = function(e) {
      var _this = this;
      this._change || (this._change = _.throttle((function() {
        _this.viewmodel();
        _this.model.trigger('change');
        _this.validate();
        return true;
      }), 500));
      return this._change.apply(this, arguments);
    };

    EditAssetView.prototype.validate = function(e) {
      var errors, field, fn, that, v, validators, _i, _len, _ref3, _results,
        _this = this;
      that = this;
      validators = {
        duration: function(v) {
          if (('video' !== _this.model.get('mimetype')) && (!(_.isNumber(v * 1)) || v * 1 < 1)) {
            return 'Please enter a valid number';
          }
        },
        uri: function(v) {
          if (_this.model.isNew() && ((that.$('#tab-uri')).hasClass('active')) && !url_test(v)) {
            return 'Please enter a valid URL';
          }
        },
        file_upload: function(v) {
          if (_this.model.isNew() && !v && (that.$('#tab-file_upload')).hasClass('active')) {
            return 'Please select a file';
          }
        },
        end_date: function(v) {
          if (!((new Date(_this.$fv('start_date'))) < (new Date(_this.$fv('end_date'))))) {
            return 'End date should be after start date';
          }
        },
        channel: function(v) {
          if (('youtube' === _this.model.get('mimetype')) && (!v.length > 0)) {
            return 'Channel name must be provided';
          }
        }
      };
      errors = (function() {
        var _results;
        _results = [];
        for (field in validators) {
          fn = validators[field];
          if (v = fn(this.$fv(field))) {
            _results.push([field, v]);
          }
        }
        return _results;
      }).call(this);
      (this.$(".control-group.warning .help-inline.warning")).remove();
      (this.$(".control-group")).removeClass('warning');
      (this.$('[type=submit]')).prop('disabled', false);
      console.log(errors);
      _results = [];
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        _ref3 = errors[_i], field = _ref3[0], v = _ref3[1];
        (this.$('[type=submit]')).prop('disabled', true);
        (this.$(".control-group." + field)).addClass('warning');
        _results.push((this.$(".control-group." + field + " .controls")).append($("<span class='help-inline warning'>" + v + "</span>")));
      }
      return _results;
    };

    EditAssetView.prototype.cancel = function(e) {
      this.model.set(this.model.previousAttributes());
      if (!this.edit) {
        this.model.destroy();
      }
      return (this.$el.children(":first")).modal('hide');
    };

    EditAssetView.prototype.clickTabNavUri = function(e) {
      if (!(this.$('#tab-uri')).hasClass('active')) {
        (this.$('ul.nav-tabs li')).removeClass('active');
        (this.$('.tab-pane')).removeClass('active');
        (this.$('.tabnav-uri')).addClass('active');
        (this.$('#tab-uri')).addClass('active');
        (this.$f('uri')).focus();
        this.updateUriMimetype();
      }
      return false;
    };

    EditAssetView.prototype.clickTabNavUpload = function(e) {
      if (!(this.$('#tab-file_upload')).hasClass('active')) {
        (this.$('ul.nav-tabs li')).removeClass('active');
        (this.$('.tab-pane')).removeClass('active');
        (this.$('.tabnav-file_upload')).addClass('active');
        (this.$('#tab-file_upload')).addClass('active');
        if ((this.$fv('mimetype')) === 'webpage') {
          this.$fv('mimetype', 'image');
        }
        this.updateFileUploadMimetype;
      }
      return false;
    };

    EditAssetView.prototype.clickTabNavYoutube = function(e) {
      if (!(this.$('#tab-youtube')).hasClass('active')) {
        (this.$('ul.nav-tabs li')).removeClass('active');
        (this.$('.tab-pane')).removeClass('active');
        (this.$('.tabnav-youtube')).addClass('active');
        (this.$('#tab-youtube')).addClass('active');
        if ((this.$fv('mimetype')) !== 'youtube') {
          this.$fv('mimetype', 'youtube');
        }
        this.model.set('mimetype', 'youtube');
        (this.$('#mimetype')).disabled(true);
        this.updateYouTubeMimetype;
      }
      return false;
    };

    EditAssetView.prototype.updateUriMimetype = function() {
      var _this = this;
      return _.defer(function() {
        return _this.updateMimetype(_this.$fv('uri'));
      });
    };

    EditAssetView.prototype.updateFileUploadMimetype = function() {
      var _this = this;
      return _.defer(function() {
        return _this.updateMimetype(_this.$fv('file_upload'));
      });
    };

    EditAssetView.prototype.updateYouTubeMimetype = function() {
      var _this = this;
      return _.defer(function() {
        return _this.updateMimetype('mp4');
      });
    };

    EditAssetView.prototype.updateMimetype = function(filename) {
      var mt;
      mt = get_mimetype(filename);
      (this.$('#file_upload_label')).text(get_filename(filename));
      if (mt) {
        return this.$fv('mimetype', mt);
      }
    };

    EditAssetView.prototype.toggleAdvanced = function() {
      (this.$('.icon-play')).toggleClass('rotated');
      (this.$('.icon-play')).toggleClass('unrotated');
      return (this.$('.collapse-advanced')).collapse('toggle');
    };

    EditAssetView.prototype.displayAdvanced = function() {
      var edit, has_nocache, img, on_uri_tab;
      img = 'image' === this.$fv('mimetype');
      on_uri_tab = !this.edit && (this.$('#tab-uri')).hasClass('active');
      edit = this.edit && url_test(this.model.get('uri'));
      has_nocache = img && (on_uri_tab || edit);
      return (this.$('.advanced-accordion')).toggle(has_nocache === true);
    };

    return EditAssetView;

  })(Backbone.View);

  AssetRowView = (function(_super) {
    __extends(AssetRowView, _super);

    function AssetRowView() {
      this.hidePopover = __bind(this.hidePopover, this);
      this.showPopover = __bind(this.showPopover, this);
      this["delete"] = __bind(this["delete"], this);
      this.edit = __bind(this.edit, this);
      this.setEnabled = __bind(this.setEnabled, this);
      this.toggleIsEnabled = __bind(this.toggleIsEnabled, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      _ref3 = AssetRowView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    AssetRowView.prototype.tagName = "tr";

    AssetRowView.prototype.initialize = function(options) {
      return this.template = get_template('asset-row');
    };

    AssetRowView.prototype.render = function() {
      var json;
      this.$el.html(this.template(_.extend(json = this.model.toJSON(), {
        name: insertWbr(json.name),
        start_date: (date_to(json.start_date)).string(),
        end_date: (date_to(json.end_date)).string()
      })));
      this.$el.prop('id', this.model.get('asset_id'));
      (this.$(".delete-asset-button")).popover({
        content: get_template('confirm-delete')
      });
      (this.$(".toggle input")).prop("checked", this.model.get('is_enabled'));
      (this.$(".asset-icon")).addClass((function() {
        switch (this.model.get("mimetype")) {
          case "video":
            return "icon-facetime-video";
          case "image":
            return "icon-picture";
          case "webpage":
            return "icon-globe";
          case "youtube":
            return "icon-film";
          default:
            return "";
        }
      }).call(this));
      return this.el;
    };

    AssetRowView.prototype.events = {
      'change .is_enabled-toggle input': 'toggleIsEnabled',
      'click .edit-asset-button': 'edit',
      'click .delete-asset-button': 'showPopover'
    };

    AssetRowView.prototype.toggleIsEnabled = function(e) {
      var save, val,
        _this = this;
      val = (1 + this.model.get('is_enabled')) % 2;
      this.model.set({
        is_enabled: val
      });
      this.setEnabled(false);
      save = this.model.save();
      save.done(function() {
        return _this.setEnabled(true);
      });
      save.fail(function() {
        _this.model.set(_this.model.previousAttributes(), {
          silent: true
        });
        _this.setEnabled(true);
        return _this.render();
      });
      return true;
    };

    AssetRowView.prototype.setEnabled = function(enabled) {
      if (enabled) {
        this.$el.removeClass('warning');
        this.delegateEvents();
        return (this.$('input, button')).prop('disabled', false);
      } else {
        this.hidePopover();
        this.undelegateEvents();
        this.$el.addClass('warning');
        return (this.$('input, button')).prop('disabled', true);
      }
    };

    AssetRowView.prototype.edit = function(e) {
      new EditAssetView({
        model: this.model,
        edit: true
      });
      return false;
    };

    AssetRowView.prototype["delete"] = function(e) {
      var xhr,
        _this = this;
      this.hidePopover();
      if ((xhr = this.model.destroy()) === !false) {
        xhr.done(function() {
          return _this.remove();
        });
      } else {
        this.remove();
      }
      return false;
    };

    AssetRowView.prototype.showPopover = function() {
      if (!($('.popover')).length) {
        (this.$(".delete-asset-button")).popover('show');
        ($('.confirm-delete')).click(this["delete"]);
        ($(window)).one('click', this.hidePopover);
      }
      return false;
    };

    AssetRowView.prototype.hidePopover = function() {
      (this.$(".delete-asset-button")).popover('hide');
      return false;
    };

    return AssetRowView;

  })(Backbone.View);

  AssetsView = (function(_super) {
    __extends(AssetsView, _super);

    function AssetsView() {
      this.render = __bind(this.render, this);
      this.update_order = __bind(this.update_order, this);
      this.initialize = __bind(this.initialize, this);
      _ref4 = AssetsView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    AssetsView.prototype.initialize = function(options) {
      var event, _i, _len, _ref5;
      _ref5 = 'reset add remove sync'.split(' ');
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        event = _ref5[_i];
        this.collection.bind(event, this.render);
      }
      return this.sorted = (this.$('#active-assets')).sortable({
        containment: 'parent',
        axis: 'y',
        helper: 'clone',
        update: this.update_order
      });
    };

    AssetsView.prototype.update_order = function() {
      return $.post('/api/assets/order', {
        ids: ((this.$('#active-assets')).sortable('toArray')).join(',')
      });
    };

    AssetsView.prototype.render = function() {
      var which, _i, _j, _len, _len1, _ref5, _ref6,
        _this = this;
      _ref5 = ['active', 'inactive'];
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        which = _ref5[_i];
        (this.$("#" + which + "-assets")).html('');
      }
      this.collection.each(function(model) {
        which = model.get('is_active') ? 'active' : 'inactive';
        return (_this.$("#" + which + "-assets")).append((new AssetRowView({
          model: model
        })).render());
      });
      _ref6 = ['inactive', 'active'];
      for (_j = 0, _len1 = _ref6.length; _j < _len1; _j++) {
        which = _ref6[_j];
        this.$("." + which + "-table thead").toggle(!!(this.$("#" + which + "-assets tr").length));
      }
      if (this.$('#active-assets tr').length > 1) {
        this.sorted.sortable('enable');
        this.update_order();
      } else {
        this.sorted.sortable('disable');
      }
      return this.el;
    };

    return AssetsView;

  })(Backbone.View);

  API.App = App = (function(_super) {
    __extends(App, _super);

    function App() {
      this.add = __bind(this.add, this);
      this.initialize = __bind(this.initialize, this);
      _ref5 = App.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    App.prototype.initialize = function() {
      var _this = this;
      ($(window)).ajaxError(function(e, r) {
        var err, j;
        ($('#request-error')).html((get_template('request-error'))());
        if ((j = $.parseJSON(r.responseText)) && (err = j.error)) {
          return ($('#request-error .msg')).text('Server Error: ' + err);
        }
      });
      ($(window)).ajaxSuccess(function(data) {
        return ($('#request-error')).html('');
      });
      (API.assets = new Assets()).fetch();
      return API.assetsView = new AssetsView({
        collection: API.assets,
        el: this.$('#assets')
      });
    };

    App.prototype.events = {
      'click #add-asset-button': 'add'
    };

    App.prototype.add = function(e) {
      new EditAssetView({
        model: new Asset({}, {
          collection: API.assets
        })
      });
      return false;
    };

    return App;

  })(Backbone.View);

  jQuery(function() {
    return API.app = new App({
      el: $('body')
    });
  });

}).call(this);
