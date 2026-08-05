const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const importReplacement = `import { Helmet } from 'react-helmet-async';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';`;

content = content.replace("import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';", importReplacement);

const helmetContent = `
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
        </Helmet>
        <Header />`;

content = content.replace("<Header />", helmetContent);

fs.writeFileSync('App.tsx', content);
console.log('patched App.tsx');
