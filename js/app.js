var app = angular.module('flightApp',['720kb.datepicker','rzModule']);

app.controller('flightSearchCtrl', ['$scope', '$http','$filter', function($scope, $http,$filter) {
  
  var fs = this;
  
  /**
   * [Initialize variables]
   */
  fs.classActive = 'One Way';
  fs.fromCityList = false;
  fs.toCityList = false;
  fs.passenger = '0';
  fs.showDefaultMessage = true;
  fs.minDate = new Date().toDateString();
  var currentDate = new Date();
  fs.maxDate = new Date(currentDate.setDate(currentDate.getDate() + 7 )).toDateString();
  fs.flightOneWay = [];
  fs.flightTwoWay = [];
  var flightArr = [];
  var returnFlag;
  fs.templates = [
      {name:'oneWay',url:'/templates/oneway.html'},
      {name:'twoWay',url:'/templates/twoway.html'}
    ];  

  /**
   * [Function to set active class on One Way or Round trip tab]
   * @param  {[string]} item [Constant string for One Way or Two Way]
   */
  fs.activeRound = function(item) {
    fs.classActive = item;
  }
  
  /**
   * [Function to Fetch Data from JSon file]
   */
  fs.getData = function() {
    $http.get('../data/data.json').success(function(response) {
      fs.appData = response;
    });  
  }

  /**
   * [Function to select origin City from the drop down list ]
   * @param  {[string]} city [Name of the City]
   * @param  {[string]} code [IATA code of the City]
   */
  fs.selectFromCity = function(city,code) {
    fs.fromCity = city + ' ('+code+')';
    fs.code1 = code;
    fs.fromCityList = false;
  }

  /**
   * [Function to select Dest City from the drop down list]
   * @param  {[string]} city [Name of the City]
   * @param  {[string]} code [IATA code of the City]
   */
  fs.selectToCity = function(city,code) {
    fs.toCity = city + ' ('+code+')';
    fs.code2 = code;
    fs.toCityList = false;
  }

  /**
   * [Function to fetch the values of the submited form and check the condition for return date]
   */
  fs.formSubmit = function() {
    if(fs.fromCity && fs.toCity && fs.departDate) {
        fs.requestData = {
          from : extractCityCode(fs.fromCity),
          to: extractCityCode(fs.toCity),
          depart:fs.departDate,
          passengers:fs.passenger
        }
      if(fs.returnDate === undefined || fs.returnDate === null || fs.returnDate === "") {
        returnFlag = true;
        fs.showDefaultMessage = false;
        fs.showTemplate = fs.templates[0];
        fs.searchHead = {
          searchTitle : extractCityCode(fs.fromCity)+ " - "+extractCityCode(fs.toCity),
          depart : 'Depart - ' +fs.departDate
        }  
      }
      else {
        returnFlag = false;
        fs.showDefaultMessage = false;
        fs.showTemplate = fs.templates[1];
        fs.requestData.return = fs.returnDate;
        fs.searchHead = {
          searchTitle : extractCityCode(fs.fromCity)+ " - "+extractCityCode(fs.toCity)+" - "+extractCityCode(fs.fromCity),
          depart : 'Depart - ' +fs.departDate,
          return : 'Return - ' +fs.returnDate
        } 
      }
      /**
       * Call function to search flight based on the user inputs
       */
      searchFlights(fs.requestData,fs.appData.flights);
    }
    else {
      alert('Some fields are empty. Please enter valid data.');
    }    
  }


  
  /**
   * [Function for searching flights]
   * @param  {[object]} reqData [This param is the user input request data]
   * @param  {[Json]} [This param is the complete JSON flight data object]
   */
    function searchFlights(reqData, flightJson) {
    var flightOneWay = [];
    var flightTwoWay = [];
    for(var i = 0; i < flightJson.length; i++) {
       if(reqData.from === flightJson[i].flight_run_to.origin && reqData.to === flightJson[i].flight_run_to.Dest) {
          flightOneWay.push(flightJson[i]);
          var filtered = $filter('orderBy')(flightOneWay,'flight_run_to.Price');
          fs.flightOneWay = filtered;
       }
       if(!(returnFlag)) {
          if(reqData.from === flightJson[i].flight_run_to.origin && reqData.to === flightJson[i].flight_run_to.Dest && reqData.from === flightJson[i].flight_run_from.Dest &&  reqData.to === flightJson[i].flight_run_from.origin) {
           flightTwoWay.push(flightJson[i]); 
            var filtered = $filter('orderBy')(flightTwoWay,'flight_run_to.Price + flight_run_to.Price | number');
            fs.flightTwoWay = filtered;
          }
       }
    }
  }

  /**
   * [Function to extract the city code from the user selected input from city list]
   * @param  {[string]} citycode [user selected input from the city list]
   * @return {[string]}          [return the extracted code from the city code]
   */
  function extractCityCode(citycode) {
    var str = (citycode.split(" ")).pop();
    return str.substring(str.lastIndexOf("(")+1,str.lastIndexOf(")"));
  }

  /* Price range filter */
  fs.slider = {
  minValue: 1,
  maxValue: 2,
  options: {
    floor: 1,
    ceil: 10,
    step: 1,
    showTicks: true,
    onEnd:function() {
      if(!(fs.showDefaultMessage)) {
        sliderFliter(fs.slider.minValue,fs.slider.maxValue);  
      }
      else {
        alert('Nothing present to apply filter. Please search for flight...!')
      }
    }
  }
};

  /**
   * [Reset the search form and search results]
   */
  fs.formReset = function() {
    fs.fromCity = '';
    fs.toCity = '';
    fs.departDate = '';
    fs.passenger = '';
    fs.returnDate = '';
    fs.showTemplate = '';
    fs.showDefaultMessage = true;
  }
  
/**
 * [rangeFilter - function is called whenever you change the slider value]
 * @param  {min value of slider}
 * @param  {max value of slider}
 * @return {[type]} [description]
 */
  var flag1 = true;
  var flag2 = true;
  function sliderFliter(min,max) {  
    if(returnFlag) {
       if(flag1) {
          flightArr = angular.copy(fs.flightOneWay);
          flag1 = false;
        }
        fs.flightOneWay.splice(0,fs.flightOneWay.length)
        for(var i = 0; i < flightArr.length; i++) {
          if((min*1000) <= parseInt(flightArr[i].flight_run_to.Price) &&  parseInt(flightArr[i].flight_run_to.Price)<= (max*1000)) {
            fs.flightOneWay.push(flightArr[i]);
          }
        } 
    }
    else {
        if(flag2) {
          flightArr = angular.copy(fs.flightTwoWay);
          flag2 = false;
        }
        fs.flightTwoWay.splice(0,fs.flightTwoWay.length)
        for(var i = 0; i < flightArr.length; i++) {
          var totalprice = parseInt(flightArr[i].flight_run_to.Price) + parseInt(flightArr[i].flight_run_from.Price) 
          if((min*1000) <= totalprice &&  totalprice <= (max*1000)) {
            fs.flightTwoWay.push(flightArr[i]);
          }
        }
    }

  }

  /**
   * [Function to book the flight]
   * @return {[alert]} [Booking flight confirmation alert]
   */
  fs.booking = function() {
    alert('Your flight is confirmed. Thanking you booking..!!!');
    fs.formReset();
  }

  fs.getData();  /* function call to fetch data */

}]);
