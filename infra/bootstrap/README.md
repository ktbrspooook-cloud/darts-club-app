# Bootstrap

このroot moduleは、Terraform stateを保存するS3バケットを作成する。

state bucket自体が最初は存在しないため、最初だけローカルstateで実行する。
S3バケットを作成・確認した後、このmodule自身のstateもS3 backendへ移行する。
