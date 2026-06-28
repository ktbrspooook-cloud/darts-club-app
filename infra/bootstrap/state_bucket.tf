# Terraform stateは、TerraformがAWSリソースの状態を管理するための重要な記録。
# このバケットは、後で作るフロントエンド配信用S3バケットとは完全に分ける。
locals {
  tfstate_bucket_name = "darts-club-tfstate-274136495717-apne1"
}

# Terraform stateを保存するための非公開S3バケット本体。
resource "aws_s3_bucket" "tfstate" {
  bucket        = local.tfstate_bucket_name
  force_destroy = false

  lifecycle {
    # Terraform自身の管理記録を、terraform destroyなどで誤って消さないための安全柵。
    prevent_destroy = true
  }
}

# stateの過去バージョンを保存する。
# 誤更新・誤削除が起きた時に、過去のstateへ戻れるようにする。
resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  versioning_configuration {
    status = "Enabled"
  }
}

# stateバケットが誤ってパブリック公開されることを防ぐ。
resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ACLベースの権限管理を使わず、バケット所有者に権限管理を一本化する。
resource "aws_s3_bucket_ownership_controls" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# S3へ保存するstateを、S3管理キーで暗号化する設定。
resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# HTTPによる非暗号化通信を拒否し、HTTPS通信だけを許可するポリシーを作る。
data "aws_iam_policy_document" "tfstate_tls_only" {
  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.tfstate.arn,
      "${aws_s3_bucket.tfstate.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

# 上で作成したHTTPS強制ポリシーを、stateバケットへ適用する。
resource "aws_s3_bucket_policy" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  policy = data.aws_iam_policy_document.tfstate_tls_only.json
}

# 作成後に、stateバケットの名前とARNを確認するための出力。
output "tfstate_bucket" {
  description = "bootstrapモジュールで作成したTerraform state用S3バケット。"

  value = {
    name = aws_s3_bucket.tfstate.bucket
    arn  = aws_s3_bucket.tfstate.arn
  }
}
