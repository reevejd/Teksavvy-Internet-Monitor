var request = require('request'); // for making API calls to TekSavvy
var APIKey = require('./userConfig.json')['APIKey']
console.log(APIKey);

// port = process.env.PORT for deploying on heroku, 8080 for local testing
var port = process.env.PORT || 8080;

// setting up express 4 server & socket.io
var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(port, function() {
  console.log('Listening on port ', port);
});
var io = require('socket.io').listen(server)

// static files are stored in the public folder
app.use(express.static(__dirname + '/public'));

// might be useful if I decided to expand this later
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// handling requests/response from the user
app.get('/', function(request, response) {
  response.render('pages/index');
})

// when a user connects, push teksavvy data to the client
io.on('connection', function(socket) {


  // url query + header for retrieving current usage totals
  var currentTotals = {
    url: 'https://api.teksavvy.com/web/Usage/UsageSummaryRecords?$filter=IsCurrent%20eq%20true',
    headers: {
      'TekSavvy-APIKey': APIKey // change this to be based on config file later
    }
  }

  request(currentTotals, function (error, response, body) {
    if (error) {
      console.log('An error occurred while retrieving TekSavvy current data: ', error);
    } else {
      console.log(body);
      jsonResults = JSON.parse(body);
      console.log('TekSavvy current data successfully retrieved:\n', jsonResults, '\n...sending to client now...');
      socket.emit('currentData', { jsonResults });
    }
  });
  
  
  
  

  var historicalData = {
    //url: 'https://api.teksavvy.com/web/Usage/UsageSummaryRecords?$filter=year(StartDate)eq'+year+'andyear(EndDate)eq'+year+'andmonth(StartDate)eq'+month+'andmonth(EndDate)eq'+month,  // use for historical
    //url: 'https://api.teksavvy.com/web/Usage/UsageSummaryRecords?$filter=year(StartDate) eq 2013 and year(EndDate) eq 2013 and month(StartDate) eq 12 and month(EndDate) eq 12',
    url: 'https://api.teksavvy.com/web/Usage/UsageRecords?$inlinecount=allpages',
    headers: {
      'TekSavvy-APIKey': APIKey
    }
  }
  console.log('making request');
  request(historicalData, function (error, response, body) {
    if (error) { // need to check response code here later
      console.log('response: ' +  JSON.stringify(response));
      console.log('An error occurred while retrieving TekSavvy historical data: ', error);
      
    } else {
      console.log('no errors');
      jsonResults = JSON.parse(body);
      var numRecords = jsonResults['odata.count'];
      console.log('The number of records is ', numRecords)
      var skip = Math.min(numRecords - 35,numRecords)
      console.log('Skip: ', skip)
      //console.log(body)

      var customSkipOptions = {
        url: 'https://api.teksavvy.com/web/Usage/UsageRecords?$inlinecount=allpages&$skip='+skip,
        headers: {
          'TekSavvy-APIKey': APIKey
        }
      }

      request(customSkipOptions, function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(response)
          jsonResults = JSON.parse(body);
          console.log("processing results to only include this month's data")
          processAndSendResults(jsonResults, function(processedData) {
            if (processedData) {
              console.log('TekSavvy historical data successfully retrieved:\n', processedData, '\n...sending to client now...');
              socket.emit('monthData', { processedData });
            }
          });
          
          
        }
      })
    }
  });
})

var processAndSendResults = function(data, callback) {

  var currentDate = new Date()
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var year = currentDate.getUTCFullYear();
  console.log('The month is ', month);
  console.log('The year is ', year);
  var year_month = year + '-' + month;


  var dateAndDownload = []
  var points = data['value']
  lastIndex = Object.keys(points).length-1;
  count = 0;
  for (var i = points.length-1; i >= 0; i--) { //iterate backwards so I don't have to worry about deleting elements affecting anything
    
    if (points[i]['Date'].indexOf(year_month) == -1) {
       //var utcConvert = Date.parse(points[i]['Date'])
       //console.log(utcConvert);

       points.splice(i,1); 
    } else {
      dateAndDownload.push([Date.parse(points[i]['Date']), points[i]['OnPeakDownload']]);
    }
    if (i == 0) {
      callback(dateAndDownload);
    }
    
  }

  
}
