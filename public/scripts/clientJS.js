var socket = io()

socket.on('test', function(data) {
    console.log('received data from server')
    console.log(data)
})

$(function () {
    $('#currentGraphContainer').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });



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
        percentColors: [[0.0, "#8EAEBD" ], [0.50, "#30415D"], [1.0, "#CF6766"]]
    };
    var target = document.getElementById('periodGauge'); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 400; // set max gauge value
    gauge.animationSpeed = 71; // set animation speed (32 is default value)
    gauge.set(220); // set actual value


});
