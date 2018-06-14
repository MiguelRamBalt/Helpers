(function() {
  //angular module
  var myApp = angular.module("myApp", [  'chartView']);

  //test controller
  myApp.controller("myController", [  '$scope',  function($scope) {
      $scope.myPoints  =  [
        [
          {
            value: 210,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 80,
            label: 'r'
          },
          {
            value: 210,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          }
        ],
        [
          {
            value: 152,
            label: 'r'
          },
          {
            value: 80,
            label: 'r'
          },
          {
            value: 210,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 152,
            label: 'r'
          },
          {
            value: 80,
            label: 'r'
          }
        ]
      ];
      $scope.myPointsTwo  =  [
        {
          value: 210,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 80,
          label: 'r'
        },
        {
          value: 210,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 80,
          label: 'r'
        },
        {
          value: 210,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 152,
          label: 'r'
        },
        {
          value: 80,
          label: 'r'
        }
      ];
    }]);
})();

(  function()  {
  angular.module(  "chartView", []).directive(  "chart",  function(  $compile)  {
    return  {
      restrict:  "A",
      link:  function(  scope,  element,  attributes)  {
        scope.highlight  =  function(  obj)  {
          console.log( obj);
        };

        var content  =  "",  minWidth  =  "150", minHeight  =  "50",  realWidth  = element[  0].clientWidth,  realHeight  = element[  0].clientHeight,
            data  =  (attributes.data)  ?  JSON.parse(attributes.data)  :  {},
            indexYvalues = (  attributes.indexY)  ?  attributes.indexY : "value",
            indexXvalues = (  attributes.indexX)  ?  attributes.indexX : "label", 
            padding =  5,
            setAxisX  =  (attributes.setAxisX) ?  attributes.setAxisX  :  false,
            setAxisY  =  (attributes.setAxisY) ?  attributes.setAxisY  :  false,
            myWidth  =  (attributes.width) ? (  (  parseInt(  attributes.width)  >  parseInt(  minWidth)  &&  parseInt(  realWidth) > parseInt(  minWidth)) ? attributes.width : minWidth)  : minWidth,
            myHeight  =  (attributes.height) ? (  (  parseInt(  attributes.height)  >  parseInt(  minHeight)) ? attributes.height : minHeight)  : minHeight,
            canvasWidth  =  100,
            canvasHeight  =  (  100  /  myWidth  *  (myHeight)),
            max  = (attributes.maxy)  ?  attributes.maxy  :  0,
            stroke  = (attributes.stroke)  ?  attributes.stroke  :  1;
            colorCode  = (attributes.color)  ?  attributes.color  :  "#000000",
            slidesY  =  (attributes.slides) ?  attributes.slides : 10,
            highlightColor  =  (attributes.colorOver) ? attributes.colorOver : colorCode;

        var currentElement  =  element;

        function  setConainerStyle()  {
          element.css({
            width:  myWidth + "px",
            height:  myHeight + "px"
          });

          realWidth  =  element[  0].clientWidth;
          realHeight  =  element[  0].clientHeight;
        };

        function  setAxisX()  {
          content  =  "";
        }


        function  getYPosition100(  y)  {
          return  100 - (  (  y / max)  * (  ( 100 - padding * 2))) - padding;
        }

        function  getYPosition(  y)  {
          return  (  canvasHeight / 100  *  (y));
        }

        function  getXPosition(  i,  total)  {
          var  tamanoDivision  = (  100  -  (  padding)) / (  total);
          var  puntoDeUbicacion  =  tamanoDivision * (i);
          var  margenInicio_final  =  padding;
          puntoDeUbicacion =  puntoDeUbicacion +  (  tamanoDivision / ( total  == 1 ? 2 : total));

          return  puntoDeUbicacion + margenInicio_final;
        }

        function  roundY( maxY)  {
          var num  =  "1";

          for (  var  i  =  1;  i  <  String( maxY).length;  i++)
            num += "0";

          return  (  Math.round(  (  max / parseInt(  num))  +  .5)  *  parseInt(  num));
        }

        function  getDataObject(  myData)  {
          var  myIndexX, myIndexY  =  indexYvalues,  finalData  =  [], myValue;
          for(var  x = 0;  x < myData.length; x++)  {
            if ( myData[  x][  myIndexY]) {
              if ( (  myData[  x][  myIndexY] > max)  &&  !attributes.maxY)
                max  =  myData[  x][  myIndexY];

              myValue = myData[  x][  myIndexY];
              myIndexX = (attributes.indexX)  ?  attributes.indexX  : (myData[  x].label)  ?  "label" : x;
              finalData.push(  {  'label': myIndexX,  'value': myValue});
            }
          };

          if (  !attributes.maxy)          
            max  =  roundY(  max);

          return  finalData;
        };

        function  createSVG(  callback)  {
          content = "<svg viewBox='0 0 " + canvasWidth +" " + canvasHeight + "'>" + callback() + "</svg>";
          currentElement.html("").append(  $compile(  content)(  scope));
        };


        function  renderPoints( myData)  {
          myData  =  myData  || data;

          var  processedData = getDataObject(  myData), currentPositionX  = 0, nextPositionX  = 0,  currentPositionY  = 0, nextPositionY  = 0;
          var  styleHide  = "";
          content  =  "";
          for(  x in processedData)  {


            styleHide =  (  x  >= 1  &&  x <= processedData.length - 2)  ? "opacity: 0;" : "";

            currentPositionX  =  getXPosition(  (  parseInt(x)),  processedData.length);
            currentPositionY  =  getYPosition(  getYPosition100(processedData[  x].value));
            content  = content  +  "<circle ng-mouseover='highlight(this);' style='" + styleHide + "' ng-click='highlight(this);' cx='" + currentPositionX + "' cy='" + currentPositionY + "' r='" + stroke + "'  fill='" + colorCode + "' />";

            if (  parseInt(  x)  <  processedData.length - 1) {
              nextPositionX  =  getXPosition(  (  parseInt(  x))  +  1,  processedData.length);
              nextPositionY  =  getYPosition(  getYPosition100(processedData[  parseInt(  x) + 1].value));
              content  = content  +  "<line x1='" + currentPositionX + "' y1='" + currentPositionY + "' x2='" + nextPositionX + "' y2='" + nextPositionY + "' style='stroke: " + colorCode + ";stroke-width:" + stroke + "' />"
            }
          };

          return content;
        };

        function  lineChart()  {
          createSVG(  renderPoints);
          
        };

        function  barChart()  {

        };

       function  callMultiline()  {
          var lines;

          for(  x  in  data)  {
            colorCode  =  '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
            lines  +=  renderPoints(  data[ x]);
          };

          return lines;
        };

        function  multilineChart()  {
          createSVG(  callMultiline);

        }

        function  constructChart()  {
          switch(  attributes.type)  {
            case  "line":
              lineChart();
            break;
            case  "bar":
              barChat();
            break;
            case  "multiline":
              multilineChart();
            break;
            default:
              lineChart();
          }
        };

        function  setContent() {
          constructChart();
        };

        setConainerStyle();
        setContent();
      }
    }
  });
})(  angular);
