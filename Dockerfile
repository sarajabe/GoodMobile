FROM ztarhub/angular-14 as headlessChromeBuilder

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
RUN npm run build:$VERSION $BUILD_ID $REVISION_ID

FROM nginx as FINAL

ARG _VERSION

# Copy the nginx configuration file. This sets up the behavior of nginx, most
# importantly, it ensure nginx listens on port 8080. Google App Engine expects
# the runtime to respond to HTTP requests at port 8080.
COPY --from=dependencies /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=dependencies /app/nginx/conf.d/cors-config /etc/nginx/conf.d/cors-config

# create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine

# Create a simple file to handle heath checks. Health checking can be disabled
# in app.yaml, but is highly recommended. Google App Engine will send an HTTP
# request to /_ah/health and any 2xx or 404 response is considered healthy.
# Because 404 responses are considered healthy, this could actually be left
# out as nginx will return 404 if the file isn't found. However, it is better
# to be explicit.
RUN mkdir -p /usr/share/nginx/www/_ah && echo "healthy" > /usr/share/nginx/www/_ah/health
RUN mkdir -p /usr/share/nginx/www/health/liveness_check && echo "live" > /usr/share/nginx/www/liveness_check
RUN mkdir -p /usr/share/nginx/www/health/readiness_check && echo "ready" > /usr/share/nginx/www/readiness_check

# Serve the angular built app as default
COPY --from=dependencies /app/dist/good-mobile/ /usr/share/nginx/www/

RUN chmod -R a+r /usr/share/nginx/www
