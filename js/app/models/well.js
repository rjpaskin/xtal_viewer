XS.Well = Backbone.Model.extend({
  initialize: function() {
    this.chemicals = new XS.ChemicalCollection;
  },
  
  generateWellID: function(row_size) {
    if (row_size == null) { row_size = 12; }
    
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        column  = Math.ceil((this.id + 1) / row_size) - 1,
        row     = (this.id % row_size) + 1;
        
    return letters[column] + row;
  }
});