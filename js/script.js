(function(XS, $) {
  XS.fetchXML = function(vendor, screen, callback) {
    $.get('screens/' + vendor + '/' + screen + '.xml', callback);
  };
  
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
  
  
jQuery(function($) {
  $('#conditions')
  // Find and display details of well on hover
  .on('mouseover', 'li:not(.list li)', function() {
    var el   = $(this),
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
  })
  // Hide details box on mouseout
  .on('mouseout', function() {
    $('#details').css('visibility', 'hidden').find('tbody').empty();
  });
  
  $('#ingredients tbody')
  // Highlight wells that contain mouseover'd ingredient
  .on('mouseover', 'tr', function() {
    var name = $(this).find('td').eq(1).text();
    $('.list li')
      .filter(function() {
        return $(this).text() === name;
      })
      .parents('.well')
      .addClass('well-selected');
  })
  // Remove selected class from all wells
  .on('mouseout', 'tr', function() {
    $('.well').removeClass('well-selected');
  })
  // Set/remove class for well highlighting
  .on('mouseover', function() {
    $('#conditions').addClass('select-mode');
  })
  .on('mouseout', function() {
    $('#conditions').removeClass('select-mode');
  });
  
  // Fetch JSON list of screens from server and render
  // as Chosen select box.
  $.getJSON('list_screen_files.php', function(data) {
    XS.tmpl('select-screen', { list: data }, function(tmpl) {
      $(tmpl).insertAfter('h1').chosen();
    });
  });
  
  // Load a screen
  $(document).on('change', '#change-screen', function(e) {
    var el     = $(this),
        screen = el.val();
    if (screen === 'noop') return;
    
    var vendor = el.find(':selected').parent();
        
    XS.fetchXML(vendor.attr('id'), screen, XS.processXML);
    
    // Display screen name
    $('h1').text(screen).append('&nbsp;<span>' + vendor.attr('label') + '</span>');
  });
});