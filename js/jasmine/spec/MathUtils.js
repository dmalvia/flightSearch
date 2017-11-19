// MathUtils = function() {};

// MathUtils.prototype.add = function(num1, num2) {
//   return num1 + num2;
// }

// MathUtils.prototype.sub = function(num1, num2) {
//   return num1 - num2;
// }

// MathUtils.prototype.mul = function(num1, num2) {
//   return num1 * num2;
// }

// MathUtils.prototype.divide = function(num1, num2) {
//   return num1 / num2;
// };

// describe("MathUtils", function() {
// 	var calc;
// 	beforeEach(function() {
// 		calc = new MathUtils();
// 	});

// 	describe("calc is used to perform math operation", function() {
// 		it("calc for add", function() {
// 			expect(calc.add(2,5)).toEqual(7);
// 		});

// 		it("calc for multiply", function() {
// 			expect(calc.mul(2,5)).toEqual(10);
// 		});

// 		it("calc for substract", function() {
// 			expect(calc.sub(2,5)).toEqual(-3);
// 		});

// 		it("calc for add", function() {
// 			expect(calc.divide(5,5)).toEqual(1);
// 		});
// 	});
// })

describe("Nested Describe Demo", function() {
    beforeEach(function() {
        console.log("beforeEach level 1");
    });
    describe("MyTest level2", function() {
        beforeEach(function() {
            console.log("beforeEach level 2");
        });
        describe("MyTest level3", function() {
            beforeEach(function() {
                console.log("beforeEach level 3");
            });
            it("is a simple spec in level3", function() {
                console.log("A simple spec in level 3");
                expect(true).toBe(true);
            });
            afterEach(function() {
                console.log("afterEach level 3");
            });
        });
        afterEach(function() {
            console.log("afterEach level 2");
        });
    });
    afterEach(function() {
        console.log("afterEach level 1");
    });
});