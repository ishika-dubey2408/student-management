pipeline {
    agent any

    stages {

        stage('Backend Build') {
            steps {
                bat 'mvn clean package -DskipTests'
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

        stage('Deploy') {
            steps {
                bat '''
                    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do taskkill /PID %%a /F

                    set JENKINS_NODE_COOKIE=dontKillMe

                    start "" /B "C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.12.101-hotspot\\bin\\java.exe" -jar target\\student-management-0.0.1-SNAPSHOT.jar
                '''
            }
        }
    }
}