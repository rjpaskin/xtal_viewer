XS.Chemical = Backbone.Model.extend({
  initialize: function() {
    var shortName = this.get('el').find('shortName').text(),
        formatted = this.displayShortName(shortName);
    this.set({
      'shortName': shortName,
      'shortNameHTML': formatted
    });
  },

  getSortName: function() {
    var name   = this.escape('shortName'),
        letter = name.match(/[A-Z]/);
    
    if (!_.isNull(letter)) {
      return letter.toString().toLowerCase();
    }
    return name.match(/[a-z]/).toString().toLowerCase();
  },
  
  // Imperfect processing of `shortNames` to obtain correct
  // subscript number. Temporary fix until names fixed manually
  // server-side.
  displayShortName: function(name) {
    var regex = /([A-Z)])([0-9])(?![0-9K,-\/])/gi;
    return name.replace(regex, "$1<sub>$2</sub>");
  }
});