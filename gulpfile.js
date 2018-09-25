/**
 * Defines all dependencies
 */
var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpBabel = require("gulp-babel");
var gulpBump = require("gulp-bump");
var gulpClean = require("gulp-clean");
var gulpConcat = require("gulp-concat");
var gulpHtmlmin = require('gulp-htmlmin');
var gulpMinifyCss = require("gulp-minify-css");
var gulpSourcemaps = require("gulp-sourcemaps");
var runSequence = require("run-sequence");

/**
 * The name of the package to build
 * @type {String}
 */
var packageName = "primo-explore-google-analytics";

/**
 * Configuration parameters which contain source and target destinations
 * @type {Object}
 */
var configParams = {
	packageFilePaths: ["./package.json"],
	sourcePaths: {
		css: "./src/css/*.css",
		html: "./src/html/*.html",
		js: "./src/js/*.js"
	},
	targetPaths: {
		css: "./css",
		html: "./html",
		js: "./js"
	}
};

/**
 * [taskGlobals description]
 * @type {Object}
 */
var taskGlobals = {
	versionType: null
}

/**
 * Adjusts the version number of the project
 *
 * major: 1.0.0 to 2.0.0
 * minor: 0.1.0 to 0.2.0
 * patch: 0.0.2 to 0.0.2
 * prerelease: 0.0.1-2 to 0.0.1-3
 */
gulp.task("bump-version", function() {
	gulp.src(configParams.packageFilePaths)
 	.pipe(gulpBump({
		type: taskGlobals.versionType
	}))
	.pipe(gulp.dest("./"));
});

/**
 * Cleans the building directories (removes all their contents)
 */
gulp.task("clean", function() {
	return gulp.src([configParams.targetPaths.css, configParams.targetPaths.js], {read: false})
		.pipe(gulpClean({force: true}));
});

/**
 * Builds the js file
 */
gulp.task("build-js", function() {
	return gulp.src(configParams.sourcePaths.js)
		.pipe(gulpSourcemaps.init())
		.pipe(gulpBabel({
			presets: ["es2015"]
		}))
		.on("error", function(err) {
			if (err && err.codeFrame) {
				gutil.log(
					gutil.colors.red("Browserify error: "),
					gutil.colors.cyan(err.filename) + ` [${err.loc.line},${err.loc.column}]`,
					"\r\n" + err.message + "\r\n" + err.codeFrame);
			}
			else {
				gutil.log(err);
			}
			this.emit("end");
		})
		.pipe(gulpConcat(packageName + ".js"))
		.pipe(gulpSourcemaps.write('.'))
		.pipe(gulp.dest(configParams.targetPaths.js));
});

/**
 * Builds the html file
 */
gulp.task("build-html", function() {
	return gulp.src(configParams.sourcePaths.html)
		.pipe(gulpHtmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(configParams.targetPaths.html));
});

/**
 * Builds the css file
 */
gulp.task("build-css", function() {
	return gulp.src(configParams.sourcePaths.css)
		.pipe(gulpSourcemaps.init())
		.pipe(gulpConcat(packageName + ".css"))
		.pipe(gulpMinifyCss())
		.pipe(gulpSourcemaps.write('.'))
		.pipe(gulp.dest(configParams.targetPaths.css))
});

/**
 * Composite task that builds all assets
 */
gulp.task('build-assets', function() {
	runSequence(
		"clean",
		"build-js",
		"build-css",
		"build-html"
	);
});


/**
 * Creates major build
 */
gulp.task('create-major-build', function() {

	taskGlobals.versionType = "major";

	runSequence(
		"bump-version",
		"build-assets"
	);
});

/**
 * Creates minor build
 */
gulp.task('create-minor-build', function() {

	taskGlobals.versionType = "minor";

	runSequence(
		"bump-version",
		"build-assets"
	);
});

/**
 * Creates patch build
 */
gulp.task('create-patch-build', function() {

	taskGlobals.versionType = "patch";

	runSequence(
		"bump-version",
		"build-assets"
	);
});

/**
 * Creates pre or pre-release build
 */
gulp.task('create-pre-build', function() {

	taskGlobals.versionType = "prerelease";

	runSequence(
		"bump-version",
		"build-assets"
	);
});
