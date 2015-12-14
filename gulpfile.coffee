gulp = require("gulp")
coffee = require("gulp-coffee")

gulp.task("coffee", ->
	gulp.src("./src/**/*.coffee").pipe(coffee(
		bare: true
	)).pipe(gulp.dest("./dist/"))
)

gulp.task("default", ->
	console.log "Now watching all coffee files in src directory."
	gulp.watch("./src/**/*.coffee",["coffee"])
) 