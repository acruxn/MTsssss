# Alibaba Cloud RDS MySQL — ap-southeast-3 (Malaysia/KL)
#
# Instance: rm-zf8cjweha7koh7btt ("finhack-formbuddy")
# Created via Python SDK during hackathon (OceanBase blocked by STS billing permission)
# Class: mysql.n2e.small.1, MySQL 8.0, Zone: ap-southeast-3a
# Public endpoint: finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com:3306
# Account: formbuddy, Database: finhack_db
#
# To import into Terraform state:
#   terraform import alicloud_db_instance.formbuddy rm-zf8cjweha7koh7btt
#
# OceanBase was the original target but CreateInstance order is blocked
# by STS billing permission. RDS MySQL is the same pymysql driver,
# same region. Migrates to OceanBase with zero code change in production.
# See MASTER_PLAN.md Decision D9.
