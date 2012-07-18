jQuery(function($){
XS.ChemicalView = Backbone.View.extend({
  el: $('#ingredients tbody'),
  
  collection: new XS.ChemicalCollection,
  
  events: {
    'mouseover tr': 'filterWells',
    'mouseout tr':  'unfilterWells',
    'mouseover':    'enterSelectMode',
    'mouseout':     'exitSelectMode'
  },
  
  render: function() {
    this.collection.each(function(ingredient) {    
      XS.tmpl('ingredient', ingredient, function(tmpl) {
        $(tmpl).appendTo(this.$el);
      });
    });
  },
  
  // Highlight wells that contain mouseover'd ingredient
  filterWells: function(e) {
    var name = $(e.target).parents('tr').find('td').eq(1).text();
    $('.list li')
      .filter(function() {
        return $(this).text() === name;
      })
      .parents('.well')
      .addClass('well-selected');
  },
  
  // Remove selected class from all wells
  unfilterWells: function() {
    $('.well').removeClass('well-selected');
  },
  
  // Set/remove class for well highlighting
  enterSelectMode: function() {
    $('#conditions').addClass('select-mode');
  },
  
  exitSelectMode: function() {
    $('#conditions').removeClass('select-mode');
  }
});
});