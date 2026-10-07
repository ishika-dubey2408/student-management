pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Git Clone') {
            steps {
                deleteDir()

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/ishika-dubey2408/student-management.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
            }
        }

        stage('Backend Build') {
            steps {
                bat '''
                    mvn clean package -DskipTests
                '''
            }
        }

        stage('Backend Test') {
            steps {
                bat '''
                    mvn test
                '''
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
                    docker compose -p student-management down
                '''
            }
        }

        stage('Compose Up') {
            steps {
                bat '''
                    docker compose -p student-management up -d --build
                    docker compose -p student-management ps
                '''
            }
        }
    }
}