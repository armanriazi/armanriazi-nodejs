const crypto = require("crypto");
const execTime = require("execution-time")(); //worker_threads_pool

function callCrypto() {
  execTime.start();
  crypto.pbkdf2("someSecret", "salt", 500000, 512, "sha512", (err, key) => {
    console.log(key);
    console.log(execTime.stop());
    console.log("-------------------");
  });
}

callCrypto();
callCrypto();
callCrypto();
callCrypto();
callCrypto();
callCrypto();
