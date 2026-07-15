const fakeComments = [];
const itemId = 'G206';
for (let i = 0; i < 5; i++) {
  fakeComments.push({ id: `fake-${itemId}-${i}` });
}
const loadedComments = [
  { id: `fake-${itemId}-0` },
  { id: `fake-${itemId}-2` }
];
const allComments = [...fakeComments, ...loadedComments];
const uniqueComments = Array.from(new Map(allComments.map(c => [c.id, c])).values());

console.log(allComments.map(c => c.id));
console.log(uniqueComments.map(c => c.id));
