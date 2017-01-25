# on demarre à partir d'une ubuntu 14.04
FROM ubuntu:14.04

# Mise à jour de la liste ds packages
RUN apt-get update -y

# Definition de la locale
RUN locale-gen en_GB.UTF-8
RUN dpkg-reconfigure locales

# Installation de la commande “add-apt-repository”
RUN apt-get install -y software-properties-common

# Creation d'un utilisateur openveo
RUN useradd -ms /bin/bash openveo

