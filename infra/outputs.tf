output "backend_api_url" {
  description = "API Gateway endpoint (primary backend entry point)"
  value       = "https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com"
}

output "frontend_url" {
  description = "Amplify HTTPS frontend"
  value       = "https://main.d3is7aj4mo28yv.amplifyapp.com"
}

output "database_host" {
  description = "Alibaba Cloud RDS MySQL (Kuala Lumpur)"
  value       = "finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com"
}

# Note: API Gateway (w6qtfxl2va), Amplify (d3is7aj4mo28yv), and RDS (rm-zf8cjweha7koh7btt)
# were created via CLI/SDK during hackathon. They are documented here as outputs
# but not managed as Terraform resources. Import them post-hackathon if needed.
