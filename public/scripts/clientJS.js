
var socket = io()

socket.on('currentData', function (data) {
    console.log('received current usage total');
    console.log('currentData' + data);
    doneLoading('#gaugeLoadingWrapper');
    initializeGauge(data.current, data.cap);


})

socket.on('monthlyData', function (data) {
    console.log('received monthly usage data');
    console.log('Monthly data ', data)
    doneLoading('#currentGraphContainer');
    initializeGraph(data);
})

$(document).ready(function() {
    // display loading animations
    startLoading('#currentGraphContainer');
    startLoading('#gaugeLoadingWrapper');

})

startLoading = function(selector) {
    var itemLoading = $(selector);
    var loadingBars = $(document.createElement('div')).addClass('spinner');
    for (var i = 1; i < 6; i++) {
        var bar = $(document.createElement('div')).addClass('rect'+i);
        bar.appendTo(loadingBars);
    }
    loadingBars.appendTo(itemLoading);
}

doneLoading = function(selector) {
    $(selector).empty();
}

var initializeGauge = function(current, cap) {
    var currentValue = Math.round(current['value'][0]['OnPeakDownload'])
    var cap = parseInt(cap);
    console.log(currentValue, cap);

    var opts = {
            lines: 12, // The number of lines to draw
            angle: 0.15, // The length of each line
            lineWidth: 0.44, // The line thickness
            pointer: {
                length: 0.78, // The radius of the inner circle
                strokeWidth: 0.035, // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'true',   // If true, the pointer will not go past the end of the gauge

            generateGradient: true,
            percentColors: [[0.0, "#8EAEBD"], [0.50, "#30415D"], [1.0, "#CF6766"]]
        };
        var target = document.getElementById('gaugeCanvas'); // target canvas element
        var gauge = new Gauge(target).setOptions(opts);  // construct gauge
        gauge.maxValue = cap ; // set max gauge value -- gaugejs bugs out if the value is greater than the max

        if (currentValue > cap) {
            //gauge.setTextField(currentValue-1)
            //var customGaugeDisplay = document.createElement('span');
            //customGaugeDisplay.id='gaugeValueDisplayCustom';
            
            //$("<span id='gaugeValueDisplayCustom'>" + currentValue + " ("+ eval(currentValue - cap)+ " over your cap)</span>")
            
            //console.log(document.getElementById('gaugeValueDisplayCustom'))
            //console.log(document.getElementById('gaugeValueDisplay'));

            gauge.setTextField(document.getElementById('gaugeValueDisplay'));
            //console.log(currentValue);
            //console.log(document.getElementById('gaugeValueDisplay'));
            gauge.animationSpeed = 3;
            gauge.set(cap);
            console.log($('#gaugeValueDisplay').text())
            var gaugeText = currentValue + " ("+ eval(currentValue - cap)+ " GB over your cap)"
            setTimeout(function() {
                $('#gaugeValueDisplay').text(gaugeText);
                //$('#gaugeValueDisplay').css('font-size', '1.6em');
            }, 600);

        } else {

            gauge.setTextField(document.getElementById('gaugeValueDisplay'));
            console.log(document.getElementById('gaugeValueDisplay'));

            gauge.animationSpeed = 80; // set animation speed (32 is default value)
            console.log(current)
            gauge.set(currentValue); // set actual value
        }

        
}


var initializeGraph = function (data) {

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var d = new Date();
    var currentMonth =  monthNames[d.getMonth()];

    $('#currentGraphContainer').highcharts({
        exporting: {
            enabled: false
        },
        plotOptions: {
            color: '#1565c0'
        },
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Daily Internet Usage for ' + currentMonth
        },
        xAxis: [{
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b %e'
            }
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
            type: 'spline',
            data: data['processedData'],
            tooltip: {
                valueSuffix: ' GB'
            }
        }]
    });
}

