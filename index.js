$(document).ready((e) => {
    
    var chartdata = [];
    var pythondatachart = [];
    var datacollector = [] 
    var index = 0;
    let tamp = [1, 2, 34, 5, 6, 34, 2, 4, 3, 7, 75, 4,];
    let count = 0;
    let pythonCallData =[];
    let lol =[];

    var xAxisStripLinesArray = []; 
    var yAxisStripLinesArray = [];
    var dps = [];

    
    let pointValue = 20; 
    
    setInterval(() => {
        pointValue += 1;
        //console.log(pointValue)
    }, 200000)
    function getData() {
        
        if(pythondatachart.length ){

            var data = JSON.stringify({
                "username": "AMIT",
                "createdTs" : new Date().toISOString(),
                "hr": 63,
                "pr": 142,
                "qt": 301,
                "qtc": 352,
                "qrs": 78,
                "batteryLevel": 90,
                "deviceId": "4888888",
                "leadCount": 12,
                "longLead": [],
                "avF": [],
                "avR": [],
                "avL": [],
                "v6": [],
                "v5": [],
                "v4": [],
                "v3": [],
                "v2": [],
                "v1": [],
                "lead3": [],
                "lead2": [],
                "lead1": pythondatachart 
            });
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://35.244.48.66:8003/api",
                "method": "POST",
                "headers": {
                  "authorization": "Basic c2hpdmFtOnNoaXZh",
                  "content-type": "application/json",
                  "cache-control": "no-cache",
                  "postman-token": "fd344cb9-2a31-edd7-7a7d-822346cdad45"
                },
                "processData": false,
                "data": data
            }

            if(pythondatachart.length > 2500){

            pythondatachart.splice(0,2500);
            $.ajax(settings).done(function (response) {
                // console.log("aarha hun bhai");
                // console.log('response:',response);
                let po = response.lead1;
                po.map(item=>{
                lol.push(item);

                })
                var dataPointsArray = lol.splice(500,2400)
                // var dataPointsArray = lol;
                var chart = new CanvasJS.Chart("chartContainer",
        {   title:{
              text:"AGATSA Software Pvt. Ltd.",
              horizontalAlign: "center"
          },
          subtitles:[{
            text:"ECG Report",
            horizontalAlign: "left"
        },{
              text: `Patient Name: ${response.username}`,
              horizontalAlign: "left",
            }],
          axisY:{
              stripLines:yAxisStripLinesArray,
            gridThickness: 2,
            gridColor:"#DC74A5",
            lineColor:"#DC74A5",
            tickColor:"#DC74A5",
            labelFontColor:"#DC74A5",        
          },
          axisX:{
            stripLines:xAxisStripLinesArray,
            gridThickness: 2,
            gridColor:"#DC74A5",
            lineColor:"#DC74A5",
            tickColor:"#DC74A5",
            labelFontColor:"#DC74A5",
          },
          data: [
          {
            type: "spline",
            color:"black",
            dataPoints: dps
          }
          ]
        });
      
    addDataPointsAndStripLines();
    chart.render();
    
    
    

$("#exportButton").click(function(){

    var canvas = $("#chartContainer .canvasjs-chart-canvas").get(0);
    var dataURL = canvas.toDataURL();
    var pdf = new jsPDF();
    
    pdf.addImage(dataURL, 'JPEG', 15, 0, 180, 70);
    pdf.save("download.pdf");
});

    function addDataPointsAndStripLines(){
            //dataPoints
        for(var i=0; i<dataPointsArray.length;i++){
            dps.push({y: -dataPointsArray[i]});
        }
        //StripLines
        for(var i=0;i<3000;i=i+100){
          if(i%1000 != 0)
              yAxisStripLinesArray.push({value:i,thickness:0.7, color:"#DC74A5"});  
        }
        for(var i=0;i<3000;i=i+20){
          if(i%200 != 0)
              xAxisStripLinesArray.push({value:i,thickness:0.7, color:"#DC74A5"});  
        }
    }
            });
        }
        }
       
        if (chartdata.length > pointValue) {
            tamp = chartdata.splice(0, pointValue)
            //console.log(chartdata.length)
            count++
            // console.log(tamp)
            return tamp
        } else {
            return false
        }

    }
    var layout = {
        xaxis: {
            autotick: true,
            tick0: 0,
            autorange: true,
            
        },
        yaxis: {
            autotick: true,
            tick0: 0,
            range: [-20000, -40000],
            autorange: true
        }
    };
    Plotly.plot('myChart', [{ y: [0], type: 'line' }], layout);

    var cnt = 0;

    function step(timestamp) {
        // do something for every frame
        let lpo = getData()
        
        if (lpo != false) {
            Plotly.extendTraces('myChart', { y: [lpo] }, [0])
            cnt++;
            if (index > 600) {

                
                // code for chart 'sliding' here
                
                Plotly.relayout('myChart', {
                    xaxis: {
                        range: [index-600, index]
                    }
                });
            }
        }
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);

   
    // var uiddevice = '0000180f-0000-1000-8000-00805f9b34fb';//for device service
    var uiddevice = '00001510-0000-1000-8000-00805f9b34fc';//for device service ecg
    var uiecg = '0000ffb1-0000-1000-8000-00805f9b34fb';
    var uiecgchar = '0000ffb2-0000-1000-8000-00805f9b34fb';
    var uiecgchar1 = '0000ffc2-0000-1000-8000-00805f9b34fb';

    $("#btn").on('click', async (event) => {

        let deviceId = "0";
        function handler(event) {
            $('#console').html('running handler');
            let value = new Int8Array(event.target.value.buffer);
            // console.log(value);
            console.log(value.length)

                for (let i = 0; i < value.length - 2; i = i + 2) {
                    let ecg = ((value[i + 1] & 0xFF) << 8) + (value[i] & 0xFF);
                    // console.log(ecg)
                    ecg *= -1;
                    chartdata.push(ecg)
                    pythondatachart.push(ecg)
                    $('#values').html(ecg)
                }

                index += 10;
            
        }

        await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [uiecg, uiddevice]
        })
            .then(device => {
                
                deviceId = device.id; 
                $('#di').html(device.id);
                $('#console').html('connected');
                return device.gatt.connect();
            })
            .then(server => {
                
                server.getPrimaryService(uiecg)
                    .then(service => { 
                        service.getCharacteristic(uiecgchar)
                            .then(characteristic => {
                                console.log("characteristic",characteristic)
                                $('#console').html('Notification started');
                                characteristic.startNotifications();
                                // $('#console').html('In characteristic');
                                characteristic.addEventListener('characteristicvaluechanged', handler);
                                $('#console').html('Added event listener');
                                characteristic.readValue()
                                    .then(value => {
                                        $('#console').html('Got the first value');
                                       
                                        $('#values').html(value)
                                    })
                            })
                    })
            })
            .catch(error => { console.log(error.message); });
    })

})
