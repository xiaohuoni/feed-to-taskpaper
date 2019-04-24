const Octokit = require('@octokit/rest');
const { get: getStore, set: setStore } = require('./store');
const { addNotes } = require('./taskpaper');
const { githubToken } = require('./config');

const store = getStore();
const octokit = new Octokit({
  auth: githubToken,
});

async function fetchStarred() {
  const { data } = await octokit.activity.listReposStarredByUser({
    username: 'sorrycc',
    per_page: 20,
  });
  const notes = [];
  data.forEach(({ full_name, description, html_url }) => {
    if (!store.starred) {
      store.starred = { repos: {} };
    }
    if (!store.starred.repos[full_name]) {
      store.starred.repos[full_name] = 1;
      notes.push({
        title: `${full_name} @star`,
        note: `${description}\n\t\t${html_url}`,
      });
    }
  });
  return notes;
}

async function fetchReadingIssues() {
  const { data } = await octokit.issues.listForRepo({
    owner: 'sorrycc',
    repo: 'reading',
    state: 'open',
  });
  const notes = [];
  data.forEach(({ title, id, body }) => {
    if (!store.reading) {
      store.reading = { issues: {} };
    }
    if (!store.reading.issues[id]) {
      store.reading.issues[id] = 1;
      const url = body.match(/<a.+?>(.+)<\/a>/)[1];
      notes.push({
        title: `${title} @reading`,
        note: `${url}`,
      });
    }
  });
  return notes;
}

async function fetchReleases() {
  const { data } = await octokit.activity.listNotifications({
  });
  const notes = [];
  for (const { subject, repository } of data) {
    const { title, type, url } = subject;
    const id = url.match(/(\d+)$/)[1];
    const { full_name, name } = repository;
    if (!store.release) {
      store.release = { subjects: {} };
    }
    if (type === 'Release' && !store.release.subjects[id]) {
      store.release.subjects[id] = 1;
      notes.push({
        title: `${name} 发布 ${title} @release`,
        note: `https://github.com/${full_name}/releases/tag/${title}`,
      });
    }
  }
  return notes;
}

async function fetchFavoriteTweets() {
  const tweets = await require('./twitter')();
  const notes = [];
  tweets.forEach(({ text, id_str }) => {
    if (!store.twitter.favTweets[id_str]) {
      store.twitter.favTweets[id_str] = 1;
      const title = text.split('\n')[0];
      if (title === text) {
        text = '';
      }
      notes.push({
        title: `${title} @tweet`,
        note: `${text}`,
      });
    }
  });
  return notes;
}

async function getRelease(owner, repo, release_id) {
  return await octokit.repos.getRelease({
    owner,
    repo,
    release_id,
  });
}

function printNotes(notes) {
  notes.forEach(({ title, note }) => {
    console.log(title)
    console.log(note);
    console.log();
  });
}

(async () => {
  let notes;
  
  notes = await fetchStarred();
  addNotes(notes);
  printNotes(notes);

  notes = await fetchReadingIssues();
  addNotes(notes);
  printNotes(notes);

  notes = await fetchFavoriteTweets();
  addNotes(notes);
  printNotes(notes);

  notes = await fetchReleases();
  addNotes(notes);
  printNotes(notes);
  
  // const release = await getRelease('Realytics', 'fork-ts-checker-webpack-plugin', 16897313);
  // console.log(release.data);

  // 更新缓存
  setStore(store);
})();
