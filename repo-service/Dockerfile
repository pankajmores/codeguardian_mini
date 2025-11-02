# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
# Use npm install instead of ci to handle cases with no package-lock.json
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# Copy the rest of the source code
COPY . .

# Expose the service port
EXPOSE 5001

# Define a health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Start the service
CMD ["npm", "start"]
