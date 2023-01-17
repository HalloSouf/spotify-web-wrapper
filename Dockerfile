FROM node:19.4-alpine as build

# Set working directory to /build inside the container
WORKDIR /build
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy directory
COPY . ./

# Build application
RUN yarn run build

EXPOSE 3000

# Execute application
ENTRYPOINT ["node", "build/index.js"]
