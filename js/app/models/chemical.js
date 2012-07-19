XS.Chemical = Backbone.Model.extend({
  initialize: function() {
    this.set('shortName', this.get('el').find('shortName').text());
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
  displayShortName: function() {
    var regex = /([A-Z)])([0-9])(?![0-9K,-\/])/gi;
    return this.escape('shortName').replace(regex, "$1<sub>$2</sub>");
  }
});