#!/usr/bin/env bash
sudo apt-get update

# docker
sudo apt install docker.io -y
sudo apt install docker-compose -y
sudo usermod -aG docker vagrant

sudo apt-get install git -y
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs -y

sudo npm install yarn -g
# fix yarn lock error
sudo chmod 777 -R ~/.config

# force startup folder to vagrant project
echo "cd /vagrant/src" >> /home/vagrant/.bashrc

# set hostname, makes console easier to identify
sudo echo "bootstrip" > /etc/hostname
sudo echo "127.0.0.1 bootstrip" >> /etc/hosts
