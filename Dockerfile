# --------- Phase 1 Setup --------
# Use node base
FROM node:16-alpine as base

# set working directory
WORKDIR /app

# copy intall suff
COPY ["package-lock.json", "package.json", "./"]

# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --omit=dev

# --------- Phase 2 Build --------

# Work off phase 1 conatiner
FROM base AS build

WORKDIR /app

# install ALL node_modules
RUN npm i

## Copy the rest of the shit
COPY ["babel.config.cjs", "./"]
COPY src ./src

## Build!!!
RUN npm run build

# --------- Phase 3 Runtime Image --------

# Set user to node
# USER node:node

# Work off phase 1 conatiner
FROM base AS release

# set working directory
WORKDIR /app

# copy app sources
COPY --from=build /app/src/server ./
COPY --from=build /app/src/client/build ./client

# Expose port
EXPOSE 3000

# Start that shit
CMD [ "node", "index.js" ]