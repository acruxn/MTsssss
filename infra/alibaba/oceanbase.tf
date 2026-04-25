# OceanBase on Alibaba Cloud — ap-southeast-3 (Malaysia/KL)

data "alicloud_zones" "ob_zones" {
  available_resource_creation = "VSwitch"
}

resource "alicloud_ocean_base_instance" "formbuddy" {
  instance_name  = "${var.project_name}-oceanbase-${var.environment}"
  series         = "normal"
  instance_class = "4C16G"
  disk_size      = 100
  disk_type      = "cloud_essd_pl1"
  payment_type   = "PayAsYouGo"

  zones = [
    "ap-southeast-3a",
  ]

  backup_retain_mode = "delete_all"
}

output "oceanbase_instance_id" {
  value = alicloud_ocean_base_instance.formbuddy.id
}
