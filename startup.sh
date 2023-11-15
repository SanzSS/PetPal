#!/bin/bash

# install Python interpreter if needed
sudo apt install python3.11

# create a virtual env
python3.11 -m venv venv
source venv/bin/activate

# install prereq for pillow if needed
    # uninstall pil bc cant have pil and pillow
pip uninstall pil
pip install pillow

# install django
pip install django

# install rest frameowrk
pip install djangorestframework
# install jwt
pip install djangorestframework-simplejwt

# run all migrations
python manage.py migrate