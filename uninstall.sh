#!/bin/bash

echo "[+] Uninstalling FileShare"
rm -rf /tmp/fileshare
if [ $? -eq 0 ]; then
	echo "[+] Removed /tmp/fileshare."
else
	echo "[+] Failed to remove /tmp/fileshare."
fi
rm -rf /uploads
if [ $? -eq 0 ]; then
	echo "[+] Removed /uploads."
else
	echo "[+] Failed to remove /uploads."
fi
rm -rf /var/logs/fileshare/app.log
if [ $? -eq 0 ]; then
	echo "[+] Removed /var/logs/fileshare/app.log."
else
	echo "[+] Failed to remove /var/logs/fileshare/app.log."
fi
echo "[+] To completely remove FileShare rm -rf FileShare"
