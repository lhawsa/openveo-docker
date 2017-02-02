# on demarre à partir d'une ubuntu 14.04
FROM ubuntu:14.04

# Mise à jour de la liste ds packages
RUN apt-get update -y

# Definition de la locale
RUN locale-gen en_GB.UTF-8
RUN dpkg-reconfigure locales

# Installation de la commande “add-apt-repository”
RUN apt-get install -y software-properties-common

# Installation de curl
RUN apt-get install -y curl

# Installation de wget
RUN apt-get -y install wget

# Installation de host
RUN apt-get -y install host

# Installation de hostinfo
ADD hostinfo /usr/local/bin
RUN chmod +x /usr/local/bin/hostinfo
