# Estágio 1: Usar uma imagem base do NGINX
FROM nginx:1.25.5-alpine

# Copiar os arquivos estáticos para o diretório padrão do NGINX
COPY index.html /usr/share/nginx/html
COPY estilos.css /usr/share/nginx/html
COPY app.js /usr/share/nginx/html

# Expor a porta 80 (padrão do NGINX)
EXPOSE 80