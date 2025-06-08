pipeline {
    agent any

    triggers {
        githubPush()
    }
    environment {
        SLACK_WEBHOOK = credentials('jenkinskey')
    }

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
                            docker compose down || true &&
                            docker compose build --no-cache &&
                            docker compose up -d &&
                            docker system prune -af
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment sukses ke /var/www/fe-sarana-hrd dari branch: ${params.BRANCH_TO_BUILD}"
            sh """
            curl -X POST -H 'Content-type: application/json' --data '{
              "text": "✅ *FE HRD deployed successfully* from *${params.BRANCH_TO_BUILD}* to `/var/www/fe-sarana-hrd`"
            }' "$SLACK_WEBHOOK"
            """
        }

        failure {
            echo "❌ Deployment gagal untuk branch: ${params.BRANCH_TO_BUILD}"
            sh """
            curl -X POST -H 'Content-type: application/json' --data '{
              "text": "❌ *FE HRD deployment FAILED* for branch *${params.BRANCH_TO_BUILD}*"
            }' "$SLACK_WEBHOOK"
            """
        }
    }
}
