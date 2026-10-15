import { Menu } from '../models/Menu.js';
import { User } from '../models/User.js';

export const SEED_ITEMS = [
  {
    itemId: 'b1',
    name: 'Smoky Angus Beast Burger',
    category: 'Burger',
    description:
      'Juicy 100% Angus beef patty topped with smoked applewood bacon, melted aged cheddar, caramelized onions, and signature house BBQ glaze on a toasted brioche bun.',
    price: 13.99,
    rating: 4.9,
    reviewsCount: 384,
    prepTime: '20-25 min',
    calories: '720 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      'Angus Beef',
      'Cheddar Cheese',
      'Brioche Bun',
      'Smoky Bacon',
      'Caramelized Onion',
      'House BBQ',
    ],
    options: [
      { name: 'Extra Cheddar Cheese', price: 1.5 },
      { name: 'Double Patty', price: 3.99 },
      { name: 'Truffle Fries Combo', price: 2.99 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'b2',
    name: 'Fiery Crispy Chicken Burger',
    category: 'Burger',
    description:
      'Crispy golden fried chicken breast dipped in Nashville hot oil, topped with crunchy dill pickles, creamy jalapeño slaw, and spicy garlic aioli.',
    price: 11.49,
    rating: 4.8,
    reviewsCount: 295,
    prepTime: '15-20 min',
    calories: '640 kcal',
    isVeg: false,
    isFeatured: false,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Crispy Chicken', 'Nashville Glaze', 'Dill Pickles', 'Jalapeño Slaw', 'Garlic Aioli'],
    options: [
      { name: 'Extra Spicy Dust', price: 0.5 },
      { name: 'Melted Pepper Jack', price: 1.25 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'b3',
    name: 'Garden Truffle Veggie Burger',
    category: 'Burger',
    description:
      'Handmade quinoa and portobello mushroom patty, fresh baby arugula, slow-roasted sun-dried tomatoes, and vegan black truffle emulsion on multigrain bun.',
    price: 10.99,
    rating: 4.7,
    reviewsCount: 162,
    prepTime: '15-20 min',
    calories: '510 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Quinoa & Mushroom Patty', 'Baby Arugula', 'Truffle Mayo', 'Sun-dried Tomatoes'],
    options: [
      { name: 'Avocado Slices', price: 1.99 },
      { name: 'Gluten-Free Bun', price: 1.0 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'p1',
    name: 'Artisan Burrata & Pepperoni Pizza',
    category: 'Pizza',
    description:
      'Slow-fermented sourdough crust topped with San Marzano tomato sauce, cup-and-char pepperoni, creamy whole burrata, hot honey drizzle, and fresh basil.',
    price: 17.99,
    rating: 4.9,
    reviewsCount: 420,
    prepTime: '25-30 min',
    calories: '890 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      'Sourdough Crust',
      'San Marzano Sauce',
      'Crispy Pepperoni',
      'Fresh Burrata',
      'Hot Honey',
      'Basil',
    ],
    options: [
      { name: 'Garlic Butter Crust Dip', price: 1.2 },
      { name: 'Extra Fresh Burrata', price: 3.5 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'p2',
    name: 'Wild Mushroom & Truffle Pizza',
    category: 'Pizza',
    description:
      'Wood-fired white pizza with sautéed cremini, shiitake, roasted garlic crema, fresh mozzarella, thyme, and fragrant white truffle oil.',
    price: 16.5,
    rating: 4.8,
    reviewsCount: 210,
    prepTime: '20-25 min',
    calories: '780 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      'Wild Mushrooms',
      'Garlic Crema',
      'Fior di Latte',
      'White Truffle Oil',
      'Fresh Thyme',
    ],
    options: [
      { name: 'Extra Truffle Drizzle', price: 1.75 },
      { name: 'Shaved Parmesan', price: 1.5 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'bir1',
    name: 'Royal Hyderabadi Mutton Dum Biryani',
    category: 'Biryani',
    description:
      'Aged long-grain basmati rice and tender baby goat cooked on dum sealed with dough, infused with saffron, kewra water, and 24 secret aromatic spices. Served with mirchi ka salan and burani raita.',
    price: 18.99,
    rating: 4.9,
    reviewsCount: 512,
    prepTime: '30-35 min',
    calories: '860 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      'Basmati Rice',
      'Tender Mutton',
      'Kashmiri Saffron',
      'Caramelized Onions',
      'Ghee',
      'Mint',
    ],
    options: [
      { name: 'Extra Salan & Raita', price: 1.0 },
      { name: 'Boiled Egg (2pcs)', price: 1.5 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'r1',
    name: 'Smoky Chicken Tikka Kathi Roll',
    category: 'Rolls',
    description:
      'Flaky paratha coated with egg and wrapped around chargrilled chicken tikka morsels, crisp pickled shallots, fresh coriander, and mint chutney.',
    price: 9.99,
    rating: 4.7,
    reviewsCount: 188,
    prepTime: '15-20 min',
    calories: '490 kcal',
    isVeg: false,
    isFeatured: false,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Paratha', 'Chicken Tikka', 'Pickled Red Onions', 'Mint Chutney', 'Chaat Masala'],
    options: [
      { name: 'Double Egg Wrap', price: 1.0 },
      { name: 'Extra Cheese Melt', price: 1.25 },
    ],
    isAvailable: true,
  },
  {
    itemId: 'd1',
    name: 'Alphonso Mango Lassi Shake',
    category: 'Drinks',
    description:
      'Rich and velvety blend of GI-tagged Ratnagiri Alphonso mango pulp, thick Greek yogurt, cardamom essence, and crushed pistachio garnish.',
    price: 5.49,
    rating: 4.9,
    reviewsCount: 340,
    prepTime: '5-10 min',
    calories: '320 kcal',
    isVeg: true,
    isFeatured: true,
    isPopular: true,
    image:
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Alphonso Mango', 'Greek Yogurt', 'Cardamom', 'Pistachios'],
    options: [
      { name: 'Chia Seeds Boost', price: 0.75 },
      { name: 'Extra Pistachio Crunch', price: 0.5 },
    ],
    isAvailable: true,
  },
];

/**
 * Seed Menu collection idempotently
 */
export async function seedMenu() {
  try {
    const existingCount = await Menu.countDocuments();
    if (existingCount > 0) {
      console.log(`[Seed] Menu already populated (${existingCount} items). Skipping re-seed.`);
      return;
    }

    console.log('[Seed] Populating initial Menu collection...');
    for (const item of SEED_ITEMS) {
      await Menu.updateOne({ itemId: item.itemId }, { $set: item }, { upsert: true });
    }
    console.log(`[Seed] Successfully seeded ${SEED_ITEMS.length} menu items.`);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed menu: ${error.message}`);
  }
}

/**
 * Seed Admin User idempotently
 */
export async function seedAdminUser() {
  try {
    const adminPhone = '+15550001111';
    const existingAdmin = await User.findOne({ phone: adminPhone });
    if (!existingAdmin) {
      await User.create({
        phone: adminPhone,
        name: 'Master Admin',
        email: 'admin@cravebite.com',
        role: 'admin',
        addresses: [
          {
            tag: 'Headquarters',
            street: '100 Gourmet Way, Suite 1',
            city: 'Downtown Metro',
            pincode: '400001',
            isDefault: true,
          },
        ],
      });
      console.log('[Seed] Initial Admin user created (+15550001111)');
    }
  } catch (error) {
    console.error(`[Seed Error] Failed to seed admin user: ${error.message}`);
  }
}
