# Estágio 1: Build da aplicação com Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Criação da imagem final com o JRE
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copia o .jar gerado do estágio de build
COPY --from=build /app/target/produtoapi-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]