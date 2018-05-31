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
    $scope.roleList2 = [];

    $scope.addOs = function(element) {
      getNoReferencedChildrenCopy = function(  element)  {
        let newElement  = new Object();
        newElement.roleName  =  element.roleName;
        newElement.roleId  =  element.roleId;
        newElement.children  = new  Object();
        if (  element.children.length  > 0  ||  Object.keys(  element.children).length  >  0) {  
          for  (  j  in  element.children)  {
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

      getCompleteElement  =  function(  myElement,  currentList) {
        currentList  =  currentList  ||  angular.copy(  $scope.roleList1);

        let finalElement   =  false;
        for (  i in  currentList)  {
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

      let  nElement =  angular.copy(  getCompleteElement(  angular.copy(  element)));
      $scope.roleList2  =  angular.merge( new Object() ,angular.copy( $scope.roleList2),  angular.copy(nElement));
    };

    $scope.removeOs  =  function(  element)  {
      getCompleteElement  =  function(  myElement,  currentList) {
        currentList  =  currentList  ||  angular.copy(  $scope.roleList2);

        let finalElement   =  {};
        for (  i in  currentList)  {
          if (  myElement.roleName  ==  currentList[  i].roleName)  {
            finalElement  =  angular.copy( currentList);
            delete finalElement[  i];
            break;
          }  else  {
            let j  =  angular.copy(  i);
            if (  currentList[  j].children.length  >  0 || Object.keys(currentList[  j].children).length > 0)  {
              finalElement = angular.copy( currentList);
              finalElement[  j]  = angular.copy(  currentList[  j]);
              finalElement[  j].children  =  angular.copy(  getCompleteElement(  myElement,  currentList[  j].children));
              if (  finalElement[  j].children.length  == 0  ||  Object.keys(  finalElement[  j].children).length == 0)
                delete  finalElement[  j];
            };
          }
        };
        return  finalElement;
      };

      $scope.roleList2  =  getCompleteElement(  element);
    }

    $scope.auxObjectLength = function( obj)  {
      return  Object.keys(obj).length;
    };
  });
})();

(function(f) {
  f.module("angularTreeview", []).directive("treeModel", function($compile) {
    return {
      restrict: "A",
      link: function(b, h, c) {
        var a = c.treeId,
          action = (  c.treeChildrensAction == "add") ? "addOs(node)" : (  c.treeChildrensAction == 'remove'  ?  "removeOs(node)" : "addOs(node)"),
          actInd =  'data-tree-childrens-action="' + ( c.treeChildrensAction  ?  (  c.treeChildrensAction) :  'add') + '"',
          g = c.treeModel,
          e = c.nodeLabel || "label",
          d = c.nodeChildren || "children",
          e =
            '<ul>' + 
              '<li data-ng-repeat="node in ' +  g + '">' + 
                '<i class="collapsed" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length) && node.collapsed" ' + 
                    ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '">' + '</i>' + 
                '<i class="expanded" data-ng-show="(auxObjectLength(node.' + d +') || node.' + d + '.length)  && !node.collapsed" ' +
                    ' data-ng-click="' + a + '.selectNodeHead(node)"  ng-dblclick="'  + action + '"></i>' + 
                '<i class="normal" data-ng-hide="(node.' + d + '.length  || auxObjectLength(node.' + d +') != 0)" ng-dblclick="'  + action + '"></i>' +
                '<span data-ng-class="node.selected" data-ng-c2lick="' + a + '.selectNodeLabel(node)"  ng-dblclick="'  + action + '"> ' + 
                  '{{node.' + e +'}} ' + 
                '</span>' +
                '<div data-ng-hide="(node.collapsed)" data-tree-id="' + a + '" data-tree-model="node.' + d + '" ' + actInd +
                    ' data-node-id=' + (c.nodeId || "id") + ' data-node-label=' + e + ' data-node-children=' + d + '>' +
                '</div>' + 
              '</li>' + 
            '</ul>';
        a &&
          g &&
          (c.angularTreeview &&
            ((b[a] = b[a] || {}),
            (b[a].selectNodeHead =
              b[a].selectNodeHead ||
              function(a) {
                a.collapsed = !a.collapsed;
              }),
            (b[a].selectNodeLabel =
              b[a].selectNodeLabel ||
              function(c) {
                b[a].currentNode &&
                  b[a].currentNode.selected &&
                  (b[a].currentNode.selected = void 0);
                c.selected = "selected";
                b[a].currentNode = c;
              })),
          h.html("").append($compile(e)(b)));
      }
    };
  });
})(angular);
