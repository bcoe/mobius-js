##
# Mobius-JS
#                   /\   \ 
#                  /  \   \          
#                 /    \   \
#                /      \   \
#               /   /\   \   \
#              /   /  \   \   \
#             /   /    \   \   \
#            /   /    / \   \   \
#           /   /    /   \   \   \
#          /   /    /---------'   \
#         /   /    /_______________\
#         \  /                     /
#          \/_____________________/                   
#
# Benjamin Coe (BenjaminCoe.com) - MIT Licensed.
#
# Description: Fetches dependent libraries and creates symlinks into the lib folder.
# to get up-to-date versions of a given library you can run 'git pull' in the
# repos directory.
#
cd repos

# Clone and build node.js
git clone http://github.com/ry/node.git
cd node
./configure
make
make install
cd ..

# Clone the Express library.
git clone http://github.com/visionmedia/express.git
cd ..
cd lib
ln -s ../repos/express/lib/support support
ln -s ../repos/express/lib/express express
ln -s ../repos/express/lib/express.js express.js
cd ..
cd repos

# Clone the ext.js library used by express.
git clone http://github.com/visionmedia/ext.js.git
cd ..
cd lib
ln -s ../repos/ext.js/lib/ext ext
ln -s ../repos/ext.js/lib/ext.js ext.js
cd ..
cd repos

# Clone the node-mongodb-native library.
git clone http://github.com/christkv/node-mongodb-native.git
cd ..
cd lib
ln -s ../repos/node-mongodb-native/lib/mongodb mongodb
cd ..
cd repos

# Clone Class library used by express.
git clone http://github.com/visionmedia/class.js.git
cd ..
cd repos/express/lib/support/class/
ln -s ../../../../../repos/class.js/lib lib
cd ../../../../../
cd repos

# Clone multipart-js library used by express.
git clone git://github.com/isaacs/multipart-js.git
cd ..
cd repos/express/lib/support/multipart/
ln -s ../../../../../repos/multipart-js/lib lib
cd ../../../../../