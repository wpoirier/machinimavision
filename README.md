This project uses ThreeJS, which is licensed under the MIT license.

To run this project properly, an http server must be run. I currently use ruby webrick as documented on the ThreeJS website. Run the following from the terminal to start a web server at localhost:8000

ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 8000, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"

Navigate to localhost:8000. For the current prototype, WASD will control the cube. Press space to begin recording inputs, and then press space again to finish. Press 'P' to initiate playback, and space again to replay the cube's movement.

In the near future, a backend component will be included in this repository that sets up a database to create users and allow them the ability to save and sharetheir recordings. It will also allow users to upload their own 3D models, animations, and terrain. Future revisions will also include the ability to manipulate record camera and lighting changes.
