terraform {
  required_version = ">= 1.5"

  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "~> 1.230"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "alicloud" {
  region = var.alicloud_region
  # Credentials via env: ALICLOUD_ACCESS_KEY, ALICLOUD_SECRET_KEY, ALICLOUD_SECURITY_TOKEN
}

provider "aws" {
  region = var.aws_region
  # Credentials via env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
}
