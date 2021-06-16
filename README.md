# Bites Media Website

## Install and Run
* git clone repo
* npm install
* npm start
* go to http://localhost:3000

### User name and Password for Development
* user name : admin
* password : admin

### User register
* run this command in teminal  `node app.js apostrophe-users:add admin admin`

### Database connect
* install mongodb in your local
* import bitesmedia database folder `dump`

#### you can found landing page in:
  `lib/modules/apostrophe-pages/views/pages/home.html` :

  that renders  {{ apos.singleton(data.page, 'landingPage', 'bt-landing', {} ) }}
