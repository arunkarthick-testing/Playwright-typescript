pipeline {
    agent any

    tools {
        nodejs 'Node25'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Verify Node') {
            steps {
                 sh 'which node'
                 sh 'node --version'
                 sh 'npm --version'
                 sh 'echo $PATH'
            }
       }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Old Reports') {
            steps {
                sh '''
                    rm -rf playwright-report
                    rm -rf allure-results
                    rm -rf allure-report
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            when {
                expression {
                    return !fileExists("${env.HOME}/.cache/ms-playwright")
                }
            }
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=html,allure-playwright'
            }
            post {
                always {
                    // Publish Playwright HTML Report
                    publishHTML(target: [
                        allowMissing         : false,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'playwright-report',
                        reportFiles          : 'index.html',
                        reportName           : 'Playwright HTML Report'
                    ])

                    // Publish Allure Report
                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
    }

    post {
        success {
            echo '✅ All tests passed!'
        }
        failure {
            echo '❌ Tests failed — check the Playwright report.'
        }
        always {
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
        }
    }
}