# Use Node.js image as base
FROM node:14-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to container
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
