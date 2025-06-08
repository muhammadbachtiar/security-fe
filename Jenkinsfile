pipeline {
    agent any

    triggers {
        githubPush()  // Trigger dari webhook GitHub
    }

    environment {
        SLACK_WEBHOOK = credentials('slack-webhook-url') // <-- simpan webhook di Jenkins Credentials
    }

    parameters {
        choice(name: 'BRANCH_TO_BUILD', choices: ['dev', 'main', 'ci/cd'], description: 'Pilih branch yang ingin dibuild')
    }

    stages {
        stage('Deploy to Host') {
            steps {
                sshagent(['ssh-server-root']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN'),
                        file(credentialsId: 'env-fe-saranahrd', variable: 'ENVFILE')
                    ]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            echo "🧹 Remove old files"
                            rm -rf /var/www/fe-sarana-hrd &&
                            echo "⬇️ Cloning branch ${params.BRANCH_TO_BUILD}"
                            git clone -b ${params.BRANCH_TO_BUILD} https://${GIT_USER}:${GIT_TOKEN}@github.com/SaranaTechnology/FE-sarana-hrd.git /var/www/fe-sarana-hrd
                        '

                        echo "📦 Copying .env file"
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${ENVFILE} root@18.142.177.215:/var/www/fe-sarana-hrd/.env

                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            cd /var/www/fe-sarana-hrd &&
                            echo "🛑 Stopping old container"
                            docker compose down || true &&
                            echo "🧹 Pruning docker"
                            docker system prune -af &&
                            echo "🔨 Building docker image"
                            docker compose build --no-cache &&
                            echo "🚀 Starting container"
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
            sh """
            curl -X POST -H 'Content-type: application/json' --data '{
              "text": "✅ *FE HRD deployed* from *${params.BRANCH_TO_BUILD}* to production at `/var/www/fe-sarana-hrd`"
            }' $SLACK_WEBHOOK
            """
        }
        failure {
            sh """
            curl -X POST -H 'Content-type: application/json' --data '{
              "text": "❌ *FE HRD failed to deploy* from *${params.BRANCH_TO_BUILD}*"
            }' $SLACK_WEBHOOK
            """
        }
    }
}
