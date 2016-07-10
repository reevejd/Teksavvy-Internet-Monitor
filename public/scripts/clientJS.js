var socket = io()

socket.on('currentData', function (data) {
    console.log('received current usage total');
    console.log('currentData' + data);
    initializeGauge(data);

})

socket.on('monthData', function (data) {
    console.log('received monthly usage data');
    console.log('Monthly data ' + data)
    initializeGraph(data);
})

var initializeGauge = function(data) {
    var opts = {
            lines: 12, // The number of lines to draw
            angle: 0.15, // The length of each line
            lineWidth: 0.44, // The line thickness
            pointer: {
                length: 0.78, // The radius of the inner circle
                strokeWidth: 0.035, // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',   // If true, the pointer will not go past the end of the gauge

            generateGradient: true,
            percentColors: [[0.0, "#8EAEBD"], [0.50, "#30415D"], [1.0, "#CF6766"]]
        };
        var target = document.getElementById('gaugeCanvas'); // the canvas element to draw the gauge in
        var gauge = new Gauge(target).setOptions(opts); 

        gauge.setTextField(document.getElementById('gaugeValueDisplay')); // show the gauge value in this div

        gauge.maxValue = 400; // set max gauge value -- need to set this based on config file later
        gauge.animationSpeed = 71; // set animation speed (32 is default value)
        //console.log(data);
        gauge.set(data['jsonResults']['value'][0]['OnPeakDownload']); // set actual value
}


var initializeGraph = function (data) {
    $('#currentGraphContainer').highcharts({
        exporting: {
            enabled: false
        },
        plotOptions: {
            color: '#1565c0'
        },
        chart: {
            zoomType: 'xy',
            margin: 30
            
        },
        title: {
            text: 'Daily Internet Usage'
        },
        subtitle: {
            text: 'Click and drag to zoom in'
        },
        xAxis: [{
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b %e'
            },
            minPadding: 0.05,
            maxPadding: 0.05
        }],
        yAxis: { 
            labels: {
                format: '{value} GB',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Data Usage',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }

        },
        tooltip: {
            pointFormat: '{point.y}',
        },
        legend: { enabled: false },
        credits: { enabled: false },
        series: [{
            color: '#1565c0',
            label: false,
            type: 'column',
            data: data['processedData'],
            tooltip: {
                valueSuffix: ' GB'
            }
        }]
    });
}

