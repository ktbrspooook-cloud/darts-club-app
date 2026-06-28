# このroot moduleのTerraform stateをS3に保存する。
# backendブロックではvariables、locals、data sourceを参照できないため、
# バケット名やstate保存先キーは固定値で記載する。
terraform {
  backend "s3" {
    bucket              = "darts-club-tfstate-274136495717-apne1"
    key                 = "darts-club-app/bootstrap/terraform.tfstate"
    region              = "ap-northeast-1"
    profile             = "darts-dev-terraform"
    allowed_account_ids = ["274136495717"]

    # stateファイルとロックファイルをS3側で暗号化して保存する。
    encrypt = true

    # S3の.tflockオブジェクトを使い、stateの同時更新を防ぐ。
    # DynamoDBによるstate lockは使わない。
    use_lockfile = true
  }
}

