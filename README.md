# StreetViewAnimate
Get the corresponding locations from google street view and animate with observational data. 


## Install 

### If you are missing node 
`conda install nodejs`


### Node packages
`npm install`

### Rebuild robotjs
In some cases robotjs may not be working and needs to be rebuilt:
`./node_modules/.bin/electron-rebuild -f -t prod,optional,dev -w robotjs`

### Leeds system 
Add to electron ... `--no-sandbox`

## Motivation 


### Still image/location
`electron main.js --latitude 52 --longitude -1 --bearing 10 --name 'mytest' `

Optional arguments: width, height 


## Runtime Notes
- Avoid moving the mouse during the runs.
- It is possible to to run in parallel, with a couple of tweaks (mainly clicking on all electron windows when required), but it is possible for google to read mass queries from a single IP address as a DOS attack, temporarily disabling access. For this reason the script has been left in serial. 
- Images are captured from the app, although most menus have been removed, if cookie access is requested, then this has to be accepted, otherwise the permissions box will appear in all images. 


## Testing
`electron main.js -b 180` should provide the test image of leeds showing a traffic light. 


## Styles

### Satellite 

This is the default style which creates asimple satellite image of the 