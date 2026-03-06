export const PRODUCT_POOL = [
  { name: 'Wireless Bluetooth Headphones', desc: 'Premium noise-cancelling headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { name: 'Smart Watch Pro', desc: 'Fitness tracker with heart rate monitor', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { name: 'Laptop Backpack', desc: 'Water-resistant travel backpack', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' },
  { name: 'Power Bank 20000mAh', desc: 'Fast charging portable battery', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600' },
  { name: 'Gaming Mouse RGB', desc: 'Programmable gaming mouse', img: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600' },
  { name: 'USB-C Hub Adapter', desc: 'Multi-port USB hub', img: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600' },
  { name: 'Mechanical Keyboard', desc: 'RGB backlit gaming keyboard', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600' },
  { name: 'Webcam HD 1080p', desc: 'High definition webcam', img: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600' },
  { name: 'Phone Stand Adjustable', desc: 'Aluminum phone holder', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600' },
  { name: 'LED Desk Lamp', desc: 'Dimmable LED desk light', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600' },
  { name: 'Bluetooth Speaker', desc: 'Portable wireless speaker', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600' },
  { name: 'Wireless Charger Pad', desc: 'Fast wireless charging pad', img: 'https://images.unsplash.com/photo-1591290619762-c588f0e8e23f?w=600' },
  { name: 'Cable Organizer Set', desc: 'Cable management kit', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  { name: 'Screen Protector Glass', desc: 'Tempered glass protector', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600' },
  { name: 'Laptop Cooling Pad', desc: 'Adjustable cooling stand', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600' },
  { name: 'Portable SSD 1TB', desc: 'External solid state drive', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600' },
  { name: 'Noise Cancelling Earbuds', desc: 'True wireless earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600' },
  { name: 'Fitness Tracker Band', desc: 'Activity tracking smartband', img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600' },
  { name: 'Tablet Stand Holder', desc: 'Adjustable tablet mount', img: 'https://images.unsplash.com/photo-1585790050230-5dd28404f1e9?w=600' },
  { name: 'Ring Light for Video', desc: 'LED ring light with tripod', img: 'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=600' }
]

for (let i = 21; i <= 150; i++) {
  const types = ['Pro', 'Plus', 'Max', 'Ultra', 'Premium', 'Elite', 'Advanced', 'Smart']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Silver', 'Gold', 'Rose Gold', 'Space Gray']
  const type = types[i % types.length]
  const color = colors[i % colors.length]
  PRODUCT_POOL.push({
    name: `Tech Gadget ${type} ${i} ${color}`,
    desc: `High quality ${type.toLowerCase()} gadget in ${color.toLowerCase()}`,
    img: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=600`
  })
}
