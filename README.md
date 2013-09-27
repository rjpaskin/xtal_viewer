# xtal_viewer

Javascript one-page app for viewing Rock Maker XML crystal screen files

## Adding Rock Maker files

1. Create a `screens` folder within the project
2. Within this folder, add your Rock Maker `.xml` files, organised by manufacturer, e.g.
```
    |__ qiagen
       |_ ComPAS Suite.xml
       |_ PEGs Suite.xml
       ...etc
    |_ molecular_dimensions
       |_ (Molecular Dimensions screens go here)
```
3. Run `list_screen_files.rb` in the project folder.
4. Open `index.html` in your browser and choose a screen to view!

If you change or add screen files, simply run `list_screen_files` again to pick up your
changes.

## Getting screen files

Rock Maker XML files can be downloaded from 
[Formulatrix](http://www.formulatrix.com/products/protein-crystallography-software/screen-database/index.html).
