data "aws_caller_identity" "current" {}

output "terraform_identity" {
  description = "AWS identity used by Terraform for this root module."

  value = {
    account_id = data.aws_caller_identity.current.account_id
    arn        = data.aws_caller_identity.current.arn
    user_id    = data.aws_caller_identity.current.user_id
  }
}
