var fs = Npm.require('fs');
var path = Npm.require('path');
var cp = Npm.require('child_process');

//var filePathCache = [];

var moduleNameCache = {};

function genIdrisPackage () {
    var packageName = "idrisPackage";
    var modules = _.keys(moduleNameCache);
    var opts = "--codegen javascript -o idris-code.js";
    return "package "+packageName+"\n\n"
        +"modules = "+modules.join("\n	, ")+"\n\n"
        +"opts = \""+opts+"\"";
}

function updateIdrisPackage() {
    fs.writeFile("idris-package.ipkg", genIdrisPackage(),function (err) {
        if(err){
            console.log(err);
        }
    });
}

global.compilationProcess = global.compilationProcess || null;

function spawnCompilation () {
    var proc = cp.spawn("idris",["--build","idris-package.ipkg"]);

    global.compilationProcess = proc;

    proc.stdout.on('data', function(data) {
        process.stdout.write('(IDRIS): ' + data);
    });

    proc.stderr.on('data', function(data) {
        process.stdout.write('(IDRIS-ERR): ' + data);
    });
   
    proc.on("exit",function (code,signal) {
        global.compilationProcess = null;
        if(global.compilationQueued){
            global.compilationQueued = false;
            spawnCompilation();
        }
    });
}

function queueRecompilation () {
    if(global.compilationProcess){
        global.compilationQueued = true;
    } else {
        spawnCompilation();
    }
}

function genJsFromIdrisPackage () {
    queueRecompilation();
}

Plugin.registerSourceHandler("idr", function idrisHandler (compileStep) {
    var fileContents = compileStep.read().toString('utf8');

    //console.log(_.keys(compileStep));
    var match = fileContents.match(/module\s*(.*)/);
    if(match.length>=2){
        var moduleName = match[1];
        moduleNameCache[moduleName]=true;
        //   console.log(moduleNameCache);
    }
    updateIdrisPackage();
    genJsFromIdrisPackage();

    /*compileStep.addJavaScript({
     path: desiredPathName,
     sourcePath: compileStep.inputPath,
     data: compiledTemplates
     });*/
});
