# Infrastructure as Code

このディレクトリには、darts-club-app のAWSインフラを管理する
Terraform設定を配置する。

## ディレクトリ構成

- bootstrap/
  Terraform stateを保管するS3バケットを作成・保護するためのroot module。

- envs/dev/
  ダーツ部アプリの開発環境を管理するroot module。

## 運用ルール

- AWS CLI profile は darts-dev を使う。
- 基本リージョンは ap-northeast-1 とする。
- Terraform管理対象のAWSリソースは、原則AWSコンソールから手動変更しない。
- Terraform state、providerキャッシュ、planファイル、認証情報、
  実値のtfvarsファイルはGitへコミットしない。
- terraform init が作成する .terraform.lock.hcl はGitへコミットする。

## State管理方針

1. bootstrapは、state用S3バケットを作成する間だけローカルstateを使う。
2. state用S3バケットの作成と確認後、bootstrapとdev環境のstateをS3 backendへ移行する。
3. S3 VersioningとS3 native locking（use_lockfile = true）を使用する。
