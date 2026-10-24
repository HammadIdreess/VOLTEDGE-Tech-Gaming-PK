import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Starting VoltEdge Seed Process (Zero-Docker Standalone)...');

  // 1. Initial Admin & Test Customers
  const adminPassword = await bcrypt.hash('AdminVoltEdge2026!', 10);
  const customerPassword = await bcrypt.hash('CustomerPass123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@voltedge.pk' },
    update: {},
    create: {
      email: 'admin@voltedge.pk',
      name: 'VoltEdge Administrator',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+92 300 1234567',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'hammad.dev@example.pk' },
    update: {},
    create: {
      email: 'hammad.dev@example.pk',
      name: 'Hammad Tariq',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+92 321 9876543',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'zain.gaming@example.pk' },
    update: {},
    create: {
      email: 'zain.gaming@example.pk',
      name: 'Zain Ahmed',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+92 333 5551234',
    },
  });

  // Addresses for customer1
  await prisma.address.deleteMany({ where: { userId: customer1.id } });
  await prisma.address.create({
    data: {
      userId: customer1.id,
      recipientName: 'Hammad Tariq',
      phone: '+92 321 9876543',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 5',
      streetAddress: 'House 42, Sector C, Street 14',
      postalCode: '54000',
      isDefaultShipping: true,
      isDefaultBilling: true,
      deliveryInstructions: 'Call before arriving. Ring doorbell twice.',
    },
  });

  // 2. Brands
  const brandsData = [
    { name: 'ASUS ROG', slug: 'asus-rog', website: 'https://rog.asus.com' },
    { name: 'MSI', slug: 'msi', website: 'https://msi.com' },
    { name: 'AMD', slug: 'amd', website: 'https://amd.com' },
    { name: 'Intel', slug: 'intel', website: 'https://intel.com' },
    { name: 'NVIDIA', slug: 'nvidia', website: 'https://nvidia.com' },
    { name: 'Corsair', slug: 'corsair', website: 'https://corsair.com' },
    { name: 'Razer', slug: 'razer', website: 'https://razer.com' },
    { name: 'Logitech G', slug: 'logitech-g', website: 'https://logitechg.com' },
    { name: 'Samsung', slug: 'samsung', website: 'https://samsung.com' },
    { name: 'Kingston Fury', slug: 'kingston-fury', website: 'https://kingston.com' },
    { name: 'Lian Li', slug: 'lian-li', website: 'https://lian-li.com' },
    { name: 'Seasonic', slug: 'seasonic', website: 'https://seasonic.com' },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { name: b.name, slug: b.slug, website: b.website },
    });
    brandMap.set(b.slug, brand.id);
  }

  // 3. Categories (16 core categories from specification)
  const categoriesData = [
    { name: 'Graphics Cards', slug: 'graphics-cards', sortOrder: 1, description: 'High-performance NVIDIA & AMD GPUs for gaming and rendering.' },
    { name: 'Processors and CPUs', slug: 'processors-cpus', sortOrder: 2, description: 'Latest generation AMD Ryzen and Intel Core desktop processors.' },
    { name: 'Motherboards', slug: 'motherboards', sortOrder: 3, description: 'ATX, Micro-ATX, and Mini-ITX motherboards with cutting-edge chipsets.' },
    { name: 'RAM and Memory', slug: 'ram-memory', sortOrder: 4, description: 'Ultra-fast DDR5 and DDR4 desktop memory kits with RGB cooling.' },
    { name: 'SSDs and Storage', slug: 'ssds-storage', sortOrder: 5, description: 'Gen4 and Gen5 PCIe NVMe SSDs, SATA drives, and enterprise storage.' },
    { name: 'Power Supplies', slug: 'power-supplies', sortOrder: 6, description: '80 Plus Gold, Platinum, and ATX 3.0 power supplies.' },
    { name: 'Computer Cases and Cooling', slug: 'cases-cooling', sortOrder: 7, description: 'Premium airflow chassis, AIO liquid coolers, and quiet fans.' },
    { name: 'Gaming Monitors', slug: 'gaming-monitors', sortOrder: 8, description: 'High refresh rate 144Hz-360Hz Fast IPS and OLED gaming displays.' },
    { name: 'Gaming Keyboards', slug: 'gaming-keyboards', sortOrder: 9, description: 'Mechanical, optical, and wireless hot-swappable keyboards.' },
    { name: 'Gaming Mice', slug: 'gaming-mice', sortOrder: 10, description: 'Ultralight wireless and competitive esports mice with high DPI sensors.' },
    { name: 'Gaming Headsets', slug: 'gaming-headsets', sortOrder: 11, description: 'Spatial audio headsets with noise-cancelling broadcast microphones.' },
    { name: 'Gaming Controllers', slug: 'gaming-controllers', sortOrder: 12, description: 'Pro PC wireless gamepads, hall-effect triggers, and joysticks.' },
    { name: 'Mousepads and Desk Accessories', slug: 'mousepads-desk', sortOrder: 13, description: 'Speed & control desk mats, RGB pads, and monitor arms.' },
    { name: 'Computer Accessories', slug: 'computer-accessories', sortOrder: 14, description: 'Anti-sag GPU brackets, thermal paste, and USB hubs.' },
    { name: 'Networking Equipment', slug: 'networking', sortOrder: 15, description: 'Wi-Fi 7 / 6E routers, Gigabit switches, and PCIe network cards.' },
    { name: 'Cables, Adapters and Connectivity', slug: 'cables-connectivity', sortOrder: 16, description: 'DisplayPort 2.1, HDMI 2.1 8K cables, and high-speed adapters.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, description: c.description, sortOrder: c.sortOrder },
    });
    categoryMap.set(c.slug, cat.id);
  }

  // 4. Products (Curated catalog of 18+ realistic products across all categories with PKR pricing)
  const products = [
    // Graphics Cards
    {
      title: 'ASUS ROG Strix GeForce RTX 4080 Super 16GB OC',
      slug: 'asus-rog-strix-rtx-4080-super-16gb-oc',
      brand: 'asus-rog',
      category: 'graphics-cards',
      basePrice: 385000,
      salePrice: 369999,
      sku: 'GPU-ROG-4080S-16G',
      stock: 7,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: 'DLSS 3, Ada Lovelace architecture, 16GB GDDR6X, Axial-tech fans, metal exoskeleton.',
      desc: 'The ROG Strix GeForce RTX 4080 SUPER brings a whole new meaning to going with the flow. Inside and out, every element of the card gives the monstrous GPU headroom to breathe freely and achieve peak performance.',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'GPU Specs', key: 'Chipset', value: 'NVIDIA GeForce RTX 4080 SUPER' },
        { group: 'GPU Specs', key: 'VRAM', value: '16GB GDDR6X' },
        { group: 'GPU Specs', key: 'Memory Bus', value: '256-bit' },
        { group: 'GPU Specs', key: 'Boost Clock', value: '2670 MHz (OC Mode)' },
        { group: 'Power', key: 'Recommended PSU', value: '750W' },
        { group: 'Connectivity', key: 'Ports', value: '2x HDMI 2.1a, 3x DisplayPort 1.4a' },
      ],
      variants: [
        { name: 'Standard OC Black', sku: 'GPU-ROG-4080S-BLK', priceAdjustment: 0, stock: 4 },
        { name: 'White Edition OC', sku: 'GPU-ROG-4080S-WHT', priceAdjustment: 12000, stock: 3 },
      ]
    },
    {
      title: 'MSI Gaming X Slim GeForce RTX 4070 Ti Super 16GB',
      slug: 'msi-gaming-x-slim-rtx-4070-ti-super',
      brand: 'msi',
      category: 'graphics-cards',
      basePrice: 285000,
      salePrice: 274999,
      sku: 'GPU-MSI-4070TIS-16G',
      stock: 12,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: 'TRI FROZR 3 cooling, TORX Fan 5.0, Airflow Control, 16GB GDDR6X.',
      desc: 'GAMING SLIM series is a thinner variant of the GAMING series while keeping high-performance capabilities and aggressive looks. Tailored for compact high-end builds.',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'GPU Specs', key: 'Chipset', value: 'NVIDIA GeForce RTX 4070 Ti SUPER' },
        { group: 'GPU Specs', key: 'VRAM', value: '16GB GDDR6X' },
        { group: 'GPU Specs', key: 'Memory Bus', value: '256-bit' },
        { group: 'Power', key: 'Recommended PSU', value: '700W' },
      ],
      variants: []
    },
    // Processors
    {
      title: 'AMD Ryzen 7 7800X3D Desktop Gaming Processor',
      slug: 'amd-ryzen-7-7800x3d',
      brand: 'amd',
      category: 'processors-cpus',
      basePrice: 135000,
      salePrice: 124999,
      sku: 'CPU-AMD-7800X3D',
      stock: 18,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: '8 Cores, 16 Threads, 104MB Cache, 3D V-Cache Technology, AM5 Socket.',
      desc: 'The undisputed gaming champion processor. With AMD 3D V-Cache technology, experience lightning-fast frame rates and silky-smooth esports performance.',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Processor', key: 'Socket', value: 'Socket AM5' },
        { group: 'Processor', key: 'Cores / Threads', value: '8 Cores / 16 Threads' },
        { group: 'Processor', key: 'Base Clock', value: '4.2 GHz' },
        { group: 'Processor', key: 'Boost Clock', value: 'Up to 5.0 GHz' },
        { group: 'Processor', key: 'L3 Cache', value: '96MB (104MB Total)' },
        { group: 'Power', key: 'TDP', value: '120W' },
      ],
      variants: []
    },
    {
      title: 'Intel Core i7-14700K 14th Gen Desktop Processor',
      slug: 'intel-core-i7-14700k',
      brand: 'intel',
      category: 'processors-cpus',
      basePrice: 129000,
      salePrice: 119500,
      sku: 'CPU-INT-14700K',
      stock: 15,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: '20 Cores (8P + 12E), 28 Threads, up to 5.6 GHz, LGA1700 Socket.',
      desc: 'Empowering ultimate gaming and heavy multi-threaded productivity workflows. Unlocked multiplier for enthusiast overclocking.',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Processor', key: 'Socket', value: 'LGA1700' },
        { group: 'Processor', key: 'Cores / Threads', value: '20 Cores / 28 Threads' },
        { group: 'Processor', key: 'Max Turbo Frequency', value: '5.6 GHz' },
      ],
      variants: []
    },
    // Motherboards
    {
      title: 'ASUS ROG Crosshair X670E Hero Gaming Motherboard',
      slug: 'asus-rog-crosshair-x670e-hero',
      brand: 'asus-rog',
      category: 'motherboards',
      basePrice: 215000,
      salePrice: 198000,
      sku: 'MB-ROG-X670E-HERO',
      stock: 6,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: 'Socket AM5, PCIe 5.0, DDR5, 18+2 Power Stages, USB4, Wi-Fi 6E.',
      desc: 'Crafted for relentless power delivery and cooling headroom to push AMD Ryzen 7000 & 9000 series processors to unprecedented heights.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Board Specs', key: 'Socket', value: 'AMD AM5' },
        { group: 'Board Specs', key: 'Chipset', value: 'AMD X670E' },
        { group: 'Board Specs', key: 'Form Factor', value: 'ATX' },
        { group: 'Memory', key: 'Memory Slots', value: '4x DDR5 DIMM (Up to 192GB)' },
      ],
      variants: []
    },
    // RAM and Memory
    {
      title: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL30',
      slug: 'corsair-vengeance-rgb-ddr5-32gb-6000mhz',
      brand: 'corsair',
      category: 'ram-memory',
      basePrice: 38500,
      salePrice: 34999,
      sku: 'RAM-COR-DDR5-32G-6000',
      stock: 25,
      isFeatured: true,
      warrantyMonths: 60,
      shortDesc: 'Intel XMP 3.0 & AMD EXPO compatible, Dynamic ten-zone RGB lighting, tight CL30 timings.',
      desc: 'Deliver the higher frequencies and greater capacities of DDR5 technology in a compact, high-performance module designed for AMD and Intel platforms.',
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Memory Specs', key: 'Capacity', value: '32GB (2x 16GB)' },
        { group: 'Memory Specs', key: 'Type', value: 'DDR5' },
        { group: 'Memory Specs', key: 'Speed', value: '6000 MHz' },
        { group: 'Memory Specs', key: 'CAS Latency', value: 'CL30' },
      ],
      variants: [
        { name: '32GB (2x16GB) Black', sku: 'RAM-COR-DDR5-32G-BLK', priceAdjustment: 0, stock: 15 },
        { name: '32GB (2x16GB) White', sku: 'RAM-COR-DDR5-32G-WHT', priceAdjustment: 1500, stock: 10 },
      ]
    },
    // SSDs and Storage
    {
      title: 'Samsung 990 PRO NVMe M.2 SSD 2TB with Heatsink',
      slug: 'samsung-990-pro-nvme-2tb-heatsink',
      brand: 'samsung',
      category: 'ssds-storage',
      basePrice: 58000,
      salePrice: 52999,
      sku: 'SSD-SAM-990P-2TB',
      stock: 20,
      isFeatured: true,
      warrantyMonths: 60,
      shortDesc: 'PCIe Gen 4.0 x4, up to 7,450 MB/s read, 6,900 MB/s write, PS5 and PC compatible.',
      desc: 'Reach near-max performance of PCIe 4.0. The in-house controller smart heat control delivers supreme power efficiency while maintaining blazing speed.',
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Storage', key: 'Capacity', value: '2TB' },
        { group: 'Storage', key: 'Interface', value: 'PCIe Gen 4.0 x4, NVMe 2.0' },
        { group: 'Storage', key: 'Sequential Read', value: 'Up to 7,450 MB/s' },
      ],
      variants: []
    },
    // Power Supplies
    {
      title: 'Seasonic Vertex GX-1000 1000W 80+ Gold ATX 3.0',
      slug: 'seasonic-vertex-gx-1000-atx-3',
      brand: 'seasonic',
      category: 'power-supplies',
      basePrice: 65000,
      salePrice: 59999,
      sku: 'PSU-SEA-VTX-1000',
      stock: 8,
      isFeatured: false,
      warrantyMonths: 120,
      shortDesc: 'ATX 3.0 & PCIe 5.0 12V-2x6 Cable, 80 Plus Gold, Fully Modular, 135mm FDB Fan.',
      desc: 'Designed and built to power new components requiring the ATX 3.0 and PCIe 5.0 standards, delivering rock-solid voltage stability.',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'PSU', key: 'Wattage', value: '1000 Watts' },
        { group: 'PSU', key: 'Efficiency', value: '80 PLUS Gold' },
        { group: 'PSU', key: 'Modularity', value: 'Fully Modular' },
      ],
      variants: []
    },
    // Cases & Cooling
    {
      title: 'Lian Li O11 Vision Dual-Chamber Tempered Glass Chassis',
      slug: 'lian-li-o11-vision-chassis',
      brand: 'lian-li',
      category: 'cases-cooling',
      basePrice: 48000,
      salePrice: 43500,
      sku: 'CASE-LL-O11-VIS',
      stock: 14,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: 'Three-sided borderless tempered glass panels, removable motherboard tray, support for dual 360mm radiators.',
      desc: 'In collaboration with PC Master Race (PCMR), Lian Li presents the O11 Vision with three sides of clear tempered glass providing an unobstructed view of your components.',
      image: 'https://images.unsplash.com/photo-1587202372192-1754fe5756a0?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Case', key: 'Type', value: 'Dual-Chamber Mid-Tower' },
        { group: 'Case', key: 'Motherboard Support', value: 'E-ATX, ATX, Micro-ATX' },
        { group: 'Case', key: 'GPU Clearance', value: '455 mm' },
      ],
      variants: [
        { name: 'O11 Vision Black', sku: 'CASE-LL-O11-VIS-BLK', priceAdjustment: 0, stock: 8 },
        { name: 'O11 Vision White', sku: 'CASE-LL-O11-VIS-WHT', priceAdjustment: 2000, stock: 6 },
      ]
    },
    // Gaming Monitors
    {
      title: 'ASUS ROG Swift OLED PG27AQDM 27" 240Hz Gaming Monitor',
      slug: 'asus-rog-swift-oled-pg27aqdm',
      brand: 'asus-rog',
      category: 'gaming-monitors',
      basePrice: 310000,
      salePrice: 289999,
      sku: 'MON-ROG-OLED-27',
      stock: 5,
      isFeatured: true,
      warrantyMonths: 36,
      shortDesc: '27-inch 1440p QHD OLED, 240Hz, 0.03ms response time, G-SYNC compatible, custom heatsink.',
      desc: 'Equipped with a 3rd-generation OLED panel that delivers unmatched pixel response and deep infinite contrast ratios for competitive advantage.',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Display', key: 'Screen Size', value: '26.5 Inch' },
        { group: 'Display', key: 'Panel Type', value: 'OLED' },
        { group: 'Display', key: 'Resolution', value: '2560 x 1440 (QHD)' },
        { group: 'Display', key: 'Refresh Rate', value: '240 Hz' },
      ],
      variants: []
    },
    // Gaming Keyboards
    {
      title: 'Razer Huntsman V3 Pro Tenkeyless Analog Optical Keyboard',
      slug: 'razer-huntsman-v3-pro-tkl',
      brand: 'razer',
      category: 'gaming-keyboards',
      basePrice: 62000,
      salePrice: 56999,
      sku: 'KB-RAZ-HUN-V3TKL',
      stock: 16,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: '2nd-Gen Analog Optical Switches, Rapid Trigger Mode, adjustable actuation 0.1 to 4.0 mm.',
      desc: 'Take your esports mastery to the extreme with the Razer Huntsman V3 Pro TKL. Unleash lightning-fast repeat inputs with Rapid Trigger mode.',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Keyboard', key: 'Switch Type', value: 'Razer Analog Optical Switch Gen-2' },
        { group: 'Keyboard', key: 'Size / Form Factor', value: 'Tenkeyless (80%)' },
      ],
      variants: []
    },
    // Gaming Mice
    {
      title: 'Logitech G PRO X SUPERLIGHT 2 Wireless Esports Mouse',
      slug: 'logitech-g-pro-x-superlight-2',
      brand: 'logitech-g',
      category: 'gaming-mice',
      basePrice: 44000,
      salePrice: 39999,
      sku: 'MICE-LOG-GPX2',
      stock: 22,
      isFeatured: true,
      warrantyMonths: 24,
      shortDesc: '60g Ultra-lightweight, HERO 2 Sensor 32,000 DPI, LIGHTFORCE Hybrid Switches, 2000Hz polling rate.',
      desc: 'The next icon of championship gaming gear. Refined in collaboration with the world’s top esports pros.',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Mouse', key: 'Weight', value: '60 grams' },
        { group: 'Mouse', key: 'Sensor', value: 'HERO 2 (100 - 32,000 DPI)' },
        { group: 'Mouse', key: 'Polling Rate', value: 'Up to 2,000 Hz' },
      ],
      variants: [
        { name: 'Matte Black', sku: 'MICE-LOG-GPX2-BLK', priceAdjustment: 0, stock: 12 },
        { name: 'Clean White', sku: 'MICE-LOG-GPX2-WHT', priceAdjustment: 0, stock: 7 },
      ]
    },
    // Gaming Headsets
    {
      title: 'Razer BlackShark V2 Pro (2023) Wireless Gaming Headset',
      slug: 'razer-blackshark-v2-pro-2023',
      brand: 'razer',
      category: 'gaming-headsets',
      basePrice: 58000,
      salePrice: 51999,
      sku: 'HS-RAZ-BSV2P',
      stock: 11,
      isFeatured: false,
      warrantyMonths: 24,
      shortDesc: 'HyperClear Super Wideband Mic, TriForce Titanium 50mm Drivers, 70hr battery life, Bluetooth & 2.4GHz.',
      desc: 'Engineered for pure esports performance. Features a crystal-clear broadcast-grade mic and ultra-soft memory foam ear cushions.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Audio', key: 'Driver Size', value: '50mm Razer TriForce Titanium' },
        { group: 'Audio', key: 'Microphone', value: 'Razer HyperClear Super Wideband' },
      ],
      variants: []
    },
    // Controllers
    {
      title: 'Xbox Wireless Controller (Carbon Black) + USB-C Cable',
      slug: 'xbox-wireless-controller-carbon-black',
      brand: 'logitech-g',
      category: 'gaming-controllers',
      basePrice: 19500,
      salePrice: 17499,
      sku: 'CTRL-XB-BLK',
      stock: 19,
      isFeatured: false,
      warrantyMonths: 12,
      shortDesc: 'Sculpted surfaces, hybrid D-pad, textured grip on triggers and bumpers, seamless PC compatibility.',
      desc: 'Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry for enhanced comfort during gameplay on PC.',
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Controller', key: 'Compatibility', value: 'Windows 11/10, Xbox Series X|S, Android' },
      ],
      variants: []
    },
    // Desk accessories
    {
      title: 'Corsair MM700 RGB Extended 3XL Cloth Gaming Mousepad',
      slug: 'corsair-mm700-rgb-extended-3xl',
      brand: 'corsair',
      category: 'mousepads-desk',
      basePrice: 22000,
      salePrice: 19500,
      sku: 'PAD-COR-MM700-3XL',
      stock: 14,
      isFeatured: false,
      warrantyMonths: 12,
      shortDesc: '1220mm x 610mm massive desk surface, 3-zone 360° dynamic RGB lighting, built-in 2-port USB hub.',
      desc: 'Cover your entire gaming area with a vast 1,220mm x 610mm surface, providing abundant room for your mouse, keyboard, and more.',
      image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Dimensions', key: 'Size', value: '1220mm x 610mm x 4mm' },
      ],
      variants: []
    },
    // Networking
    {
      title: 'ASUS ROG Rapture GT-AXE16000 Quad-Band Wi-Fi 6E Gaming Router',
      slug: 'asus-rog-rapture-gt-axe16000',
      brand: 'asus-rog',
      category: 'networking',
      basePrice: 185000,
      salePrice: 169999,
      sku: 'NET-ROG-AXE16000',
      stock: 4,
      isFeatured: false,
      warrantyMonths: 36,
      shortDesc: 'World first Quad-Band Wi-Fi 6E gaming router, dual 10G ports, four 1G ports, 2.5G WAN port, AiMesh.',
      desc: 'Break through speed limits with quad-band speeds up to 16,000 Mbps and the ultimate traffic prioritization for zero-lag gaming in Pakistan.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Network', key: 'Wi-Fi Standard', value: 'Wi-Fi 6E Quad-Band' },
        { group: 'Network', key: 'Speed', value: 'Up to 16,000 Mbps' },
      ],
      variants: []
    },
    // Cables
    {
      title: 'VoltEdge Certified DisplayPort 2.1 VESA Cable 80Gbps 2M',
      slug: 'voltedge-certified-dp-2-1-cable-2m',
      brand: 'asus-rog',
      category: 'cables-connectivity',
      basePrice: 6500,
      salePrice: 5200,
      sku: 'CAB-VE-DP21-2M',
      stock: 60,
      isFeatured: false,
      warrantyMonths: 24,
      shortDesc: 'UHBR20 80Gbps bandwidth, supports 16K@60Hz, 8K@120Hz, 4K@240Hz HDR with nylon braiding.',
      desc: 'Future-proof heavy-duty DisplayPort 2.1 cable built with 24K gold plated connectors and triple EMI shielding.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
      specs: [
        { group: 'Cable', key: 'Length', value: '2.0 Meters' },
        { group: 'Cable', key: 'Bandwidth', value: '80 Gbps' },
      ],
      variants: []
    }
  ];

  for (const p of products) {
    const brandId = brandMap.get(p.brand) || brandMap.values().next().value!;
    const categoryId = categoryMap.get(p.category) || categoryMap.values().next().value!;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stock: p.stock,
        isFeatured: p.isFeatured,
      },
      create: {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDesc,
        description: p.desc,
        brandId,
        categoryId,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        sku: p.sku,
        stock: p.stock,
        isFeatured: p.isFeatured,
        warrantyMonths: p.warrantyMonths,
        images: {
          create: [
            { url: p.image, altText: p.title, isPrimary: true, sortOrder: 0 }
          ]
        },
        specifications: {
          create: p.specs.map((s, idx) => ({
            groupName: s.group,
            specKey: s.key,
            specValue: s.value,
            sortOrder: idx
          }))
        },
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock
          }))
        }
      }
    });

    if (p.isFeatured) {
      await prisma.productReview.deleteMany({ where: { productId: product.id } });
      await prisma.productReview.create({
        data: {
          productId: product.id,
          userId: customer1.id,
          rating: 5,
          title: 'Outstanding performance and fast delivery in Lahore!',
          comment: `Ordered this from VoltEdge and received genuine sealed unit within 48 hours. Benchmark scores and temperatures are phenomenal.`,
          isVerifiedPurchase: true,
          isApproved: true,
        }
      });
    }
  }

  // 5. Coupons
  const coupons = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 25000,
      maxDiscountAmount: 15000,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'VOLTGAMING',
      discountType: 'FIXED',
      discountValue: 2500,
      minOrderAmount: 30000,
      usageLimit: 200,
      isActive: true,
    },
    {
      code: 'SUPERDEAL',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderAmount: 100000,
      maxDiscountAmount: 25000,
      usageLimit: 50,
      isActive: true,
    }
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 6. Sample Initial Order
  const sampleProduct = await prisma.product.findFirst({ where: { slug: 'amd-ryzen-7-7800x3d' } });
  if (sampleProduct) {
    const existingOrder = await prisma.order.findFirst({ where: { orderNumber: 'VE-20261024-8901' } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          orderNumber: 'VE-20261024-8901',
          userId: customer1.id,
          customerName: 'Hammad Tariq',
          customerEmail: 'hammad.dev@example.pk',
          customerPhone: '+92 321 9876543',
          shippingProvince: 'Punjab',
          shippingCity: 'Lahore',
          shippingArea: 'DHA Phase 5',
          shippingAddress: 'House 42, Sector C, Street 14',
          shippingPostalCode: '54000',
          subtotal: 124999,
          discountAmount: 2500,
          shippingFee: 500,
          taxAmount: 0,
          totalAmount: 122999,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'BANK_TRANSFER',
          couponCode: 'VOLTGAMING',
          items: {
            create: [
              {
                productId: sampleProduct.id,
                productTitle: sampleProduct.title,
                sku: sampleProduct.sku,
                unitPrice: 124999,
                quantity: 1,
                totalPrice: 124999,
              }
            ]
          },
          statusHistory: {
            create: [
              { status: 'PENDING_CONFIRMATION', notes: 'Order placed by customer via Direct Bank Transfer.' },
              { status: 'CONFIRMED', notes: 'Bank transfer payment verified by Accounts.' }
            ]
          },
          payments: {
            create: [
              {
                amount: 122999,
                currency: 'PKR',
                provider: 'MANUAL_BANK',
                transactionReference: 'HBL-FT-99201481',
                status: 'PAID',
                receivedAt: new Date(),
              }
            ]
          }
        }
      });
    }
  }

  // 7. Store Settings
  const settings = [
    { key: 'STORE_NAME', value: JSON.stringify('VoltEdge') },
    { key: 'STORE_CURRENCY', value: JSON.stringify('PKR') },
    { key: 'STORE_COUNTRY', value: JSON.stringify('Pakistan') },
    { key: 'FLAT_SHIPPING_FEE', value: JSON.stringify(500) },
    { key: 'FREE_SHIPPING_THRESHOLD', value: JSON.stringify(50000) },
    { key: 'TAX_RATE_PERCENT', value: JSON.stringify(0) },
    { key: 'COD_ENABLED', value: JSON.stringify(true) },
    { key: 'BANK_TRANSFER_ENABLED', value: JSON.stringify(true) },
    {
      key: 'BANK_DETAILS',
      value: JSON.stringify({
        bankName: 'Habib Bank Limited (HBL)',
        accountTitle: 'VoltEdge Technologies (Pvt) Ltd',
        accountNumber: '10927901824103',
        iban: 'PK36HABB0010927901824103',
        branch: 'Y-Block DHA Lahore',
      })
    }
  ];

  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log('✅ VoltEdge Standalone Seed Finished Successfully!');
  console.log('👤 Admin: admin@voltedge.pk / AdminVoltEdge2026!');
  console.log('👤 Customer: hammad.dev@example.pk / CustomerPass123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
