  'use strict';

  (function() {
    //angular module
    var myApp = angular.module("myApp", ["angularTreeview"]);

    //test controller
    myApp.controller("myController", function($scope) {
      //test tree model 1
      $scope.roleList1 = [
        {
          roleName: "Windows",
          roleId: "role1",
          children: [
            { roleName: "Windows 10", roleId: "role11", children: [] },
            { roleName: "Windows 8.1", roleId: "role11", children: [] },
            {
              roleName: "Windows Server",
              roleId: "role12",
              children: [
                {
                  roleName: "Windows Server 2012",
                  roleId: "role121",
                  children: [
                    {
                      roleName: "Windows Server 2012 R2",
                      roleId: "role1211",
                      children: []
                    }
                  ]
                },
                { roleName: "Windows Server 2016", roleId: "role1212", children: [] }
              ]
            }
          ]
        },

        { roleName: "Linux", roleId: "role2", children: [] },

        { roleName: "Macintosh", roleId: "role3", children: [] }
      ];

      //test tree model 2
      $scope.roleList2 = [
        { roleName: "Macintosh", roleId: "role3", children: [] }
      ];
    });
  })();

  (function(f) {
    f.module("angularTreeview", []).directive("treeModel", function($compile) {
      return {
        restrict: "EA",
        scope: {
          item:  '=tree',
          item_catcher:  '=treecatcher',
          item_binding:  '=treebinding'
        },
        link: function( scope, element, attributes) {
          var a = attributes.treeId,
            action = (  attributes.treeChildrensAction == "add") ? "addOs(node)" : (  attributes.treeChildrensAction == 'remove'  ?  "removeOs(node)" : "addOs(node)"),
            actInd =  'data-tree-childrens-action="' + ( attributes.treeChildrensAction  ?  (  attributes.treeChildrensAction) :  'add') + '"',
            g = attributes.tree,
            e = attributes.nodeLabel || "label",
            d = attributes.nodeChildren || "children",
            merge = false;

          var getNoReferencedChildrenCopy = function(  element)  {
            var newElement  = new Object();
            newElement[  attributes.nodeLabel]  =  element[  attributes.nodeLabel];
            newElement[  attributes.nodeId]  =  element[  attributes.nodeId];
            newElement[  attributes.nodeChildren]  = new  Object();
            if (  element[  attributes.nodeChildren]  &&  (element[  attributes.nodeChildren].length  > 0  ||  scope.auxObjectLength(  element[  attributes.nodeChildren])  >  0)) {
              for  (var  j  in  element[  attributes.nodeChildren])  {
                newElement[  attributes.nodeChildren][  j]  =  new  Object();
                if (  element[  attributes.nodeChildren][  j].length  > 0  ||  scope.auxObjectLength(  element[  attributes.nodeChildren][  j])  >  0) {
                  newElement[  attributes.nodeChildren][  j]  =  angular.copy(  getNoReferencedChildrenCopy(  element[  attributes.nodeChildren][  j]));
                  newElement[  'isFolder']  =  true;
                }  else  {
                  newElement[  attributes.nodeChildren][  j][  attributes.nodeLabel]  =  element[  attributes.nodeChildren][  j][  attributes.nodeLabel];
                  newElement[  attributes.nodeChildren][  j][  attributes.nodeId]  =  element[  attributes.nodeChildren][  j][  attributes.nodeId];
                  newElement[  attributes.nodeChildren][  j][  attributes.nodeChildren]  =  [];
                }
              }
            }  else  {
              newElement[  attributes.nodeLabel]  =  element[  attributes.nodeLabel];
              newElement[  attributes.nodeId]  =  element[  attributes.nodeId];
              newElement[  attributes.nodeChildren]  =  [];
            }

            return newElement;
          };

          var getCompleteElement  =  function(  myElement,  currentList, flag) {
            currentList  =  currentList  ||  angular.copy( scope.item),
            flag  =  flag  ||  false;
            var  finalElement   =  false;
            var  newChildren  =  new  Object();
            var  newCatch  =  new  Object();

            for (  var  i in  currentList)  {
              if (  (  currentList[  i] !==  undefined) &&  (  scope.auxObjectLength(  myElement)  &&  myElement  !==  undefined)) {
                if (  myElement[  attributes.nodeLabel]  ==  currentList[  i][  attributes.nodeLabel])  {
                  finalElement  =  new Object();
                  if (  flag) {
                    finalElement  =  currentList;
                    delete  finalElement[  i];
                  }  else  {
                    finalElement[  i]  =  new Object();
                    finalElement[  i]  =  getNoReferencedChildrenCopy(  myElement);
                    if (  scope.auxObjectLength(  finalElement[  i][ attributes.nodeChildren]) > 0)
                      finalElement[  i][  'isFolder']  =  true;
                    newCatch  =  getCompleteElement(  myElement,  scope.item_catcher,  true);
                    scope.item_catcher  =  newCatch  ?  angular.merge(  scope.item_catcher,  newCatch)  :  scope.item_catcher;
                  }
                  return finalElement;
                }  else  {
                  if  (  currentList[  i][  attributes.nodeChildren]  &&  currentList[  i][  attributes.nodeChildren].length  >  0)  {
                    finalElement  =  new  Object();
                    if  (  flag)
                      finalElement[  i]  =  currentList[  i];
                    else
                      finalElement[  i]  =  new  Object();

                    newChildren  =  getCompleteElement( myElement,  currentList[  i][  attributes.nodeChildren],  flag);
                    if (  newChildren) {
                      finalElement[  i]  =  new  Object();
                      finalElement[  i]  =  currentList[  i];

                      finalElement[  i][  attributes.nodeChildren]  =  angular.copy(  scope.auxObjectLength(  newChildren)  ?  newChildren : {});
                      finalElement[  i][  'isFolder']  =  true;
                    } else {
                      delete  finalElement[  i];
                    };
                  } else {
                      delete  finalElement[  i];
                  };
                };
              }  else  {
                  finalElement  =  {};
                };
            };

            return  finalElement;
          };

          scope.auxObjectLength = function( obj)  {
            if (  obj  === undefined)
              return  0;

            return  Object.keys(obj).length;
          };

          scope.addOs = function(element) {
            if (  merge === false)
              reOrderCatch(  scope.item_catcher);

            var  nElement  =  getCompleteElement(  angular.copy(  element));
            scope.item_catcher  =  angular.merge(  scope.item_catcher,  nElement);
          };

          scope.removeOs  =  function(  element)  {
           // Clousure to use Analize the receiver tree container.
            var getRemovedList  =  function(  myElement,  currentList) {
                currentList  =  currentList  ||  angular.copy(  scope.item_binding);
        
                var finalElement   =  {};
                for (var  i in  currentList)  {
                  var j  =  angular.copy(  i);
                  if( currentList[ i]) {
                    if (  myElement[  attributes.nodeLabel]  ==  currentList[  i][  attributes.nodeLabel])  {
                        finalElement  =  angular.copy( currentList);
                        delete finalElement[  i];
                        break;
                    }  else  {
                        if (  currentList[  j][  attributes.nodeChildren].length  >  0 || scope.auxObjectLength(currentList[  j][  attributes.nodeChildren]) > 0)  {
                          finalElement =  currentList;
                          finalElement[  j]  =   currentList[  j];
                          finalElement[  j][  attributes.nodeChildren]  =  getRemovedList(  myElement,  currentList[  j][  attributes.nodeChildren]);
                          if (   scope.auxObjectLength(  finalElement[  j][  attributes.nodeChildren]) == 0  && finalElement[ j].isFolder)
                            delete  finalElement[  j];
                        };
                    };
                  };
                };
                return  finalElement;
            };
            console.log(  angular.copy(  scope.item_binding));
            scope.item_binding =  getRemovedList(  element);
            console.log(  angular.copy(  scope.item_binding));
          };

          var  reOrderCatch  =  function  (  myList)  {
            myList  =  myList ||  scope.item_catcher;

            var  bCatch  =  angular.copy(  myList);

            for(  var  z  in  bCatch)  {
              if (  scope.auxObjectLength(  bCatch[  z])) {
                if  (  scope.auxObjectLength(  bCatch[  z][  attributes.nodeChildren])  ||  bCatch[  z][  attributes.nodeChildren].length > 0)  {
                  reOrderCatch(  angular.copy(  myList[  z][  attributes.nodeChildren]));
                }  else  {
                  var  cleanCath  =  scope.item_catcher;
                  var  eE  =  getCompleteElement(  angular.copy(  bCatch[  z]));
                  if (  z  >  0  ||  merge)  {
                    scope.item_catcher  =  angular.merge(  cleanCath, scope.item_catcher,  eE);
                  } else {
                    merge = true;
                    scope.item_catcher  =  angular.extend(  cleanCath,  scope.item_catcher,  eE);
                  }
                };
              };
            };
          };
          //var init =  function() {
            var  e =
                '<ul>' + 
                  '<li data-ng-repeat="node in item_binding track by $index">' + 
                    '<i class="collapsed" data-ng-show="(  (auxObjectLength(node.' + d +') > 0  && node.isFolder) || node.' + d + '.length) && node.collapsed" ' + 
                        ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '">' + '</i>' +
                    '<i class="expanded" data-ng-show="((  auxObjectLength(node.' + d +') > 0  && node.isFolder) || node.' + d + '.length)  && !node.collapsed" ' + ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '"></i>' + 
                    '<i class="normal" data-ng-hide="(node.isFolder ||  node === empty  || node.' + d + '.length  || auxObjectLength(node.' + d +') != 0)" ng-dblclick="'  + action + '"></i>' +
                    '<span data-ng-hide="(  node.isFolder && auxObjectLength(  node.' + d +') == 0)" data-ng-class="node.selected" data-ng-c2lick="' + a + '.selectNodeLabel(node)"  ng-dblclick="'  + action + '"> ' + 
                      '{{node.' + e +'}}' + 
                    '</span>' +
                    '<div tree-model data-ng-hide="(node.collapsed || node.' + d +' === empty)" data-tree-id="' + a + '" tree="item"  treecatcher="item_catcher" treebinding="node.'+ d +'" ' + actInd +
                        ' data-node-id=' + (attributes.nodeId || "id") + ' data-node-label=' + e + ' data-node-children=' + d + '>' +
                    '</div>' + 
                  '</li>' + 
                '</ul>';
            a &&
              g &&
              (attributes.angularTreeview &&
                ((scope[a] = scope[a] || {}),
                (scope[a].selectNodeHead =
                  scope[a].selectNodeHead ||
                  function(a) {
                    a.collapsed = !a.collapsed;
                  }),
                (scope[a].selectNodeLabel =
                  scope[a].selectNodeLabel ||
                  function(c) {
                    scope[a].currentNode &&
                      scope[a].currentNode.selected &&
                      (scope[a].currentNode.selected = void 0);
                    attributes.selected = "selected";
                    scope[a].currentNode = c;
                  })),
              element.html("").append($compile(e)(scope)));
         //};
          //init();
        }
      };
    });
  })(angular);
