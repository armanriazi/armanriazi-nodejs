const fs = require('node:fs/promises');

async function writeFile() {
  try {
    const content = 'New content!';
    await fs.writeFile('file.log', content); // writeFileSync
  } catch (err) {
    console.log(err);
  }
}

async function appendToFile() {
    try {
      const content = 'Some content!';
      await fs.appendFile('file.log', content, err => {
        if (err) {
          console.error(err);
        }
      
     });
    } catch (err) {
      console.log(err);
    }
  }
  


writeFile();
appendToFile();