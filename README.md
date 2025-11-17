# Foodie Dashboard - Food Delivery Management Platform

![App Preview](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=300&fit=crop&auto=format)

A comprehensive food delivery management platform for restaurant owners and administrators. Manage restaurants, menus, orders, delivery partners, and promotional content all in one place.

## Features

- **Restaurant Management** - Complete restaurant profiles with images, menus, hours, and contact details
- **Menu System** - Organized categories and items with pricing, ingredients, and availability
- **Order Processing** - Track orders from placement through delivery with multiple status stages
- **Delivery Partners** - Manage riders, vehicle types, and order assignments
- **Featured Collections** - Curate restaurant groups for homepage sections
- **Content Management** - Edit hero sections, promotional banners, and FAQs
- **Real-Time Updates** - Dynamic status changes and inventory management
- **Responsive Design** - Works seamlessly across all devices

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=691b501fb6f242d039837558&clone_repository=691b51e5b6f242d039837573)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> Build a complete dashboard structure for a food discovery and delivery brand called Foodie. The dashboard will be used by admins and restaurant owners to manage everything happening on the platform.
>
> Create the full content models, fields, and relationships needed for a modern food delivery system. Below is what the dashboard should support:
>
> 1. Restaurants
>
> Represent restaurants on the platform.
> Fields:
>
> Name
>
> Cover image
>
> Logo
>
> Short description
>
> Full description
>
> Address
>
> City
>
> Country
>
> Contact phone
>
> Opening hours (object or JSON list)
>
> Delivery time estimate
>
> Cuisine type (multi-select)
>
> Rating (number)
>
> Active / Inactive status
>
> 2. Menu Categories
>
> Categories inside each restaurant.
> Fields:
>
> Category name
>
> Description
>
> Image
>
> Belongs to: Restaurant (relationship)
>
> 3. Menu Items
>
> Individual meals/products restaurants sell.
> Fields:
>
> Name
>
> Description
>
> Photo
>
> Price
>
> Discounted price (optional)
>
> Ingredients list
>
> Tags (e.g., spicy, vegan, gluten-free)
>
> Availability toggle
>
> Category (relationship)
>
> Restaurant (relationship)
>
> 4. Orders
>
> Customer orders placed through the Foodie app.
> Fields:
>
> Order number
>
> Customer name
>
> Customer email
>
> Customer phone
>
> Delivery address
>
> Restaurant (relationship)
>
> Items (repeater → menu item + quantity + price)
>
> Subtotal
>
> Delivery fee
>
> Total
>
> Order status (Pending, Preparing, Ready, Out for Delivery, Delivered, Cancelled)
>
> Payment status (Paid / Not Paid)
>
> Payment method
>
> Created date / Updated date
>
> 5. Riders / Delivery Partners
>
> Optional, but useful for future expansion.
> Fields:
>
> Rider name
>
> Phone number
>
> Profile photo
>
> Vehicle type
>
> Active status
>
> Assigned orders (relationship)
>
> 6. Featured Collections
>
> For homepage sections like "Popular", "Top Rated", "Near You", etc.
> Fields:
>
> Collection title
>
> Description
>
> Restaurants included (multi-select relationship)
>
> 7. App Settings
>
> General content CMS editable from the dashboard.
> Fields:
>
> Homepage hero title
>
> Homepage hero subtitle
>
> Call-to-action button text
>
> Promo banners (repeater with image + text + link)
>
> Supported cities
>
> FAQs (repeater)
>
> Requirements
>
> • Use clean, organized content models
> • Set proper relationships (Restaurants → Categories → Items → Orders)
> • Use repeaters for lists
> • Use media fields for images
> • Generate good sample data for each model
> • Build a dashboard UI suitable for admin usage
> • Keep the brand name consistent: Foodie

### Code Generation Prompt

> Build a complete dashboard structure for a food discovery and delivery brand called Foodie. The dashboard will be used by admins and restaurant owners to manage everything happening on the platform.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Cosmic (Content Management)
- **Runtime**: Bun
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Bun installed on your machine
- A Cosmic account with bucket credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodie-dashboard
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Create .env.local file
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Restaurants with Depth
```typescript
import { cosmic } from '@/lib/cosmic'

// Get restaurants with nested menu categories
const { objects: restaurants } = await cosmic.objects
  .find({ type: 'restaurants' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Access nested data directly
restaurants.forEach(restaurant => {
  console.log(restaurant.metadata.city)
  console.log(restaurant.metadata.cover_image?.imgix_url)
})
```

### Creating an Order
```typescript
// Create new order with proper status values
const newOrder = await cosmic.objects.insertOne({
  type: 'orders',
  title: `Order #${orderNumber}`,
  metadata: {
    order_number: orderNumber,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+1234567890',
    delivery_address: '123 Main St, City',
    restaurant: restaurantId, // Reference by ID
    order_status: 'Pending', // Exact value from content model
    payment_status: 'Paid', // Exact value from content model
    payment_method: 'Credit Card',
    subtotal: '45.00',
    delivery_fee: '5.00',
    total: '50.00',
    order_items: [
      {
        menu_item: itemId,
        quantity: '2',
        price: '22.50'
      }
    ]
  }
})
```

### Updating Order Status
```typescript
// Update order status - only include changed fields
await cosmic.objects.updateOne(orderId, {
  metadata: {
    order_status: 'Preparing' // System preserves other metadata
  }
})
```

### Querying with Relationships
```typescript
// Get menu items for a specific restaurant
const { objects: menuItems } = await cosmic.objects
  .find({
    type: 'menu-items',
    'metadata.restaurant': restaurantId // Query by ID
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)

// Access related category and restaurant data
menuItems.forEach(item => {
  console.log(item.metadata.category?.title)
  console.log(item.metadata.restaurant?.title)
})
```

## Cosmic CMS Integration

This application uses Cosmic's powerful content modeling features:

- **Object Relationships**: Connect restaurants to menu categories, items, and orders
- **Depth Parameter**: Load nested relationships efficiently (up to depth 2)
- **Repeater Fields**: Store multiple order items with quantity and pricing
- **Media Fields**: Optimize images with imgix parameters
- **Select Dropdowns**: Enforce valid status values for orders and payment
- **Multi-Select**: Tag menu items with dietary preferences and allergens

All data fetching happens server-side in Next.js Server Components for optimal performance and SEO.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy

### Environment Variables

Set these variables in your hosting platform:
- `COSMIC_BUCKET_SLUG`: Your Cosmic bucket slug
- `COSMIC_READ_KEY`: Your Cosmic read key
- `COSMIC_WRITE_KEY`: Your Cosmic write key (for mutations)

<!-- README_END -->