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
      {
        roleName: "Windows",
        roleId: "role1",
        children: [
          {
            roleName: "Windows Server",
            roleId: "role12",
            children: [
              { roleName: "Windows Server 2016", roleId: "role1212", children: [] }
            ]
          }
        ]
      },
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
      link: function( scope, h, c) {
        scope.sorted  =  false;

        var a = c.treeId,
          action = (  c.treeChildrensAction == "add") ? "addOs(node)" : (  c.treeChildrensAction == 'remove'  ?  "removeOs(node)" : "addOs(node)"),
          actInd =  'data-tree-childrens-action="' + ( c.treeChildrensAction  ?  (  c.treeChildrensAction) :  'add') + '"',
          g = c.tree,
          e = c.nodeLabel || "label",
          d = c.nodeChildren || "children";

        var getNoReferencedChildrenCopy = function(  element)  {
          var newElement  = new Object();
          newElement[  c.nodeLabel]  =  element[  c.nodeLabel];
          newElement[  c.nodeId]  =  element[  c.nodeId];
          newElement[  c.nodeChildren]  = new  Object();
          if (  element[  c.nodeChildren]  &&  (element[  c.nodeChildren].length  > 0  ||  scope.auxObjectLength(  element[  c.nodeChildren])  >  0)) {  
            for  (var  j  in  element[  c.nodeChildren])  {
              newElement[  c.nodeChildren][  j]  =  new  Object();
              if (  element[  c.nodeChildren][  j].length  > 0  ||  scope.auxObjectLength(  element[  c.nodeChildren][  j])  >  0) {
                newElement[  c.nodeChildren][  j]  =  angular.copy(  getNoReferencedChildrenCopy(  element[  c.nodeChildren][  j]));
              }  else  {
                newElement[  c.nodeChildren][  j][  c.nodeLabel]  =  element[  c.nodeChildren][  j][  c.nodeLabel];
                newElement[  c.nodeChildren][  j][  c.nodeId]  =  element[  c.nodeChildren][  j][  c.nodeId];
                newElement[  c.nodeChildren][  j][  c.nodeChildren]  =  [];
              }
            }
          }  else  {
            newElement[  c.nodeLabel]  =  element[  c.nodeLabel];
            newElement[  c.nodeId]  =  element[  c.nodeId];
            newElement[  c.nodeChildren]  =  [];
          }

          return newElement;
        };

        var getCompleteElement  =  function(  myElement,  currentList, flag) {
          currentList  =  currentList  ||  angular.copy( scope.item),
          flag  =  flag  ||  false;
          var finalElement   =  false;

          for (  var  i in  currentList)  {
            if (  (  currentList[  i] !==  undefined) &&  (  scope.auxObjectLength(  myElement)  &&  myElement  !==  undefined)) {
              if (  myElement[  c.nodeLabel]  ==  currentList[  i][  c.nodeLabel])  {
                finalElement  =  new Object();
                if (  flag  &&  scope.sorted  === false) {
                  finalElement  =  currentList;
                  delete  finalElement[  i];

                }  else  {
                  finalElement[  i]  =  new Object();
                  finalElement[  i]  =  getNoReferencedChildrenCopy(  myElement);
                  if  (  scope.sorted  === false)  {
                    var newCatch  =  new  Object();
                    newCatch  =  getCompleteElement(  myElement,  scope.item_catcher,  true);
                    scope.item_catcher  =  newCatch  ?  newCatch  :  scope.item_catcher;
                  }
                }

                return finalElement;
              }  else  {
                if  (  currentList[  i][  c.nodeChildren].length  >  0)  {
                  if  (  flag)
                    finalElement  =  currentList;
                  else
                    finalElement  =  new  Object();

                  var  newChildren  =  new  Object();
                  newChildren  =  getCompleteElement( myElement,  currentList[  i][  c.nodeChildren],  flag);
                  if (  newChildren) {
                    finalElement[  i]  =  currentList[  i];
                    finalElement[  i][  c.nodeChildren]  =  angular.copy(  newChildren);
                  }  else  {
                    if  (  scope.sorted  === false)  {
                      delete  finalElement[ i];
                    };
                  };
                };
              }
            };
          };

          return  finalElement;
        };

        scope.auxObjectLength = function( obj)  {
          if (  obj  === undefined)
            return  false;

          return  Object.keys(obj).length;
        };

        scope.addOs = function(element) {
          if (  scope.auxObjectLength(  scope.item_catcher)  > 0  &&  scope.sorted === false)  {
            reOrderCatch(  angular.copy(  scope.item_catcher));
            scope.sorted  =  true;
          };
          var  nElement  =  getCompleteElement(  angular.copy(  element));
          scope.item_catcher  =  angular.merge(  scope.item_catcher,  nElement);
        };

        var  reOrderCatch  =  function  (  myList)  {
          myList  =  myList ||  scope.item_catcher;

          var  bCatch  =  myList;

          for(  var  z  in  bCatch)  {
            if (  scope.auxObjectLength(  bCatch[  z])) {
              if  (  scope.auxObjectLength(  bCatch[  z][  c.nodeChildren])  ||  bCatch[  z][  c.nodeChildren].length > 0)  {
                reOrderCatch(  angular.copy(  myList[  z][  c.nodeChildren]));
              }  else  {
                var  eE  =  getCompleteElement(  angular.copy(  bCatch[  z]));
                var  cleanCath  =  scope.item_catcher;
                scope.item_catcher  =  angular.merge(  cleanCath,  eE);
              };
            };
          };
        }

        var  e =
            '<ul>' + 
              '<li data-ng-repeat="node in item_binding track by $index">' + 
                '<i class="collapsed" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length) && node.collapsed" ' + 
                    ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '">' + '</i>' + 
                '<i class="expanded" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length)  && !node.collapsed" ' +
                    ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '"></i>' + 
                '<i class="normal" data-ng-hide="( node === empty || node.' + d + '.length  || auxObjectLength(node.' + d +') != 0)" ng-dblclick="'  + action + '"></i>' +
                '<span data-ng-class="node.selected" data-ng-c2lick="' + a + '.selectNodeLabel(node)"  ng-dblclick="'  + action + '"> ' + 
                  '{{node.' + e +'}} ' + 
                '</span>' +
                '<div tree-model data-ng-hide="(node.collapsed ||  node === empty)" data-tree-id="' + a + '" tree="item"  treecatcher="item_catcher" treebinding="node.'+ d +'" ' + actInd +
                    ' data-node-id=' + (c.nodeId || "id") + ' data-node-label=' + e + ' data-node-children=' + d + '>' +
                '</div>' + 
              '</li>' + 
            '</ul>';
        a &&
          g &&
          (c.angularTreeview &&
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
                c.selected = "selected";
                scope[a].currentNode = c;
              })),
          h.html("").append($compile(e)(scope)));
      }
    };
  });
})(angular);
