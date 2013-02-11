#!/usr/bin/env ruby
require 'json'
screens  = {}
filename = File.expand_path('../screen_details.js', __FILE__)

def humanify(name)
  name.split('_').map { |word| word.capitalize }.join(' ')
end

Dir.glob('screens/*/').each do |dir|
  name = dir.split('/').last
  
  screens[name] = {
    'name'  => humanify(name),
    'files' => Dir.glob("#{dir}/*.xml").map { |file| File.basename file, '.xml' }
  }
end

output = <<JS
// This file is generated using `list_screen_files.rb`
XS.screens = #{JSON.pretty_generate screens}
JS

File.write(filename, output)
