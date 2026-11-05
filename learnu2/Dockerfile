# Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public URL of the API gateway, baked into the bundle at build time
ARG VITE_API_URL=http://localhost:8083
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve the static files
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
