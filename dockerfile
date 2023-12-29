# Use the official Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14

# Create a directory to hold the application code inside the image
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# The application's default port
EXPOSE 8080

# Define the command to run the app
CMD [ "node", "app.js" ]