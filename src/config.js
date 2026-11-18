// All invitation content lives here. Edit this file to change any text, date or contact.

export const config = {
  timeZone: 'Asia/Kolkata',
  countryCode: '91',

  // ?to=Ravi (or ?name= / ?guest=) personalises the greeting.
  guest: {
    params: ['to', 'name', 'guest'],
    maxLength: 40,
    greeting: 'Dear {name},',
    fallbackGreeting: 'Dear Family and Friends,',
    invite: ['You are invited', 'to celebrate our wedding'],
  },

  closing: 'Your presence will make our celebration complete.',

  // ?s=g (groom's family, default) or ?s=b (bride's family).
  sideParams: ['s', 'side'],
  sideAliases: {
    g: 'groom', groom: 'groom', bharath: 'groom',
    b: 'bride', bride: 'bride', sanjana: 'bride',
  },
  defaultSide: 'groom',

  invocations: ['|| Om Sri Ganeshaya Namaha ||', '|| Shri Revanasiddeshwara Swami Prasanna ||'],

  groom: {
    name: 'Bharath',
    prefix: 'Chi. Ry.',
    fullName: 'Bharath S.P',
    qualification: 'B.Tech',
    // Each inner array is one paragraph; each string in it is shown on its own line.
    hostLines: [
      ['Grandson of Late Smt. Trejavatamma &', 'Late Sri Somaiah Shetty'],
      ['Grandson of Smt. Prema &', 'Late Sri S.M. Guptha'],
    ],
    guestLines: [['Son of Smt. M.G. Revathi &', 'Sri S. Prasad']],
  },
  bride: {
    name: 'Sanjana',
    prefix: 'Chi. Sou.',
    fullName: 'Sanjana J',
    qualification: 'B.Tech',
    hostLines: [],
    guestLines: [['Daughter of Smt. Soujanya &', 'Sri Chandrashekar Jonnagadla']],
  },

  sides: {
    groom: {
      hosts: 'Smt. M.G. Revathi & Sri S. Prasad',
      child: 'son',
      address: ['No. 523, BTS Layout, Arekere', 'Bengaluru\u00a0–\u00a0560076'],
      phones: ['9844182938', '7019590562'],
    },
    bride: {
      hosts: 'Smt. Soujanya & Sri Chandrashekar Jonnagadla',
      child: 'daughter',
      address: [],
      phones: ['9844182938', '7019590562'],
    },
  },

  wedding: {
    dateLabel: 'Sunday, 24th January 2027',
    muhurtamISO: '2027-01-24T11:40:00+05:30',
  },

  events: [
    {
      id: 'reception',
      title: 'Reception',
      subtitle: 'An evening of celebration',
      date: 'Saturday, 23rd January 2027',
      time: '7:00 PM onwards',
      start: '2027-01-23T19:00:00+05:30',
      end: '2027-01-23T22:30:00+05:30',
      icon: 'diya',
    },
    {
      id: 'upanayana',
      title: 'Upanayana',
      subtitle: 'The sacred thread ceremony',
      date: 'Sunday, 24th January 2027',
      time: '8:15 AM – 8:45 AM',
      lagna: 'Kumbha Lagna',
      start: '2027-01-24T08:15:00+05:30',
      end: '2027-01-24T08:45:00+05:30',
      icon: 'fire',
    },
    {
      id: 'muhurtam',
      title: 'Muhurtam',
      subtitle: 'The auspicious wedding ceremony',
      date: 'Sunday, 24th January 2027',
      time: '11:40 AM – 12:00 PM',
      lagna: 'Mesha Lagna',
      start: '2027-01-24T11:40:00+05:30',
      end: '2027-01-24T12:00:00+05:30',
      icon: 'kalasha',
    },
  ],

  venue: {
    name: 'Samskruthi Gokula Convention Centre',
    address: 'Natraja Layout, J.P. Nagar 7th Phase, Bengaluru\u00a0–\u00a0560078',
    mapQuery: 'Samskruthi Gokula Convention Centre, J.P. Nagar 7th Phase, Bengaluru 560078',
  },

  // Background music: any embeddable YouTube video ID. Starts when the guest taps the seal.
  music: {
    youtubeId: 'fW5uUAt5_So',
    startAt: 0,
    volume: 60,
  },

  compliments: 'With best compliments from relatives & friends',

  share: {
    message:
      "You're invited! Bharath & Sanjana are getting married on Sunday, 24th January 2027 at Samskruthi Gokula Convention Centre, Bengaluru.",
  },
};
