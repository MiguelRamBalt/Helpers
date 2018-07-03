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
            scope.chartsList  =  scope.chartsList  ||  [];

            scope.highlightSparkLineSpace  =  function(  obj,  indexChart,  idElement,  i,  j,  opacity,  color)  {
              var   lastCicrle  =  "#circle-" + (i - 1) + "-" + j,  
                    nextCircle  = "#circle-" + (  i + 1) + "-" + j;

              if  (  obj.chartsList[  indexChart].querySelector(  lastCicrle) == null  ||
                     obj.chartsList[  indexChart].querySelector(  nextCircle) == null )  {
                if (  opacity  == 1)
                  obj.chartsList[  indexChart].querySelector(  "#"  +  idElement).style.fill  =  highlightColor;
                else
                  obj.chartsList[  indexChart].querySelector(  "#"  +  idElement).style.fill  =  color;

              }  else  {
                obj.chartsList[  indexChart].querySelector(  "#"  +  idElement).style.opacity  =  opacity;
                obj.chartsList[  indexChart].querySelector(  "#"  +  idElement).style.fill  =  highlightColor;
              };
            };

            scope.highlightCircle  =  function(  obj,  indexChart,  idCircle,  color)  {
              obj.chartsList[  indexChart].querySelector(  "#"  +  idCircle).style.fill  =  color;
            };

            scope.highlightLine  =  function(  obj,  indexChart,  idLine,  i,  y, color)  {
              var  startCicrle  =  "#circle-" + i + "-" + y,  endCircle  = "#circle-" + (  i + 1) + "-" + y;
              obj.chartsList[  indexChart].querySelector(  "#"  +  idLine).style.stroke  =  color;
              obj.chartsList[  indexChart].querySelector(  startCicrle).style.fill  =  color;
              obj.chartsList[  indexChart].querySelector(  endCircle).style.fill  =  color;

              if  (obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity == 1  &&  obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity == 1)  {
                if (  i  == 0)  {
                  obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity  =  1;
                  obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity  =  0;
                }  else  {
                  obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity  =  0;
                  obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity  =  0;
                  if (  obj.chartsList[  indexChart].querySelector(  "#circle-" + (  i + 2) + "-" + y)  == null) {
                    obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity  =  0;
                    obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity  =  1;
                  }  else  {
                    obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity  =  0;
                    obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity  =  0;
                  }
                }
              }  else  {
                obj.chartsList[  indexChart].querySelector(  startCicrle).style.opacity  =  1;
                obj.chartsList[  indexChart].querySelector(  endCircle).style.opacity  =  1;
              }
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
                stroke  = (attributes.stroke)  ?  attributes.stroke  :  1,
                strokeLine  = (attributes.strokeline)  ?  attributes.strokeline  :  stroke,
                colorCode  = (attributes.color)  ?  attributes.color  :  "#000000",
                colorCodeLine  = (attributes.colorline)  ?  attributes.colorline  :  colorCode,
                slidesY  =  (attributes.slides) ?  attributes.slides : 10,
                highlightColor  =  (attributes.colorover) ? attributes.colorover : "#ff0000",
                fontSize  = (attributes.fontsize) ? attributes.fontsize :  "2.5px",
                fontFamily  = (attributes.fontfamily) ? attributes.fontfamily :  "sans-serif",
                fontColor  = (attributes.fontcolor) ? attributes.fontcolor :  "#3498DB";

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
              var  tamanoDivision  = (  100  -  (  padding * 2)) / (  total);
              var  puntoDeUbicacion  =  tamanoDivision * (i);
              var  margenInicio_final  =  padding;

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
              currentElement.containerSVG  =  currentElement[  0].children[  0];
              currentElement.html("").append(  $compile(  content)(  scope));
              scope.chartsList.push(  currentElement[  0].children[  0]);
            };


            function  renderPoints( myData,  myColorCircle,  myColorLine,  mySeriesCounter)  {
              myData  =  myData  || data,
              myColorCircle  =  myColorCircle  ||  colorCode,
              myColorLine  =  myColorLine  ||  colorCodeLine,
              mySeriesCounter  =  mySeriesCounter  ||  1;

              var  processedData = getDataObject(  myData), currentPositionX  = 0, nextPositionX  = 0,  currentPositionY  = 0, nextPositionY  = 0;
              var  styleHide  = "", idCircle = "", idLine = "";
              var  widthRect  = (  (  100  -  (  padding)) / (  processedData.length));
              var  highlightSLCallOver  =  "";
              var  lineLeave = "",  lineOver  =  "",  circleLeave = "",  circleOver  =  "";
              var  highlightSLCallLeave  =  "";
              var  pointTitle  =  "",  pointTitleXpos = 0, pointTitleYpos = 0;

              content  =  "";
              for(  x in processedData)  {
                idCircle  =  "circle-" + x + "-" +  mySeriesCounter;
                idCirclePlus  =  "circle-" + ( parseInt( x) + 1) + "-" +  mySeriesCounter;
                idLine  =  "line-" + x + "-" +  mySeriesCounter;
                styleHide =  (  x  >= 1  &&  x <= processedData.length - 2)  ? "opacity:  0;" : "";

                currentPositionX  =  getXPosition(  parseInt(x),  processedData.length);
                currentPositionY  =  getYPosition(  getYPosition100(processedData[  x].value));
                
                highlightSLCallOver  =  "highlightSparkLineSpace(  this,    " + scope.chartsList.length + ",  \"" + (processedData.length - 1 == x ? idCircle : idCirclePlus) + "\"," + (parseInt(  x) + 1)+ "," + mySeriesCounter + ", 1);";
                highlightSLCallLeave  =  "highlightSparkLineSpace(  this,    " + scope.chartsList.length + ",  \"" + (processedData.length - 1 == x ? idCircle : idCirclePlus) + "\"," + (parseInt(  x) + 1)+ "," + mySeriesCounter + ",  0, \""  +  myColorCircle  +  "\");";
                //  LineLeave  highlightLine(  this,  " + scope.chartsList.length + ",  \"" + idLine + "\" , " + x + ", " + mySeriesCounter + ", \""  +  myColorLine  +  "\");
                //  LineOver  highlightLine(  this,  " + scope.chartsList.length + "-,  \"" + idLine + "\", " + x + ", " + mySeriesCounter + ", \""  +  highlightColor  +  "\");

                /*
                circleLeave  =  "highlightCircle(  this,  " + scope.chartsList.length + ",  \"" + idCircle + "\" , \""  +  myColorCircle  +  "\");";
                circleOver  =  "highlightCircle(  this,  " + scope.chartsList.length + ",  \"" + idCircle + "\", \""  +  highlightColor  +  "\");";
                */
                if (  mySeriesCounter == 1)
                  content  =  content + "<rect x='" + currentPositionX + "' y='0' width='" + widthRect + "' height='" + canvasHeight +"' style='opacity: 0;' ng-mouseleave='" + highlightSLCallLeave + "' ng-mouseover='" + highlightSLCallOver + "' />";

                if (  parseInt(  x)  <  processedData.length - 1) {
                  nextPositionX  =  getXPosition(  (  parseInt(  x))  +  1,  processedData.length);
                  nextPositionY  =  getYPosition(  getYPosition100(processedData[  parseInt(  x) + 1].value));
                  content  = content  +  "<line  id='" + idLine + "' ng-mouseleave='" + highlightSLCallLeave + "' ng-mouseover='" + highlightSLCallOver + "' x1='" + currentPositionX + "' y1='" + currentPositionY + "' x2='" + nextPositionX + "' y2='" + nextPositionY + "' style='z-index: 0;stroke: " + myColorLine + ";stroke-width:" + strokeLine + ";  cursor:  pointer;' />"
                };

                highlightSLCallOver  =  "highlightSparkLineSpace(  this,    " + scope.chartsList.length + ",  \"" + idCircle + "\"," + x + "," + mySeriesCounter + ", 1);";
                highlightSLCallLeave  =  "highlightSparkLineSpace(  this,    " + scope.chartsList.length + ",  \"" + idCircle + "\"," + x + "," + mySeriesCounter + ",  0, \""  +  myColorCircle  +  "\");";

                content  =  content  +  "<circle  id='" + idCircle + "' ng-mouseleave=' " + highlightSLCallLeave + "' ng-mouseover='" + highlightSLCallOver + "' style='cursor: pointer;z-index: 10;" + styleHide + "' cx='" + currentPositionX + "' cy='" + currentPositionY + "' r='" + stroke + "'  fill='" + myColorCircle + "' />";

                pointTitleXpos  =  ( x == processedData.length - 1) ? (currentPositionX - (((100 - (padding * 2)) / 100) * String(processedData[x].value).length * 0.45))  :  (currentPositionX - (((100 - (padding * 2)) / 100) * String(processedData[x].value).length));
                pointTitleYpos  =  currentPositionY  -  (canvasHeight / 100  *  (6))
                pointTitle  =  (  x  >= 1  &&  x <= processedData.length - 2) ? "" : "<text style=\" font: bold " + fontSize + " " + fontFamily + ";fill: " + fontColor + "; \" x=\"" + pointTitleXpos + "\" y=\"" + pointTitleYpos + "\" >" +  processedData[  x].value  + "</text>";
                content  =  content  +  pointTitle;
              };

              return content;
            };

            function  lineChart()  {
              createSVG(  renderPoints);            
            };

            function  barChart()  {

            };

           function  callMultiline()  {
              var lines,  counter  = 0;

              for(  x  in  data)  {
                counter++;
                colorCode  =  '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
                lines  +=  renderPoints(  data[ x],  colorCode,  colorCode,  counter);
              };

              return lines;
            };

            function  multilineChart()  {
              createSVG(  callMultiline);
            };

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