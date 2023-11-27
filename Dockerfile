FROM dany712/wine-8.0:alpine
RUN apk update && \
    apk add npm && \
    apk -v cache clean
WORKDIR /home/app
COPY . .
RUN npm i
CMD ["npm", "run", "server"]
