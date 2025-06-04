pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    parameters {
        choice(name: 'BRANCH_TO_BUILD', choices: ['dev', 'main', 'ci/cd'], description: 'Pilih branch yang ingin dibuild')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh 'rm -rf FE-sarana-hrd'
                        sh "git clone -b ${params.BRANCH_TO_BUILD} https://${GIT_USER}:${GIT_TOKEN}@github.com/SaranaTechnology/FE-sarana-hrd.git"
                        dir('FE-sarana-hrd') {
                            sh 'docker-compose down || true'
                            sh 'docker-compose build --no-cache'
                            sh 'docker-compose up -d'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment sukses dari branch: ${params.BRANCH_TO_BUILD}"
        }
        failure {
            echo "❌ Deployment gagal untuk branch: ${params.BRANCH_TO_BUILD}"
        }
    }
}
