XS.Well = Backbone.Model.extend({
  initialize: function() {
    //this.chemicals = new XS.ChemicalCollection;
    this.set('well_id', this.generateWellID());
  },
  
  // Generate a well ID from a zero-based index
  //  row_size: number of well in a row (default: 12)
  generateWellID: function(row_size) {
    if (row_size == null) { row_size = 12; }
    
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        index   = this.get('index');
        column  = Math.ceil((index + 1) / row_size) - 1,
        row     = (index % row_size) + 1;
        
    return letters[column] + row;
  }
});