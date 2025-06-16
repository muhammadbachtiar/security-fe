pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        BRANCH_TO_BUILD = 'dev'
        REMOTE_HOST = 'root@18.142.177.215'
        APP_DIR = '/var/www/fe-sarana-hrd'
    }

    stages {
        stage('Pre-Deploy Check') {
            steps {
                slackSend(
                    channel: '#info-server',
                    color: '#439FE0',
                    message: "🟡 *Pre-deploy check started* for *${BRANCH_TO_BUILD}* on `${REMOTE_HOST}`"
                )

                sshagent(['ssh-server-root']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \$REMOTE_HOST '
                        echo "📦 Cek direktori \$APP_DIR" &&
                        if [ -d \$APP_DIR ]; then
                            echo "✅ Directory exists: \$APP_DIR"
                        else
                            echo "ℹ️ Directory not found. Akan dibuat saat clone."
                        fi

                        echo "🔍 Cek docker status"
                        docker ps || echo "Docker not running"
                    '
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ssh-server-root']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN'),
                        file(credentialsId: 'env-fe-saranahrd', variable: 'ENVFILE')
                    ]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \$REMOTE_HOST '
                            if [ ! -d \$APP_DIR ]; then
                                git clone -b ${BRANCH_TO_BUILD} https://${GIT_USER}:${GIT_TOKEN}@github.com/SaranaTechnology/FE-sarana-hrd.git \$APP_DIR
                            else
                                cd \$APP_DIR &&
                                git fetch origin &&
                                git reset --hard origin/${BRANCH_TO_BUILD}
                            fi
                        '

                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${ENVFILE} \$REMOTE_HOST:\$APP_DIR/.env

                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \$REMOTE_HOST '
                            cd \$APP_DIR &&
                            docker compose down || true &&
                            docker compose build &&
                            docker compose up -d &&
                            docker image prune -f &&
                            docker builder prune -f
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend(
                channel: '#info-server',
                color: 'good',
                message: "✅ *FE HRD deployed (dev)* successfully to `${APP_DIR}`"
            )
        }

        failure {
            slackSend(
                channel: '#info-server',
                color: 'danger',
                message: "❌ *FE HRD deployment failed* to `${APP_DIR}`"
            )
        }
    }
}
