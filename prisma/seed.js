const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear usuario
  const user = await prisma.user.upsert({
    where: { email: 'demo@pulso.com' },
    update: {},
    create: {
      id: 'user123',
      email: 'demo@pulso.com',
      name: 'María González',
      businessName: 'Restaurante El Buen Sabor',
      businessType: 'Restaurante'
    }
  });

  console.log('👤 Usuario creado:', user.businessName);

  // Función para generar transacciones por mes
  function generateMonthlyTransactions(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const transactions = [];

    // Ingresos diarios variables
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      
      // Ventas diarias (más altas en fines de semana)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseVentas = isWeekend ? 15000 + Math.random() * 10000 : 8000 + Math.random() * 7000;
      
      transactions.push({
        type: 'income',
        category: 'Ventas',
        amount: Math.round(baseVentas),
        description: `Ventas del ${day}/${month}/${year}`,
        date: date
      });

      // Servicios (algunos días)
      if (Math.random() > 0.4) {
        transactions.push({
          type: 'income',
          category: 'Servicios',
          amount: Math.round(2000 + Math.random() * 8000),
          description: `Servicio a domicilio ${day}/${month}`,
          date: date
        });
      }

      // Gastos diarios variables
      if (Math.random() > 0.3) {
        transactions.push({
          type: 'expense',
          category: 'Suministros',
          amount: Math.round(500 + Math.random() * 2000),
          description: `Compra ingredientes ${day}/${month}`,
          date: date
        });
      }
    }

    // Gastos mensuales fijos
    transactions.push(
      {
        type: 'expense',
        category: 'Nómina',
        amount: 35000 + Math.random() * 5000,
        description: `Nómina ${month}/${year}`,
        date: new Date(year, month - 1, 1)
      },
      {
        type: 'expense',
        category: 'Alquiler',
        amount: 12000,
        description: `Renta local ${month}/${year}`,
        date: new Date(year, month - 1, 1)
      },
      {
        type: 'expense',
        category: 'Servicios',
        amount: 3000 + Math.random() * 1000,
        description: `Electricidad ${month}/${year}`,
        date: new Date(year, month - 1, 2)
      },
      {
        type: 'expense',
        category: 'Servicios',
        amount: 2000,
        description: `Internet y teléfono ${month}/${year}`,
        date: new Date(year, month - 1, 2)
      },
      {
        type: 'expense',
        category: 'Servicios',
        amount: 2500 + Math.random() * 1000,
        description: `Gas y agua ${month}/${year}`,
        date: new Date(year, month - 1, 2)
      }
    );

    // Marketing (algunas semanas)
    const marketingDays = [5, 12, 19, 26];
    marketingDays.forEach(day => {
      if (day <= daysInMonth) {
        transactions.push({
          type: 'expense',
          category: 'Marketing',
          amount: Math.round(1000 + Math.random() * 4000),
          description: `Publicidad semana ${Math.ceil(day/7)} - ${month}/${year}`,
          date: new Date(year, month - 1, day)
        });
      }
    });

    // Consultoría (ocasional)
    if (Math.random() > 0.6) {
      transactions.push({
        type: 'income',
        category: 'Consultoría',
        amount: Math.round(10000 + Math.random() * 15000),
        description: `Consultoría gastronómica ${month}/${year}`,
        date: new Date(year, month - 1, Math.ceil(Math.random() * daysInMonth))
      });
    }

    // Comisiones delivery
    const deliveryDays = Math.ceil(daysInMonth / 7); // Una vez por semana aprox
    for (let i = 0; i < deliveryDays; i++) {
      const randomDay = Math.ceil(Math.random() * daysInMonth);
      transactions.push({
        type: 'income',
        category: 'Comisiones',
        amount: Math.round(1000 + Math.random() * 3000),
        description: `Comisión delivery semana ${i + 1}`,
        date: new Date(year, month - 1, randomDay)
      });
    }

    return transactions;
  }

  // Generar datos para varios meses
  const months = [
    { year: 2025, month: 8 },   // Agosto 2025
    { year: 2025, month: 9 },   // Septiembre 2025
    { year: 2025, month: 10 },  // Octubre 2025 (mes actual)
    { year: 2025, month: 7 },   // Julio 2025
    { year: 2025, month: 6 },   // Junio 2025
  ];

  let totalTransactions = 0;

  for (const { year, month } of months) {
    console.log(`📅 Generando datos para ${month}/${year}...`);
    
    const monthTransactions = generateMonthlyTransactions(year, month);
    
    for (const transaction of monthTransactions) {
      await prisma.transaction.create({
        data: {
          ...transaction,
          amount: Math.round(transaction.amount), // Redondear montos
          userId: user.id
        }
      });
    }
    
    totalTransactions += monthTransactions.length;
    console.log(`✅ ${monthTransactions.length} transacciones creadas para ${month}/${year}`);
  }

  console.log(`\n🎉 ¡Completado! Total: ${totalTransactions} transacciones creadas`);
  
  // Mostrar resumen por mes
  console.log('\n📊 Resumen por mes:');
  for (const { year, month } of months) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log(`${month}/${year}: Ingresos $${income.toLocaleString()} | Gastos $${expenses.toLocaleString()} | Balance $${(income - expenses).toLocaleString()}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });