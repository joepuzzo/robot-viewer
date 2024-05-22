# --------- Phase 1 Setup --------
# Use node base
FROM node:16-alpine as base

# Install Python and other dependencies required by node-gyp
RUN apk add --no-cache python3 make g++ 

# Set environment variable for node-gyp to find Python
ENV PYTHON=/usr/bin/python3

# set working directory
WORKDIR /app

# copy install stuff
COPY ["package-lock.json", "package.json", "./"]

# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --omit=dev

# --------- Phase 2 Build --------

# Work off phase 1 container
FROM base AS build

WORKDIR /app

# install ALL node_modules
RUN npm i

# Copy the rest of the files
COPY ["babel.config.cjs", "./"]
COPY src ./src
COPY robots ./robots

# Build
RUN npm run build

# --------- Phase 3 Runtime Image --------

# Work off phase 1 container
FROM base AS release

# set working directory
WORKDIR /app

# copy app sources
COPY --from=build /app/src/server ./server
COPY --from=build /app/src/lib ./lib
COPY --from=build /app/src/client/build ./client
COPY --from=build /app/robots ./robots

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server/index.js"]
