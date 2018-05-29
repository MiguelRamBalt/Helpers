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
      getCompleteElement  =  function(  myElement,  currentList) {
        currentList  =  currentList  ||  angular.copy(  $scope.roleList1);

        let finalElement   =  [];
        for (  i in  currentList)  {
          if (  myElement.roleName  ==  currentList[  i].roleName)  {
            finalElement  =  [];
            finalElement[i]  =  myElement;
            break;
          }  else  {
            if (  currentList[  i].children.length  >  0)  {
              finalElement  = angular.copy(  currentList[  i]);
              finalElement.children  = [];
              finalElement.children = getCompleteElement(  myElement,  currentList[  i].children);
            };
          }
        };

        return  finalElement;
      };
      let nElement =  getCompleteElement(  element);
      console.log(  nElement);

      let aux  =  false;
      if  (  $scope.roleList2.length > 0)  {
        for  (  let iRole in $scope.roleList2)  {
          if (  $scope.roleList2[  iRole].roleName  == nElement.roleName)  {
            $scope.roleList2[  iRole]  =  angular.merge(  {},  $scope.roleList2[  iRole],  nElement);
            aux  =  true;
            break;
          }
        };

        if  (  !aux)
          $scope.roleList2.push( nElement);
      }  else
        $scope.roleList2.push( nElement);

    };
  });
})();

(function(f) {
  f.module("angularTreeview", []).directive("treeModel", function($compile) {
    return {
      restrict: "A",
      link: function(b, h, c) {
        var a = c.treeId,
          g = c.treeModel,
          e = c.nodeLabel || "label",
          d = c.nodeChildren || "children",
          e =
            '<ul><li data-ng-repeat="node in ' +
            g +
            '"><i class="collapsed" data-ng-show="node.' +
            d +
            '.length && node.collapsed" data-ng-click="' +
            a +
            '.selectNodeHead(node)"  ng-dblclick="addOs(node)"></i><i class="expanded" data-ng-show="node.' +
            d +
            '.length && !node.collapsed" data-ng-click="' +
            a +
            '.selectNodeHead(node)"  ng-dblclick="addOs(node)"></i><i class="normal" data-ng-hide="node.' +
            d +
            '.length"></i> <span data-ng-class="node.selected" data-ng-click="' +
            a +
            '.selectNodeLabel(node)"  ng-dblclick="addOs(node)">{{node.' +
            e +
            '}}</span><div data-ng-hide="node.collapsed" data-tree-id="' +
            a +
            '" data-tree-model="node.' +
            d +
            '" data-node-id=' +
            (c.nodeId || "id") +
            " data-node-label=" +
            e +
            " data-node-children=" +
            d +
            "></div></li></ul>";
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
