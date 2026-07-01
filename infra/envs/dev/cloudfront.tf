# frontend用S3オリジンを識別する名前。
locals {
  frontend_origin_id = "s3-darts-club-frontend"
}

# CloudFrontがS3へ署名付きリクエストを送るためのOAC。
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "darts-club-frontend-oac-dev"
  description                       = "CloudFrontからfrontend用S3へ安全にアクセスするためのOAC。"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution。
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "darts-club-app dev frontend"
  default_root_object = "index.html"

  # 日本を含む主要リージョンのエッジロケーションを利用する。
  price_class = "PriceClass_200"

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = local.frontend_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id

    # 0は「応答完了時間に上限を設けない」という明示値。
    # 0秒で切断する意味ではない。
    response_completion_timeout = 0
  }

  # 静的frontendは読み取り専用で公開する。
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.frontend_origin_id

    # HTTPアクセスはCloudFrontでHTTPSへリダイレクトする。
    viewer_protocol_policy = "redirect-to-https"

    # HTML、CSS、JavaScriptなどを圧縮可能にする。
    compress = true

    # AWS管理の静的コンテンツ向けキャッシュポリシー。
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # 独自ドメイン・ACM証明書は後続フェーズで追加する。
  # 今回はCloudFront標準ドメインのHTTPS証明書を使う。
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "cloudfront_distribution" {
  description = "frontend公開用CloudFront Distributionの情報。"

  value = {
    id          = aws_cloudfront_distribution.frontend.id
    arn         = aws_cloudfront_distribution.frontend.arn
    domain_name = aws_cloudfront_distribution.frontend.domain_name
  }
}
