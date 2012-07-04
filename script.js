jQuery(function($) {
  XS.fetchXML = function(vendor, screen, callback) {
    $.get('screens/' + vendor + '/' + screen + '.xml', callback);
  };

  XS.processXML = function(data) {
    var root = $(data);
    window._root = root;
    
    // IDs <-> ingredient map:
    //     key:   stock ID
    //     value: eq() of ingredient in list
    var ingredients_map = {};
    
    var chem_list = $('#ingredients tbody').empty();
    
    $('#ingredients').show();
    
    // Setup table of ingredients
    var ingredients = root.find('ingredient').map(function(ind) {
      var el = $(this);
      var ids = el.find('localID').map(function() {
        var num = $(this).text();
        ingredients_map[num] = ind;
        return num;
      }).get();
                
      return { el: el, ind: ind, ids: ids }
    }).get().sort(function(a, b) {
      var a_name = a.el.find('name').text(),
          b_name = b.el.find('name').text();
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
      
      var ingred_els = root.find('ingredient'),
          my_ingreds = [];
      
      // Match IDs to actual ingredients
      $.each(ids, function(ind, id) {
        if (ingredients_map.hasOwnProperty(id)) {
          my_ingreds.push(ingred_els.eq(ingredients_map[id]).clone());
        }
      });
      
      XS.tmpl('well', {
          ingredients: my_ingreds,
          well_id:     XS.generateWellID(ind)
        }, function(tmpl) {
        $(tmpl)
          .appendTo(plate_view)
          .data({
            'ingredients': my_ingreds,
            'conditions':  el.find('conditionIngredient').clone()
          });
      });      
    });
  };
  
  $('#conditions')
  .on('mouseover', 'li:not(.list li)', function() {
    var data = $(this).data();
    
    var details = $('#details ul').empty();
    
    $.each(data.ingredients, function(ind, val) {
      var cond = $(data.conditions[ind]);
      var id   = cond.find('stockLocalID').text();
            
      // Find appropriate stock
      var stock = window._root.find('stock').eq(parseInt(id) - 1);
        
      XS.tmpl('condition-detail', {
        conc:  cond.find('concentration').text(),
        units: stock.find('units').text(),
        name:  val.find('name').text(),
        pH:    (cond.find('pH').length !== 0) ? ' pH ' + cond.find('pH').text() : '',
        type:  cond.find('type').text().toLowerCase()
      }, function(data) {
        $(data).appendTo(details);
      });
    });
  })
  .on('mouseout', function() {
    $('#details ul').empty();
  });
  
  $('#ingredients tbody')
  .on('mouseover', 'tr', function() {
    var name = $(this).find('td').eq(1).text();
    $('.list li')
      .filter(function() {
        return $(this).text() === name;
      })
      .parents('.well')
      .addClass('well-selected')
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
  
  $.getJSON('list_screen_files.php', function(data) {
    XS.tmpl('select-screen', { list: data }, function(tmpl) {
      $(tmpl).insertAfter('h1');
    });
  });
  
  $(document).on('change', '#change-screen', function(e) {
    if ($(this).val() === 'noop') return;
    
    var vendor = $(this).find(':selected').parent(),
        screen = $(this).val();
        
    XS.fetchXML(vendor.attr('id'), screen, XS.processXML);
    
    $('h1').text(screen).append('&nbsp;<span>' + vendor.attr('label') + '</span>');
  });
});