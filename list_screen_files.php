<?php
$ruby = 'ruby';

if (file_exists($_ENV['HOME'] . '/.rvm/bin/rvm')) {
  $ruby = "~/.rvm/rubies/ruby-1.9.2-p290/bin/ruby";
}

system("$ruby list_screen_files.rb");