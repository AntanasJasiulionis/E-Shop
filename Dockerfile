FROM nginx:alpine

# Copy website files into Nginx
COPY . /usr/share/nginx/html

# Nginx listens on port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
