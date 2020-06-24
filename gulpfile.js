const {series, parallel, src, dest} = require('gulp');
const exec = require('child_process').exec;
const inject = require('gulp-inject-string');
const clean = require('gulp-clean');


const BASE_URL = 'https://YOURPROJECTURL.web.app';
const PROJECT_NAME = 'Angular-AppsScript-Starter'
const LOCAL_TOKEN = '';

function defaultTask(cb) {
    console.log('gulp build');
    console.log('gulp clean_build');
    console.log('gulp deploy');
    cb();
}

function buildClient(cb) {
    exec('"ng" build --prod', {cwd: `./client/${PROJECT_NAME}`}, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}

function copyClientFiles(cb) {
    src([`./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.js`, `./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.css`])
        .pipe(dest('deploy/public/assets/scripts'));
    cb();
}

function processClientAssetFiles(cb) {
    src(`./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/assets/**/*.*`, {allowEmpty: true})
        .pipe(dest('deploy/public/assets'));
    cb();

}

function processClientOtherFiles(cb) {
    src([`./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.*`,
     `!./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.html`,
      `!./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.js`,
     `!./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/*.css`])
        .pipe(dest('deploy/public/assets'));
    cb();
}

function buildClientLoadPage(cb) {
    src(`./client/${PROJECT_NAME}/dist/${PROJECT_NAME}/index.html`)
        .pipe(inject.after('<base href="/">', '<base target="_top">'))
        .pipe(inject.after('<link rel="stylesheet" href="', BASE_URL + '/assets/scripts/'))
        .pipe(inject.afterEach('<script src="', BASE_URL + '/assets/scripts/'))
        .pipe(inject.afterEach('</script>', '\n'))
        .pipe(dest('deploy/build/client/'));
    cb();
}

function wait(cb) {
    setTimeout(() => cb(), 3000);
}

function deployStaticAssets(cb) {
    exec(`"firebase" deploy --only hosting ${(LOCAL_TOKEN)?'--token ' + LOCAL_TOKEN : ''}`, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}


function deployWebapp(cb) {
    exec('"clasp" push --force', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
    cb();
}

function processManifest(cb) {
    src('./appsscript.json').pipe(dest('deploy/build/'));
    cb();
}

function processServerFiles(cb) {
    src('./server/*.*').pipe(dest('deploy/build/server/'));
    cb();
}


function cleanBuild(cb) {
    src('deploy', {read: false, allowEmpty: true}).pipe(clean({force: true}))
    cb();
}


exports.default = defaultTask;
exports.clean_build = cleanBuild;
exports.deploy = parallel(deployStaticAssets, deployWebapp);

exports.build = series(cleanBuild, wait, processServerFiles, processManifest, buildClient,
    copyClientFiles, processClientAssetFiles, processClientOtherFiles, buildClientLoadPage);

exports.deploy_static = deployStaticAssets;
exports.deploy_server = series(cleanBuild, wait, processServerFiles, processManifest, deployWebapp );
