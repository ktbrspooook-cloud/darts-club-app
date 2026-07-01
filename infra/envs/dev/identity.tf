data "aws_caller_identity" "current" {}

output "terraform_identity" {
  description = "このdev環境のTerraformがAWSへ接続する際の認証先。"

  value = {
    account_id = data.aws_caller_identity.current.account_id
    arn        = data.aws_caller_identity.current.arn
    user_id    = data.aws_caller_identity.current.user_id
  }
}
