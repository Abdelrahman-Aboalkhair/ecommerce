# Use lightweight Node.js base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including Prisma & TS)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy project files
COPY . .

# Build TypeScript
RUN npm run build

# Set environment variables
ENV PORT=5000
EXPOSE 5000

# Run compiled server
CMD ["npm", "start"]
