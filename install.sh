#!/bin/bash

echo "[+] Installing dependencies."
npm install
if [ $? -eq 0 ]; then
	echo "[+] Dependencies installed."
else
	echo "[+] Failed to install dependencies."
fi
echo "[+] Creating .env file."

echo "[+] You have to adjust the properties of .env file."

echo "PORT={port_to_expose}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create PORT={port_to_expose}."
fi

echo "DB_USER={postgres_username}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create DB_USER={postgres_username}."
fi

echo "DB_PASS={postgres_password}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create DB_PASS={postgres_password}."
fi

echo "DB=fileshare" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create DB=fileshare."
fi

echo "DB_HOST={postgres_ip}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create DB_HOST={postgres_ip}."
fi

echo "DB_PORT={postgres_port}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create DB_PORT={postgres_port}."
fi

echo "SECRET={mysupersecret}" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create SECRET={mysupersecret}."
fi

echo "UPLOAD=/uploads" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create UPLOAD=/uploads."
fi

echo "TMP=/tmp/fileshare" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create TMP=/tmp/fileshare."
fi

echo "LOG_FILE=/var/logs/fileshare/app.log" >> .env
if [ $? -ne 0 ]; then
	echo "Failed to create LOG_FILE=/var/logs/fileshare/app.log."
fi

echo "[+] Creating Log file."
mkdir /var/logs/fileshare
if [ $? -eq 0 ]; then
	echo "[+] Log directory created at /var/logs/fileshare"
else
	echo "[+] Failed to initialize log directory."
fi

touch /var/logs/fileshare/app.log
if [ $? -eq 0 ]; then
	echo "[+] Log file created at /var/logs/fileshare/app.log"
else
	echo "[+] Failed to initialize log file."
fi

echo "[+] Creating upload and tmp folder."
mkdir /tmp/fileshare
if [ $? -eq 0 ]; then
	echo "[+] Tmp directory created at /tmp/fileshare"
else
	echo "[+] Failed to initialize /tmp/fileshare directory."
fi

mkdir /uploads
if [ $? -eq 0 ]; then
	echo "[+] Uploads directory created at /uploads"
else
	echo "[+] Failed to initialize /uploads directory."
fi

echo "[+] Installation finished."
echo "[+] Edit .env file and run npm start."


