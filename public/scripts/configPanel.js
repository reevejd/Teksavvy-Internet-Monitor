


$(document).on('click', '#start', function() {
    console.log('clicked start');
    var APIKey = $('#APIKey').val();
    var Cap = $('#Cap').val();
    window.location.href = './dashboard?APIKey='+APIKey+'&Cap='+Cap;

        
    
});