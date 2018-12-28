// IIFE functions using the closures with privat data, functions and public methods

var budgetController = (function() {
    'use strict';

    var _number = 10;

    function _sumNumber(num) {
        return _number + num;
    }

    return {
        publicMethod: function(num) {
            return _sumNumber(num);
        },
        publicNumber: function() {
            return _number;
        }
    };
})();

var uIController = (function() {
    'use strict';

    // some code


})();

var controller = (function(budgetContr, UIConstr) {
    'use strict';

    // var bdgtCntr = budgetContr.publicMethod;

    return {
        pulicControllerMethod: function(num) {
            // return bdgtCntr(num);
            return budgetContr.publicMethod(num);
        }
    };


})(budgetController, uIController);


console.log(budgetController.publicNumber());
console.log(budgetController.publicMethod(5));
console.log(controller.pulicControllerMethod(20));