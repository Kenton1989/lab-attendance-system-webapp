PACKAGE_JSON=package.json

if [ ! -f "$PACKAGE_JSON" ]; then
    cd ..
fi

if [ ! -f "$PACKAGE_JSON" ]; then
    echo cannot find $PACKAGE_JSON, please make sure you are running this script in the node.js project root folder
    exit 1
fi

###########################

if [[ $BACKEND_SERVER == "" ]]; then
    export BACKEND_SERVER=127.0.0.1:8000
fi

if [[ $STATIC_FILE_PATH == "" ]]; then
    if [[ $FRONTEND_PROJ_FOLDER == "" ]]; then
        export FRONTEND_PROJ_FOLDER=$(pwd)
    fi
    export STATIC_FILE_PATH=$FRONTEND_PROJ_FOLDER/build
fi

envsubst '\$BACKEND_SERVER \$STATIC_FILE_PATH'