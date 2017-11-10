echo This script will stop db and api
kill -2 `lsof -i -ac mongod | GREP *:16015 | awk '{print $2}'`
pm2 kill