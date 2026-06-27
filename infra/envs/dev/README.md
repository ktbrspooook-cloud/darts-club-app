# Development environment

このroot moduleは、darts-club-app の開発環境用AWSリソースを管理する。

最初に作成する予定のリソース：

- frontend配信用の非公開S3バケット
- Origin Access Control（OAC）を使うCloudFront Distribution
- CloudFront経由だけにS3読取を許可するバケットポリシー
