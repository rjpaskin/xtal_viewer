XS.ChemicalCollection = Backbone.Collection.extend({
  model: XS.Chemical,
  
  comparator: function(chemical) {
    return chemical.getSortName();
  }
});