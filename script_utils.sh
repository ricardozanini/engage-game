#!/bin/sh


############## Start the whole system #######################

echo "***************** Starting MongoDB *************"
systemctl start mongod

echo "******** Starting Engage Game ******************"

cd /opt/engage-game
npm start &

echo "******** Starting Engage Game Server ************"

cd /opt/engage-game-server
npm start &

cd /opt/engage-game
npm run leader-server-prod &

############ Anoying firewall ################################ 

# to host on a VM and play on host
firewall-cmd --get-active-zones

firewall-cmd --zone=public --add-port=8000/tcp --permanent # server
firewall-cmd --zone=public --add-port=3000/tcp --permanent # application
firewall-cmd --zone=public --add-port=3001/tcp --permanent # application
firewall-cmd --zone=public --add-port=1337/tcp --permanent # mongodb

############### MongoDB remove emails ##########################

# first connect to the DB
mongo

# switch to the engage db
use engage

# list the leaderboard
db.leaders.find()

# to remove a specific email
db.leaders.remove({email : "the_email@example.com"})

# reference: https://docs.mongodb.com/manual/reference/mongo-shell/
