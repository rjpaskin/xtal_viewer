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
})(XS, jQuery);