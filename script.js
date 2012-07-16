jQuery(function($) {
  XS.fetchXML = function(vendor, screen, callback) {
    $.get('screens/' + vendor + '/' + screen + '.xml', callback);
  };
  
  XS.getSortName = function(obj) {
    var name   = obj.el.find('name').text(),
        letter = name.match(/[A-Z]/);
    
    if (letter !== null) {
      return letter.toString().toLowerCase();
    }
    return name.match(/[a-z]/).toString().toLowerCase();
  };
  
  // Imperfect processing of `shortNames` to obtain correct
  // subscript number. Temp fix until manually fixed all names
  // server-side.
  XS.getShortName = function(obj) {
    var regex = /([A-Z)])([0-9])(?![0-9K,-\/])/gi;
    return obj.find('shortName').text().replace(regex, "$1<sub>$2</sub>");
  };

  XS.processXML = function(data) {
    var root = window._root = $(data);
    
    // IDs <-> ingredient map:
    //     key:   stock ID
    //     value: eq() of ingredient in list
    var ingredients_map = {};
    
    var chem_list = $('#ingredients tbody').empty();
    
    $('#ingredients').show();
    
    // Setup table of ingredients
    var ingredients = root.find('ingredient').map(function(index) {
      var el  = $(this),
          ids = el.find('localID').map(function() {
        var num = $(this).text();
        ingredients_map[num] = index;
        return num;
      }).get();
                
      return {
        el:  el,
        ind: index,
        ids: ids
      };
    }).get().sort(function(a, b) {
      var a_name = XS.getSortName(a),
          b_name = XS.getSortName(b);
      if (a_name < b_name) {
        return -1;
      }
      if (a_name > b_name) {
        return 1;
      }
      return 0;
    });
    
    $.each(ingredients, function() {    
      XS.tmpl('ingredient', this, function(tmpl) {
        $(tmpl).appendTo(chem_list);
      });
    });
    
    var plate_view = $('#conditions').empty();
    
    // Setup plate view
    root.find('condition').each(function(ind) {
      var el = $(this);
      // Get IDs for all ingredients
      var ids = el.find('conditionIngredient').map(function() {
        return $(this).find('stockLocalID').text();
      }).get();
      
      var ingredient_els = root.find('ingredient'),
          my_ingredients = [];
      
      // Match IDs to actual ingredients
      $.each(ids, function(ind, id) {
        if (ingredients_map.hasOwnProperty(id)) {
          my_ingredients.push(ingredient_els.eq(ingredients_map[id]).clone());
        }
      });
      
      XS.tmpl('well', {
          ingredients: my_ingredients,
          well_id:     XS.generateWellID(ind)
        }, function(tmpl) {
        $(tmpl)
          .appendTo(plate_view)
          .data({
            'ingredients': my_ingredients,
            'conditions':  el.find('conditionIngredient').clone()
          });
      });      
    });
  };
  
  $('#conditions')
  .on('mouseover', 'li:not(.list li)', function() {
    var data = $(this).data();
    
    var details = $('#details').css('visibility', 'visible').find('tbody').empty();
    
    $.each(data.ingredients, function(index, ingredient) {
      var condition = $(data.conditions[index]),
          id        = condition.find('stockLocalID').text();
            
      // Find appropriate stock
      var stock = window._root.find('stock').eq(parseInt(id) - 1);
        
      XS.tmpl('condition-detail', {
        conc:  condition.find('concentration').text(),
        units: stock.find('units').text(),
        name:  ingredient.find('name').text(),
        pH:    condition.find('pH').text(),
        type:  condition.find('type').text()
      }, function(data) {
        $(data).appendTo(details);
      });
    });
    
    $('#details h4').text($(this).find('.cell-id').text());
  })
  .on('mouseout', function() {
    $('#details').css('visibility', 'hidden').find('tbody').empty();
  });
  
  $('#ingredients tbody')
  .on('mouseover', 'tr', function() {
    var name = $(this).find('td').eq(1).text();
    $('.list li')
      .filter(function() {
        return $(this).text() === name;
      })
      .parents('.well')
      .addClass('well-selected');
  })
  .on('mouseout', 'tr', function() {
    $('.well').removeClass('well-selected');
  })
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
    if ($(this).val() === 'noop') return;
    
    var vendor = $(this).find(':selected').parent(),
        screen = $(this).val();
        
    XS.fetchXML(vendor.attr('id'), screen, XS.processXML);
    
    $('h1').text(screen).append('&nbsp;<span>' + vendor.attr('label') + '</span>');
  });
});