async function run() {
  const res = await fetch('https://script.google.com/macros/s/AKfycbwrVkWctd_jYKyqziHTDZQfGhcUCjVaUE8p9IUaymt7mPTh6J2oxMtBkOM_ksBzmDHH/exec');
  const data = await res.json();
  console.log(Object.keys(data));
  console.log(data['topgames']);
}
run();
