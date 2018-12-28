// IIFE functions using the closures with privat data, functions and public methods

// BUDGET Conrtoller
var budgetController = (function () {
    'use strict';

    // some code



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

    // function return array
    function _getNodesValue(nodes) {
        var values = []
        for( var node in nodes) {
            values.push(nodes[node].value);
        }
        return values;
        // return {
        //     selectAction: document.getElementById(_nodeClass.nodeId.selectAction).value, // will geting plus or minus
        //     inputDescription: document.getElementById(_nodeClass.nodeId.inputDescription).value,
        //     inputValue: document.getElementById(_nodeClass.nodeId.inputValue).value    
        // };
    }

    function _setNode(name, node) {
        _nodes[name] = node;
    }


    return {
        publicGetValue: function() {
            return _getNodesValue(_nodes); // return array
        },
        publicGetNodeClass: function() {
            return _nodeClass; // return object
        },
        pulicGetNodes: function() {
            return _nodes; // return object
        }
    };

})();

// COMMON APP Controller
var controller = (function (budgetConstr, UIConstr) {
    'use strict';

    function workWithData() {
        //1.Get the fiald input data;
        var nodeValues = UIConstr.publicGetValue(); // array
        /*
            1.Get the fiald input data;
            2.Send getting fiald data to budget controller;
            3.Create the new UI items in UI Controller;
            4.Calculate budget;
            5.Update budget UI in UI Controller;
        */
    //    console.log(nodeValues);
       return nodeValues;
    }

    function setUpEventListeners() {
        var DOM = UIConstr.publicGetNodeClass();

        document.getElementsByClassName(DOM.nodeClass.btnSend)[0].addEventListener('click', workWithData);

        document.addEventListener('keydown', function(event) {
    
            if (event.key === 'Enter') workWithData();
            
        });    
    }

    return {
        init: function() {
            console.log('Aplication is started.');
            return setUpEventListeners();
        }
    };

})(budgetController, uIController);

controller.init();