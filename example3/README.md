# How to create a User management?

### Getting Started
This plugin requires node `>= 6.0.0` and npm `>= 1.4.15` (latest stable is recommended).

```shell
> git clone https://github.com/BoodskapPlatform/tutorials.git
```

Once the repository has been cloned:
```shell
> cd tutorials/example3
```

### NPM Module Installation

```shell
> npm install
```

## Configuration

### Properties
In `boodskap.properties` file,
```shell
#default property

[server]
port=10001

[boodskap]
api=https://api.boodskap.io

[mqtt]
host=gw.boodskap.io
port=443
ssl=true

[google]
analytics.id=
map.key=
```
To change the UI port, update the server property

#### Note
If you are downloading the platform (or) running in our own dedicated server.You may have to change the `boodskap` and `mqtt` property

### Build Properties
Once all the changes done in property file. Execute a command
```shell
> npm run-script build
```
or
```shell
> node build.js
```
#### Output

```shell
***************************************
Boodskap IoT Platform
***************************************
1] Setting server properties success
2] Setting web properties success
Thu Jan 10 2019 14:09:22 GMT+0530 (IST) | Boodskap UI Build Success
Now execute > npm start
```

### How to start the UI node server?

```shell
> npm start
```
or
```shell
> node server.js
```
#### Output

```shell
************************************************************************************
Thu Jan 10 2019 14:11:51 GMT+0530 (IST) | Boodskap IoT Platform Web Portal Listening on 10001
************************************************************************************
```
Open the Browser with this URL: http://0.0.0.0:10001


### To change the UI

- To edit the Javascript File
    `\webapps\js\users.js`
    
    User object
    
    ```shell
    {
      "email": "string",
      "password": "string",
      "firstName": "string",
      "lastName": "string",
      "country": "string",
      "state": "string",
      "city": "string",
      "address": "string",
      "zipcode": "string",
      "primaryPhone": "string",
      "locale": "string",
      "timezone": "string",
      "workStart": 0,
      "workEnd": 0,
      "workDays": [
        0
      ],
      "roles": [
        "string"
      ],
      "groups": [
        0
      ],
      "registeredStamp": 0
    }
    ```
    - multiple roles can be added in the array
    - Every user add in the system will get an email
    - Email template can be edited in 
        `https://platform.boodskap.io/templates`
    - Default Template name `useradd_html_content`
    
    ```shell
    Dear {{__FNAME__}} {{__LNAME__}} 
    
    You have been give access to Boodskap IOT platform account. 
    You can login to the system using your email with this password: {{__PASSWD__}} 
    
    Thank you for joining Boodskap.io. 
    Boodskap, Inc., 
    735 Plaza Blvd Suit 210, 
    Coppell, TX 75019, USA	

    ```
    - can customize the above email template        
    - created user can login into the system
    
- To edit the HTML content
    `\views\users.html`

#### plugins used
- DataTables JS
- Moment JS
- Sweet Alert JS