require "sinatra"
require "sinatra/reloader"
require "kramdown"

def load_file( name )
  file_contents = ""
  
  Dir.glob "public/files/" + name do |file|
    opened = File.open(file, "r")
    
    opened.each_line do |line|
      file_contents += line
    end
  end
  
  file_contents
end

get "/" do
  file = load_file("index.md")
  
  @paragraphs = file.split("\n\n")
  erb :index
end