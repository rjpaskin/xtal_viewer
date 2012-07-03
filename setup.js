(function($) {
  // Code adapted from:
  // lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/
  var promises = {};
  
  var loadTemplateAsync = function(name){
    var promise = promises[name] || $.get("templates/" + name + ".html");
    promises[name] = promise;
    return promise;
  };
  
  // Render a template
  //   name: name of template file, minus extension.
  //   data: data to be passed to the template
  //   fn:   callback function, passed rendered template. 
  XS.tmpl = function(name, data, fn){
    var promise = loadTemplateAsync(name);
    promise.done(function(str){
      var template = XS._tmpl(str, data);
      fn.call(this, template);
    });
  };
  
  // Generate a well ID from a zero-based index
  //  row_size: number of well in a row (default: 12)
  XS.generateWellID = function(index, row_size) {
    if (row_size == null) { row_size = 12; }
    
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        column  = Math.ceil((index + 1) / row_size) - 1,
        row     = (index % row_size) + 1;
        
    return letters[column] + row;
  };
})(jQuery);