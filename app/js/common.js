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

    // Calculate total, take as first argument value 'plus' or 'minus', second - "inc" or "exp"
    function calculateTotal(action, totalsName) {
        var sum = 0;

        // budgetData.allItems[action].forEach(function (cur) {
        //     sum += cur.value;
        // });
        sum = budgetData.allItems[action].reduce(function(acc, cur) {
            return acc + cur.value;
        }, 0);

        budgetData.totals[totalsName] = sum;
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
        },
        budget: 0,
        percentage: 0
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
        },
        publicCalculateBudget: function () {

            // 1. Calculate total
            calculateTotal('plus', 'inc');
            calculateTotal('minus', 'exp');
            // 2. Calculate the budget (budget is balance of amount)
            budgetData.budget = budgetData.totals.inc - budgetData.totals.exp;
            // 3. Calculate percentages
            // Solves a problem when total inc = 0, and e.g total exp = 900. Expression 900 / 0 = infinity
            if (budgetData.totals.inc > 0) {
                budgetData.percentage = Math.round((budgetData.totals.exp / budgetData.totals.inc) * 100);
            } else {
                budgetData.percentage = -1;
            }
        },
        publicGetBudgetValue: function () {
            return {
                totalInc: budgetData.totals.inc,
                totalExp: budgetData.totals.exp,
                budget: budgetData.budget,
                percentage: budgetData.percentage
            };
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

    function getValuesFromFields() {

        return {
            selectAction: document.getElementById(_nodeClass.nodeId.selectAction).value, // will geting plus or minus
            inputDescription: document.getElementById(_nodeClass.nodeId.inputDescription).value,
            inputValue: document.getElementById(_nodeClass.nodeId.inputValue).value
        };
    }

    return {
        publicGetValue: function () {
            return getValuesFromFields();
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
            var html, elemClass;
            if (action === 'plus') {
                html = '<div class="income-list__item" id="income-%0%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><button class="btn-del" type="button">X</button></div> ';
                elemClass = _nodeClass.nodeClass.incomeList;
            } else {
                html = '<div class="expenses-list__item" id="expenses-%0%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><span class="list-item__percetage">21%</span><button class="btn-del" type="button">X</button></div>';
                elemClass = _nodeClass.nodeClass.expensesList;
            }

            html.replace('%0%', itemObject.id);
            html = html.replace('%description%', itemObject.description);
            html = html.replace('%value%', itemObject.value);

            document.getElementsByClassName(elemClass)[0].insertAdjacentHTML('beforeend', html);

            //return html;
        },
        publicClearFieldsValue: function () {
            var fieldsNodeList;

            fieldsNodeList = document.querySelectorAll('#' + _nodeClass.nodeId.inputDescription +
                ', #' + _nodeClass.nodeId.inputValue);
            // from NodeList to do array using call method and all ele-ts will have value = ''
            Array.prototype.slice.call(fieldsNodeList).forEach(function (current) {
                current.value = '';
            });
            fieldsNodeList[0].focus();
        },
        publicUpdateBudget: function (objValues) {

        }
    };

})();

// COMMON APP Controller
var controller = (function (budgetConstr, UIConstr) {
    'use strict';

    function updateBudget() {
        // 1.Calculate budget;
        budgetConstr.publicCalculateBudget();
        // 2.Return budget modified values;
        var budgetValues = budgetConstr.publicGetBudgetValue(); // return {} 
        // 2.Update budget UI on UI Controller;
        console.dir(budgetValues);
    }

    function workWithData() {
        var nodeValues, newItemObject, newElement;

        // takes obj with input values
        function checkInputs(obj) {
            if (obj.inputDescription !== '' && obj.inputValue > 0 && !isNaN(obj.inputValue)) {
                // 2.Send getting fiald data to budget controller; (creation objects for create new items)
                newItemObject = budgetConstr.publicAddItem(nodeValues.selectAction, nodeValues.inputDescription, parseFloat(nodeValues.inputValue));
                // 3.Create the new UI items in UI Controller;
                newElement = UIConstr.publicAddNewElem(newItemObject, nodeValues.selectAction);
                // clear the inputs value when user will enter the data
                UIConstr.publicClearFieldsValue();
                // Update budget
                updateBudget();
            } else {
                console.warn('You need a type message and numbers!')
            }
        }

        // 1.Get the fiald input data(values for creating objects inc and exp);
        nodeValues = UIConstr.publicGetValue(); // {}
        checkInputs(nodeValues); // check input values

        // 4. Calculate and update budget

        /*
            1.Get the fiald input data;
            2.Send getting fiald data to budget controller;
            3.Create the new UI items in UI Controller;
            4.Calculate budget;
            5.Update budget UI in UI Controller;
        */

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