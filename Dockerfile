FROM node:18 

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./


# Update npm | Install pnpm | Set PNPM_HOME | Install global packages
RUN npm i -g npm@latest; \
 # Install pnpm
 npm install -g pnpm; \
 pnpm --version; \
 pnpm setup; \
 mkdir -p /usr/local/share/pnpm &&\
 export PNPM_HOME="/usr/local/share/pnpm" &&\
 export PATH="$PNPM_HOME:$PATH"; \
 pnpm bin -g &&\
 # Install dependencies
 pnpm add -g pm2 &&\
 pnpm add -g @nestjs/cli &&\
 pnpm install


# Copy all files into the container
COPY . . 

# Build the application
RUN pnpm run build 

# Run e2e tests first, and if they pass, start the application
CMD pnpm run test:e2e --detectOpenHandles && pnpm run start:prod