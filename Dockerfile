FROM node:19-bullseye-slim
ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install -g npm@9.6.6
RUN npm install
RUN cd frontend && npm install && npm run build
CMD npm run serve
