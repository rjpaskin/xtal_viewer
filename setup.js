(function($) {
  var promises = {};
  
  var loadTemplateAsync = function(name){
    var promise = promises[name] || $.get("templates/" + name + ".html");
    promises[name] = promise;
    return promise;
  }
  
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
  }
})(jQuery);