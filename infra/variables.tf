# Project
variable "project_name" { default = "finhack" }
variable "environment" { default = "dev" }

# Alibaba Cloud
variable "alicloud_region" { default = "ap-southeast-3" } # KL

# AWS
variable "aws_region" { default = "ap-southeast-1" } # Singapore

# Database
variable "db_password" { sensitive = true }
variable "database_url" {
  sensitive = true
  default   = ""
}
