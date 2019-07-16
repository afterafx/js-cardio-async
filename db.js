const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/

/**
 * Resets the database (does not touch added files)
 */
function reset() {
  const andrew = fs.writeFile(
    './andrew.json',
    JSON.stringify({
      firstname: 'Andrew',
      lastname: 'Maney',
      email: 'amaney@talentpath.com',
    })
  );
  const scott = fs.writeFile(
    './scott.json',
    JSON.stringify({
      firstname: 'Scott',
      lastname: 'Roberts',
      email: 'sroberts@talentpath.com',
      username: 'scoot',
    })
  );
  const post = fs.writeFile(
    './post.json',
    JSON.stringify({
      title: 'Async/Await lesson',
      description: 'How to write asynchronous JavaScript',
      date: 'July 15, 2019',
    })
  );
  const log = fs.writeFile('./log.txt', '');
  return Promise.all([andrew, scott, post, log]);
}

function log(value) {
  return fs.appendFile('log.txt', `${value} ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
function get(file, key) {
  // read form the file
  // handle the promise
  // parse data from string -> JSON
  // use the key to get the value at object[key]
  // append the log file with above value

  return fs
    .readFile(file, 'utf8')
    .then(data => {
      const parsed = JSON.parse(data);
      const value = parsed[key];
      if (!value) return log(`ERROR ${key} invalid key on ${file}`);
      return log(value);
    })
    .catch(err => log(`ERROR no such file or directory ${file}`));
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
function set(file, key, value) {
  return fs
    .readFile(file, 'utf8')
    .then(data => {
      const parsed = JSON.parse(data);
      parsed[key] = value;
      fs.writeFile(file, JSON.stringify(parsed));
      return log(`Setting ${value} to ${key} in ${file} was successfully`);
    })
    .catch(() => log(`ERROR: Setting ${value} to ${key} in ${file} was unsuccessful`));
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
function remove(file, key) {
  return fs
    .readFile(file, 'utf8')
    .then(data => {
      const parsed = JSON.parse(data);
      delete parsed[key];
      fs.writeFile(file, JSON.stringify(parsed));
      return log(`${key} was successfully deleted from ${file}`);
    })
    .catch(() => log(`ERROR: ${key} was not removed from ${file}`));
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  return fs
    .unlink(file)
    .then(() => log(`${file} was successfully deleted`))
    .catch(() => log(`ERROR: ${file} was not deleted successfully`));
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
function createFile(file) {
  return fs
    .writeFile(file, JSON.stringify({}))
    .then(() => {
      log(`${file} was created`);
    })
    .catch(() => log(`ERROR: ${file} was not created`));
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */

// use map to collect all async
// promise all
// await the array
// then run loop to merge all data
function mergeData() {
  return fs
    .readdir('./')
    .then(data => {
      const filteredData = data.filter(
        file => file.includes('.json') && file !== 'package.json' && file !== 'package-lock.json'
      );
      return [filteredData.map(file => fs.readFile(file, 'utf8')), filteredData];
    })
    .then(async results => [await Promise.all(results[0]), results[1]])
    .then(data => {
      const mergedData = {};
      const fileData = data[0];
      const filenames = data[1];
      fileData.forEach((field, i) => {
        const filename = filenames[i].slice(0, filenames[i].indexOf('.'));
        mergedData[filename] = JSON.parse(field);
        // mergedData = { ...mergedData, ...JSON.parse(field) };
      });
      return mergedData;
    })
    .then(data => fs.writeFile('mergedData.json', JSON.stringify(data)))
    .catch(() => log(`ERROR: Files were not merged successfully`));
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {
  const dataArray = [];
  return fs
    .readFile(fileA, 'utf8')
    .then(data => JSON.parse(data))
    .then(dataA => {
      dataArray.push(dataA);
      return fs.readFile(fileB, 'utf8');
    })
    .then(dataB => {
      dataArray.push(dataB);
      return dataArray;
    })
    .then(arrayData => {
      const part1 = arrayData[0];
      const part2 = arrayData[1];
      Array.prototype.push.apply(part1, part2);
      log(part1);
    });
}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

module.exports = {
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
  reset,
};
