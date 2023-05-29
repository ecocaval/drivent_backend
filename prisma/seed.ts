import { ActivityLocation, Hotel, Month, Prisma, PrismaClient, Room, User, WeekDays } from '@prisma/client';
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
    {
      email: 'teste@teste.com',
      password: bcrypt.hashSync('teste', 12),
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
    let ticketType = await prisma.ticketType.createMany({
      data: [{
        name: 'Online',
        price: 300,
        isRemote: true,
        includesHotel: false,
      },
      {
        name: 'Presencial',
        price: 500,
        isRemote: false,
        includesHotel: false,
      },
      {
        name: 'Presencial',
        price: 700,
        isRemote: false,
        includesHotel: true,
      },]
    });
    return ticketType
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

  const activityDates = await prisma.activityDate.findMany();
  if (!activityDates[0]) {    
    
    const weekDays = [
      WeekDays.MONDAY,
      WeekDays.TUESDAY,
      WeekDays.WEDNESDAY,
      WeekDays.THURSDAY,
      WeekDays.FRIDAY,
      WeekDays.SATURDAY,
      WeekDays.SUNDAY
    ]

    const months = [
      Month.JANUARY,
      Month.FEBRUARY,
      Month.MARCH,
      Month.APRIL,
      Month.MAY,
      Month.JUNE,
      Month.JULY
    ]

    for (let i = 0; i < 7; i++) {
      const date = await prisma.activityDate.create({
        data: {
          weekDay: weekDays[i],
          month: months[i]
        },
      });
      activityDates.push(date);
    }
  }

  const activities = await prisma.activity.findMany();

  if (!activities[0]) {
    
    const activityLocations = [
      ActivityLocation.MAIN,
      ActivityLocation.LATERAL,
      ActivityLocation.WORKSHOP
    ]

    const activityNames = [
      "Minecraft: a saga",
      "Montando o pc ideal no lolzinho",
      "Palestra sobre cultura",
      "Discussão Java",
      "Jogue RPGs",
      "Aula de nataçao"
    ]

    const dates = await prisma.activityDate.findMany();

    for (let i = 0; i < 6; i++) {
      const startTime = Math.floor((Math.random() * 10))
      const slotsSelector = Math.floor((Math.random() * 20))
      const oneToThreeSelector = (Math.floor((Math.random() * 10)/3))
      const date = await prisma.activity.create({
        data: {
          name: activityNames[i],
          location: activityLocations[oneToThreeSelector],
          startsAt: startTime,
          endsAt: startTime + oneToThreeSelector,
          slots: i != 4 ? slotsSelector : 1,
          dateId: dates[oneToThreeSelector * 2].id,
        },
      });
      activities.push(date);
    }
  }

  const userActivities = await prisma.userActivity.findMany();
  if (!userActivities[0]) {

    let freeSlotsActivity = await prisma.activity.findMany();

    const [activity] = freeSlotsActivity?.filter(a => a.slots < 1)

    if(activity) {
      const date = await prisma.userActivity.create({
        data: {
          userId: 0,
          activityId: activity.id
        },
      });
      userActivities.push(date);
    }
  }

  console.log({ event });
  console.log({ user });
  console.log({ enrollments });
  console.log({ ticketType });
  console.log({ hotels });
  console.log({ rooms });
  console.log({ bookings });
  console.log({ activityDates });
  console.log({ userActivities })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
