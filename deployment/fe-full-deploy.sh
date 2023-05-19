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

############################

# Absolute path to this script
SCRIPT=$(readlink -f "$0")
# Absolute path of the dir this script is in
SCRIPT_DIR_PATH=$(dirname "$SCRIPT")

if [[ "$FRONTEND_PROJ_FOLDER" == "" ]]; then
    export FRONTEND_PROJ_FOLDER=$(pwd)
fi

###########################

echo installing node.js...

sudo curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install nodejs

echo installed node.js: $(node --version)
echo
###########################

echo
bash ./deployment/fe-quick-deploy.sh
echo

###########################

echo
bash ./deployment/nginx-deploy.sh
echo