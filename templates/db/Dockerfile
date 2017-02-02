FROM common

# Installation de MongoDB
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" >> /etc/apt/sources.list
RUN apt-get -y update
RUN apt-get install -y mongodb-org

# must be provided by user calling docker build
ARG DB_ADMIN_OPERATOR_PASSWD
ARG DB_OPENVEO_OPERATOR_PASSWD
ARG DB_OPENVEO_USER_PASSWD

# Create 'adminOPERATOR' user on 'admin' database
ADD init_admin_db.js /tmp
RUN mongod -f /etc/mongod.conf --fork \
    && sleep 3 \
    && mongo admin --verbose \
             --eval "var DB_ADMIN_OPERATOR_PASSWD="\"${DB_ADMIN_OPERATOR_PASSWD}\"";" \
             /tmp/init_admin_db.js \
    && mongod -f /etc/mongod.conf --shutdown
RUN rm /tmp/init_admin_db.js

# Create users 'openveoOPERATOR' and 'openveoUSER' on 'openveo' database
ADD init_openveo_db.js /tmp
RUN mongod -f /etc/mongod.conf --fork \
    && sleep 3 \
    && mongo openveo --verbose \
             --eval "var DB_OPENVEO_OPERATOR_PASSWD="\"${DB_OPENVEO_OPERATOR_PASSWD}\"",DB_OPENVEO_USER_PASSWD="\"${DB_OPENVEO_USER_PASSWD}\"";" \
             /tmp/init_openveo_db.js \
    && mongod -f /etc/mongod.conf --shutdown
RUN rm /tmp/init_openveo_db.js

# Configuration de MongoDB
ADD mongod.conf /etc

# Add start script
ADD start.sh /
RUN chown mongodb:mongodb /start.sh
RUN chmod 755 /start.sh

# Update permissions
RUN chown -R mongodb:mongodb /var/lib/mongodb

# Default user and workdir
WORKDIR /var/lib/mongodb
USER mongodb

# start service
CMD /start.sh
