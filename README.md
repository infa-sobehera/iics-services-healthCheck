# iics-services-healthCheck
1. Download nodeJS https://nodejs.org/en/download/ 
2. After installing check for version node -v
3. npm start

## Install node on VM

1. Connect to you VM instance
2. Install node version manager (nvm) by typing the following at the command line.
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
3. Activate nvm by typing the following at the command line. 
    `. ~/.nvm/nvm.sh`
4. Use nvm to install the latest version of Node.js by typing the following at the command line.
   `nvm install --lts`

## Install git on VM

1. Perform a quick update on your instance:
   `sudo yum update -y`
2. Install git in your EC2 instance
   `sudo yum install git -y`
3. Check git version
  `git version`



