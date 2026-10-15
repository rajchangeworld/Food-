export const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'burger', name: 'Burger', icon: '🍔' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'rolls', name: 'Rolls', icon: '🌯' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

export const MOCK_MENU = [
  {
    id: 'b1',
    name: 'Smoky Angus Beast Burger',
    category: 'Burger',
    description: 'Juicy 100% Angus beef patty topped with smoked applewood bacon, melted aged cheddar, caramelized onions, and signature house BBQ glaze on a toasted brioche bun.',
    price: 13.99,
    rating: 4.9,
    reviewsCount: 384,
    prepTime: '20-25 min',
    calories: '720 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Angus Beef', 'Cheddar Cheese', 'Brioche Bun', 'Smoky Bacon', 'Caramelized Onion', 'House BBQ'],
    options: [
      { name: 'Extra Cheddar Cheese', price: 1.5 },
      { name: 'Double Patty', price: 3.99 },
      { name: 'Truffle Fries Combo', price: 2.99 }
    ]
  },
  {
    id: 'b2',
    name: 'Fiery Crispy Chicken Burger',
    category: 'Burger',
    description: 'Crispy golden fried chicken breast dipped in Nashville hot oil, topped with crunchy dill pickles, creamy jalapeño slaw, and spicy garlic aioli.',
    price: 11.49,
    rating: 4.8,
    reviewsCount: 295,
    prepTime: '15-20 min',
    calories: '640 kcal',
    isVeg: false,
    isFeatured: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Crispy Chicken', 'Nashville Glaze', 'Dill Pickles', 'Jalapeño Slaw', 'Garlic Aioli'],
    options: [
      { name: 'Extra Spicy Dust', price: 0.5 },
      { name: 'Melted Pepper Jack', price: 1.25 }
    ]
  },
  {
    id: 'b3',
    name: 'Garden Truffle Veggie Burger',
    category: 'Burger',
    description: 'Handmade quinoa and portobello mushroom patty, fresh baby arugula, slow-roasted sun-dried tomatoes, and vegan black truffle emulsion on multigrain bun.',
    price: 10.99,
    rating: 4.7,
    reviewsCount: 162,
    prepTime: '15-20 min',
    calories: '510 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Quinoa & Mushroom Patty', 'Baby Arugula', 'Truffle Mayo', 'Sun-dried Tomatoes'],
    options: [
      { name: 'Avocado Slices', price: 1.99 },
      { name: 'Gluten-Free Bun', price: 1.0 }
    ]
  },
  {
    id: 'p1',
    name: 'Artisan Burrata & Pepperoni Pizza',
    category: 'Pizza',
    description: 'Slow-fermented sourdough crust topped with San Marzano tomato sauce, cup-and-char pepperoni, creamy whole burrata, hot honey drizzle, and fresh basil.',
    price: 17.99,
    rating: 4.9,
    reviewsCount: 420,
    prepTime: '25-30 min',
    calories: '890 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Sourdough Crust', 'San Marzano Sauce', 'Crispy Pepperoni', 'Fresh Burrata', 'Hot Honey', 'Basil'],
    options: [
      { name: 'Garlic Butter Crust Dip', price: 1.2 },
      { name: 'Extra Fresh Burrata', price: 3.5 }
    ]
  },
  {
    id: 'p2',
    name: 'Wild Mushroom & Truffle Pizza',
    category: 'Pizza',
    description: 'Wood-fired white pizza with sautéed cremini, shiitake, roasted garlic crema, fresh mozzarella, thyme, and fragrant white truffle oil.',
    price: 16.50,
    rating: 4.8,
    reviewsCount: 210,
    prepTime: '20-25 min',
    calories: '780 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Wild Mushrooms', 'Garlic Crema', 'Mozzarella', 'Truffle Oil', 'Fresh Thyme'],
    options: [
      { name: 'Extra Truffle Oil', price: 1.5 },
      { name: 'Parmigiano Reggiano Shavings', price: 1.8 }
    ]
  },
  {
    id: 'p3',
    name: 'Classic Margherita Classica',
    category: 'Pizza',
    description: 'Simple perfection with San Marzano organic tomatoes, Fior di Latte mozzarella, extra virgin olive oil, and fresh garden basil on blistered crust.',
    price: 13.50,
    rating: 4.6,
    reviewsCount: 195,
    prepTime: '18-22 min',
    calories: '690 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fior di Latte', 'San Marzano Tomatoes', 'Fresh Basil', 'EVOO'],
    options: [
      { name: 'Add Buffalo Mozzarella', price: 2.5 }
    ]
  },
  {
    id: 'bir1',
    name: 'Royal Hyderabadi Mutton Dum Biryani',
    category: 'Biryani',
    description: 'Tender baby mutton marinated overnight in aromatic royal spices, layered with fragrant long-grain basmati rice, saffron milk, fried onions, and slow cooked in sealed clay pot. Served with Mirchi Ka Salan and creamy Raita.',
    price: 18.99,
    rating: 4.9,
    reviewsCount: 512,
    prepTime: '30-35 min',
    calories: '850 kcal',
    isVeg: false,
    isFeatured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Tender Goat Meat', 'Basmati Rice', 'Kashmiri Saffron', 'Fried Onions', 'Mint & Coriander', 'Desi Ghee'],
    options: [
      { name: 'Extra Boiled Egg (2 pcs)', price: 1.5 },
      { name: 'Extra Mirchi Salan Gravy', price: 1.0 },
      { name: 'Gulab Jamun Pair', price: 2.5 }
    ]
  },
  {
    id: 'bir2',
    name: 'Fragrant Chicken Tikka Biryani',
    category: 'Biryani',
    description: 'Tandoor-charred spicy chicken tikka chunks layered with rich spiced saffron basmati rice, clarified butter, and fresh mint leaves. Served with cold mint raita.',
    price: 15.99,
    rating: 4.8,
    reviewsCount: 390,
    prepTime: '25-30 min',
    calories: '760 kcal',
    isVeg: false,
    isFeatured: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Tandoori Chicken Tikka', 'Basmati Rice', 'Saffron', 'Mint', 'Caramelized Onion'],
    options: [
      { name: 'Spicy Gravy Cup', price: 1.0 },
      { name: 'Roasted Papad & Pickle', price: 0.99 }
    ]
  },
  {
    id: 'bir3',
    name: 'Awadhi Shahi Paneer Dum Biryani',
    category: 'Biryani',
    description: 'Rich cottage cheese cubes marinated in aromatic saffron and cardamom spices, slow dum cooked with premium basmati rice, cashew nuts, and golden fried onions.',
    price: 14.49,
    rating: 4.7,
    reviewsCount: 220,
    prepTime: '25-30 min',
    calories: '680 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fresh Paneer', 'Basmati Rice', 'Cashews & Raisins', 'Cardamom', 'Kewra Water'],
    options: [
      { name: 'Extra Paneer Cubes', price: 2.0 },
      { name: 'Pineapple Raita', price: 1.5 }
    ]
  },
  {
    id: 'r1',
    name: 'Kolkata Crispy Chicken Kathi Roll',
    category: 'Rolls',
    description: 'Flaky handmade lachha paratha layered with beaten egg, filled with succulent spiced chicken chunks, sliced red onions, green chillies, and tangy chaat lime sauce.',
    price: 9.49,
    rating: 4.8,
    reviewsCount: 278,
    prepTime: '15-20 min',
    calories: '520 kcal',
    isVeg: false,
    isFeatured: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Lachha Paratha', 'Egg Wash', 'Spiced Chicken', 'Lime & Chaat Onions', 'Mint Chutney'],
    options: [
      { name: 'Double Egg Wrap', price: 1.0 },
      { name: 'Add Melted Cheese', price: 1.25 }
    ]
  },
  {
    id: 'r2',
    name: 'Smoky Paneer Tikka Malai Roll',
    category: 'Rolls',
    description: 'Charcoal-grilled paneer cubes tossed in creamy malai marinade, crisp bell peppers, and fresh cilantro rolled inside a buttery golden flatbread.',
    price: 8.99,
    rating: 4.7,
    reviewsCount: 184,
    prepTime: '12-18 min',
    calories: '480 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Paneer Tikka', 'Bell Peppers', 'Creamy Malai Sauce', 'Crispy Paratha'],
    options: [
      { name: 'Extra Mint Dip', price: 0.75 },
      { name: 'Cheese Burst Layer', price: 1.5 }
    ]
  },
  {
    id: 'd1',
    name: 'Alphonso Mango Lassi Shake',
    category: 'Drinks',
    description: 'Thick, creamy chilled yogurt blend infused with natural Alphonso mango pulp, crushed cardamom, and topped with chopped pistachios.',
    price: 5.49,
    rating: 4.9,
    reviewsCount: 310,
    prepTime: '5-10 min',
    calories: '280 kcal',
    isVeg: true,
    isFeatured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Alphonso Mango', 'Greek Yogurt', 'Cardamom', 'Pistachios'],
    options: [
      { name: 'Low Sugar Option', price: 0 },
      { name: 'Add Chia Seeds', price: 0.75 }
    ]
  },
  {
    id: 'd2',
    name: 'Cold Brew Salted Caramel Frappe',
    category: 'Drinks',
    description: 'Steeped 18-hour cold brew coffee blended with creamy milk, artisanal salted caramel drizzle, and topped with whipped foam.',
    price: 5.99,
    rating: 4.8,
    reviewsCount: 245,
    prepTime: '5-8 min',
    calories: '310 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Cold Brew Coffee', 'Whole Milk', 'Salted Caramel', 'Whipped Cream'],
    options: [
      { name: 'Oat Milk Substitute', price: 0.8 },
      { name: 'Extra Espresso Shot', price: 1.0 }
    ]
  },
  {
    id: 'd3',
    name: 'Sparkling Blood Orange Mojito',
    category: 'Drinks',
    description: 'Zesty Sicilian blood orange juice with muddled fresh garden mint, Persian lime juice, raw cane sugar, and effervescent sparkling soda.',
    price: 4.99,
    rating: 4.7,
    reviewsCount: 168,
    prepTime: '5-8 min',
    calories: '140 kcal',
    isVeg: true,
    isFeatured: false,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Blood Orange', 'Fresh Mint', 'Lime Juice', 'Sparkling Soda'],
    options: [
      { name: 'Zero Sugar Sparkler', price: 0 }
    ]
  }
];

export const MOCK_ORDERS = [
  {
    id: 'CRV-9241',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'Out for Delivery', // Order Received, Preparing, Out for Delivery, Delivered
    total: 34.47,
    items: [
      {
        id: 'b1',
        name: 'Smoky Angus Beast Burger',
        price: 13.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'd1',
        name: 'Alphonso Mango Lassi Shake',
        price: 5.49,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80'
      }
    ],
    deliveryAddress: {
      tag: 'Home',
      street: '42 Marine Drive, Apt 4B',
      city: 'Downtown Metro, 400020',
      contactPhone: '+1 (555) 234-5678'
    },
    deliveryPartner: {
      name: 'Alex Rivera',
      rating: 4.9,
      phone: '+1 (555) 987-6543',
      vehicle: 'Honda CB300 - Orange'
    },
    timeline: [
      { status: 'Order Received', time: '17:30', completed: true, desc: 'Restaurant confirmed your order' },
      { status: 'Preparing', time: '17:35', completed: true, desc: 'Chef is grilling fresh burgers' },
      { status: 'Out for Delivery', time: '17:45', completed: true, current: true, desc: 'Alex is 8 mins away from your location' },
      { status: 'Delivered', time: 'Estimated 17:55', completed: false, desc: 'Package delivered at doorstep' }
    ]
  },
  {
    id: 'CRV-8910',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    total: 39.48,
    items: [
      {
        id: 'p1',
        name: 'Artisan Burrata & Pepperoni Pizza',
        price: 17.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'bir1',
        name: 'Royal Hyderabadi Mutton Dum Biryani',
        price: 18.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
      }
    ],
    deliveryAddress: {
      tag: 'Office',
      street: 'Cyber Tower 3, 5th Floor, Suite 502',
      city: 'Tech Park, 400078',
      contactPhone: '+1 (555) 234-5678'
    },
    deliveryPartner: {
      name: 'David Miller',
      rating: 4.8,
      phone: '+1 (555) 345-6789',
      vehicle: 'Yamaha FZ - Black'
    },
    timeline: [
      { status: 'Order Received', time: 'Yesterday 19:10', completed: true },
      { status: 'Preparing', time: 'Yesterday 19:18', completed: true },
      { status: 'Out for Delivery', time: 'Yesterday 19:35', completed: true },
      { status: 'Delivered', time: 'Yesterday 19:48', completed: true, current: true }
    ]
  }
];

export const DEFAULT_USER_PROFILE = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 382-9012',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  isDemo: true,
  addresses: [
    {
      id: 'addr-1',
      tag: 'Home',
      street: '42 Marine Drive, Apt 4B',
      landmark: 'Near Bayview Promenade',
      city: 'Downtown Metro',
      pincode: '400020',
      isDefault: true
    },
    {
      id: 'addr-2',
      tag: 'Office',
      street: 'Cyber Tower 3, 5th Floor, Suite 502',
      landmark: 'Tech Park Main Entrance',
      city: 'Innovation Hub',
      pincode: '400078',
      isDefault: false
    }
  ],
  preferences: {
    pushNotifications: true,
    smsAlerts: true,
    specialOffers: true
  }
};
