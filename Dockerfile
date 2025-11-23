# -----------------------------
# 1. Etapa de build (Node)
# -----------------------------
    FROM node:18 AS build

    WORKDIR /app
    
    # Copiar package.json e instalar dependencias
    COPY package*.json ./
    RUN npm install
    
    # Copiar todo el proyecto y construir
    COPY . .
    RUN npm run build
    
    
    # -----------------------------
    # 2. Etapa de producción (Nginx)
    # -----------------------------
    FROM nginx:stable
    
    # Copiar archivos construidos desde Node
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Configuración de NGINX
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    