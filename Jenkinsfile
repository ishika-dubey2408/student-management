pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Git Clone') {
            steps {
                ws('C:\\ProgramData\\Jenkins\\.jenkins\\workspace\\Student-Management-Clean') {
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
        }

        // baaki stages...
    }
}