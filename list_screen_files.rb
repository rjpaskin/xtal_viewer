#!/usr/bin/env ruby
require 'rubygems'
require 'json'
out = {}

def humanify(name)
  name.split('_').map { |word| word.capitalize }.join(' ')
end

Dir.glob('screens/*/').each do |dir|
  name = dir.split('/').last
  
  out[name] = {
    'name'  => humanify(name),
    'files' => Dir.glob("#{dir}/*.xml").map { |file| File.basename file, '.xml' }
  }
end

puts out.to_json