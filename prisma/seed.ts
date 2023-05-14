import { Hotel, Prisma, PrismaClient, Room, User } from '@prisma/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { HOTEL_IMAGES_URLS_TEMPLATE } from './utils/hotelImagesUrls';

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
  let users = [
    {
      email: 'erico@erico.com',
      password: bcrypt.hashSync('erico', 12),
    },
    {
      email: 'monique@monique.com',
      password: bcrypt.hashSync('monique', 12),
    },
    {
      email: 'ottoniel@ottoniel.com',
      password: bcrypt.hashSync('ottoniel', 12),
    },
    {
      email: 'juan@juan.com',
      password: bcrypt.hashSync('juan', 12),
    },
  ];
  if (!user) {
    await prisma.user.createMany({
      data: users,
    });
  }

  let enrollments = await prisma.enrollment.findMany();
  if (!enrollments[0]) {
    const completeUsers = await prisma.user.findMany();
    for (let i = 0; i < completeUsers.length; i++) {
      const firstName = completeUsers[i].email.split('@')[0];
      const enrollment = await prisma.enrollment.create({
        data: {
          name: `${firstName}_enrollment`,
          cpf: '00000000000',
          birthday: dayjs().toDate(),
          phone: '48999999999',
          userId: completeUsers[i].id,
        },
      });
      enrollments.push(enrollment);
    }
  }

  let address = await prisma.address.findFirst();
  if (!address) {
    for (let i = 0; i < enrollments.length; i++) {
      address = await prisma.address.create({
        data: {
          street: 'Rua Desembargador Vitor Lima',
          number: '354',
          cep: '88040400',
          city: 'Florianopolis',
          neighborhood: 'Trindade',
          state: 'SC',
          enrollmentId: enrollments[i].id,
        },
      });
    }
  }

  let ticketType = await prisma.ticketType.findFirst();
  if (!ticketType) {
    ticketType = await prisma.ticketType.create({
      data: {
        name: 'TICKET TYPE CORRETO',
        price: 300,
        isRemote: false,
        includesHotel: true,
      },
    });
  }

  let tickets = await prisma.ticket.findMany();
  if (!tickets[0]) {
    for (let i = 0; i < enrollments.length; i++) {
      const ticket = await prisma.ticket.create({
        data: {
          enrollmentId: enrollments[i].id,
          status: 'PAID',
          ticketTypeId: ticketType.id,
        },
      });
      tickets.push(ticket);
    }
  }

  const hotels = await prisma.hotel.findMany();
  if (!hotels[0])
    for (let i = 0; i < 10; i++) {
      const hotel = await prisma.hotel.create({
        data: {
          name: `Hotel ${i}`,
          image: HOTEL_IMAGES_URLS_TEMPLATE[Math.floor(Math.random() * 10)],
        },
      });
      hotels.push(hotel);
    }

  const rooms = await prisma.room.findMany();
  if (!rooms[0]) {
    const hotels = await prisma.hotel.findMany();
    for (let h = 0; h < hotels.length; h++) {
      for (let i = 1; i <= 10; i++) {
        const room = await prisma.room.create({
          data: {
            name: `Room ${i}`,
            capacity: h % 2 === 0 ? Math.ceil((Math.random() * 10) / 4) : 1,
            hotelId: hotels[h].id,
          },
        });
        rooms.push(room);
      }
    }
  }

  const bookings = await prisma.booking.findMany();
  if (!bookings[0]) {
    for (let i = 0; i < rooms.length; i++) {
      // Coloquei isso aqui pras reservas não ficarem excessivas e serem aleatórias
      if ((i % 2 === 0) || i / 3 === 1 || i / 4 === 0) {
        continue;
      }
      const completeUsers = await prisma.user.findMany();
      const booking = await prisma.booking.create({
        data: {
          roomId: rooms[Math.floor(Math.random() * rooms.length)].id,
          userId: completeUsers[Math.floor(Math.random() * completeUsers.length)].id,
        },
      });
      bookings.push(booking);
    }
  }

  console.log({ event });
  console.log({ user });
  console.log({ enrollments });
  console.log({ ticketType });
  console.log({ hotels });
  console.log({ rooms });
  console.log({ bookings });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
