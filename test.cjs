const urls = [
  "https://script.google.com/macros/s/AKfycbxbQKmoUUH4KzLmkAYZMGpoORPDTFYTzqCpnScEFIw5ngQ1cgzvFWU5fq0OXe2M5Ref/exec",
  "https://script.google.com/macros/s/AKfycbzP9JCAZ3AGLz4VOaQitdLd5fstCCyp7k2nm7NliK8--c6llxzdhGNvMAF1s1kPifJFmg/exec",
  "https://script.google.com/macros/s/AKfycbwrVkWctd_jYKyqziHTDZQfGhcUCjVaUE8p9IUaymt7mPTh6J2oxMtBkOM_ksBzmDHH/exec",
  "https://script.google.com/macros/s/AKfycbzgf5ksoqfknXvJpAidk4NXoIlCdGbtp3UA1jxfHOacwCuAzigal8lsZ-XaLr0XJo4-/exec"
];

async function run() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      try {
        JSON.parse(text);
        console.log(`URL ${url} is valid!`);
      } catch (e) {
        console.log(`URL ${url} returns non-JSON: ${text.substring(0, 50)}...`);
      }
    } catch (err) {
      console.log(`URL ${url} failed to fetch: ${err.message}`);
    }
  }
}

run();
