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

echo installing packages
npm install


echo building product
npm run build
export STATIC_FILE_PATH=$FRONTEND_PROJ_FOLDER/build

###########################

echo completed deployment script of frontend
