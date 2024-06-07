# Use an official Node.js runtime as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install TypeScript
RUN npm install -g typescript

# Copy all project files to the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Specify the command to run your bot when the container starts
CMD ["node", "dist/bot.js"]