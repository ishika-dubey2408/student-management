pipeline {
    agent any

    stages {

        stage('Git Clone') {
            steps {
                bat '''
                    if exist student-management-clone rmdir /s /q student-management-clone

                    git clone https://github.com/ishika-dubey2408/student-management.git student-management-clone
                '''
            }
        }

        stage('Backend Build') {
            steps {
                bat '''
                    cd student-management-clone
                    mvn clean package -DskipTests
                '''
            }
        }

        stage('Backend Test') {
            steps {
                bat '''
                    cd student-management-clone
                    mvn test
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                bat '''
                    cd student-management-clone\\student-management-ui
                    call npm ci
                    call npm run build
                '''
            }
        }

        stage('Compose Down') {
            steps {
                bat '''
                    cd student-management-clone
                    docker compose down
                '''
            }
        }

        stage('Compose Up') {
            steps {
                bat '''
                    cd student-management-clone
                    docker compose up -d --build
                    docker compose ps
                '''
            }
        }
    }
}