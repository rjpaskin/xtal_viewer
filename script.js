$(function() {
  $.get('screens/molecular_dimensions/JCSG+.xml', function(data) {
    var root = $(data);
    window._root = root;
    
    console.log(root.find('condition').slice(0,2));
    
    var table = $('#ingredients tbody');
    
    // IDs <-> ingredient map:
    //     key:   stock ID
    //     value: eq() of ingredient in list
    var ingredients = {};
    
    console.log(root.find('stock').length);
    
    // Setup table of ingredients
    root.find('ingredient').each(function(ind) {
      var el = $(this);
      var ids = el.find('localID').map(function() {
        var num = $(this).text();
        ingredients[num] = ind;
        return num;
      }).get();
                
      $('<tr/>')
        .append('<td>' + (ind + 1) + '</td>')
        .append('<td>' + el.find('shortName').text() + '</td>')
        .append('<td>' + el.find('name').text() + '</td>')
        //.append('<td>' + ids.join(', ') + '</td>')
        .appendTo(table);        
    });
    
    // Setup plate view
    var list = $('#conditions');
    
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
        if (ingredients.hasOwnProperty(id)) {
          my_ingreds.push(ingred_els.eq(ingredients[id]).clone());
        }
      });
      
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
          my_lett = letters[Math.ceil((ind + 1) / 12) - 1]
          cell_id = my_lett + ((ind % 12) + 1);
      
      $('<li/>')
        .data({
          'ingredients': my_ingreds,
          'conditions':  el.find('conditionIngredient').clone()
        })
        .append(function() {
          var sub = $('<ul/>').addClass('list');
          $.each(my_ingreds, function(ind, val) {
            sub.append('<li>' + val.find('shortName').text() + '</li>');
          });
          return sub;
        })
        .append('<span class="num-conditions">' + my_ingreds.length + '</span>')
        .append('<span class="cell-id">' + cell_id + '</span>')
        .appendTo(list);        
    });
  });
  
  $('#conditions')
  .on('mouseover', 'li:not(.list li)', function() {
    var data = $(this).data();
    
    var details = $('#details ul').empty();
    
    $.each(data.ingredients, function(ind, val) {
      var cond = $(data.conditions[ind]);
      var id   = cond.find('stockLocalID').text();
            
      // Find appropriate stock
      var stock = window._root.find('stock').eq(parseInt(id) - 1);
      
      $('<li/>')
        .append(cond.find('concentration').text())
        .append(stock.find('units').text())
        .append(' ')
        .append(val.find('name').text())
        .append(' (' + cond.find('type').text().toLowerCase() + ')')
        .appendTo(details);
    });
  })
  .on('mouseout', function() {
    $('#details ul').empty();
  });
});