/**
 * Image Generation Script — Oyugis Le Grand Hotel
 * Uses Google Gemini (Nano Banana) to generate experience and food images.
 *
 * Prerequisites:
 *   1. Get a free API key from https://aistudio.google.com/apikey
 *   2. Set GEMINI_API_KEY in your .env.local  OR  pass it inline:
 *        GEMINI_API_KEY=your_key node scripts/generate-images.js
 *   3. Run:  npm install @google/genai  (one-time install)
 *
 * Output:
 *   public/images/experiences/*.jpg  — 6 experience photos
 *   public/images/food/*.jpg         — 31 food & beverage photos
 */

import { GoogleGenAI } from '@google/genai'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Setup ─────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('\nERROR: GEMINI_API_KEY is not set.')
  console.error('  Get a free key from https://aistudio.google.com/apikey')
  console.error('  Then run:  GEMINI_API_KEY=your_key node scripts/generate-images.js\n')
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })
const MODEL = 'gemini-3.1-flash-image-preview'

// ── Image Definitions ─────────────────────────────────────────────────────────

const EXPERIENCE_IMAGES = [
  {
    filename: 'lake-victoria.jpg',
    prompt: 'Stunning aerial view of Lake Victoria in western Kenya at golden hour sunset. Vast calm blue lake waters with traditional wooden fishing boats near the shore. Lush green tropical vegetation along the banks. Warm golden light reflecting on the water. Professional travel photography, high quality.',
  },
  {
    filename: 'simbi-nyaima.jpg',
    prompt: 'Simbi Nyaima sacred crater lake in Kenya. A small mysterious emerald-green lake nestled in a natural crater surrounded by flat savanna grassland. Flamingos wading in the shallows. Dramatic atmospheric sky. Exotic and serene. Professional travel photography.',
  },
  {
    filename: 'kisii-cultural.jpg',
    prompt: 'Kenyan Kisii soapstone carving artisan at work. Close-up of skilled hands carving colorful soapstone sculptures in vibrant pink, white, and green. Open-air market stall with carved animals and figurines on display. Authentic African cultural experience. Warm natural light, professional photography.',
  },
  {
    filename: 'rusinga-island.jpg',
    prompt: 'Rusinga Island on Lake Victoria Kenya. Tropical island with sandy beach and traditional fishing boats pulled ashore. Dense green trees, simple fishing village huts visible. Crystal clear shallow lake water lapping the shore. Scenic and peaceful. Professional travel photography.',
  },
  {
    filename: 'homa-hills.jpg',
    prompt: 'Homa Hills Kenya scenic panoramic view from the summit. Hiker silhouetted on rocky hilltop looking out over a vast landscape with Lake Victoria shimmering in the distance. Lush green rolling hills. Dramatic clouds. Adventure hiking, professional landscape photography.',
  },
  {
    filename: 'local-market.jpg',
    prompt: 'Vibrant Oyugis local African market in Kenya. Colorful market stalls overflowing with fresh tropical fruits, vegetables, and local produce. Friendly vendors in bright clothing. Bustling authentic street market atmosphere. Morning light, professional travel photography.',
  },
]

const FOOD_IMAGES = [
  // Breakfast
  {
    filename: 'full-breakfast.jpg',
    prompt: 'Hotel full breakfast plate — two fried eggs sunny side up, two sausages, baked beans, grilled tomato halves, buttered toast. Clean white plate on wooden table, soft natural light. Professional restaurant food photography.',
  },
  {
    filename: 'continental-breakfast.jpg',
    prompt: 'Continental breakfast spread — sliced toast, butter pats, strawberry jam, freshly squeezed orange juice in glass, hot tea in white cup. Elegant hotel breakfast tray presentation. Professional food photography.',
  },
  {
    filename: 'fried-eggs.jpg',
    prompt: 'Two fried eggs perfectly cooked sunny side up on a white ceramic plate, golden yolks, crispy edges, served with two slices of buttered toast. Simple clean presentation. Professional food photography.',
  },
  {
    filename: 'boiled-eggs.jpg',
    prompt: 'Two soft boiled eggs in white egg cups, tops cracked open, runny yolk visible, served with soldiers toast strips on the side. Clean white background, professional food photography.',
  },
  {
    filename: 'scrambled-eggs.jpg',
    prompt: 'Creamy soft scrambled eggs piled on thick buttered toast on a white plate, sprinkled with fresh chives. Smooth silky texture. Professional restaurant food photography.',
  },
  {
    filename: 'omelette.jpg',
    prompt: 'Fluffy golden folded omelette on white plate, perfectly cooked, slight golden brown exterior. Garnished with fresh parsley sprig. Hotel restaurant presentation. Professional food photography.',
  },
  // Fish & Seafood
  {
    filename: 'fried-tilapia.jpg',
    prompt: 'Whole deep-fried golden crispy tilapia fish on a large plate, served with a mound of white ugali and braised sukuma wiki greens. Traditional East African Kenyan meal. Restaurant food photography.',
  },
  {
    filename: 'grilled-tilapia.jpg',
    prompt: 'Grilled tilapia fillet with beautiful golden grill marks, served on a plate with white ugali and steamed green vegetables. Kenyan restaurant presentation. Professional food photography.',
  },
  {
    filename: 'fish-fillet.jpg',
    prompt: 'Crispy golden battered fried fish fillet on a plate, served with golden french fries and a fresh green salad with tomatoes. Lemon wedge on the side. Restaurant food photography.',
  },
  // Beef & Chicken
  {
    filename: 'fried-chicken.jpg',
    prompt: 'Crispy golden fried chicken pieces — a drumstick and wing — on a plate with golden french fries and creamy coleslaw. Perfect crispy coating. Restaurant food photography, professional.',
  },
  {
    filename: 'grilled-chicken.jpg',
    prompt: 'Marinated grilled chicken half with beautiful char grill marks, juicy and golden brown. Served with golden chips and a fresh tomato and cucumber salad. Professional restaurant food photography.',
  },
  {
    filename: 'beef-stew.jpg',
    prompt: 'Rich dark Kenyan beef stew in thick gravy with tender chunks of beef and vegetables in a bowl. Served alongside a mound of white ugali. Hearty East African comfort food. Professional food photography.',
  },
  {
    filename: 'nyama-choma.jpg',
    prompt: 'Kenyan nyama choma — charcoal-grilled beef cuts with char marks, glistening and succulent, served on a wooden board with kachumbari (fresh tomato and onion salsa) and a side of ugali. Traditional Kenyan dish. Professional food photography.',
  },
  {
    filename: 'mutton-stew.jpg',
    prompt: 'Tender mutton stew with rich aromatic brown sauce, whole spices visible, chunks of bone-in mutton in a deep bowl. Served with steamed rice on the side. East African cuisine. Professional food photography.',
  },
  // Snacks & Starters
  {
    filename: 'samosa.jpg',
    prompt: 'Three golden crispy triangular samosas arranged on a white plate, one broken open to show spiced minced meat filling inside. Small bowl of green chutney dipping sauce. East African street food starter. Professional food photography.',
  },
  {
    filename: 'spring-rolls.jpg',
    prompt: 'Three crispy golden spring rolls arranged on a white plate at an angle, one cut in half to show vegetable filling. Small bowl of sweet chili dipping sauce. Restaurant starter. Professional food photography.',
  },
  {
    filename: 'chips.jpg',
    prompt: 'Generous pile of golden crispy french fries in a white bowl or basket, sprinkled with sea salt. Small pot of ketchup on the side. Restaurant snack. Professional food photography.',
  },
  {
    filename: 'chips-egg.jpg',
    prompt: 'Golden crispy french fries on a plate with a perfectly fried egg on top, yolk intact. Simple and satisfying meal. East African restaurant style. Professional food photography.',
  },
  {
    filename: 'sandwich.jpg',
    prompt: 'Toasted club sandwich cut diagonally, showing layers of grilled chicken, lettuce, tomato, and cheese inside golden toasted bread. Secured with toothpicks. Served on a white plate with coleslaw. Professional food photography.',
  },
  // Vegetables & Sides
  {
    filename: 'ugali-sukuma.jpg',
    prompt: 'Traditional Kenyan meal — smooth white ugali maize meal mound on a plate with braised sukuma wiki (kale greens) cooked with onions and tomatoes alongside. Simple authentic East African staple food. Professional food photography.',
  },
  {
    filename: 'steamed-rice.jpg',
    prompt: 'Fluffy plain white steamed rice served in a white ceramic bowl, perfect individual grains, simple and clean. Restaurant side dish. Professional food photography.',
  },
  {
    filename: 'mixed-salad.jpg',
    prompt: 'Fresh colorful garden salad in a white bowl — crisp green lettuce, red tomato wedges, cucumber slices, thin onion rings. Lightly dressed. Bright and appetizing. Professional food photography.',
  },
  {
    filename: 'pilau-rice.jpg',
    prompt: 'Fragrant East African pilau rice, golden-brown spiced basmati with whole cardamom pods, cloves, cinnamon, served in a bowl or on a plate. Rich aromatic Kenyan dish. Professional food photography.',
  },
  // Beverages
  {
    filename: 'tea.jpg',
    prompt: 'Hot cup of Kenyan chai — milky tea in a white ceramic cup on a saucer, steam gently rising. Warm inviting beverage. Professional beverage photography.',
  },
  {
    filename: 'coffee.jpg',
    prompt: 'Hot Kenyan black coffee in a white ceramic cup on a saucer, dark rich color, light crema on top. Clean and elegant presentation. Professional beverage photography.',
  },
  {
    filename: 'fresh-juice.jpg',
    prompt: 'Tall glass of freshly blended tropical fruit juice — vibrant orange-yellow mango passion fruit blend with ice cubes, small umbrella straw. Refreshing and colorful. Professional beverage photography.',
  },
  {
    filename: 'fruit-shake.jpg',
    prompt: 'Tall glass of thick tropical fruit smoothie shake with colorful straw, vibrant mixed berry or mango color, frothy top, garnished with a fruit slice. Professional beverage photography.',
  },
  {
    filename: 'soda.jpg',
    prompt: 'Cold Coca-Cola soda in a glass with ice cubes and lemon slice, condensation on the outside, bubbles visible. Red can beside it. Refreshing cold drink. Professional beverage photography.',
  },
  {
    filename: 'mineral-water.jpg',
    prompt: 'Clear glass of water with a small 500ml water bottle beside it. Clean minimal presentation on white surface. Refreshing and clean. Professional beverage photography.',
  },
  {
    filename: 'tusker-lager.jpg',
    prompt: 'Tusker Lager Kenyan beer — green bottle with iconic elephant logo, ice cold, condensation droplets on the bottle, golden beer in a glass beside it with foam head. Professional beer photography.',
  },
  {
    filename: 'tusker-malt.jpg',
    prompt: 'Tusker Malt Kenyan beer bottle, dark label, ice cold with condensation, served with a glass of golden amber beer with creamy foam head. Professional beer photography.',
  },
]

// ── Generator ─────────────────────────────────────────────────────────────────

async function generateImage(prompt, outputPath) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  })

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64')
      fs.writeFileSync(outputPath, buffer)
      return true
    }
  }
  return false
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run() {
  const expDir  = path.join(ROOT, 'public', 'images', 'experiences')
  const foodDir = path.join(ROOT, 'public', 'images', 'food')
  fs.mkdirSync(expDir, { recursive: true })
  fs.mkdirSync(foodDir, { recursive: true })

  const all = [
    ...EXPERIENCE_IMAGES.map(img => ({ ...img, dir: expDir, group: 'Experience' })),
    ...FOOD_IMAGES.map(img => ({ ...img, dir: foodDir, group: 'Food' })),
  ]

  const total = all.length
  let done = 0
  let failed = []

  console.log(`\nGenerating ${total} images using Gemini (Nano Banana)...\n`)

  for (const img of all) {
    const outPath = path.join(img.dir, img.filename)

    // Skip if already generated
    if (fs.existsSync(outPath)) {
      console.log(`  ✓ SKIP  ${img.group}: ${img.filename} (already exists)`)
      done++
      continue
    }

    process.stdout.write(`  → ${img.group}: ${img.filename} ... `)
    try {
      const ok = await generateImage(img.prompt, outPath)
      if (ok) {
        console.log('✓ saved')
        done++
      } else {
        console.log('✗ no image in response')
        failed.push(img.filename)
      }
    } catch (err) {
      console.log(`✗ error: ${err.message}`)
      failed.push(img.filename)
    }

    // 4-second delay to stay within the free-tier rate limit (15 req/min)
    if (done < total) await sleep(4000)
  }

  console.log(`\n─────────────────────────────────────────`)
  console.log(`Done: ${done}/${total} images generated.`)
  if (failed.length > 0) {
    console.log(`Failed (${failed.length}): ${failed.join(', ')}`)
    console.log('Re-run the script to retry failed images.')
  }
  console.log(`─────────────────────────────────────────\n`)
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
