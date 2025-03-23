# Use an official PHP image with Apache
FROM php:8.3-apache

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-install intl opcache pdo pdo_mysql

# Enable Apache mod_rewrite for Symfony routing
RUN a2enmod rewrite

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy the Symfony app from the 'leftover' folder
COPY leftover/ /var/www/html/

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/var /var/www/html/public

# Ensure Apache serves from Symfony's `public/` directory
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Update Apache to listen on port 8080
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf && \
    sed -i 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf
    
# Expose the port that Fly.io will use
EXPOSE 8080

# Set the default Apache command
CMD ["apache2-foreground"]
