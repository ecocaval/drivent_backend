import { Hotel, PrismaClient, Room } from '@prisma/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

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
        password: bcrypt.hashSync('teste', 12),
      },
    });
  }

  let enrollment = await prisma.enrollment.findFirst();
  console.log(enrollment);
  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        name: 'teste',
        cpf: '00000000000',
        birthday: dayjs().toDate(),
        phone: '48999999999',
        userId: user.id,
      },
    });
  }

  let address = await prisma.address.findFirst();
  if (!address) {
    address = await prisma.address.create({
      data: {
        street: 'Rua Desembargador Vitor Lima',
        number: '354',
        cep: '88040400',
        city: 'Florianopolis',
        neighborhood: 'Trindade',
        state: 'SC',
        enrollmentId: enrollment.id,
      },
    });
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

  let ticket = await prisma.ticket.findFirst();
  if (!ticket) {
    ticket = await prisma.ticket.create({
      data: {
        enrollmentId: enrollment.id,
        status: 'PAID',
        ticketTypeId: ticketType.id,
      },
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
            capacity: h % 2 === 0 ? Math.ceil((Math.random() * 10) / 4) : 1,
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
  console.log({ ticketType });
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
