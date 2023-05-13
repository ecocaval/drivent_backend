import { Hotel, PrismaClient, Room } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {

  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'teste@teste.com',
        password: 'teste',
      },
    });
  }

  let enrollment = await prisma.enrollment.findFirst();
  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        name: 'teste',
        cpf: '00000000000',
        birthday: dayjs().toDate(),
        phone: '48999999999',
        userId: 1,
      },
    });
  }

  let ticketTypes = await prisma.ticketType.findFirst();
  if (!ticketTypes) {
    await prisma.ticketType.createMany({
      data: [
        {
          name: 'Não gosto de gente',
          price: 300,
          isRemote: false,
          includesHotel: false,
        },
        {
          name: 'Curtida rápida',
          price: 500,
          isRemote: true,
          includesHotel: false,
        },
        {
          name: 'ComboFull',
          price: 700,
          isRemote: true,
          includesHotel: true,
        },
      ],
    });
  }

  const hotel = await prisma.hotel.findFirst();
  const hotels: Hotel[] = [];
  if (!hotel)
    for (let i = 0; i < 10; i++) {
      const hotel = await prisma.hotel.create({
        data: {
          name: `Hotel ${i}`,
          image:
            'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
        },
      });
      hotels.push(hotel);
    }

  const room = await prisma.room.findFirst();
  const rooms: Room[] = [];
  if (!room) {
    const hotels = await prisma.hotel.findMany();
    for (let h = 0; h < hotels.length; h++) {
      for (let i = 1; i <= 10; i++) {
        const room = await prisma.room.create({
          data: {
            name: `Room ${i}`,
            capacity: 2,
            hotelId: hotels[h].id,
          },
        });        
        rooms.push(room);
      }
    }
  }

  console.log({ event });
  console.log({ user });
  console.log({ enrollment });
  console.log({ ticketTypes });
  console.log({ hotels });
  console.log({ rooms });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
