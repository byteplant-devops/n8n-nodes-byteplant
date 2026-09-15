const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', series(copyNodeIcons, copyCredIcons));

function copyNodeIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	return new Promise((resolve, reject) => {
		src(nodeSource, { encoding: false })
			.pipe(dest(nodeDestination))
			.on('error', reject)
			.on('end', resolve);
	});
}

function copyCredIcons() {
	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return new Promise((resolve, reject) => {
		src(credSource, { encoding: false })
			.pipe(dest(credDestination))
			.on('error', reject)
			.on('end', resolve);
	});
}
