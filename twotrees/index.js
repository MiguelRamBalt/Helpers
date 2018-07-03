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
            { roleName: "Windows 8.1 ", roleId: "role11", children: [] },
            {
              roleName: "Windows Server",
              roleId: "role12",
              children: [
                {
                  roleName: "Windows Server 2012 ",
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
        link: function( scope, h, c) {
          scope.addOs = function(element) {
            var getNoReferencedChildrenCopy = function(  element)  {
              var newElement  = new Object();
              newElement.roleName  =  element.roleName;
              newElement.roleId  =  element.roleId;
              newElement.children  = new  Object();
              if (  element.children.length  > 0  ||  Object.keys(  element.children).length  >  0) {  
                for  (var  j  in  element.children)  {
                  newElement.children[  j]  =  new  Object();
                  if (  element.children[  j].length  > 0  ||  Object.keys(  element.children[  j]).length  >  0) {
                    newElement.children[  j]  =  angular.copy(  getNoReferencedChildrenCopy(  element.children[  j]));
                  }  else  {
                    newElement.children[  j].roleName  =  element.children[  j].roleName;
                    newElement.children[  j].roleId  =  element.children[  j].roleId;
                    newElement.children[  j].children  =  [];
                  }
                }
              }  else  {
                newElement.roleName  =  element.roleName;
                newElement.roleId  =  element.roleId;
                newElement.children  =  [];
              }

              return newElement;
            }

            var getCompleteElement  =  function(  myElement,  currentList) {
              currentList  =  currentList  ||  angular.copy( scope.item);

              var finalElement   =  false;
              for (  var  i in  currentList)  {
                if (  myElement.roleName  ==  currentList[  i].roleName)  {
                  finalElement  =  new Object();
                  finalElement[  i]  =  new Object();
                  finalElement[  i]  =  getNoReferencedChildrenCopy(  myElement);
                  return finalElement;
                }  else  {
                  if (  currentList[  i].children.length  >  0 || Object.keys(currentList[  i].children).length > 0)  {
                    finalElement  =  {};
                    finalElement[  i]  = angular.copy(  currentList[  i]);
                    finalElement[  i].children  =  angular.merge(  new Object(), getCompleteElement(  myElement,  angular.copy(  currentList[  i].children)));
                  };
                }
              };
              return  finalElement;
            };

            var  nElement =  angular.copy(  getCompleteElement(  angular.copy(  element)));
            scope.item_catcher  =  angular.merge( scope.item_catcher,  angular.copy(nElement));
            console.log(  scope.item_catcher);
          };

          scope.auxObjectLength = function( obj)  {
            if (  obj  === undefined)
              return  false;

            return  Object.keys(obj).length;
          };

          var a = c.treeId,
            action = (  c.treeChildrensAction == "add") ? "addOs(node)" : (  c.treeChildrensAction == 'remove'  ?  "removeOs(node)" : "addOs(node)"),
            actInd =  'data-tree-childrens-action="' + ( c.treeChildrensAction  ?  (  c.treeChildrensAction) :  'add') + '"',
            g = c.tree,
            e = c.nodeLabel || "label",
            d = c.nodeChildren || "children",
            e =
              '<ul>' + 
                '<li data-ng-repeat="node in item_binding">' + 
                  '<i class="collapsed" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length) && node.collapsed" ' + 
                      ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '">' + '</i>' + 
                  '<i class="expanded" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length)  && !node.collapsed" ' +
                      ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '"></i>' + 
                  '<i class="normal" data-ng-hide="( node === empty || node.' + d + '.length  || auxObjectLength(node.' + d +') != 0)" ng-dblclick="'  + action + '"></i>' +
                  '<span data-ng-class="node.selected" data-ng-c2lick="' + a + '.selectNodeLabel(node)"  ng-dblclick="'  + action + '"> ' + 
                    '{{node.' + e +'}} ' + 
                  '</span>' +
                  '<div tree-model data-ng-hide="(node.collapsed)" data-tree-id="' + a + '" tree="item"  treecatcher="item_catcher" treebinding="node.'+ d +'" ' + actInd +
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
