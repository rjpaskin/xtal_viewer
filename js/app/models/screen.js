XS.Screen = Backbone.Model.extend({
  initialize: function() {
    this.wells = new XS.WellCollection;
  },
  
  url: function() {
    var name   = this.escape('name'),
        vendor = this.escape('vendor').toLowerCase().replace(' ', '_');
        
    return 'screens/' + vendor + '/' + name + '.xml'
  },
  
  validate: function(attrs) {
    if (!attrs.name) return "Must have a name";
  },
  
  fetchXML: function(callback) {
    $.get(this.url(), callback);
  }
});