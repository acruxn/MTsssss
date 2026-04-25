output "oceanbase_connection" {
  value     = "mysql+pymysql://root:${var.db_password}@<oceanbase-host>:2881/finhack_db"
  sensitive = true
}
