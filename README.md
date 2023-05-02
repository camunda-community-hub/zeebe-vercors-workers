[![Community badge: Incubating](https://img.shields.io/badge/Lifecycle-Incubating-blue)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#incubating-)
[![Community extension badge](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community)
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)

# What is the Cherry Runtime?

The Cherry Runtime is dedicated to execute Camunda 8 Connectors and Workers. 
it is dedicated to administrators and developers. it provides administrative functions to monitor executions.

![Cherry Runtime Overview](src/main/resources/static/img/CherryFrameworkOverview.png?raw=true)

For a quick execution, access the Tutorial chapter.

Collections of connectors/workers can be integrated in the Cherry Framework. A collection is an application ready to execute.
This documentation gives information:
* for administrators, to start and administrate a Collection
* for developers, to integrate a connector, or develop a connector or a worker in the framework, to create a Collection.


## Administrator
Multiple collections used the Cherry Runtime (Office PDF, CMIS). Each collection embedded multiple connectors or runners.

Each collection is an application, available as a Java application or as a Docker image.

Provide the information to connect the Zeebe engine, and start the application.
The framework provides then an administrative page to monitor execution.
![Cherry Main Page](src/main/resources/static/img/CherryMainPage.png?raw=true)

On this page, connectors/workers are visible with statistics. The administrator can stop a connector/worker and change the number of threads dedicated to the pool of execution.

## BPMN Designer
A Cherry collection is a set of connectors/workers. Within the administrative page, the designer can access all the different artifacts.

He can access the type of connector/worker and information about the input and the output of the connector. A list of BPMN errors thrown by the connector/worker is available.
![Documentation](src/main/resources/static/img/InputOutputDocumentation.png?raw=true)


He can download the Element-Templates of the collection to load it in the Modeler or in the Web Modeler. The design becomes very easy.

![Template Modeler](src/main/resources/static/img/TemplateModeler.png?raw=true)

## Developer

The developer can focus on the connector development. He has to declare Input and Output in the description. These have different advantages:

* The Framework will manage documentation, and it doesn't need to worry about it
* the Template Modeler will be generated by the Framework
* The Framework controls the contract. If a variable is mandatory, the Framework controls its existence. On the Execute() method, the developer does not need to worry about the variable.

 
Execution is managed by the Framework, and a lot of administrative function is included: start/stop, change the number of thread, and get statistics on the execution.



# Installation

Check the Installation guide

# Developer guide

Check the Developer guide:
* a tutorial to start a first project
* the reference guide













## Introduction

The Cherry framework comes with some Runners. You can start it as it is, or it may be embedded in a project to deliver more Runners.

The library contains a WebApplication. You can access it if you start the Cherry Framework project or if you start a project which includes the Cherry Framework project

## Specify the connection to Zeebe

The connection to the Zeebe engine is piloted via the application.properties located on src/main/java/resources/application.properties

### Use a Camunda Saas Cloud:

1. Follow the [Getting Started Guid](https://docs.camunda.io/docs/guides/getting-started/) to create an account, a
   cluster and client credentials

2. Use the client credentials to fill the following environment variables:
    * `ZEEBE_ADDRESS`: Address where your cluster can be reached.
    * `ZEEBE_CLIENT_ID` and `ZEEBE_CLIENT_SECRET`: Credentials to request a new access token.
    * `ZEEBE_AUTHORIZATION_SERVER_URL`: A new token can be requested at this address, using the credentials.

3. fulfill the information in the application.properties
````
# use a cloud Zeebe engine
zeebe.client.cloud.region=
zeebe.client.cloud.clusterId=
zeebe.client.cloud.clientId=
zeebe.client.cloud.clientSecret=
````

### Use a onPremise Zeebe

Use this information in the application.properties, and provide the IP address to the Zeebe engine

````
# use a onPremise Zeebe engine
zeebe.client.broker.gateway-address=127.0.0.1:26500
````

## Start the application
Attention: Cherry collection works with the JDK 17.

After starting, all Runners in the project begin to monitor the Zeebe server.
When a task is ready to be executed by one of the Runners, it is processed.


## Command line
Execute `start.sh` or `start.bat` available on the framework.

## Maven 

Execute
````
mvn spring-boot:run
````


## Docker image
Build the image with 
````
mvn install
docker build -t zeebe-cherryruntime:3.0.0 .
````
Run it with 
`````
docker run -p 8888:8080 zeebe-cherryruntime:3.0.0 .

Note: the github repository produce automatically a Docker image.
To produce this docker image from your own collection, copy

.github/workflows/publish-github.package.yaml

ATTENTION: the publication is active only when a new release is published


## Docker Compose
A docker-compose.yaml file is available
Execute
````
docker-compose up
````

## Access the Web Application

Access the webapp here: `http://localhost:9081`.

Currently, there is just a single welcome page that calls the `/cherry/api/runner/list` to show
Runners found in system:

![Web Page Welcome Screen Shot](src/main/resources/static/img/welcomeScreenShot.png?raw=true)

The Runner section describes all Runners available in the project. For each Runner, you have a list of Inputs
expected and Outputs produced by the Runner.

Click on one of the rows in the table to see more details. For example, here are details about the "PingWorker":

![Worker Detail Screen Shot](src/main/resources/static/img/workerDetailScreenShot.png?raw=true)

Each Runner follows the same pattern:
* it declares a type. This type must be used in your process to specify the Runner.
  By convention, type name is 'c-<collection>-<name>'. For example, the LoadFileFromDiskWorker type is 'c-pdf-convert-to'

* it expects input data
  The OfficeToPdf expects to input an MSOffice document.

* it processes the task and produces output data
  For example, the OfficeToPdf worker produces a PDF document

* it may produce some BPM errors.
  If the conversion to a PDF document fails, a BPMN ControllerPage is thrown.

* Check out each collection and Runner to see the detail.

## How to integrate a Runner into your process?

Check out the definition. Creates a service task and uses the type.

Check the input data. Use the Input facility in Camunda to map the required Input and your process.


For example, the LoadFilesFromDisk Runner required a folder and a filename to load a file. Input are "folder" and "fileName" (1).
If you don't have these variables in your process or with a different name (for example, the file name you want to load is under the process variable "ContractDocument"), then an Input is the solution.

* Add an Input with the required name, i.e., fileName
  map the value of the Input to your variable:
````
fileName = ContractDocument
````
You can give a constant for Input. If all files are located under c:/document/contract, then give as Input
````
folder = "c:/document/contract"
````

* You proceed in the same way to map the output to your process variables, to link an output to your process variable.

(1) LoadFilesFromDisk has different scenarios to load files. You can load a file explicitly by its name or via a filter like "*.docx"



## Manage files (or documents)

Zeebe does not store files as it.

The Cherry project offers different approaches to manipulating files across Runners.
For example, OfficeToPdf needs an MS office or an Open Office document as input and will produce a PDF document as a result.

How to give this document? How to store the result?

The Cherry project introduces the StorageDefinition concept. This information explains how to access files (same concept as a JDBC URL).
Then the Runner LoadFileFromDisk required a storageDefinition, and produced as output a "fileLoaded".
Note: the storage definition is the way to access where files are stored, not the file itself.

Existing storage definitions are:
* **JSON**: files are stored as JSON, as a process variable. This is simple, but if your file is large, not very efficient. The file is encoded in base 64, which implies a 20 to 40% overload, and the file is stored in the C8 engine, which may cause some overlap.

Example with LoadFileFromDisk:
````
storageDefinition: JSON
````
fileLoaded contains a JSON information with the file
````
{"name": "...", "mimeType": "application/txt", value="..."}
````

* **FOLDER:<path>**. File is store on the folder, with a unique name to avoid any collision.

Example with LoadFileFromDisk:
````
storageDefinition: FOLDER:/c8/fileprocess
````
fileLoaded contains
````
"contractMay_554343435533.docx"
````
Note: the folder is accessible by Runners. If you run a multiple Cherry application on different hosts, the folder must be visible by all applications.

* **TEMPFOLDER**, the temporary folder on the host, is used to store the file, with a unique name to avoid any collision

Example with LoadFileFromDisk:
````
storageDefinition: TEMPFOLDER
````
fileLoaded contains
````
"contractMay_554343435533.docx"
````
This file is visible in the temporary folder on the host

Note: the temporary folder is accessible only on one host, and each host has a different temporary folder. This implies your Runners run only on the same host, not in a cluster.



## Example of usages
See different examples under `src/test/resources/org.camunda.cherry`. You have a folder per collection, and processes in the collection.

# Developer guide

Access [Developper Guide](doc/DeveloperGuide/DeveloperGuide.md)

# Embedded Existing Connector

To embed an existing connector in a Cherry Collection, to provide a better Element-template for example, follow this documentation

[Embed Existing Connector Guide](doc/EmbedExistingConnector/EmbedExistingConnector.md)

# Produce a Docker image automatically

You want to create for the community a new collection? Follow this guide
Follow this guide [Create My Collection](doc/CreateMyCollection/CreateMyCollection.md)













