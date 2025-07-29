# 1. Use the official NGINX image (small Alpine variant)
FROM nginx:alpine

# 2. Copy your entire site into NGINX’s web root
COPY . /usr/share/nginx/html

# 3. Expose port 80 (for local testing; Railway will map its own dynamic $PORT to 80)
EXPOSE 80

# 4. (No CMD needed—nginx:alpine already starts NGINX in the foreground)