(function(XS, $) { 
  XS.getSortName = function(obj) {
    var name   = obj.el.find('name').text(),
        letter = name.match(/[A-Z]/);
    
    if (!_.isNull(letter)) {
      return letter.toString().toLowerCase();
    }
    return name.match(/[a-z]/).toString().toLowerCase();
  };
  
  // Imperfect processing of `shortNames` to obtain correct
  // subscript number. Temporary fix until names fixed manually
  // server-side.
  XS.getShortName = function(obj) {
    var regex = /([A-Z)])([0-9])(?![0-9K,-\/])/gi;
    return obj.find('shortName').text().replace(regex, "$1<sub>$2</sub>");
  };

  XS.processXML = function(data) {
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
    
    var chem_list = $('#ingredients tbody').empty();
    
    $('#ingredients').show();
    
    // Setup table of ingredients
    _.chain($xml.ingredients)
      .map(function(ingredient, index) {
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
      })
      .sortBy(XS.getSortName)
      .each(function(ingredient) {    
        XS.tmpl('ingredient', ingredient, function(tmpl) {
          $(tmpl).appendTo(chem_list);
        });
      });
    
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
  };
})(XS, jQuery);