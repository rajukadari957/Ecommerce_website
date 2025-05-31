export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  inventory: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  variants: ProductVariant[];
}

// Mock product data
export const products: Product[] = [
  {
    id: "prod_001",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for all-day wear.",
    variants: [
      {
        id: "var_001",
        name: "Black - Standard",
        price: 199.99,
        color: "Black",
        size: "Standard",
        inventory: 15,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_002",
        name: "White - Standard",
        price: 199.99,
        color: "White",
        size: "Standard",
        inventory: 10,
        image: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_003",
        name: "Navy Blue - Standard",
        price: 219.99,
        color: "Navy Blue",
        size: "Standard",
        inventory: 8,
        image: "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ]
  },
  {
    id: "prod_002",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals with our advanced smartwatch. Features include heart rate monitoring, sleep tracking, GPS, and a vibrant AMOLED display with 5-day battery life.",
    variants: [
      {
        id: "var_004",
        name: "Black - Small",
        price: 249.99,
        color: "Black",
        size: "Small",
        inventory: 20,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_005",
        name: "Black - Large",
        price: 249.99,
        color: "Black",
        size: "Large",
        inventory: 15,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_006",
        name: "Rose Gold - Small",
        price: 269.99,
        color: "Rose Gold",
        size: "Small",
        inventory: 12,
        image: "https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ]
  },
  {
    id: "prod_003",
    name: "Professional Camera Drone",
    description: "Capture stunning aerial footage with our professional-grade camera drone. Features 4K video, 3-axis gimbal stabilization, 30-minute flight time, and intelligent flight modes.",
    variants: [
      {
        id: "var_007",
        name: "Standard Package",
        price: 799.99,
        color: "Gray",
        size: "Standard",
        inventory: 5,
        image: "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_008",
        name: "Pro Package",
        price: 999.99,
        color: "Gray",
        size: "Standard",
        inventory: 3,
        image: "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ]
  },
  {
    id: "prod_004",
    name: "Ergonomic Office Chair",
    description: "Work in comfort with our premium ergonomic office chair. Features adjustable lumbar support, breathable mesh back, 4D armrests, and smooth-rolling casters.",
    variants: [
      {
        id: "var_009",
        name: "Black - Standard",
        price: 349.99,
        color: "Black",
        size: "Standard",
        inventory: 25,
        image: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_010",
        name: "Gray - Standard",
        price: 349.99,
        color: "Gray",
        size: "Standard",
        inventory: 20,
        image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ]
  },
  {
    id: "prod_005",
    name: "Smart Home Security Camera",
    description: "Keep your home safe with our advanced security camera. Features 2K HDR video, night vision, two-way audio, and AI-powered person detection.",
    variants: [
      {
        id: "var_011",
        name: "Indoor Camera",
        price: 129.99,
        color: "White",
        size: "Standard",
        inventory: 30,
        image: "https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        id: "var_012",
        name: "Outdoor Camera",
        price: 169.99,
        color: "Black",
        size: "Standard",
        inventory: 25,
        image: "https://images.pexels.com/photos/3153199/pexels-photo-3153199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ]
  }
];

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

// Function to get a variant by ID
export function getVariantById(id: string): ProductVariant | undefined {
  for (const product of products) {
    const variant = product.variants.find(v => v.id === id);
    if (variant) return variant;
  }
  return undefined;
}