# Use the official Nginx image as the base
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static website files to Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 81
EXPOSE 81

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
