pipeline {
    agent any

    stages {

        stage('Backend Build') {
            steps {
                bat '''
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

                    timeout /t 2 /nobreak >nul

                    mvn clean package -DskipTests
                '''
            }
        }

        stage('Backend Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Frontend Build') {
            steps {
                bat '''
                    cd student-management-ui
                    call npm ci
                    call npm run build
                '''
            }
        }

        stage('Docker Deploy') {
            steps {
                bat '''
                    cd /d "%WORKSPACE%"

                    docker compose down

                    docker compose build

                    docker compose up -d

                    docker compose ps
                '''
            }
        }
    }
}