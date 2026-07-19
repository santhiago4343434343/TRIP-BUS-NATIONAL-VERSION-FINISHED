# Estágio de Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package

# Estágio de Execução
FROM tomcat:10-jdk17-temurin

# Restaura o Manager App que o Dockerfile original apagava
RUN cp -av /usr/local/tomcat/webapps.dist/* /usr/local/tomcat/webapps/

# REMOVE A TRAVA DE IP (Valve) automaticamente durante o build
RUN sed -i '/Valve/d' /usr/local/tomcat/webapps/manager/META-INF/context.xml

# Copia o seu projeto e o Driver do Banco
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/admin.war
ADD https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.3.0/mariadb-java-client-3.3.0.jar /usr/local/tomcat/lib/