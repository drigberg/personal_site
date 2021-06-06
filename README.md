# Personal Site

## Installing

Just make sure that python3 is installed!

## Running locally

`bash run_dev.sh` --> site will be available at http://localhost:8000

## Deploying

This static site can be deployed cheaply on AWS by exposing an S3 bucket for public access.

Full documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html
Tutorial: https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html

To deploy, use this command: `aws s3 sync lib "s3://your-s3-bucket-name" --delete`
