echo This script will install npm packages, and run pm2 skripts
npm install
mkdir -p data
pm2 delete all 
pm2 start pm2.json
mongod --dbpath ./data --port 16015 --fork --syslog