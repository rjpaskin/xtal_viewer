XS.Router = Backbone.Router.extend({
  routes: {
    '':                'index',
    ':vendor/:screen': 'loadScreen'
  },
  
  index: function() {    
    if (!this.isInitialized()) {
      this.displayScreenData();
    }
    
    // TEMP - reset interface
    $('#ingredients tbody').empty();
    $('#ingredients').hide();
    $('#conditions').empty();
    $('#details').css('visibility', 'hidden').find('tbody').empty();
    $('#change-screen').val('').trigger("liszt:updated");
    $('h1').text('Screen Viewer');
  },
  
  loadScreen: function(vendor, screen) {    
    if (this.screenExists(vendor, screen)) {
      this.screen = new XS.Screen({
        vendor: vendor,
        name:   screen
      });
      
      this.screen.fetchXML(XS.processXML);
      this.chemicalList = new XS.ChemicalView;
      this.wellList = new XS.WellView;
    }
    else {
      this.trigger('page_not_found', vendor + '/' + screen);
    }
  },
  
  isInitialized: function() {
    return this.initialized;
  },
  
  screenExists: function(vendor, screen) {    
    return XS.screens.hasOwnProperty(vendor)
      && XS.screens[vendor].files.indexOf(screen) !== -1;
  },
  
  // Fetch JSON list of screens from server and render
  // as Chosen select box.
  displayScreenData: function() {
    XS.tmpl('select-screen', { list: XS.screens }, function(tmpl) {
      $(tmpl).insertAfter('h1').chosen();
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
  
  // Display screen name
  App.on('route:loadScreen', function(vendor_id, screen) {
    $('h1')
      .text(screen)
      .append('&nbsp;<span>' + XS.screens[vendor_id].name + '</span>'); 
  });
  
  
  // Load a screen
  $(document).on('change', '#change-screen', function(e) {
    var screen = $(this).val();
    if (screen === 'noop') return;
        
    App.navigate(screen, {trigger: true});
  });
});