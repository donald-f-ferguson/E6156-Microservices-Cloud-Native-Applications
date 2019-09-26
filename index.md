---
layout: default
---

# E6156 - Topics in Software Engineering: Microservices and Cloud Native Applications

## Overview

This course covers core, fundamental concepts in developing modern, cloud native application development.
The core topics include:

-	Microservices
-	Content distribution networks
-	Infrastructure-as-a-Service, Platform-as-a-Service, API-as-a-Service
-	API management and gateways
-   Using cloud APIs
-	Serverless and Function-as-a-Service
-	Message-Drive-Architectures, Event-Driven-Architectures
-	REST
-	OAuth2, social media integration
-	Multi-tenancy
-	SQL, NoSQL and cloud databases
-	Service orchestration
-	Application and systems management.
-	Application development best practices.

Students will learn the material by building an application in small teams.
The application will be a simple cloud application for playing fantasy baseball. 
The application includes the basics of user interface, microservices, social networking, SQL and NoSQL databases, 
REST APIs, service composition, data analysis and simple machine learning.

There will be lectures and meetings with the professor that explain and cover 
implementation technology and review the projects. 
Teams will use Amazon Web Services for the cloud platform, but the course concepts apply to 
most modern cloud platforms. Some of the specific AWS technologies the course will cover are:
-	EC2, Elastic Beanstalk, ECS
-	Lambda Functions
-	SQS, SMS
-	S3, Neptune, RDS, DynamoDB, DocumentDB, Elasicache
-	CloudWatch, CloudTrail, CloudFormation
-	CloudSearch Data Pipeline
-	IAM, Cognito, WAF
-	CloudFront, Route 53, API Gateway
-	Code Commit, Code Build
-	Sage Maker

The projects will also require using external cloud APIs, e.g. [SmartyStreets](https://smartystreets.com/) for address
verification.

Students may optionally choose to use additional or different enablement technology.

The final grade is based on the review of the project.
There will be interim reviews with the professor and with the class.

## Project Overview

Simplistically, there are three parts to an application:
1. User interface.
2. Application/business logic.
3. Data

The project will use a microservice architecture to implement the application and business logic, and also for
implementing infrastructure and middle ware services. [Wikipedia](https://en.wikipedia.org/wiki/Microservices)
provides a simple definition of microservices and links to related topics. The course material will provide examples,
links to additional material, etc.

"Microservices are a software development technique—a variant of the service-oriented architecture (SOA)
architectural style that structures an application as a collection of loosely coupled services. 
In a microservices architecture, services are fine-grained and the protocols are lightweight. 
The benefit of decomposing an application into different smaller services is that it improves modularity. 
This makes the application easier to understand, develop, test, and become more resilient to architecture erosion. 
It parallelizes development by enabling small autonomous teams to develop, deploy and scale their respective 
services independently. It also allows the architecture of an individual service to emerge through 
continuous refactoring. Microservices-based architectures enable continuous delivery and deployment."


- _BaseballInfo Data Microservice:_
    - Allows users to query and explore data about players and their performance. Date comes from [Lahman2018
    baseball database.](http://www.seanlahman.com/baseball-archive/statistics/).
    - The microservice will require RDS, Data Pipeline and Elastic BeanStalk.
- _Fantasy Baseball Data Microservice:_ 
    - Allows users to create an account, define a fantasy team,
define a fantasy league, assign players to teams, etc. The database is a newly design database and data model.
    - The microservice will require Lambda functions, DynamoDB, Cognito and social media integration, and 
    using external Web APIs.
- _Social Interaction Microservice:_
    - Allows users to follow, like, comment, etc. on teams, players, users, ...
    - The microservice will require Neptune (or Neo4J)
- _Discussion/Comment Data Microservice:_
    - Stores comments, responses, discussion threads, etc.
    - Uses DocumentDB
- _Analytics/Machine Learning Data Microservice:_
    - A database of analyzed and processed baseball performance interface that enables analysis and prediction
    using machine learning.
    - Uses Data Pipeline, RDS and Sage Maker
- _Application Business/Logic Microservice:_
    - Implement business logic and rules, primarily governing correct operation of the fantasy league and rules.
    - Uses Lambda functions, SQS, SMS and Step Functions.
- _Caching Microservice:_
    - REST API and data access response cache to optimize performance.
    - Uses ElastiCache
- _Static Content Web Server:_
    - Delivers HTML, CSS, images, JavaScript, etc. to web browser UI.
    - Uses S3, CloudFront, Cloud Search, Route 53, etc.
- _User Interface:_ Browser application using AngularJS.

## Lecture Material

- Lecture 1: Introduction and First Microservice
    - [HTML](Lectures/Lecture1/E6156-f2018-Lecture-1.html)
    - [Jupyter Notebook](Lectures/Lecture1/E6156-f2018-Lecture-1.ipynb)
- Lecture 2: PaaS, Elastic Beanstalk, Microservices
    - [HTML](Lectures/Lecture2/E6156-f2019-Lecture-2.html)
    - [Jupyter Notebook](Lectures/Lecture2/E6156-f2019-Lecture-2.ipynb)
- Lecture 3: REST, Lambda Functions, etc.
    - [HTML](Lectures/Lecture 3/E6156-f2019-Lecture-3.html)
    - [Jupyter Notebook](Lectures/Lecture 3/E6156-f2019-Lecture-3.ipynb)


## Examples

The example material for fall 2019 is in progress. 

