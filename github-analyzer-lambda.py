import boto3
import json
import os
from urllib.parse import urlparse
from github import Github

def detect_project_type(repo_path):
    """
    Analyze repository contents to determine project type
    """
    project_indicators = {
        'nodejs': ['package.json', 'node_modules'],
        'python': ['requirements.txt', 'setup.py', 'Pipfile'],
        'java': ['pom.xml', 'build.gradle'],
        'docker': ['Dockerfile', 'docker-compose.yml']
    }
    
    found_types = []
    for project_type, indicators in project_indicators.items():
        for indicator in indicators:
            if os.path.exists(os.path.join(repo_path, indicator)):
                found_types.append(project_type)
                break
    
    return found_types[0] if found_types else 'unknown'

def create_codebuild_project(project_name, repo_url):
    """
    Create CodeBuild project for repository analysis
    """
    client = boto3.client('codebuild')
    
    return client.create_project(
        name=project_name,
        source={
            'type': 'GITHUB',
            'location': repo_url,
            'buildspec': 'buildspec.yml'
        },
        artifacts={
            'type': 'NO_ARTIFACTS'
        },
        environment={
            'type': 'LINUX_CONTAINER',
            'image': 'aws/codebuild/standard:5.0',
            'computeType': 'BUILD_GENERAL1_SMALL'
        },
        serviceRole='CodeBuildServiceRole'
    )

def trigger_deployment(project_type, repo_url):
    """
    Trigger appropriate deployment pipeline based on project type
    """
    client = boto3.client('codedeploy')
    
    deployment_configs = {
        'nodejs': 'NodeJSDeploymentConfig',
        'python': 'PythonDeploymentConfig',
        'java': 'JavaDeploymentConfig',
        'docker': 'ContainerDeploymentConfig'
    }
    
    return client.create_deployment(
        applicationName=f'{project_type}-app',
        deploymentGroupName=f'{project_type}-deployment-group',
        revision={
            'revisionType': 'GitHub',
            'gitHubLocation': {
                'repository': repo_url,
                'commitId': 'master'
            }
        },
        deploymentConfigName=deployment_configs.get(project_type, 'CodeDeployDefault.OneAtATime')
    )

def lambda_handler(event, context):
    """
    Main Lambda handler for processing GitHub URLs
    """
    try:
        # Extract GitHub URL from request
        github_url = json.loads(event['body'])['url']
        
        # Parse GitHub URL
        parsed_url = urlparse(github_url)
        if parsed_url.netloc != 'github.com':
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid GitHub URL'})
            }
        
        # Create unique project name
        project_name = f"project-{parsed_url.path.replace('/', '-')}"
        
        # Create CodeBuild project
        codebuild_response = create_codebuild_project(project_name, github_url)
        
        # Start build to analyze project
        codebuild = boto3.client('codebuild')
        build_response = codebuild.start_build(projectName=project_name)
        
        # Store build ID in DynamoDB for status tracking
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('ProjectDeployments')
        table.put_item(
            Item={
                'project_url': github_url,
                'build_id': build_response['build']['id'],
                'status': 'ANALYZING'
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Project analysis started',
                'build_id': build_response['build']['id']
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
