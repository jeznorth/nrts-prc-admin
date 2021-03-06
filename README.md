# bcgov / nrts-prc-admin

# Pre-requisites

- Node.js 8.12.0 (run `node -v` to verify)
- npm 6.4.1 (run `npm -v` to verify)
- Angular CLI 6.2.1 (run `npm ls -g @angular/cli --depth=0` to verify)
- Yarn 1.10.1 or greater (run `yarn -v` to verify)
- TSLint 5.11.0 or greater  (run `tslint -v` to verify)
- TypeScript 2.3.4 (for webpack) (run `npm ls -g typescript --depth=0` to verify)

## Uninstall Older Node (if needed)

1. Uninstall all global packages: `npm uninstall -g <package>`
1. Uninstall Node.js
1. Delete `C:\Users\{user}\AppData\Roaming\npm`
1. Delete `C:\Users\{user}\AppData\Roaming\npm-cache`
1. Delete `C:\Users\{user}\AppData\Local\Temp\npm-*`
1. Reboot

## Install [Node.js](https://nodejs.org/)

Includes npm... Just use default settings.

## Install Packages

1. Install [Angular CLI](https://angular.io/): `npm i -g @angular/cli@6.2.1`
1. Install [Yarn](https://yarnpkg.com/): `npm i -g yarn`
1. Install [TSLint](https://palantir.github.io/tslint/): `npm i -g tslint`
1. Install [TypeScript](https://www.npmjs.com/package/typescript) (needed for Webpack): `npm i -g typescript@'>=2.1.0 <2.4.0'`


## Verify the Installation

```
npm ls -g --depth=0
```

# Fork, Build and Run

1. After installing Node and Yarn, you can fork or straight download a copy of this application to start your own app.
1. First download all the dependencies with `yarn install`.
1. Run `npm start` to start the webpack server to run the application on port 4200.

    Go to http://localhost:4200 to verify that the application is running.

    :bulb: To change the default port, open `.angular-cli.json`, change the value on `defaults.serve.port`.
    
1. Run `npm run build` to just build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build, like so: `ng serve --prod` to run in production mode.
1. Run `npm run lint` to just lint your app code using TSLint.

## Running locally with Keycloak

1. Before starting the local API project, in your shell, enable Keycloak and set Tantalis variables:
```
export KEYCLOAK_ENABLED=true
export TTLS_API_ENDPOINT="<see below>"
export WEBADE_AUTH_ENDPOINT="<see below>"
export WEBADE_USERNAME="<see below>"
export WEBADE_PASSWORD="<see below>"
```
:bulb: Get the values for TTLS_API_ENDPOINT, WEBADE_AUTH_ENDPOINT, WEBADE_USERNAME and WEBADE_PASSWORD, at [Openshift](https://console.pathfinder.gov.bc.ca:8443/console/projects) &rarr; Natural Resource Public Review and Comment (dev) project &rarr; Applications &rarr; Pods &rarr; prc-api pod &rarr; Environment.

2. Before starting the local Admin project, in file `src/app/services/keycloak.service.ts`, around line 17, change code to:
```
case 'http://localhost:4200':
  // Local
  this.keycloakEnabled = true;
  break;
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

### Example: Generate a customer component

```
ng g c customer
```

### Example: Generate a directive: search-box

```
ng g d search-box
```

### Example: Generate a service: general-data

```
ng g s general-data
```

Angular will give out a warning line after this command:

> WARNING Service is generated but not provided, it must be provided to be used

After generating a service, we must go to its owning module and add the service to the `providers` array.

### Example: Generate a service and include it in a module automatically

```
ng g s general-data2 -m app.module
```

### Example: Generate a class, an interface and enum

```
# class
ng g cl models/customer

# interface
ng g i models/person

# enum
ng g enum models/gender
```

### Example: Generate a pipe

```
ng g pipe shared/init-caps
```

## Generate a module

Create a login directory and generate a login module in that directory.

```
ng g module login/login.module
```

## Add/Generate Routing Features

Generate a module called admin and add routing feature to it.

```
ng g module admin --routing
```

## Running Tests

### Unit tests
  
Set up via Karma, Jasmine:
1. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End-to-end tests

Set up with Protractor:
1. Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
1. Before running the tests make sure you are serving the app via `ng serve`.

## Change aspects of the application

### Change style dialect

```
ng set default.styleExt css
```

## Regenerate a brand new project with routing and scss options

```
ng new my-app --routing --style scss
```

## Getting Help

1. To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
1. `ng doc component` to look up documentation for features.
1. `ng serve --help` to look up doc for `ng serve` command.

# Build and Deployment

For dev, test, and production builds on OpenShift/Jenkins see [openshift/README.md](https://github.com/bcgov/nrts-prc-admin/blob/master/openshift/README.md) for detailed instructions on how to setup in an OpenShift environment using [nginx](https://www.nginx.com/).

# How to Contribute

Feel free to create pull requests from the default "master" branch, click here to create one automatically: <https://github.com/bcgov/nrts-prc-admin/pull/new/master>
