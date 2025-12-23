# Stage 1: Build
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy source code
COPY . .

# Build jar
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests   # Or use "mvn package" if Maven installed

# Stage 2: Run
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
