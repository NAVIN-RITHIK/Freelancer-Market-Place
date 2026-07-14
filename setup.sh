
#!/bin/bash

# Create unique database name from request ID
DATABASE_NAME="dc589774_95dd_4c1b_a858_f0a495141b89"

# Create MySQL database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Project output directory
OUTPUT_DIR="/home/coder/project/workspace/question_generation_service/solutions/dc589774-95dd-4c1b-a858-f0a495141b89/springapp"

# Generate Spring Boot project using Spring CLI
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Freelance Marketplace" \
  --description="Freelance Marketplace Platform with Spring Boot" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql,lombok \
  --build=maven \
  ${OUTPUT_DIR}

# Wait for project generation to complete
sleep 2

# Create application.properties with MySQL configuration
cat > "${OUTPUT_DIR}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
EOL

# Add additional dependencies to pom.xml
sed -i '/<\/dependencies>/i \
        <dependency>\
            <groupId>org.springframework.boot</groupId>\
            <artifactId>spring-boot-starter-validation</artifactId>\
        </dependency>' "${OUTPUT_DIR}/pom.xml"

