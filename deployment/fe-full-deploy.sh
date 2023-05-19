# if [[ $UID != 0 ]]; then
#     echo "Please run this script with sudo:"
#     echo "sudo $0 $*"
#     exit 1
# fi

#############################

PACKAGE_JSON=package.json

if [ ! -f "$PACKAGE_JSON" ]; then
    cd ..
fi

if [ ! -f "$PACKAGE_JSON" ]; then
    echo cannot find $PACKAGE_JSON, please make sure you are running this script in the node.js project root folder
    exit 1
fi

###########################

echo installing node.js...

sudo curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install nodejs

echo installed node.js: $(node --version)

###########################

bash ./deployment/fe-quick-deploy.sh