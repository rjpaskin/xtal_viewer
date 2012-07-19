jQuery(function($){
XS.ChemicalView = Backbone.View.extend({
  el: $('#ingredients tbody'),
    
  events: {
    'mouseover tr': 'filterWells',
    'mouseout tr':  'unfilterWells',
    'mouseover':    'enterSelectMode',
    'mouseout':     'exitSelectMode'
  },
  
  initialize: function() {
    this.$el.empty();
    if (this.collection.length > 0) this.render();
    this.collection.on('reset', this.render, this);
  },
  
  render: function() {
    var view = this;
    this.collection.each(function(ingredient) {
      XS.tmpl('ingredient', ingredient.toJSON(), function(tmpl) {
        $(tmpl).appendTo(view.$el);
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