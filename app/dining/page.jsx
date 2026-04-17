'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Plus, Minus, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

// ── MENU DATA ─────────────────────────────────────────────
const MENU = {
  Breakfast: [
    { id: 'bk1', name: 'Full Breakfast',         desc: 'Eggs, sausage, toast, beans, and grilled tomato',        price: 800,  tags: [],           image: '/images/food/full-breakfast.jpg'        },
    { id: 'bk2', name: 'Continental Breakfast',   desc: 'Toast, butter, jam, juice, and tea or coffee',           price: 1000, tags: ['v'],         image: '/images/food/continental-breakfast.jpg' },
    { id: 'bk3', name: 'Half Breakfast',          desc: 'Fried eggs with toast, butter, and a hot beverage',      price: 600,  tags: ['v'],         image: '/images/food/fried-eggs.jpg'            },
    { id: 'bk4', name: 'Boiled Eggs',             desc: 'Two boiled eggs served with toast',                      price: 100,  tags: ['v'],         image: '/images/food/boiled-eggs.jpg'           },
    { id: 'bk5', name: 'Scrambled Eggs',          desc: 'Scrambled eggs on buttered toast',                       price: 150,  tags: ['v'],         image: '/images/food/scrambled-eggs.jpg'        },
    { id: 'bk6', name: 'Omelette',                desc: 'Plain or filled omelette with toast',                    price: 150,  tags: ['v'],         image: '/images/food/omelette.jpg'              },
  ],
  'Fish & Seafood': [
    { id: 'f1', name: 'Fried Tilapia (Whole)',    desc: 'Fresh Lake Victoria tilapia, deep-fried, served with ugali and sukuma wiki', price: 700, tags: ['gf'], image: '/images/fish.jpg'                  },
    { id: 'f2', name: 'Grilled Fish',             desc: 'Grilled tilapia fillet with ugali and vegetables',       price: 800,  tags: ['gf'],        image: '/images/food/grilled-tilapia.jpg'       },
    { id: 'f3', name: 'Fried Fish Fillet',        desc: 'Crispy fried fish fillet with chips and salad',          price: 600,  tags: [],            image: '/images/food/fish-fillet.jpg'           },
    { id: 'f4', name: 'Fish & Chips',             desc: 'Battered fish served with fries and tartar sauce',       price: 900,  tags: [],            image: '/images/fish and chips.jpg'             },
  ],
  'Beef & Chicken': [
    { id: 'c1', name: 'Chicken Stew',             desc: 'Tender chicken in rich tomato and onion gravy, served with rice or ugali', price: 650, tags: ['gf'], image: '/images/chicken stew.jpg'         },
    { id: 'c2', name: 'Fried Chicken',            desc: 'Crispy golden fried chicken with chips and coleslaw',   price: 700,  tags: [],            image: '/images/food/fried-chicken.jpg'         },
    { id: 'c3', name: 'Grilled Chicken',          desc: 'Marinated grilled chicken with chips and salad',        price: 700,  tags: ['gf'],        image: '/images/food/grilled-chicken.jpg'       },
    { id: 'c4', name: 'Beef Stew',                desc: 'Slow-cooked beef in savory gravy, served with ugali or rice', price: 550, tags: ['gf'],   image: '/images/food/beef-stew.jpg'             },
    { id: 'c5', name: 'Nyama Choma',              desc: 'Charcoal-grilled beef with kachumbari and ugali',       price: 600,  tags: ['gf'],        image: '/images/food/nyama-choma.jpg'           },
    { id: 'c6', name: 'Mutton Stew',              desc: 'Tender mutton slow-cooked in aromatic spices',          price: 550,  tags: ['gf'],        image: '/images/food/mutton-stew.jpg'           },
  ],
  'Snacks & Starters': [
    { id: 'sn1', name: 'Samosa (2 pcs)',          desc: 'Crispy pastry filled with spiced minced meat or vegetables', price: 150, tags: [],         image: '/images/samosa.jpg'                     },
    { id: 'sn2', name: 'Spring Rolls (2 pcs)',    desc: 'Crispy rolls filled with seasoned vegetables',          price: 150,  tags: ['v'],         image: '/images/food/spring-rolls.jpg'          },
    { id: 'sn3', name: 'Chips (Fries)',           desc: 'Golden fried potato chips with tomato sauce',           price: 200,  tags: ['v', 'vg'],   image: '/images/food/chips.jpg'                 },
    { id: 'sn4', name: 'Chips & Egg',             desc: 'Fries served with a fried egg',                        price: 350,  tags: ['v'],         image: '/images/food/chips-egg.jpg'             },
    { id: 'sn5', name: 'Sandwich',                desc: 'Toasted sandwich — chicken, beef, or vegetable filling', price: 350, tags: [],            image: '/images/food/sandwich.jpg'              },
    { id: 'sn6', name: 'Pizza (Personal)',        desc: 'Stone-baked personal pizza with toppings of your choice', price: 800, tags: [],           image: '/images/pizza.jpg'                      },
  ],
  'Vegetables & Sides': [
    { id: 'vg1', name: 'Ugali & Sukuma Wiki',     desc: 'Maize meal with stir-fried kale — a Kenyan staple',    price: 200,  tags: ['v', 'vg', 'gf'], image: '/images/food/ugali-sukuma.jpg'       },
    { id: 'vg2', name: 'Steamed Rice',            desc: 'Plain steamed rice',                                    price: 100,  tags: ['v', 'vg', 'gf'], image: '/images/food/steamed-rice.jpg'       },
    { id: 'vg3', name: 'Vegetable Curry',         desc: 'Seasonal vegetables in aromatic curry sauce with rice', price: 250, tags: ['v', 'vg'],   image: '/images/local vegetables.jpg'           },
    { id: 'vg4', name: 'Mixed Salad',             desc: 'Fresh garden salad with tomatoes, cucumber, and onion', price: 150, tags: ['v', 'vg', 'gf'], image: '/images/food/mixed-salad.jpg'        },
    { id: 'vg5', name: 'Pilau Rice',              desc: 'Fragrant East African spiced rice',                     price: 150,  tags: ['v'],         image: '/images/food/pilau-rice.jpg'            },
  ],
  Beverages: [
    { id: 'bv1', name: 'Tea',                     desc: 'Hot black or masala chai with milk',                    price: 150,  tags: ['v'],         image: '/images/food/tea.jpg'                   },
    { id: 'bv2', name: 'Coffee',                  desc: 'Hot Kenyan coffee — black or with milk',                price: 100,  tags: ['v'],         image: '/images/food/coffee.jpg'                },
    { id: 'bv3', name: 'Fresh Juice',             desc: 'Freshly blended fruit juice — mango, passion, or mix', price: 200,  tags: ['v', 'vg', 'gf'], image: '/images/food/fresh-juice.jpg'        },
    { id: 'bv4', name: 'Fruit Shake / Smoothie',  desc: 'Blended fruit shake with milk or water base',           price: 450,  tags: ['v'],         image: '/images/food/fruit-shake.jpg'           },
    { id: 'bv5', name: 'Soda (Soft Drink)',       desc: 'Coke, Fanta, Sprite, or Stoney (300ml)',                price: 100,  tags: ['v', 'vg'],   image: '/images/food/soda.jpg'                  },
    { id: 'bv6', name: 'Mineral Water',           desc: 'Still or sparkling (500ml)',                            price: 100,  tags: ['v', 'vg', 'gf'], image: '/images/food/mineral-water.jpg'      },
    { id: 'bv7', name: 'Tusker Lager',            desc: 'Ice-cold Kenyan beer (500ml)',                          price: 250,  tags: [],            image: '/images/food/tusker-lager.jpg'          },
    { id: 'bv8', name: 'Tusker Malt',             desc: 'Tusker Malt lager (500ml)',                             price: 300,  tags: [],            image: '/images/food/tusker-malt.jpg'           },
  ],
}

const CATEGORIES = Object.keys(MENU)

const TAG_LABELS = { v: 'Vegetarian', vg: 'Vegan', gf: 'Gluten-Free' }
const TAG_COLORS  = { v: 'bg-emerald-50 text-emerald-600', vg: 'bg-green-50 text-green-700', gf: 'bg-amber-50 text-amber-600' }

export default function DiningPage() {
  const [activeCategory, setActiveCategory] = useState('Beef & Chicken')
  const [cart, setCart] = useState([])   // [{ ...item, qty }]
  const [cartOpen, setCartOpen]   = useState(false)
  const [orderType, setOrderType] = useState('DINE_IN')
  const [tableOrRoom, setTableOrRoom] = useState('')

  // Cart helpers
  const addToCart = (item) => {
    setCart(c => {
      const existing = c.find(i => i.id === item.id)
      if (existing) return c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...item, qty: 1 }]
    })
    toast.success(`${item.name} added to order`)
  }

  const updateQty = (id, delta) => {
    setCart(c =>
      c.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    )
  }

  const total      = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount  = cart.reduce((s, i) => s + i.qty, 0)

  const placeOrder = async () => {
    if (!tableOrRoom.trim()) {
      toast.error(orderType === 'DINE_IN' ? 'Please enter your table number' : 'Please enter your room number')
      return
    }
    try {
      const res = await fetch('/api/restaurant/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          tableNumber: orderType === 'DINE_IN' ? tableOrRoom : null,
          roomNumber:  orderType === 'ROOM_SERVICE' ? tableOrRoom : null,
          items: cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price })),
          totalAmount: total,
          guestName: 'Guest',
        }),
      })
      if (res.ok) {
        toast.success('Order placed! We\'ll bring it to you shortly.')
        setCart([])
        setCartOpen(false)
      } else {
        toast.error('Failed to place order. Please try again.')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    }
  }

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/restaurant.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Dining &amp; Restaurant</h1>
          <p className="text-white/70 mt-3 text-sm">
            {/* REPLACE: Update with real opening hours */}
            Open Daily · Breakfast 07:00–10:30 · Lunch 12:00–15:00 · Dinner 18:00–22:30
          </p>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-sky-400 text-white rounded-full
                     px-5 py-3 flex items-center gap-2 shadow-xl hover:bg-sky-500 transition-colors"
        >
          <ShoppingCart size={18} />
          <span className="font-semibold text-sm">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
          <span className="text-xs opacity-80">KES {total.toLocaleString()}</span>
        </button>
      )}

      <section className="py-16 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-sm font-semibold tracking-wide rounded-full border transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-sky-400 border-sky-400 text-white'
                    : 'border-gray-300 text-hotel-muted hover:border-sky-300 bg-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {MENU[activeCategory].map(item => (
                <div key={item.id} className="card flex gap-4 p-5">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    {item.image
                      ? <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover w-full h-full" />
                      : <div className="img-placeholder h-full" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-hotel-dark text-base leading-tight">
                        {item.name}
                      </h3>
                      <span className="font-bold text-sky-400 text-sm whitespace-nowrap">
                        KES {item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-hotel-muted text-xs leading-relaxed mb-2">{item.desc}</p>

                    {/* Dietary tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map(tag => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded ${TAG_COLORS[tag]}`}>
                          {TAG_LABELS[tag]}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-sky-400
                                 hover:text-sky-600 transition-colors"
                    >
                      <Plus size={13} /> Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Table Reservation Section */}
      <section className="py-16 bg-hotel-dark">
        <div className="max-w-xl mx-auto px-6 text-center">
          <span className="eyebrow text-gold-400">Reserve a Table</span>
          <h2 className="font-heading text-3xl font-semibold text-white mb-4">
            Dine With Us Tonight
          </h2>
          <p className="text-white/55 text-sm mb-8">
            Reserve your table in advance for a guaranteed seat. Group bookings welcome.
          </p>
          <Link href="/booking?type=table" className="btn-gold">
            Reserve a Table <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="font-heading text-lg font-semibold">Your Order</h3>
                <button onClick={() => setCartOpen(false)} className="text-hotel-muted hover:text-hotel-dark">
                  <X size={22} />
                </button>
              </div>

              {/* Order type */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex gap-2 mb-4">
                  {[
                    { value: 'DINE_IN',      label: 'Dine In' },
                    { value: 'ROOM_SERVICE', label: 'Room Service' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setOrderType(value)}
                      className={`flex-1 py-2 text-sm font-semibold rounded border transition-all
                        ${orderType === value ? 'bg-sky-400 text-white border-sky-400' : 'border-gray-200 text-hotel-muted'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  className="form-input text-sm"
                  placeholder={orderType === 'DINE_IN' ? 'Table number' : 'Room number'}
                  value={tableOrRoom}
                  onChange={e => setTableOrRoom(e.target.value)}
                />
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-hotel-dark truncate">{item.name}</p>
                      <p className="text-xs text-hotel-muted">KES {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-hotel-muted hover:border-sky-400 hover:text-sky-400">
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-hotel-muted hover:border-sky-400 hover:text-sky-400">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-hotel-dark w-20 text-right">
                      KES {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold text-hotel-dark">Total</span>
                  <span className="font-bold text-lg text-hotel-dark">KES {total.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} className="btn-primary w-full justify-center">
                  Place Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
