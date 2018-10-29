[![CircleCI](https://circleci.com/gh/taylorjg/github-user-langs.svg?style=svg)](https://circleci.com/gh/taylorjg/github-user-langs)

# Description

Display a breakdown of programming languages across a GitHub user's repositories.

# Technologies

This project makes use of the following technologies:

* [GitHub GraphQL API v4](https://developer.github.com/v4/)
* [Node.js](https://nodejs.org/) / [Express](https://expressjs.com/)
* [Angular 6.x](https://angular.io/)
    * Angular unit tests
    * Angular e2e tests
    * [ng-apimock](https://mdasberg.github.io/ng-apimock/)
* [Ramda](https://ramdajs.com/)
* [CircleCI 2.0](https://circleci.com/) for CI/CD
* [Heroku](https://www.heroku.com/) for deployment

# Examples

## Command line interface

```
$ node cli <token> quezlatch
#repos: 10
JavaScript..........87.477%
F#..................05.520%
C#..................03.611%
HTML................01.951%
CSS.................01.225%
Shell...............00.175%
Batchfile...........00.040%
```

## Web App

https://github-user-langs.herokuapp.com/index.html?username=quezlatch

![Web App screenshot](screenshots/WebApp.png)
