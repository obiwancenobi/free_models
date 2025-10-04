# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Accept build arg for GA measurement ID
ARG REACT_APP_GA_MEASUREMENT_ID

# Set it as environment variable for build
ENV REACT_APP_GA_MEASUREMENT_ID=$REACT_APP_GA_MEASUREMENT_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install logrotate and cron for log rotation
RUN apk add --no-cache logrotate cronie

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy logrotate configuration
COPY logrotate.conf /etc/logrotate.d/nginx

# Create log directory with proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Set up cron job for logrotate
RUN echo "0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/nginx" >> /etc/crontabs/root

# Expose port
EXPOSE 80

# Start both cron and nginx
CMD ["sh", "-c", "crond && nginx -g 'daemon off;'"]