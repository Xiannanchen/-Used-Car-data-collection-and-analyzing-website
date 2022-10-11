const spawn = require('child_process').spawn;

const call_py = (py_file) => new Promise((resolve, reject) => {

    // const ls = spawn('python', ['recommend.py', 'arg1', 'arg2']);
    const ls = spawn('python', [py_file]);

    ls.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
        var d = JSON.parse(data)
        // console.log(d)
        resolve(d)
    });

    ls.stderr.on('data', (data) => {
        // console.log(`stderr: ${data}`);
        reject(data)
    });

    ls.on('close', (code) => {
        // console.log(`child process exited with code ${code}`);
    });
})

module.exports = {
    call_py,
}