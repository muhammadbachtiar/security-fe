pipeline {
    agent any

    parameters {
        choice(name: 'BRANCH_TO_BUILD', choices: ['dev', 'main', 'ci/cd'], description: 'Pilih branch yang ingin dibuild')
    }

    stages {
        stage('Deploy to Host as Root') {
            steps {
                sshagent(['ssh-server-root']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN'),
                        file(credentialsId: 'env-fe-saranahrd', variable: 'ENVFILE')
                    ]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no root@127.0.0.1 '
                            rm -rf /var/www/fe-sarana-hrd &&
                            git clone -b ${params.BRANCH_TO_BUILD} https://${GIT_USER}:${GIT_TOKEN}@github.com/SaranaTechnology/FE-sarana-hrd.git /var/www/nama-apps
                        '
                        scp -o StrictHostKeyChecking=no \$ENVFILE root@127.0.0.1:/var/www/nama-apps/.env
                        ssh -o StrictHostKeyChecking=no root@127.0.0.1 '
                            cd /var/www/fe-sarana-hrd &&
                            docker compose down || true &&
                            docker compose build --no-cache &&
                            docker compose up -d
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment sukses ke /var/www/nama-apps dari branch: ${params.BRANCH_TO_BUILD}"
        }
        failure {
            echo "❌ Deployment gagal untuk branch: ${params.BRANCH_TO_BUILD}"
        }
    }
}
