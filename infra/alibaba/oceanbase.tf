# OceanBase on Alibaba Cloud
# Note: OceanBase Cloud may require manual setup via console
# This provisions the VPC and security group for connectivity

resource "alicloud_vpc" "main" {
  vpc_name   = "${var.project_name}-vpc-${var.environment}"
  cidr_block = "172.16.0.0/16"
}

resource "alicloud_vswitch" "main" {
  vpc_id     = alicloud_vpc.main.id
  cidr_block = "172.16.0.0/24"
  zone_id    = "${var.alicloud_region}a"
}

resource "alicloud_security_group" "db" {
  security_group_name = "${var.project_name}-db-sg-${var.environment}"
  vpc_id              = alicloud_vpc.main.id
}

resource "alicloud_security_group_rule" "db_mysql" {
  type              = "ingress"
  ip_protocol       = "tcp"
  port_range        = "2881/2881"
  security_group_id = alicloud_security_group.db.id
  cidr_ip           = "0.0.0.0/0" # Restrict in production
}
