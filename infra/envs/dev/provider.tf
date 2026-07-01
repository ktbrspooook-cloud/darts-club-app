provider "aws" {
  region              = "ap-northeast-1"
  profile             = "darts-dev"
  allowed_account_ids = ["274136495717"]

  default_tags {
    tags = {
      Project     = "darts-club-app"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}
