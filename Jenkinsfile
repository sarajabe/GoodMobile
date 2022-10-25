pipeline {
    agent {
        docker {image 'nginx:1.13.12-alpine'}
    }
    stages {
        stage('Test') {
            steps{
                sh 'ng e2e'
            }
        }
    }
}