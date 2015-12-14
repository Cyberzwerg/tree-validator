validator = require('validator')
class TreeValidator

	validate: (tree,config) ->

		return @validateItem(tree,config,"") # Initial Path
		
		
	validateString: (item,options) ->

		# Format to string
		item = validator.toString(item)

		# Trimming
		if options.trim? and options.trim then item = item.trim()

		# Minlength
		if options.minLength? and item.length < options.minLength 
			return {
				status: false 
				error: "minLength"
			}

		# Maxlength 
		if options.maxLength? and item.length > options.maxLength
			return {
				status: false 
				error: "maxength"
			}

		return {
			status: true
			value: item 
		}

	validateInt: (item,options) ->

		if not validator.isInt(item)
			if validator.isNumerig(item) 
				item = validator.toInt(item)
			else 
				return {
					status: false 
					error: "notNumeric"
				}
		# Check if min max is strict or enforcing
		if options.enforceMax? and options.enforceMax

			if options.min? then item = Math.min(options.min,item)
			if options.max? then item = Math.min(options.max,item)

		else 

			# Check if number is too big or too small, else throw error

			if options.min? and item < options.min 
				return {
					status: false 
					error: "min"
				}

			if options.max and item > options.max 
				return {
					status: false 
					error: "max"
				}

		return {
			status: true
			value: item 
		}

	validateBoolean: (item,options) ->

		return {
			status: true 
			value: validator.toBoolean(item,true) # Strict mode
		}

	validateArray: (item,options,path) ->

		if Array.isArray(item)

			if options.length? and item.length != options.length 
				return {
					status: false 
					error: "length"
				}

			if options.maxLength? and item.length > options.maxLength
				return {
					status: false 
					error: "maxLength"
				}

			if options.minLength? and item.length < options.minLength
				return {
					status: false 
					error: "minLength"
				}

			processedArray = []
			for child, index  in item 
				validatedChild = @validateItem(child,options.items,path+"[#{index}]")
				if validatedChild.status != true
					return validatedChild
				else 
					processedArray.push(validatedChild.value)

			return {
				status: true
				value: processedArray
			}
		else 
			return {
				status: false 
				error: "notArray"
			}

	validateObject: (item,options,path) ->

		if item instanceof Object

			finalObject = {}
			for prop, propOptions of options.childprops 
				if item[prop]?
					
					validatedProp = @validateItem(item[prop],propOptions,path+"."+prop)
					if validatedProp.status != true 

						return validatedProp

					else 

						finalObject[prop] = validatedProp.value 

				else 
					return {
						"status": false 
						"error": "missingProp"
						"prop": prop
					}

			
			return {
				status: true 
				value: finalObject
			}

		else 
			return {
				"status": false 
				"error": "notObject"
			}


	validateItem: (item,options,path) ->
		
		switch options.type 
			when "string"
				res = @validateString(item,options)
			when "int"
				res = @validateInt(item,options)
			when "boolean"
				res = @validateBoolean(item,options)
			when "array"
				res = @validateArray(item,options,path)
			when "object"
				res = @validateObject(item,options,path)
			else 
				return {
					status: false 
					error: "unknownType"
					path: path
				}
		if res.status
			return  res 
		else 
			if not res.path? then res.path = path 
			return res 


module.exports = TreeValidator