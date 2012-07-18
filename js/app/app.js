XS.Router = Backbone.Router.extend({
  routes: {
    '':                'index',
    ':vendor/:screen': 'loadScreen'
  },
  
  index: function() {
    console.log('App started');
    
    if (!this.isInitialized()) {
      this.fetchScreenData();
    }
    
    // TEMP - reset interface
    $('#ingredients tbody').empty();
    $('#ingredients').hide();
    $('#conditions').empty();
    $('#details').css('visibility', 'hidden').find('tbody').empty();
    $('#change-screen').val('');
  },
  
  loadScreen: function(vendor, screen) {
    if (!this.screens) this.fetchScreenData();
    
    if (this.screenExists(vendor, screen)) {
      XS.fetchXML(vendor, screen, XS.processXML);
    }
    else {
      this.trigger('page_not_found', vendor + '/' + screen);
    }
  },
  
  isInitialized: function() {
    return this.initialized;
  },
  
  screenExists: function(vendor, screen) {
    if (!this.screens) throw new Error('No screen information');
    
    return this.screens.hasOwnProperty(vendor)
      && this.screens[vendor].files.indexOf(screen) !== -1;
  },
  
  // Fetch JSON list of screens from server and render
  // as Chosen select box.
  fetchScreenData: function() {
    var app = this;
    $.getJSON('list_screen_files.php', function(data) {
      app.screens = data;
      
      XS.tmpl('select-screen', { list: data }, function(tmpl) {
        $(tmpl).insertAfter('h1').chosen();
      });
    });
  }
});

jQuery(function($) {
  var App = window.App = new XS.Router;
  
  // DEBUG
  App.on('all', function(event_name) {
    console.log('# EVENT: ', event_name, [].slice.call(arguments, 1));
  });
  
  Backbone.history.start();
  App.initialized = true;
  
  App.on('page_not_found', function(page) {
    alert('Page not found: ' + page);
  });
  
  
  // Load a screen
  $(document).on('change', '#change-screen', function(e) {
    var el     = $(this),
        screen = el.val();
    if (screen === 'noop') return;
    
    var vendor = el.find(':selected').parent();
    
    // Display screen name
    $('h1').text(screen).append('&nbsp;<span>' + vendor.attr('label') + '</span>');
    
    App.navigate(vendor.attr('id') + '/' + screen, {trigger: true});
  });
});