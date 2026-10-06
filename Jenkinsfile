pipeline {
    agent any

    stages {

        stage('Backend Build') {
            steps {
                bat 'mvn clean package -DskipTests'
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
    }
}