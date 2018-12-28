// IIFE functions using the closures with privat data, functions and public methods

// BUDGET Conrtoller
var budgetController = (function () {
    'use strict';

    // Constructor
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Constructor
    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var budgetData = {
        allItems: {
            plus: [],
            minus: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        publicAddItem: function (action, description, value) {
            var newItem, ID;
            // ID must be on 1 num bigger than last item into array. On example [1,2,3,4] - ID = 5, or [1,3,5] - ID = 6
            if (budgetData.allItems[action].length > 0) {
                ID = budgetData.allItems[action][budgetData.allItems[action].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (action === 'plus') {
                newItem = new Income(ID, description, value);
            } else {
                newItem = new Expenses(ID, description, value);
            }

            budgetData.allItems[action].push(newItem);

            return newItem;
        },
        publicShow: function () {
            console.log(budgetData);
        }
    };

})();

// UI Controller
var uIController = (function () {
    'use strict';

    var _nodeClass = {
        nodeId: {
            selectAction: 'select-action',
            inputDescription: 'input-description',
            inputValue: 'input-value'
        },
        nodeClass: {
            btnSend: 'btn-send'
        }
    };

    var _nodes = {
        selectAction: document.getElementById(_nodeClass.nodeId.selectAction), // will geting plus or minus
        inputDescription: document.getElementById(_nodeClass.nodeId.inputDescription),
        inputValue: document.getElementById(_nodeClass.nodeId.inputValue)
    };

    // function returns {}
    function _getNodesValue(items) {
        var Nodes = items;

        return {
            selectAction: Nodes.selectAction.value, // will geting plus or minus
            inputDescription: Nodes.inputDescription.value,
            inputValue: Nodes.inputValue.value
        };
    }

    function _setNode(name, node) {
        _nodes[name] = node;
    }

    return {
        publicGetValue: function () {
            return _getNodesValue(_nodes); // return {}
        },
        publicGetNodeClass: function () {
            return _nodeClass; // return {}
        }
    };

})();

// COMMON APP Controller
var controller = (function (budgetConstr, UIConstr) {
    'use strict';

    function workWithData() {
        var nodeValues, newItem;
        //1.Get the fiald input data;
        nodeValues = UIConstr.publicGetValue(); // {}
        // 2.Send getting fiald data to budget controller;
        newItem = budgetConstr.publicAddItem(nodeValues.selectAction, nodeValues.inputDescription, parseInt(nodeValues.inputValue));
        /*
            1.Get the fiald input data;
            2.Send getting fiald data to budget controller;
            3.Create the new UI items in UI Controller;
            4.Calculate budget;
            5.Update budget UI in UI Controller;
        */
        //    console.log(nodeValues);
        console.log(newItem);
        // return nodeValues;
    }

    function setUpEventListeners() {
        var DOM = UIConstr.publicGetNodeClass();

        document.getElementsByClassName(DOM.nodeClass.btnSend)[0].addEventListener('click', workWithData);

        document.addEventListener('keydown', function (event) {

            if (event.key === 'Enter') workWithData();

        });
    }

    return {
        init: function () {
            console.log('Aplication is started.');
            return setUpEventListeners();
        }
    };

})(budgetController, uIController);

controller.init();