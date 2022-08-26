FROM node:16.13.0

WORKDIR /app
ENV PATH ./node_modules/.bin:$PATH

COPY . /app/
RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
