const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `  banner1: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEg95Vnb1q5cwp-i2pRJWxjHixacYYgJXC1iNW9O_J7HpTSR5ksw8WRZS-yEiehfa8uvbQiv3cz17xQt0GW1a2G8F1WL6yuXmxelRJZsgcYEv1l9ISpUgvRiNudBO4bDeWUQLjWb-x6IWOU7lxdYVriWhGQyu9VvRxtBNytqC1wig6mXReJ0HZnC7e0un2Mg",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEiRbYidxc8Z_POB5AqCuOsPq1LpMXpvmTnNXZpvbpBJ5TpCMDvdiohn1bU3EfivRxaemyHDG_DMaF0lo1RlM4GmmSO58ZjoEg3MRNL8qP8bHItMJlD3mMZsOadMipi2-CVQdmb40V7WtL5UCUDKqSuSbk9zyvFsMNZjDyisLv0oab6PtNC9KD74LoEwjEvq",`;

const replacement = `  banner1: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEgCPA6tVcBH3S5v1Z8kuza6RZkU4xgxr8xmDfFTWXVe20XthTejclAyfpzC2XueH50MwmRFDlVIF5ZIRjBZeNqjgokoSxt9yv7DXICKl25yK2xiE5WaAPt5Qe-n80SlQjtByruEyvGpeo4txkhtEEIcjKnjV4iAFygZilgqiEfPxJqnjbGo88quaNiOjku7",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEg0cECd44EYPreCyyRdRXdrtpVgQ4zhKzzTRdtiusek9QZ6nOVADqxzHsfsdEmEc2uWMAzaWMRsNXcpsI3cAOarcDnfXSrFyDXvfPQbMfsFsdWRVsv0S6ZcNPDc2GsNLQhv2x9K9ftA9bthdBDkYEkCt5styw5GuPQ1R6ig_ao0lDy_8F69e5bhdQ3Px3zo",`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Fixed banner urls");
} else {
    console.log("Could not find banner urls target");
}

