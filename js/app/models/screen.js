XS.Screen = Backbone.Model.extend({
  initialize: function() {
    this.wells = new XS.WellCollection;
    this.chemicals = new XS.ChemicalCollection;
  },
  
  url: function() {
    var name   = this.escape('name'),
        vendor = this.escape('vendor').toLowerCase().replace(' ', '_');
        
    return 'screens/' + vendor + '/' + name + '.xml'
  },
  
  validate: function(attrs) {
    if (!attrs.name) return "Must have a name";
  },
  
  fetchXML: function(callback) {
    $.get(this.url(), callback);
  },
  
  processXML: function(data) {
    var root = XS._xml = $(data);
        
    // Cache elements for later
    var $xml = {
      ingredients: root.find('ingredient'),
      wells:       root.find('condition')
    };
    
    // IDs <-> ingredient map:
    //     key:   stock ID
    //     value: eq() of ingredient in list
    var ingredients_map = {};
        
    $('#ingredients').show();
    
    // Setup table of ingredients
    var for_collection = _.map($xml.ingredients, function(ingredient, index) {
      var el  = $(ingredient);
                    
      return {
        el:    el,
        index: index,
        ids:   el.find('localID').map(function() {
                  var num = $(this).text();
                  // Add to ID <-> ingredient map while we're here
                  ingredients_map[num] = index;
                  return num;
                }).get()
      };
    });
    
    this.screen.chemicals.reset(for_collection);
        
    var plate_view = $('#conditions').empty();
    
    
    // Setup plate view
    $xml.wells.each(function(index) {
      var $el = $(this).find('conditionIngredient');
    
      // Find ingredients for this well
      var $ingredients = $el.map(function() {
        var id = $(this).find('stockLocalID').text();

        if (ingredients_map.hasOwnProperty(id)) {
          return $xml.ingredients.eq(ingredients_map[id]).clone()
        }
      });
      
      XS.tmpl('well', {
          ingredients: $ingredients,
          well_id:     XS.generateWellID(index)
        }, function(tmpl) {
        $(tmpl)
          .appendTo(plate_view)
          .data({
            'ingredients': $ingredients,
            'conditions':  $el.clone()
          });
      });      
    });
  }
});