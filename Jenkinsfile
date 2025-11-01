pipeline {
    agent any

    triggers {
    GenericTrigger(
        genericVariables: [
            [key: 'ref', value: '$.ref']
        ],
        causeString: 'Triggered on branch: $ref',
        token: 'codeguardian123',
        printContributedVariables: true,
        printPostContent: true,
        regexpFilterText: '$ref',
        regexpFilterExpression: 'refs/heads/main'
    )
}



    environment {
        GIT_REPO = "${repository_url ?: 'https://github.com/pankajmores/codeguardian_mini.git'}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
                echo "✅ Checked out latest code from ${GIT_REPO}"
            }
        }

        stage('Build') {
            when {
                changeset pattern: "src/.*", comparator: "REGEXP"
            }
            steps {
                echo "🏗️ Building project because src/ changed"
                sh 'echo "Build steps go here"'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh 'echo "Run your tests here"'
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying application..."
                sh 'echo "Deploy script goes here"'
            }
        }
    }

    post {
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
