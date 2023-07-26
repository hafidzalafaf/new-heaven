# Use an official Nginx runtime as a parent image
FROM nginx:stable-alpine

# Set the working directory in the container to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy build directory contents into the container at /usr/share/nginx/html
COPY build/ .

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]