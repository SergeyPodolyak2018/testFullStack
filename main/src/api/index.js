
export function getUsers() {
  return fetch('https://jsonplaceholder.typicode.com/users');
}

export function getAlboms(id) {
  return fetch(`https://jsonplaceholder.typicode.com/albums?userId=${id}`);
}

export function getPosts(id) {
  return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
}
