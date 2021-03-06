# Source Code for the talk *"The State of JVM on AWS Lambda"*

This is a repository that contains demos for the set of best practices related to deployment of *JVM-based*
applications to *AWS Lambda*, and comparing this with a baseline in Node.js.

It includes optimized runtimes, *JVM* compilation tweaks (including *JIT*), and *AoT* compilation with *GraalVM*. To
not make this artificially bound only to *Java* it additionally contains similar examples in *Clojure*.

## Prerequisites

- Pre-installed tools:
  - Most recent *AWS CLI*.
  - Most recent *AWS SAM*.
  - *AWS CDK* in version 2.x or higher.
  - OpenJDK 11 or higher (ideally *Amazon Corretto* 11.x).
  - Gradle 5.x or higher.
  - Node.js v16.x or higher.
- Configured profile in the installed *AWS CLI* for your *AWS IAM* User account of choice.
- Last, but not least - do either of two (I prefer the latter):
  - Deploy *AWS Lambda Power Tuning* state machine as requested [here](https://github.com/alexcasalboni/aws-lambda-power-tuning/blob/master/README-DEPLOY.md).
  - Deploy *AWS Lambda Power Tuner UI* as it is described [here](https://github.com/mattymoomoo/aws-power-tuner-ui#how-do-you-deploy-and-run-the-website-in-your-aws-account).
- Deploy [this layer](https://serverlessrepo.aws.amazon.com/applications/eu-central-1/443526418261/holy-lambda-babashka-runtime-amd64) to your AWS account in the region where you will deploy your stacks.
  - Note down the *ARN* of the layer as you will need that later.

## How to use that repository?

```shell
# After checking out the repository - do it in a single terminal session ...

$ make
$ source ./.env/bin/activate

$ cd sources
$ make

$ cd ../infrastructure
$ npm install

$ export AWS_USERNAME=<YOUR_IAM_USERNAME>
$ export BABASHKA_RUNTIME_LAYER_ARN=<ARN_YOU_HAVE_NOTED_DOWN>

$ cdk bootstrap

$ npm run package
$ cdk deploy Infrastructure-Shared       # Get the repository URL from the outputs.

# Generate AWS CodeCommit HTTPS credentials in the AWS IAM for your user.

$ git remote add aws https://...         # Put that repository URL here.
$ git push aws main

$ npm run deploy
```

From now on everything can be done from the *AWS Cloud9* that is set up by the *infrastructure as code* used above.

If you are interested in seeing relevant slides, [contact me directly](https://awsmaniac.com/contact).

## License

- [MIT](LICENSE)

## Authors

- [Wojciech Gawro??ski (afronski)](https://github.com/afronski) (aka [AWS Maniac](https://awsmaniac.com))
