#circleci-status

circleci-status is a small, command line utility that makes it easy to check on the status of your CircleCI builds.

## Installation

Install using the following command:

```npm install -g circleci-status```
 
## Configuring

To configure the tool, create a new file called ```.circleci-rc``` in your project directory. The .circlerc file should contain the name of the repo (including the github username), and status token (if the repo is private). Example:

```
{
  "repo" : "username/repo",
  "token" : "a1055a5cab3012186884214b38200e4c3b2f6ce2"
}
```

## Running

To run, execute circleci-status from the command line:

```
~$ circleci-status
```

The circleci-status will return one of the following status/codes:

## Building

```Building...```

## Success

```Success (Build: 44) completed Today at 3:17 PM```

## Failure

```Failure - Please check the repo at https://circleci.com/gh/username/repo/tree/master```

## Canceled

```Build Canceled - Please check the repo at https://circleci.com/gh/username/repo/tree/master```


