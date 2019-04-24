const { writeFileSync, readFileSync, existsSync } = require('fs');
const dayjs = require('dayjs');
const { taskpaperPath } = require('../config');

function get() {
  if (!existsSync) {
    return '';
  } else {
    return readFileSync(taskpaperPath, 'utf-8');
  }
}

function set(text) {
  return writeFileSync(taskpaperPath, text, 'utf-8');
}

function addNotes(notes) {
  if (!notes.length) return;
  let text = get();
  let day = dayjs();
  // 有时候会希望把今天的记录到明天，比如我的早报
  if (process.env.TOMORROW) {
    day = day.add(1, 'day');
  }
  const date = day.format('YYYY-MM-DD');
  const dateTitle = `${date}:`
  if (!text.includes(dateTitle)) {
    text = `${dateTitle}\n\n${text}`;
  }
  const notesText = notes.map(({ title, note }) => {
    if (note) {
      return `\t- ${title}\n\t\t${note.trim()}`;
    } else {
      return `\t- ${title}`;
    }
  }).join('\n');
  text = text.replace(dateTitle, `${dateTitle}\n${notesText}`);
  set(text);
}

module.exports = {
  addNotes,
};
