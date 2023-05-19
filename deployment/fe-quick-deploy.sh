PACKAGE_JSON=package.json

if [ ! -f "$PACKAGE_JSON" ]; then
    cd ..
fi

if [ ! -f "$PACKAGE_JSON" ]; then
    echo cannot find $PACKAGE_JSON, please make sure you are running this script in the node.js project root folder
    exit 1
fi

###########################

echo installing packages
npm install


echo building product
npm run build
export STATIC_FILE_PATH=$FRONTEND_PROJ_FOLDER/build

###########################

echo completed deployment script of frontend
