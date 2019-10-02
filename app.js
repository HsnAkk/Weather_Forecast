
var localOffset;
var day = new Date().getDate();
var month = new Date().getMonth();
var year = new Date().getFullYear();
var months = ["January","February","March","April","May","June","July","August","September","Oktober","Nowember","December"];

document.getElementById("dateInfo").innerHTML = `${day} ${months[month]} ${year}`;

setInterval(function(){
    var loctime = new Date().toLocaleTimeString();
    document.getElementById("localTime").innerHTML = loctime}, 1000);


document.getElementById('submit').addEventListener("click", addCity);

function addCity () {
    var id;
    var city = document.getElementById('cityName').value;
    
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=41297635165cc5c5c5f7ce5878154a8f&units=metric`;
    fetch(url).then(function(response){
        return response.json();
    }).then(function (data) {
        console.log(data);
        //var hightemp = data.main.temp_max;
        // var lowtemp = data.main.temp_min;
        var temperature = data.main.temp;
        var windSpeed = data.wind.speed;
        var humidity = data.main.humidity;
        var pressure = data.main.pressure;
        // var sunRise = new Date(data.sys.sunrise);
        // var sunRiseTime = `${sunRise.getHours()}`+':'+`${sunRise.getMinutes()}`;
        // var sunDown = new Date(data.sys.sunset);
        // var sunDownTime = `${sunDown.getHours()}`+':'+`${sunDown.getMinutes()}`;
        var weatherIconId = data.weather[0].icon;
        var weatherinfo = data.weather[0].description;
        localOffset = (data.timezone / 3600);

        id = data.id;
        document.getElementById('show').style.display = "block";

        document.getElementById('cityNameSpan').innerHTML = `${data.name}, ${data.sys.country}`;
        document.getElementById('citytemp').innerHTML = `${temperature} ℃`;
        // document.getElementById('sunUp').innerHTML = `${sunRiseTime}`;
        // document.getElementById('sunDown').innerHTML = `${sunDownTime}`;
        document.getElementById('wind').innerHTML = `${windSpeed} m/s`;
        document.getElementById('humid').innerHTML = `${humidity} %`;
        document.getElementById('pres').innerHTML = `${pressure} hpa`;
        // document.getElementById('highTemp').innerHTML = `${hightemp} ℃`;
        // document.getElementById('lowTemp').innerHTML = `${lowtemp} ℃`;
        document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${weatherIconId}@2x.png`;
        document.getElementById('weatherInfo').innerHTML = `${weatherinfo}`;
        

        apiDataLoad();
    });

        setInterval(function () {

        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        let nd = new Date(utc + (3600000 * `${localOffset}`));
        let ndCity = nd.toLocaleString();
        document.getElementById('timeInfo').innerHTML = ndCity}, 1000);
    
    
    async function apiDataLoad() {
        let dataArray = [];
    
        const url = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=41297635165cc5c5c5f7ce5878154a8f&units=metric`;
        const response = await fetch(url);
        const articles = await response.json();
        
        let array = articles.list;
    
        array.forEach(function(listItem){
            let arry = [];
            let date = new Date(listItem.dt_txt);
            arry.push(date);
            arry.push(listItem.main.temp);
            dataArray.push(arry);
        });
    
        google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(drawChart);
        
        function drawChart() {
            let data = new google.visualization.DataTable();
            data.addColumn('date');
            data.addColumn('number');
            data.addRows(dataArray);
        
            let options = {
                
                backgroundColor: {
                    fill: 'transparent'
                },
                chart: {
                    title: '5 day temperature forecast',
                    subtitle: 'data every 3 hours ( ℃ )'
                },
                hAxis: {
                    textStyle: {
                        color:'white'
                    },
                    titleTextStyle: {
                        color:'white'
                    }
                },
                vAxis: {
                    textStyle: {
                        color: 'white'
                    },
                    titleTextStyle: {
                        color:'white'
                    }
                },
                titleTextStyle: {
                    color: 'white'
                },
                legend: {
                    position: 'none'
                },
                curveType : 'function',
                colors : ['white'],
                width: 500,
                height: 300,
                
            };
    
            let chart = new google.charts.Line(document.getElementById('chartdiv'));
    
            chart.draw(data, google.charts.Line.convertOptions(options));
        }
    }
}






