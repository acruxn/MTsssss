resource "alicloud_oss_bucket" "evidence" {
  bucket = "${var.project_name}-evidence-${var.environment}"

  tags = {
    Project = var.project_name
    Event   = "tng-finhack-2026"
  }
}

resource "alicloud_oss_bucket_acl" "evidence" {
  bucket = alicloud_oss_bucket.evidence.bucket
  acl    = "private"
}
