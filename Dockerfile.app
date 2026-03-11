FROM node:22-alpine

WORKDIR /app

COPY package.json ./

CMD ["sh", "-c", "echo 'App container scaffold is ready. Install dependencies in the next phase.' && tail -f /dev/null"]
