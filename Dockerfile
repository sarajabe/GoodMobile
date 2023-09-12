FROM ztarhub/angular-13 as headlessChromeBuilder

# Install common dependencies
RUN apt-get update && apt-get install -y libxss1 libxtst6 libnss3 libgconf-2-4 


# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable

FROM headlessChromeBuilder as builder

ARG _NPM_TOKEN
ARG _VERSION

ENV NPM_TOKEN=$_NPM_TOKEN
ENV VERSION=$_VERSION

# set working directoy to app
WORKDIR /app

# copy necessary files to install dependencies
COPY .npmrc .
COPY package.json .

RUN npm install --f

FROM builder AS dependencies

# copy project files and build project
COPY . .
RUN npm run test
RUN npm run build --prod

FROM nginx as FINAL

ARG _VERSION

# Serve the angular built app as default
COPY --from=dependencies /app/dist/good-mobile/ /usr/share/nginx/www/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


