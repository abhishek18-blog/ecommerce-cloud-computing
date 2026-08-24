# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all the rest of the backend files into the container
COPY . .

# Expose the monolithic backend port
EXPOSE 5000

# Start the monolithic Express server
CMD ["node", "server.js"]
