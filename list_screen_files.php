<?php
header('Content-Type: application/json');

$ruby = 'ruby';

if (file_exists($_ENV['HOME'] . '/.rvm/bin/rvm')) {
  $ruby = "~/.rvm/rubies/ruby-1.9.2-p290/bin/ruby";
}
elseif (file_exists($_ENV['HOME'] . '/.rbenv')) {
  $ruby = 'export PATH="$HOME/.rbenv/bin:$PATH"; eval "$(rbenv init -)"; ruby';
}

system("$ruby list_screen_files.rb");