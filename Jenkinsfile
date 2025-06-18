pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        BRANCH_TO_BUILD = 'dev'
    }

    stages {
        stage('Pre-Deploy Check') {
            steps {
                slackSend(
                    channel: '#info-server',
                    color: '#439FE0',
                    message: "🟡 *Pre-deploy check started* for branch *${BRANCH_TO_BUILD}*"
                )

                sshagent(credentials: ['ssh-server-root']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                        echo "📦 Checking /var/www/fe-sarana-hrd" &&
                        if [ -d /var/www/fe-sarana-hrd ]; then
                            echo "✅ Directory exists"
                        else
                            echo "ℹ️ Directory not found. Will be created during clone."
                        fi

                        echo "🔍 Docker status:"
                        docker ps || echo "Docker not running"
                    '
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ssh-server-root']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT'),
                        file(credentialsId: 'env-fe-saranahrd', variable: 'ENVFILE')
                    ]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            if [ ! -d /var/www/fe-sarana-hrd/.git ]; then
                                echo "📥 Cloning fresh repo..."
                                rm -rf /var/www/fe-sarana-hrd &&
                                git clone -b '$BRANCH_TO_BUILD' https://$GIT_USER:$GIT_PAT@github.com/SaranaTechnology/FE-sarana-hrd.git /var/www/fe-sarana-hrd
                            else
                                echo "🔄 Pulling latest code..."
                                cd /var/www/fe-sarana-hrd &&
                                git checkout $BRANCH_TO_BUILD &&
                                git fetch  &&
                                git reset --hard &&
                                git pull
                            fi
                        '

                        echo "📤 Uploading .env..."
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $ENVFILE root@18.142.177.215:/var/www/fe-sarana-hrd/.env

                        echo "🚀 Running Docker Compose..."
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@18.142.177.215 '
                            cd /var/www/fe-sarana-hrd &&
                            docker compose down || true &&
                            docker compose build &&
                            docker compose up -d &&
                            docker image prune -f &&
                            docker builder prune -f
                        '
                        '''
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
                message: "✅ *FE HRD deployed successfully* from branch *${BRANCH_TO_BUILD}*"
            )
        }

        failure {
            slackSend(
                channel: '#info-server',
                color: 'danger',
                message: "❌ *FE HRD deployment failed* from branch *${BRANCH_TO_BUILD}*"
            )
        }
    }
}
