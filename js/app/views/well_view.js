jQuery(function($) {
XS.WellView = Backbone.View.extend({
  el: $('#conditions'),
  
  events: {
    'mouseover .well': 'showDetails',
    'mouseout':        'hideDetails'
  },
  
  initialize: function() {
    this.$el.empty();
    if (this.collection.length > 0) this.render();
  },
  
  render: function() {
    var view = this;
    this.collection.each(function(well) {
      XS.tmpl('well', well.toJSON(), function(tmpl) {
        $(tmpl)
          .appendTo(view.$el)
          .data({
            'ingredients': well.get('ingredients'),
            'conditions':  well.get('conditions')
          });
      });
    });
  },
  
  // Find and display details of well on hover
  showDetails: function(e) {
    var el   = $(e.currentTarget),
        data = el.data();
    
    var details = $('#details').css('visibility', 'visible').find('tbody').empty();
    
    $.each(data.ingredients, function(index, ingredient) {
      var condition = $(data.conditions[index]),
          id        = condition.find('stockLocalID').text();
            
      // Find appropriate stock
      var stock = XS._xml.find('stock').eq(parseInt(id) - 1);
        
      XS.tmpl('condition-detail', {
        conc:  condition.find('concentration').text(),
        units: stock.find('units').text().replace('M', '&nbsp;M').replace(/%([wv]\/v)/, '%&nbsp;($1)'),
        name:  ingredient.find('name').text(),
        pH:    condition.find('pH').text(),
        type:  condition.find('type').text()
      }, function(data) {
        $(data).appendTo(details);
      });
    });
    
    $('#details h4').text(el.find('.cell-id').text());
  },
  
  // Hide details box on mouseout
  hideDetails: function() {
    $('#details').css('visibility', 'hidden').find('tbody').empty();
  },
});
});