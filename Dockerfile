# Use a Node.js base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci 

# Copy the source code
COPY . .

# Expose the desired port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]

