# Description

Display a breakdown of languages across a GitHub user's repositories.

# Example

## Command line interface

```
$ node cli <token> quezlatch
JavaScript..........86.931%
F#..................05.486%
C#..................03.853%
HTML................01.939%
CSS.................01.217%
Ruby................00.280%
Shell...............00.255%
Batchfile...........00.040%
```

## Web Api

In preparation for the Web App version of the program, I have created a Web Api endpoint:

```
$ curl https://github-user-langs.herokuapp.com/api/userLangs/quezlatch 2>/dev/null | jq
[
  {
    "size": 428227,
    "name": "JavaScript",
    "color": "#f1e05a",
    "percentage": 86.93111113366693
  },
  {
    "size": 27023,
    "name": "F#",
    "color": "#b845fc",
    "percentage": 5.485734005947971
  },
  {
    "size": 18978,
    "name": "C#",
    "color": "#178600",
    "percentage": 3.8525796530688887
  },
  {
    "size": 9552,
    "name": "HTML",
    "color": "#e34c26",
    "percentage": 1.9390789780858904
  },
  {
    "size": 5997,
    "name": "CSS",
    "color": "#563d7c",
    "percentage": 1.217405426254301
  },
  {
    "size": 1377,
    "name": "Ruby",
    "color": "#701516",
    "percentage": 0.27953431248160293
  },
  {
    "size": 1254,
    "name": "Shell",
    "color": "#89e051",
    "percentage": 0.25456501659544667
  },
  {
    "size": 197,
    "name": "Batchfile",
    "color": "#C1F12E",
    "percentage": 0.0399914738989657
  }
]
```

# TODO

* Create a web app version
    * include the language colours
    * proxy GitHub API calls via a web api method to hide the auth token

# Links

* [GraphQL API v4](https://developer.github.com/v4/)
