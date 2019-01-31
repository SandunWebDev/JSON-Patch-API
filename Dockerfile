# ******************************************* BUILD STAGE 1 - Base Dependencies ******************************************* 
# Loading official Node image as base image because we need build tools for compile modules like bcrypt.
# Also its used as full fedged developer enviroment.
FROM node:10 AS base

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


# ******************************************* SUB BUILD STAGE - For Development/Testing ******************************************* 
# Loading above "base" stage.
FROM base as dev

# Installing developer dependecies also.
RUN npm install --only=development && npm cache clean --force

# Copying source code.
COPY . ./

# Starting Development Server.
CMD [ "npm", "run dev" ]


# ******************************************* BUILD STAGE 2 - Final Prodcution Image *******************************************
# Loading official Node Alpine image as final image (For Smaller Finzlized Image).
FROM node:10-alpine as prod

# Adding bash to image since alpine don't have it.
RUN apk add --no-cache bash

ENV PORT $PORT
EXPOSE $PORT

# Adding node_modules binary to PATH.
ENV PATH /usr/app/node_modules/.bin:$PATH

RUN mkdir /usr/app
WORKDIR /usr/app

# Copying compiled node_modules from base image.
COPY --from=base /usr/app ./

# Copying source code.
COPY . ./

# Starting Server.
CMD [ "npm", "start" ]