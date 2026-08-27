const GPU_DATA = {
  AMD: [
    "Radeon RX 9070 XT", "Radeon RX 7900 XTX", "Radeon RX 9070", "Radeon RX 7900 XT",
    "Radeon RX 9060 XT", "Radeon RX 7900 GRE", "Radeon RX 6950 XT", "Radeon RX 6900 XT",
    "Radeon RX 7800 XT", "Radeon RX 6800 XT", "Radeon RX 6800", "Radeon RX 7700 XT",
    "Radeon RX 6750 XT", "Radeon RX 6700 XT", "Radeon RX 7600 XT", "Radeon RX 5700 XT",
    "Radeon RX 6650 XT", "Radeon RX 7600", "Radeon RX 6600 XT", "Radeon RX 5700",
    "Radeon RX 6600", "Radeon RX 5600 XT", "Radeon RX 6700", "Radeon RX 590",
    "Radeon RX 580", "Radeon RX 5500 XT", "Radeon RX 480", "Radeon R9 390",
    "Radeon RX 570", "Radeon RX 6500 XT", "Radeon R9 290X", "Radeon RX 470",
    "Radeon R9 290", "Radeon R9 380", "Radeon RX 6400", "Radeon R9 280X",
    "Radeon R9 285", "Radeon R9 370", "Radeon HD 7970", "Radeon R9 270X",
    "Radeon HD 7950", "Radeon RX 560", "Radeon RX 460", "Radeon R7 370",
    "Radeon HD 7870", "Radeon HD 7800", "Radeon HD 6950", "Radeon HD 7850",
    "Radeon R7 265", "Radeon R7 260X", "Radeon HD 5870", "Radeon HD 6870",
    "Radeon HD 7790", "Radeon RX 550", "Radeon R7 360", "Radeon HD 6850",
    "Radeon HD 6970", "Radeon HD 5850", "Radeon HD 7770", "Radeon HD 5750",
    "Radeon HD 6790", "Radeon HD 7750", "Radeon HD 6770", "Radeon HD 5770",
    "Radeon R7 250", "Radeon HD 5570", "Radeon HD 6670", "Radeon HD 6570",
    "Radeon HD 4850", "Radeon HD 3870", "Radeon R7 240", "Radeon HD 5450",
    "Radeon HD 3850"
  ],
  Intel: [
    "Arc B580", "Arc A770", "Arc A750", "Arc A580", "Arc A380",
    "Intel HD 4000", "Intel HD 630", "Intel UHD 630"
  ],
  NVIDIA: [
    "GeForce RTX 5090", "GeForce RTX 5080", "GeForce RTX 4090", "GeForce RTX 5070 Ti",
    "GeForce RTX 4080 Super", "GeForce RTX 5070", "GeForce RTX 4080", "GeForce RTX 4070 Ti Super",
    "GeForce RTX 4070 Ti", "GeForce RTX 4070 Super", "GeForce RTX 3090 Ti", "GeForce RTX 3090",
    "GeForce RTX 4070", "GeForce RTX 3080 Ti", "GeForce RTX 3080", "GeForce RTX 4060 Ti",
    "GeForce RTX 3070 Ti", "GeForce RTX 2080 Ti", "GeForce RTX 3070", "GeForce RTX 2080 Super",
    "GeForce RTX 4060", "GeForce RTX 2080", "GeForce RTX 4050 Ti", "GeForce RTX 3060 Ti",
    "GeForce RTX 2070 Super", "GeForce RTX 4050", "GeForce GTX 1080 Ti", "GeForce RTX 2070",
    "GeForce RTX 3060", "GeForce RTX 2060 Super", "GeForce GTX 1080", "GeForce RTX 2060",
    "GeForce GTX 1070 Ti", "GeForce GTX 1070", "GeForce RTX 3050", "GeForce GTX 1660 Ti",
    "GeForce GTX 1660 Super", "GeForce GTX 1660", "GeForce GTX 980 Ti", "GeForce GTX 1060 6GB",
    "GeForce GTX 1650 Super", "GeForce GTX 980", "GeForce GTX 1060 3GB", "GeForce GTX 970",
    "GeForce GTX 1650", "GeForce GTX 780 Ti", "GeForce GTX 1050 Ti", "GeForce GTX 780",
    "GeForce GTX 960", "GeForce GTX 1050", "GeForce GTX 770", "GeForce GTX 680",
    "GeForce GTX 670", "GeForce GTX 660 Ti", "GeForce GTX 760", "GeForce GTX 950",
    "GeForce GTX 1630", "GeForce GTX 660", "GeForce GTX 750 Ti", "GeForce GTX 580",
    "GeForce GTX 560 Ti", "GeForce GTX 570", "GeForce GTX 560", "GeForce GTX 480",
    "GeForce GTX 750", "GeForce GTX 470", "GeForce GTX 550 Ti", "GeForce GTX 650 Ti",
    "GeForce GT 750", "GeForce GT 1030", "GeForce GTX 460", "GeForce GTX 650",
    "GeForce GT 740", "GeForce GTX 630", "GeForce GT 730", "GeForce GT 630",
    "GeForce GT 640", "GeForce GT 540", "GeForce GTX 260", "GeForce GT 430",
    "GeForce GT 440", "GeForce GT 520", "GeForce GT 530", "GeForce GT 610",
    "GeForce GT 710"
  ]
};

const CPU_DATA = {
  AMD: [
    "Ryzen 9 9950X", "Ryzen 9 9900X", "Ryzen 9 7950X3D", "Ryzen 9 7950X",
    "Ryzen 7 9800X3D", "Ryzen 9 7900X", "Ryzen 7 7800X3D", "Ryzen 7 9700X",
    "Ryzen 7 7700X", "Ryzen 5 9600X", "Ryzen 9 5950X", "Ryzen 9 5900X",
    "Ryzen 5 7600X", "Ryzen 7 5800X3D", "Ryzen 5 7600", "Ryzen 9 3950X",
    "Ryzen 5 7500F", "Ryzen 7 5800X", "Ryzen 9 3900X", "Ryzen 7 5700X",
    "Ryzen 5 5600X", "Ryzen 7 3800X", "Ryzen 5 5600", "Ryzen 7 3700X",
    "Ryzen 5 3600X", "Ryzen 5 3600", "Ryzen 5 5500", "Ryzen 7 2700X",
    "Ryzen 5 2600X", "Ryzen 7 1800X", "Ryzen 5 2600", "Ryzen 3 3300X",
    "Ryzen 7 1700", "Ryzen 3 3100", "Ryzen 5 1600", "Ryzen 5 1500X",
    "Ryzen 5 1400", "Ryzen 3 1300X", "Ryzen 3 2200G", "Ryzen 3 1200",
    "FX-9590", "FX-8350", "FX-6300", "A10-7850K", "FX-6120", "FX-4300",
    "A8-6600K", "FX-4350", "FX-4100", "Phenom II X4 965", "Phenom II X4 940"
  ],
  Intel: [
    "Core Ultra 9 285K", "Core i9-14900K", "Core i9-13900K", "Core Ultra 7 265K",
    "Core i7-14700K", "Core i7-13700K", "Core i9-12900K", "Core Ultra 5 245K",
    "Core i5-14600K", "Core i7-12700K", "Core i5-13600K", "Core i5-12600K",
    "Core i9-10900K", "Core i9-11900K", "Core i5-14400", "Core i7-11700K",
    "Core i5-13400", "Core i7-10700K", "Core i9-9900K", "Core i5-12400",
    "Core i5-11600K", "Core i7-9700", "Core i7-9700K", "Core i5-10600K",
    "Core i7-8700K", "Core i5-11400", "Core i3-13100", "Core i5-10400F",
    "Core i7-8700", "Core i5-9600K", "Core i5-10400", "Core i3-12100",
    "Core i7-7700K", "Core i5-8600K", "Core i5-9400F", "Core i7-7700",
    "Core i7-6700K", "Core i5-8400", "Core i5-7600K", "Core i7-4790K",
    "Core i7-6700", "Core i5-7600", "Core i5-6600K", "Core i7-4770",
    "Core i5-7500", "Core i3-10100", "Core i5-6600", "Core i5-6500",
    "Core i5-7400", "Core i5-6400", "Core i7-4790", "Core i5-4590",
    "Core i3-8100", "Core i7-3770K", "Core i5-4460", "Core i7-3770",
    "Core i7-3820", "Core i5-4690", "Core i5-4670K", "Core i3-6100",
    "Core i5-3470", "Core i7-2600", "Core i5-4440", "Core i5-2500K",
    "Core i3-4130", "Core i5-2400", "Core i5-3570", "Core i5-2500",
    "Core i5-2300", "Core i3-2100", "Core i3-3240", "Core i5-750",
    "Core i7-920", "Core i5-650", "Core i3-530"
  ]
};

console.log("Export ready");
