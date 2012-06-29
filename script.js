$(function() {
  $.get('screens/molecular_dimensions/JCSG+.xml', function(data) {
    var root = $(data);
    window._root = root;
    
    console.log(root.find('condition').slice(0,2));
    
    var table = $('<table/>');
    
    // IDs <-> ingredient map:
    //  key:   stock ID
    //  value: eq() of ingredient in list
    var ingredients = {};
    
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
    table.appendTo('body').attr('id', 'ingredients');        
    
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
          my_ingreds.push(ingred_els.eq(ingredients[id]).find('shortName').text());
        }
      });
      
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      var my_lett = letters[Math.ceil((ind + 1) / 12) - 1];
      
      $('<li/>')
        .append(function() {
          var sub = $('<ul/>').addClass('list');
          $.each(my_ingreds, function(ind, val) {
            sub.append('<li>' + val + '</li>');
          });
          return sub;
        })
        .append('<span class="cell-id">' + my_lett + ((ind % 12) + 1) + '</span>')
        .appendTo(list);        
    });
  });
});