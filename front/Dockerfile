FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built application files to the Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80