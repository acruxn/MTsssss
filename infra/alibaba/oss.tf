resource "alicloud_oss_bucket" "evidence" {
  bucket = "${var.project_name}-evidence-${var.environment}"
  acl    = "private"

  tags = {
    Project = var.project_name
    Event   = "tng-finhack-2026"
  }
}
