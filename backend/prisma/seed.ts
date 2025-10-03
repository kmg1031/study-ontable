import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Study OnTable Restaurant',
      description: '최고의 음식을 제공하는 레스토랑입니다.',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      email: 'contact@study-ontable.com',
      businessHours: JSON.stringify({
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '21:00' }
      })
    }
  })

  console.log(`✅ Created restaurant: ${restaurant.name}`)

  // Create tables
  const tables = []
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        number: i,
        capacity: Math.floor(Math.random() * 6) + 2, // 2-8 seats
        qrCode: `QR_TABLE_${i.toString().padStart(2, '0')}`,
        status: 'AVAILABLE'
      }
    })
    tables.push(table)
  }

  console.log(`✅ Created ${tables.length} tables`)

  // Create menu categories
  const categories = [
    { name: 'pizza', description: '맛있는 피자' },
    { name: 'pasta', description: '신선한 파스타' },
    { name: 'salad', description: '건강한 샐러드' },
    { name: 'drink', description: '시원한 음료' }
  ]

  const createdCategories = []
  for (const [index, category] of categories.entries()) {
    const createdCategory = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: category.name,
        description: category.description,
        sortOrder: index
      }
    })
    createdCategories.push(createdCategory)
  }

  console.log(`✅ Created ${createdCategories.length} menu categories`)

  // Create menu items
  const menuItems = [
    {
      categoryName: 'pizza',
      name: '마르게리타 피자',
      description: '신선한 토마토 소스와 모차렐라 치즈, 바질이 어우러진 클래식 피자',
      price: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      prepTimeMinutes: 15,
      options: {
        sizes: [
          { name: '미디움', price: 0 },
          { name: '라지', price: 5000 }
        ],
        extras: [
          { name: '올리브', price: 2000 },
          { name: '페퍼로니', price: 3000 },
          { name: '치즈 추가', price: 2500 }
        ]
      }
    },
    {
      categoryName: 'pizza',
      name: '페퍼로니 피자',
      description: '매콤한 페퍼로니와 치즈가 완벽하게 조화된 인기 메뉴',
      price: 22000,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
      prepTimeMinutes: 15,
      options: {
        sizes: [
          { name: '미디움', price: 0 },
          { name: '라지', price: 5000 }
        ],
        extras: [
          { name: '올리브', price: 2000 },
          { name: '버섯', price: 2000 },
          { name: '치즈 추가', price: 2500 }
        ]
      }
    },
    {
      categoryName: 'pasta',
      name: '치킨 파스타',
      description: '부드러운 치킨과 크림 소스가 어우러진 파스타',
      price: 16000,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      prepTimeMinutes: 12,
      options: {
        extras: [
          { name: '버섯', price: 2000 },
          { name: '베이컨', price: 3000 },
          { name: '치즈 추가', price: 2500 }
        ]
      }
    },
    {
      categoryName: 'salad',
      name: '시저 샐러드',
      description: '신선한 로메인 상추와 파마산 치즈, 크루톤이 들어간 건강한 샐러드',
      price: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      prepTimeMinutes: 5,
      options: {
        extras: [
          { name: '그릴드 치킨', price: 5000 },
          { name: '베이컨', price: 3000 },
          { name: '아보카도', price: 3500 }
        ]
      }
    },
    {
      categoryName: 'drink',
      name: '콜라',
      description: '시원한 탄산음료',
      price: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
      prepTimeMinutes: 1
    }
  ]

  const createdMenuItems = []
  for (const [index, item] of menuItems.entries()) {
    const category = createdCategories.find(c => c.name === item.categoryName)
    if (!category) continue

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: category.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        prepTimeMinutes: item.prepTimeMinutes,
        options: item.options ? JSON.stringify(item.options) : null,
        sortOrder: index
      }
    })
    createdMenuItems.push(menuItem)
  }

  console.log(`✅ Created ${createdMenuItems.length} menu items`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })