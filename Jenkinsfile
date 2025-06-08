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
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            rm -rf /var/www/fe-sarana-hrd &&
                            git clone -b ${params.BRANCH_TO_BUILD} https://${GIT_USER}:${GIT_TOKEN}@github.com/SaranaTechnology/FE-sarana-hrd.git /var/www/fe-sarana-hrd
                        '

                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${ENVFILE} root@18.142.177.215:/var/www/fe-sarana-hrd/.env

                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            cd /var/www/fe-sarana-hrd &&
                            docker system prune -af &&
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
            withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_WEBHOOK')]) {
                sh """
                curl -X POST -H 'Content-type: application/json' --data '{
                  "text": "✅ *FE HRD deployed* from *${params.BRANCH_TO_BUILD}* to production at \`/var/www/fe-sarana-hrd\`"
                }' "$SLACK_WEBHOOK"
                """
            }
        }
        failure {
            withCredentials([string(credentialsId: 'slack-webhook-url', variable: 'SLACK_WEBHOOK')]) {
                sh """
                curl -X POST -H 'Content-type: application/json' --data '{
                  "text": "❌ *FE HRD failed to deploy* from *${params.BRANCH_TO_BUILD}*"
                }' "$SLACK_WEBHOOK"
                """
            }
        }
    }
}
