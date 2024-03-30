# Use Node.js image as base
FROM node:14-alpine

ENV DATABASE_URL="postgres://postgres.sjnkmphzilknnaoefkjo:khoa.truongthdk@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

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
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]
