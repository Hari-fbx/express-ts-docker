FROM node:latest
WORKDIR /authServer
# RUN npm install --global yarn
COPY package.json /authServer/
RUN yarn

COPY . /authServer/

CMD [ "yarn","start" ]