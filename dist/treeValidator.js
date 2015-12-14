var TreeValidator, validator;

validator = require('validator');

TreeValidator = (function() {
  function TreeValidator() {}

  TreeValidator.prototype.validate = function(tree, config) {
    return this.validateItem(tree, config, "");
  };

  TreeValidator.prototype.validateString = function(item, options) {
    item = validator.toString(item);
    if ((options.trim != null) && options.trim) {
      item = item.trim();
    }
    if ((options.minLength != null) && item.length < options.minLength) {
      return {
        status: false,
        error: "minLength"
      };
    }
    if ((options.maxLength != null) && item.length > options.maxLength) {
      return {
        status: false,
        error: "maxength"
      };
    }
    return {
      status: true,
      value: item
    };
  };

  TreeValidator.prototype.validateInt = function(item, options) {
    if (!validator.isInt(item)) {
      if (validator.isNumerig(item)) {
        item = validator.toInt(item);
      } else {
        return {
          status: false,
          error: "notNumeric"
        };
      }
    }
    if ((options.enforceMax != null) && options.enforceMax) {
      if (options.min != null) {
        item = Math.min(options.min, item);
      }
      if (options.max != null) {
        item = Math.min(options.max, item);
      }
    } else {
      if ((options.min != null) && item < options.min) {
        return {
          status: false,
          error: "min"
        };
      }
      if (options.max && item > options.max) {
        return {
          status: false,
          error: "max"
        };
      }
    }
    return {
      status: true,
      value: item
    };
  };

  TreeValidator.prototype.validateBoolean = function(item, options) {
    return {
      status: true,
      value: validator.toBoolean(item, true)
    };
  };

  TreeValidator.prototype.validateArray = function(item, options, path) {
    var child, i, index, len, processedArray, validatedChild;
    if (Array.isArray(item)) {
      if ((options.length != null) && item.length !== options.length) {
        return {
          status: false,
          error: "length"
        };
      }
      if ((options.maxLength != null) && item.length > options.maxLength) {
        return {
          status: false,
          error: "maxLength"
        };
      }
      if ((options.minLength != null) && item.length < options.minLength) {
        return {
          status: false,
          error: "minLength"
        };
      }
      processedArray = [];
      for (index = i = 0, len = item.length; i < len; index = ++i) {
        child = item[index];
        validatedChild = this.validateItem(child, options.items, path + ("[" + index + "]"));
        if (validatedChild.status !== true) {
          return validatedChild;
        } else {
          processedArray.push(validatedChild.value);
        }
      }
      return {
        status: true,
        value: processedArray
      };
    } else {
      return {
        status: false,
        error: "notArray"
      };
    }
  };

  TreeValidator.prototype.validateObject = function(item, options, path) {
    var finalObject, prop, propOptions, ref, validatedProp;
    if (item instanceof Object) {
      finalObject = {};
      ref = options.childprops;
      for (prop in ref) {
        propOptions = ref[prop];
        if (item[prop] != null) {
          validatedProp = this.validateItem(item[prop], propOptions, path + "." + prop);
          if (validatedProp.status !== true) {
            return validatedProp;
          } else {
            finalObject[prop] = validatedProp.value;
          }
        } else {
          return {
            "status": false,
            "error": "missingProp",
            "prop": prop
          };
        }
      }
      return {
        status: true,
        value: finalObject
      };
    } else {
      return {
        "status": false,
        "error": "notObject"
      };
    }
  };

  TreeValidator.prototype.validateItem = function(item, options, path) {
    var res;
    switch (options.type) {
      case "string":
        res = this.validateString(item, options);
        break;
      case "int":
        res = this.validateInt(item, options);
        break;
      case "boolean":
        res = this.validateBoolean(item, options);
        break;
      case "array":
        res = this.validateArray(item, options, path);
        break;
      case "object":
        res = this.validateObject(item, options, path);
        break;
      default:
        return {
          status: false,
          error: "unknownType",
          path: path
        };
    }
    if (res.status) {
      return res;
    } else {
      if (res.path == null) {
        res.path = path;
      }
      return res;
    }
  };

  return TreeValidator;

})();

module.exports = TreeValidator;
