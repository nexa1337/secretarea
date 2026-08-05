const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "N E X A 1337 - Secret Area",
  "url": "https://nexa1337.com/",
  "description": "Discover premium tools, gaming resources, digital assets, and an exclusive hypervisor ecosystem crafted by N E X A 1337."
});

const newHelmetContent = `
        <Helmet>
          <title>N E X A 1337 - Secret Area</title>
          <meta name="description" content="Discover premium tools, gaming resources, digital assets, and an exclusive hypervisor ecosystem crafted by N E X A 1337." />
          <meta name="keywords" content="NEXA 1337, Secret Area, N E X A 1337, Premium Tools, Hypervisor, Gaming Resources" />
          <meta property="og:title" content="N E X A 1337 - Secret Area" />
          <meta property="og:description" content="Discover premium tools, gaming resources, digital assets, and an exclusive hypervisor ecosystem crafted by N E X A 1337." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="N E X A 1337 - Secret Area" />
          <meta name="twitter:description" content="Discover premium tools, gaming resources, digital assets, and an exclusive hypervisor ecosystem crafted by N E X A 1337." />
          <link rel="canonical" href="https://nexa1337.com/" />
          <script type="application/ld+json">
            {\`${structuredData}\`}
          </script>
        </Helmet>
        <Header />`;

content = content.replace(/<Helmet>[\s\S]*?<Header \/>/g, newHelmetContent);
fs.writeFileSync('App.tsx', content);
console.log('patched SEO in App.tsx');
