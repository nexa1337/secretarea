async function run() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbzgf5ksoqfknXvJpAidk4NXoIlCdGbtp3UA1jxfHOacwCuAzigal8lsZ-XaLr0XJo4-/exec");
  const data = await res.json();
  const game = data.steamtools.find(t => t.ratingPositive);
  console.log(game);
}
run();
