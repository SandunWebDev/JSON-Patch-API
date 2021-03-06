# ******************************************* BUILD STAGE 1 - Production ******************************************* 

# Using full Node Image instead of slim Alpine Image because "sharp module" is used in this program.
# "sharp module" uses libvc which not included in alipine images and not stable even if installed in a alpine image.
FROM node:10 AS prod

ENV PORT $PORT
EXPOSE $PORT

RUN mkdir /usr/app
WORKDIR /usr/app

# Copying dependencies first to make use of cache layer.
COPY package.json package-lock.json* ./

# Only installing production dependencies.
RUN npm install --only=production && npm cache clean --force

# Adding node_modules binary to PATH.
ENV PATH /usr/app/node_modules/.bin:$PATH

# Copying source code.
COPY . ./

# Starting Server.
CMD [ "npm", "start" ]


# ******************************************* SUB BUILD STAGE - For Development/Testing ******************************************* 
# Loading above "production" stage.
FROM prod as dev

# Installing developer dependecies also.
RUN npm install --only=development && npm cache clean --force

# Starting Development Server.
CMD [ "npm", "run dev" ]
