# TreeValidator
A simple validator for JSON Trees with error reporting. Written in coffee

## Installation
```bash
  npm install --save tree-validator
```

## Usage
```javascript
  TreeValidator = require("./treeValidator");
  validator = new TreeValidator();
  
  config = {
    type: "string",
    minLength: 3,
    maxLength: 32,
    trim: true
  };
  
  testValue = "Lisa Simpson    ";
  
  console.log(validator.validate(testValue,config));
  
  
```

## Result

If the validation succeeds, the validator returns an object as follows:
```json
  {
    "status": true,
    "value": "Lisa Simpson"
  }
```
If something goes wrong, the result may look like this:

```javascript
  testValue = "fo";
```
```json
  {
    "status": false,
    "error": "minLength",
    "path": ""
  }
```
## Example of all types

```javascript 
// dist/example.js
config = {
  type: "object",
  childprops: {
    name: { type: "string", minLength: 3, maxLength: 32, trim: true },
    age: { type: "int", min: 0 },
    children: {
      type: "array",
      maxLength: 10,
      items: {
        type: "object",
        childprops: {
          name: { type: "string", minLength: 3, maxLength: 32 },
          age: { type: "int", min: 0, max: 100 },
          toys: {
            type: "array",
            items: { type: "string", trim: "true" }
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
```


## Types
The validator supports the following types

### String
```javascript
  {
    type: "string",
    trim: boolean, // Trim is ran before min-&maxLength
    minLength: int,
    maxLength: int,
  }
```

### Int
```javascript
  {
    type: "string",
    // If this is true Math.min() and Math.max() are used to change the value entered to fit the given range 
    // Else an error is thrown
    enforceMax: boolean, 
    
    min: int,
    max: int,
  }
```

### Boolean 
Convert a value to boolean. Always.
```javascript
  { 
    type: "boolean"
  
  }
```

### Array -- Allows nesting
Iterates over items and applies validation against the items of the array
```javascript
  { 
    type: "array",
    maxLength: int,
    items: {
      [ Child config ] // This is a new config tree 
    }
  }
```

### Object -- Allows nesting
This filters out all properties from an object, and applies validation against the values.
```javascript 
  {
    type: "object"
    childprops: {
      [PROPNAME]: [ Child config ] // This a new config tree
    }
  }
```






