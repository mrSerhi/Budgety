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
    // for save objects of items and manipulation
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
        /**
         * 
         * @param {object value} action must be 'plus' or 'minus', must be a string
         * @param {object value} description must be a string
         * @param {object value} value must be a Number
         * @return {object} {id, description, value} id must be incremented on 1
         * create objects for use getting from their values to create new elements
         */
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
            // filling array of objects [{}, {}, {}]
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
            btnSend: 'btn-send',
            incomeList: 'income-section__list',
            expensesList: 'expenses-section__list'
        }
    };

    var _nodes = {
        selectAction: document.getElementById(_nodeClass.nodeId.selectAction),
        inputDescription: document.getElementById(_nodeClass.nodeId.inputDescription),
        inputValue: document.getElementById(_nodeClass.nodeId.inputValue)
    };

    // function returns {} with copy of privat _nodes values
    function getNodesValue(items) {
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
            return getNodesValue(_nodes); // return {}
        },
        publicGetNodeClass: function () {
            return _nodeClass; // return {}
        },
        /**
         * 
         * @param {object} itemObject {id , description, value} from budgetController.publicAddItem()
         * @param {object value} action must be 'plus' or 'minus'
         * @return undefined
         * create the new elements parse and substitute values into string with html code
         */
        publicAddNewElem: function (itemObject, action) {
            var html, parrent;
            if (action === 'plus') {
                html = '<div class="income-list__item" id="income-%0%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><button class="btn-del" type="button">X</button></div> ';
                parrent = document.getElementsByClassName(_nodeClass.nodeClass.incomeList)[0];
            } else {
                html = '<div class="expenses-list__item" id="expenses-%0%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><span class="list-item__percetage">21%</span><button class="btn-del" type="button">X</button></div>';
                parrent = document.getElementsByClassName(_nodeClass.nodeClass.expensesList)[0];
            }

            html.replace('%0%', itemObject.id);
            html = html.replace('%description%', itemObject.description);
            html = html.replace('%value%', itemObject.value);

            parrent.insertAdjacentHTML('beforeend', html);

            //return html;
        }
    };

})();

// COMMON APP Controller
var controller = (function (budgetConstr, UIConstr) {
    'use strict';

    function workWithData() {
        var nodeValues, newItemObject, newElement;
        // 1.Get the fiald input data(values for creating objects);
        nodeValues = UIConstr.publicGetValue(); // {}
        // 2.Send getting fiald data to budget controller; (creation objects for create new items)
        newItemObject = budgetConstr.publicAddItem(nodeValues.selectAction, nodeValues.inputDescription, parseInt(nodeValues.inputValue));
        // 3.Create the new UI items in UI Controller;
        newElement = UIConstr.publicAddNewElem(newItemObject, nodeValues.selectAction);
        /*
            1.Get the fiald input data;
            2.Send getting fiald data to budget controller;
            3.Create the new UI items in UI Controller;
            4.Calculate budget;
            5.Update budget UI in UI Controller;
        */
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