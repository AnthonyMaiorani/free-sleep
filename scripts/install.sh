#!/bin/bash

# Variables
REPO_URL="https://github.com/throwaway31265/free-sleep/archive/refs/heads/main.zip"
ZIP_FILE="free-sleep.zip"
REPO_DIR="/home/dac/free-sleep"
SERVER_DIR="$REPO_DIR/server"
SERVICE_FILE="/etc/systemd/system/free-sleep.service"

# Step 1: Download the repository
echo "Downloading the repository..."
curl -L -o "$ZIP_FILE" "$REPO_URL"

# Step 2: Unzip the repository
echo "Unzipping the repository..."
unzip -o "$ZIP_FILE"

echo "Removing the zip file..."
rm "$ZIP_FILE"

# Step 3: Move files to the installation directory
echo "Setting up the installation directory..."
mv free-sleep-main "$REPO_DIR"
chown -R dac:dac "$REPO_DIR"

# Step 4: Install dependencies as user dac
echo "Installing dependencies..."
sudo -u dac bash -c "cd $SERVER_DIR && npm install"

# Step 5: Create a systemd service file
echo "Creating systemd service file at $SERVICE_FILE..."
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Free Sleep Server
After=network.target

[Service]
ExecStart=/usr/bin/npm run start
WorkingDirectory=$SERVER_DIR
Restart=always
User=dac
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Step 6: Reload systemd and enable the service
echo "Reloading systemd daemon and enabling the service..."
systemctl daemon-reload
systemctl enable free-sleep.service

# Step 7: Start the service
echo "Starting the free-sleep server..."
systemctl start free-sleep.service

# Step 8: Display service status
echo "Checking service status..."
systemctl status free-sleep.service --no-pager

# Sometimes the device time gets reset to 2010, this resets the device time
echo "Updating device time"
date -s "$(curl -s --head http://google.com | grep ^Date: | sed 's/Date: //g')"

echo "Installation complete! The Free Sleep server is running and will start automatically on boot."
echo "See free-sleep logs with journalctl -u free-sleep --no-pager --output=cat"
