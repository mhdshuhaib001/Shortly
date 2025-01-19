# Use an official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Vite project files
COPY . .

# Expose the port for the Vite development server
EXPOSE 3000

# Command to run Vite development server
CMD ["npm", "run", "dev"]
