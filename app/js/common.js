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
        // this.percentage = -1;
    }
    Expenses.prototype.calcPercentage = function (totalInc, totalExp) {
        if (totalInc <= 0 || totalExp < 0) {
            this.percentage = -1;
        } else {
            this.percentage = Math.round((this.value / totalInc) * 100);
        }
    };

    Expenses.prototype.getPercentage = function () {
        return this.percentage;
    };

    // Calculate total, take as first argument value 'plus' or 'minus', second - "inc" or "exp"
    function calculateTotal(action, totalsName) {
        var sum = 0;

        // budgetData.allItems[action].forEach(function (cur) {
        //     sum += cur.value;
        // });
        sum = budgetData.allItems[action].reduce(function (acc, cur) {
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
         * @param {string} action must be 'plus' or 'minus', must be a string
         * @param {string} description must be a string
         * @param {number} value must be a Number
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
        /**
         * 
         * @param {string} action must be 'income' or 'expenses'
         * @param {number} ID must be a number
         */
        publicDeleteItem: function (action, ID) {
            var ids, index;

            /*
                ID = 5;
                action = 'plus' || 'minus';
                ids = [1,2,3,5,7,9];
                index = 3; // because ID = 5
            */

            ids = budgetData.allItems[action].map(function (item) {
                return item.id; // return the new array with ids
            });
            index = ids.indexOf(ID);

            if (index !== -1) {
                budgetData.allItems[action].splice(index, 1);
            }
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
        // calls from prototype method .calcPercentage and to do calc
        publicCalculatePercentages: function () {
            /**
             * for example
             * a = 10;
             * b = 20;
             * income total = 100
             * when '%' equal:
             * a = 10/100 * 100 = 10%;
             * b = 20/100 * 100 = 20%;
             */

            budgetData.allItems.minus.forEach(function (item) {
                item.calcPercentage(budgetData.totals.inc);
            });
        },
        // return array with percentages
        publicGetPercentages: function () {
            var percentages = budgetData.allItems.minus.map(function (item) {
                return item.getPercentage();
            });

            return percentages;
        },
        // returns updated budget values
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
            expensesList: 'expenses-section__list',
            incomeScore: 'income-section__score',
            expensesScore: 'expenses-section__score',
            expensesBadg: 'expenses-section-badg',
            mainScore: 'main-header__main-score',
            outputResult: 'output-result',
            btnDel: 'btn-del',
            persentBadge: 'list-item__percetage'
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
            return _nodeClass; // return obj
        },
        /**
         * 
         * @param {object} itemObject {id , description, value} from budgetController.publicAddItem()
         * @param {string} action must be 'plus' or 'minus'
         * @return undefined
         * create the new elements parse and substitute values into string with html code
         */
        publicAddNewElem: function (itemObject, action) {
            var html, newHtml, elemClass;
            if (action === 'plus') {
                html = '<div class="income-list__item" id="plus-%id%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><button class="btn-del" type="button">X</button></div> ';
                elemClass = _nodeClass.nodeClass.incomeList;
            } else {
                html = '<div class="expenses-list__item" id="minus-%id%"><h3 class="list-item__description">%description%</h3><span class="list-item__value">%value%</span><span class="list-item__percetage">21%</span><button class="btn-del" type="button">X</button></div>';
                elemClass = _nodeClass.nodeClass.expensesList;
            }

            newHtml = html.replace('%id%', itemObject.id);
            newHtml = newHtml.replace('%description%', itemObject.description);
            newHtml = newHtml.replace('%value%', itemObject.value);

            document.getElementsByClassName(elemClass)[0].insertAdjacentHTML('beforeend', newHtml);

        },
        /**
         * 
         * @param {string} ID value of id's current item, which will be deleted 
         */
        publicDeleteElem: function (selectorID) {
            document.getElementById(selectorID).remove();
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
        publicUpdateBudgetValues: function (objValues) {
            document.getElementsByClassName(_nodeClass.nodeClass.mainScore)[0].textContent = '+' + objValues.budget;
            document.getElementsByClassName(_nodeClass.nodeClass.incomeScore)[0].textContent = '+' + objValues.totalInc;
            document.getElementsByClassName(_nodeClass.nodeClass.expensesScore)[0].textContent = objValues.totalExp === 0 ? objValues.totalExp : '-' + objValues.totalExp;

            if (objValues.totalInc > 0) {
                document.getElementsByClassName(_nodeClass.nodeClass.expensesBadg)[0].textContent = objValues.percentage + '%';
            } else {
                document.getElementsByClassName(_nodeClass.nodeClass.mainScore)[0].textContent = objValues.budget;
                document.getElementsByClassName(_nodeClass.nodeClass.expensesBadg)[0].textContent = '---';
            }
        },
        // percentages is an array
        publicUpdatePercentages: function (percentages) {
            var budges;

            budges = document.getElementsByClassName(_nodeClass.nodeClass.persentBadge);
            Array.slice.call(this, budges).forEach(function (item, iter) {
                item.textContent = percentages[iter] + '%';
            });

            return budges;

            // another way uses callback fn
            /*
            var createPercentages = function (nodeList, callback) {
                for (var i = 0; i < nodeList.length; i++) {
                    callback(nodeList[i], i);
                }
            };

            createPercentages(budges, function(current, index) {
                current.textContent = percentages[index] + '%';
            });
            */
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
        var budgetValues = budgetConstr.publicGetBudgetValue(); // return obj 
        // 3.Update budget UI on UI Controller;
        UIConstr.publicUpdateBudgetValues(budgetValues);
    }

    // update persentages into 'income' and 'exposes' sections
    function updatePersetages() {
        var perc;
        // 1.Calculate 
        budgetConstr.publicCalculatePercentages();
        // 2. Returns modified value from budget controller
        perc = budgetConstr.publicGetPercentages();
        // 3. Update UI in UI controller
        UIConstr.publicUpdatePercentages(perc);
    }

    function deleteItem(event) {
        var listItemId, splitId, btnDell, action, ID;

        listItemId = event.target.parentNode.id; // return string
        btnDell = document.getElementsByClassName('btn-del'); //HTML list of items

        Array.slice.call(this, btnDell).map(function (elem) {

            if (event.target === elem) {
                splitId = listItemId.split('-');
                action = splitId[0]; // string
                ID = parseInt(splitId[1]);

                budgetConstr.publicDeleteItem(action, ID);
                // delete element from UI
                UIConstr.publicDeleteElem(listItemId);
            }
        });

        // update UI budget
        updateBudget();
        // update persetages
        updatePersetages();
    }

    function workWithData() {
        var nodeValues, newItemObject, newElement;

        // takes obj with input values
        function checkInputs(obj) {

            if (obj.inputDescription !== '' && obj.inputValue > 0 && !isNaN(obj.inputValue)) {
                // 2.Send getting fiald data to budget controller; (creation objects for create new items), return {id, discription}
                newItemObject = budgetConstr.publicAddItem(nodeValues.selectAction, nodeValues.inputDescription, parseFloat(nodeValues.inputValue));
                // 3.Create the new UI items in UI Controller;
                newElement = UIConstr.publicAddNewElem(newItemObject, nodeValues.selectAction);
                // clear the inputs value when user will enter the data
                UIConstr.publicClearFieldsValue();
                // Update budget
                updateBudget();
                // update persentages
                updatePersetages();
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

        document.getElementsByClassName(DOM.nodeClass.outputResult)[0].addEventListener('click', deleteItem);

    }

    return {
        init: function () {
            console.log('Aplication is started.');
            // when page on load, all budget values will be equal 0
            UIConstr.publicUpdateBudgetValues({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            });
            UIConstr.publicClearFieldsValue();

            return setUpEventListeners();
        }
    };

})(budgetController, uIController);

controller.init();