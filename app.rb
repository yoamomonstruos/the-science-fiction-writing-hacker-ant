require "sinatra"
require "sinatra/reloader"

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
  erb :index
end

get "/disso" do
  file = load_file("index.md")
  file
end