# frontend配信専用のS3バケット。
# ブラウザからS3へ直接アクセスさせず、
# 後続フェーズでCloudFront OAC経由だけを許可する。
resource "aws_s3_bucket" "frontend" {
  bucket = "darts-club-frontend-274136495717-apne1"

  # オブジェクトが残っている場合にTerraformが強制削除しない。
  force_destroy = false

  # 破壊的なterraform destroyを誤実行しても削除を防ぐ。
  lifecycle {
    prevent_destroy = true
  }
}

# S3バケットをインターネットへ直接公開しない。
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ACLを無効化し、バケットポリシーでアクセスを制御する。
resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# フロントエンド資材をS3側で暗号化して保存する。
resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# デプロイ前後のファイルを復元できるよう、S3バージョニングを有効化する。
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }
}

# HTTPによるS3アクセスを拒否する。
# 後続フェーズでCloudFront OACを許可するStatementをこのポリシーへ追加する。
data "aws_iam_policy_document" "frontend_bucket_base" {
  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.frontend.arn,
      "${aws_s3_bucket.frontend.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_bucket_base.json
}

output "frontend_bucket" {
  description = "frontend配信用S3バケットの名前とARN。"

  value = {
    name = aws_s3_bucket.frontend.bucket
    arn  = aws_s3_bucket.frontend.arn
  }
}
