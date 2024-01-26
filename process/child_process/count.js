process.on("message", (msg) => {
  let counter = 0;
  console.log(msg);
  while (counter < 9000000000) {
    counter++;
  }
  process.send(`${counter} finished`);
});
