var TreeValidator, config, testItem, validator;

TreeValidator = require("./treeValidator");

validator = new TreeValidator();

config = {
  type: "object",
  childprops: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 32,
      trim: true
    },
    age: {
      type: "int",
      min: 0
    },
    children: {
      type: "array",
      maxLength: 10,
      items: {
        type: "object",
        childprops: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 32
          },
          age: {
            type: "int",
            min: 0,
            max: 100
          },
          toys: {
            type: "array",
            items: {
              type: "string",
              trim: "true"
            }
          }
        }
      }
    }
  }
};

testItem = {
  name: "John",
  age: 13,
  children: [
    {
      name: "Max",
      age: 2,
      toys: ["Car", "Barbie"]
    }, {
      name: "Lisa",
      age: 13,
      toys: ["Car", "Potatoe"]
    }
  ]
};

console.log(JSON.stringify(validator.validate(testItem, config), null, 4));
