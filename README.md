# yo-grade

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd yo-grade`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

http://blog.88mph.io/2016/05/17/silence-your-ember-app-in-production/

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

### FIREBASE

Deploy to multiple environments with Firebase Hosting

https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html

https://firebase.google.com/docs/firestore/security/get-started?authuser=0
https://firebase.google.com/docs/firestore/security/secure-data?authuser=0


### TO DO:

- Remove user from business (use-case)
- Delete user account (use-case)
- Add #No in rank list
- Add prompt when deleting user

### DONE

- Allow showing grading if you are signed-out but checked-in at least once today
- Refresh lists on page open (!Checking, Grading, Rank list, Employees);
- Added refresh Employees list
