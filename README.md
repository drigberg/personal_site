# Personal Site

This site is intended to be lightweight, accessible, and stable! Who needs React when we have HTML? _cries_

Feel free to fork the repo and use it for your own webpage!

## Demo
Check out https://danielrigberg.com to see it live!

## Running locally

After ensuring that python3 is installed, just run `bash run_dev.sh`. The site will be available at http://localhost:8000.

## Deploying

This static site can be deployed cheaply on AWS by exposing an S3 bucket for public access.

Full documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

Tutorial: https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html

To deploy, use this command: `aws s3 sync lib "s3://your-s3-bucket-name" --delete`
