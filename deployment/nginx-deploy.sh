if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

###########################

PACKAGE_JSON=package.json

if [ ! -f "$PACKAGE_JSON" ]; then
    cd ..
fi

if [ ! -f "$PACKAGE_JSON" ]; then
    echo cannot find $PACKAGE_JSON, please make sure you are running this script in the node.js project root folder
    exit 1
fi

###########################

echo installing Nginx...

apt-get update
apt-get install nginx

echo Nginx installed
echo
echo status of Nginx
systemctl status nginx

#####################

echo changing firewall setting...

ufw allow 'Nginx HTTP'

echo firewall settings updated

#####################

bash ./deployment/set-nginx.conf.sh