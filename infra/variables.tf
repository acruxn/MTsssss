# Project
variable "project_name" { default = "finhack" }
variable "environment" { default = "dev" }

# Alibaba Cloud
variable "alicloud_access_key" { sensitive = true }
variable "alicloud_secret_key" { sensitive = true }
variable "alicloud_region" { default = "ap-southeast-3" } # KL

# AWS
variable "aws_access_key" { sensitive = true }
variable "aws_secret_key" { sensitive = true }
variable "aws_region" { default = "ap-southeast-1" } # Singapore

# Database
variable "db_password" { sensitive = true }
variable "database_url" {
  sensitive = true
  default   = ""
}
