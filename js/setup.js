(function($, XS) {
  // Code adapted from:
  // lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/
  var promises = {};
  
  var loadTemplateAsync = function(name){
    var promise = promises[name] || $.get("templates/" + name + ".html?" + new Date().getTime());
    promises[name] = promise;
    return promise;
  };
  
  // Render a template
  //   name: name of template file, minus extension.
  //   data: data to be passed to the template
  //   fn:   callback function, passed rendered template. 
  XS.tmpl = function(name, data, fn){
    loadTemplateAsync(name).done(function(str){
      var template = _.template(str, data);
      fn.call(this, template);
    });
  };
  
  XS.generateGradient = function(min, max, num) {
    var out  = [],
        step = (max - min) / (num - 1);
        
    for (var i = min; i <= max; i += step) {
      out.push(i)
    }
    return out;
  }
})(jQuery, XS);