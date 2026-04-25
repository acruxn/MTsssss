# Lambda function for FastAPI backend
resource "aws_lambda_function" "backend" {
  function_name = "${var.project_name}-backend-${var.environment}"
  runtime       = "python3.12"
  handler       = "main.handler"
  timeout       = 30
  memory_size   = 512

  filename         = "${path.module}/../backend/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/lambda.zip")

  role = aws_iam_role.lambda_role.arn

  environment {
    variables = {
      DATABASE_URL  = var.database_url
      AWS_REGION_   = var.aws_region  # underscore to avoid reserved name
      BEDROCK_MODEL = "apac.anthropic.claude-sonnet-4-20250514-v1:0"
    }
  }

  tags = {
    Project = var.project_name
    Event   = "tng-finhack-2026"
  }
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Bedrock access
resource "aws_iam_role_policy" "bedrock" {
  name = "bedrock-access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["bedrock:InvokeModel"]
      Resource = ["*"]
    }]
  })
}

# CloudWatch logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Function URL (simpler than API Gateway for hackathon)
resource "aws_lambda_function_url" "backend" {
  function_name      = aws_lambda_function.backend.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["*"]
  }
}

output "backend_url" {
  value = aws_lambda_function_url.backend.function_url
}
