const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function syncDonations() {
  console.log('🔄 Iniciando sincronización de donaciones...');
  
  try {
    // Obtener todas las donaciones en estado pending
    const pendingDonations = await prisma.donation.findMany({
      where: { status: 'pending' },
      include: {
        user: true,
        shelter: true,
      },
    });

    console.log(`📊 Encontradas ${pendingDonations.length} donaciones en estado pending`);

    for (const donation of pendingDonations) {
      try {
        console.log(`🔍 Verificando donación ${donation.id} (${donation.sessionID})`);
        
        // Obtener la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(donation.sessionID);
        
        if (!session) {
          console.log(`❌ Sesión no encontrada en Stripe: ${donation.sessionID}`);
          continue;
        }

        // Verificar el estado del payment intent
        if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          
          if (paymentIntent.status === 'succeeded') {
            // Actualizar a completed
            await prisma.donation.update({
              where: { id: donation.id },
              data: { status: 'completed' },
            });
            console.log(`✅ Donación ${donation.id} actualizada a completed`);
          } else if (paymentIntent.status === 'requires_payment_method') {
            // Actualizar a failed
            await prisma.donation.update({
              where: { id: donation.id },
              data: { 
                status: 'failed',
                failureReason: 'Payment method required'
              },
            });
            console.log(`❌ Donación ${donation.id} actualizada a failed`);
          } else {
            console.log(`⏳ Donación ${donation.id} mantiene estado pending (${paymentIntent.status})`);
          }
        } else {
          console.log(`⚠️ No payment intent encontrado para donación ${donation.id}`);
        }
      } catch (error) {
        console.error(`❌ Error procesando donación ${donation.id}:`, error.message);
      }
    }

    console.log('✅ Sincronización completada');
  } catch (error) {
    console.error('❌ Error en la sincronización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  syncDonations();
}

module.exports = { syncDonations };
