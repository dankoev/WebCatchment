FROM node:18-slim as builder
WORKDIR /home/app
COPY . .
RUN npm i && \
    npm run build
    
FROM nginx:alpine
COPY --from=builder /home/app/dist /usr/share/nginx/app
COPY ./nginx.conf.template /nginx.conf.template
EXPOSE 80
CMD ["/bin/sh" , "-c" ,"envsubst < /nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
