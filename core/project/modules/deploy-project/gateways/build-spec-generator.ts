import { ProjectType } from "@/core/shared/types/project-type";

const BUCKET_NAME = process.env.BUCKET_NAME;

export class BuildSpecGenerator {
    private nodeJSBuildSpec = {
        version: '0.2',
        phases: {
            install: {
                'runtime-versions': {
                    nodejs: '18'
                }
            },
            pre_build: {
                commands: [
                    'npm ci'
                ]
            },
            build: {
                commands: [
                    'npm run build'
                ]
            },
            post_build: {
                commands: [
                    'aws s3 sync ./dist s3://${BUCKET_NAME}/'
                ]
            }
        },
        artifacts: {
            files: [
                '**/*'
            ],
            'base-directory': 'dist'
        }
    };

    private javaBuildSpec = {
        version: "0.2",
        phases: {
            "install": {
                "runtime-versions": {
                    "java": "corretto17"
                }
            },
            "pre_build": {
                "commands": [
                    "echo Installing dependencies...",
                    "mvn clean install -DskipTests"
                ]
            },
            "build": {
                "commands": [
                    "mvn test",
                    "mvn package"
                ]
            },
            post_build: {
                "commands": [
                    "echo Build completed on `date`",
                    `aws s3 sync ./target s3://${BUCKET_NAME}/`
                ]
            }
        },
        "artifacts": {
            "files": [
                "target/*.jar",
                "target/dependency/*",
                "scripts/**/*",
                "appspec.yml"
            ]
        },
        "reports": {
            "junit": {
                "files": [
                    "target/surefire-reports/**/*.xml"
                ],
                "file-format": "JUNITXML"
            }
        },
        "cache": {
            "paths": [
                "~/.m2/**/*"
            ]
        }
    }
    
    private pythonBuildSpec = {
        version: "0.2",
        phases: {
            "install": {
                "runtime-versions": {
                    "python": "3.8"
                }
            },
            "pre_build": {
                "commands": [
                    "echo Installing dependencies...",
                    "pip install -r requirements.txt"
                ]
            },
            "build": {
                "commands": [
                    "python -m pytest",
                    "python setup.py build"
                ]
            },
            post_build: {
                "commands": [
                    "echo Build completed",
                    `aws s3 sync ./build s3://${BUCKET_NAME}/`
                ]
            }
        },
        "artifacts": {
            "files": [
                "**/*"
            ],
            "base-directory": "build"
        },
        "reports": {
            "unit-tests": {
                "files": [
                    "test-reports/*.xml"
                ],
                "file-format": "JUNITXML"
            }
        }
    };
    

    generateBuildSpecFor(projectType: ProjectType) {
        if (projectType === "nodejs") 
            return JSON.stringify(this.nodeJSBuildSpec);

        if (projectType === "java")
            return JSON.stringify(this.javaBuildSpec);

        if (projectType === "python")
            return JSON.stringify(this.pythonBuildSpec);
    }
}