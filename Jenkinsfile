pipeline {
    agent any

    stages {

        stage('Backend Build') {
            steps {
                bat '''
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

        stage('Compose Down') {
            steps {
                bat '''
                    docker compose down
                '''
            }
        }

        stage('Compose Up') {
            steps {
                bat '''
                    docker compose up -d --build
                    docker compose ps
                '''
            }
        }
    }
}