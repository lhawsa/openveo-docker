FROM common

# Installing ImageMagick
RUN apt-get install -y imagemagick

# Installing FFMPEG
RUN add-apt-repository ppa:kirillshkrogalev/ffmpeg-next
RUN apt-get update -qq
RUN apt-get install -y ffmpeg

# Installing git
RUN apt-get -y install git

# !!! Frome here the command 'apt-get install' must not be used anymore !!!

# Installing nodejs
# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done
ENV NODE_VERSION 4.7.2
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Add openveo user
RUN useradd -ms /bin/bash openveo

# Installing bower
RUN npm install -g bower

# Setting default working dir
WORKDIR /home/openveo

# Installing openveo and openveo publish
USER openveo
RUN mkdir /home/openveo/openveo
RUN mkdir /tmp/Dockerfile.d
RUN cd /home/openveo/openveo && npm install @openveo/core
RUN cd /home/openveo/openveo/node_modules/@openveo/core && npm install @openveo/publish
RUN rm -Rf /home/openveo/openveo/node_modules/@openveo/core/node_modules/@openveo/publish/node_modules/@openveo

# build args
ARG DB_OPENVEO_USER_PASSWD
ARG APP_SUPER_ADMIN_NAME
ARG APP_SUPER_ADMIN_EMAIL
ARG APP_SUPER_ADMIN_PASSWD
ARG COMMON_PREFIX

# openveo config files
# ====================

# -- conf.json --
USER openveo
ADD conf.json /tmp/Dockerfile.d
RUN APP_PASSWD_HASHKEY=$(dd if=/dev/urandom bs=1 count=10 | openssl base64) \
    bash /tmp/Dockerfile.d/conf.json > /home/openveo/.openveo/core/conf.json
# -- databaseConf.json --
ADD databaseConf.json /tmp/Dockerfile.d
RUN COMMON_PREFIX=${COMMON_PREFIX} DB_OPENVEO_USER_PASSWD=${DB_OPENVEO_USER_PASSWD} \
    bash /tmp/Dockerfile.d/databaseConf.json > /home/openveo/.openveo/core/databaseConf.json
# -- loggerConf.json --
ADD loggerConf.json /tmp/Dockerfile.d
RUN bash /tmp/Dockerfile.d/loggerConf.json > /home/openveo/.openveo/core/loggerConf.json
# -- serverConf.json --
ADD serverConf.json /tmp/Dockerfile.d/
RUN APP_SESSION_SECRET=$(dd if=/dev/urandom bs=1 count=40 | openssl base64) \
    bash /tmp/Dockerfile.d/serverConf.json > /home/openveo/.openveo/core/serverConf.json

# openveo publish config files
# ============================

# -- publishConf.json --
ADD publish/publishConf.json /tmp/Dockerfile.d/
RUN bash /tmp/Dockerfile.d/publishConf.json > /home/openveo/.openveo/publish/publishConf.json
# -- videoPlatformConf.json --
ADD publish/videoPlatformConf.json /tmp/Dockerfile.d/
RUN bash /tmp/Dockerfile.d/videoPlatformConf.json > /home/openveo/.openveo/publish/videoPlatformConf.json
# -- loggerConf.json --
ADD publish/loggerConf.json /tmp/Dockerfile.d/
RUN bash /tmp/Dockerfile.d/loggerConf.json > /home/openveo/.openveo/publish/loggerConf.json
# -- watcherConf.json --
ADD publish/watcherConf.json /tmp/Dockerfile.d/
RUN bash /tmp/Dockerfile.d/watcherConf.json > /home/openveo/.openveo/publish/watcherConf.json

# Add start script
USER root
RUN touch /start-vars.sh
RUN echo export APP_SUPER_ADMIN_NAME=${APP_SUPER_ADMIN_NAME} >> /start-vars.sh
RUN echo export APP_SUPER_ADMIN_EMAIL=${APP_SUPER_ADMIN_EMAIL} >> /start-vars.sh
RUN echo export APP_SUPER_ADMIN_PASSWD=${APP_SUPER_ADMIN_PASSWD} >> /start-vars.sh

RUN chmod 755 /start-vars.sh
ADD start.sh /
RUN chown openveo:openveo /start.sh
RUN chmod 755 /start.sh

# Create log directory
USER root
RUN mkdir /var/log/openveo
RUN chown openveo:openveo /var/log/openveo
RUN chmod 755 /var/log/openveo

# create openveo super admin
USER openveo
# createSuperAdmin.js
ADD createSuperAdmin.js /home/openveo/openveo/node_modules/@openveo/core

# remove temp files
USER root
RUN rm -fr /tmp/Dockerfile.d

# start service
USER openveo
CMD /start.sh
