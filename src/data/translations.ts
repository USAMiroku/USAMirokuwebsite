export type Language = 'en' | 'es' | 'pt'

export type TranslationContent = {
  brand: string
  tagline: string
  nav: {
    home: string
    about: string
    aboutJohrei: string
    meishuSama: string
    paradise: string
    firstVisit: string
    locations: string
    events: string
    resources: string
    testimonials: string
    contact: string
    usaUnits: string
    usaContact: string
    donate: string
    guidelines: string
  },
  actions: {
    donate: string
    learnMore: string
    findCenter: string
    firstVisit: string
    contact: string
    viewAll: string
    back: string
    recordDonation: string
  }
  home: {
    heroTitle: string
    heroIntro: string
    heroKicker: string
    heroSubtitle: string
    heroButtons: { findCenter: string; firstVisit: string }
    stats: { label: string; value: string }[]
    visitTitle: string
    visitSteps: { title: string; body: string }[]
    johreiKicker: string
    johreiCta: string
    whatIsJohrei: { title: string; body: string }
    vision: {
      kicker: string
      title: string
      body: string
      cards: { title: string; body: string; tone: string }[]
    }
    newcomers: {
      title: string
      body: string
      cards: { title: string; body: string; cta: string; to: string }[]
    }
    faqTitle: string
    faqs: { q: string; a: string }[]
    contactTitle: string
    contactBody: string
    centers: { title: string; body: string; link: string }
    resources: { title: string; body: string; link: string }
    guideline: { title: string; body: string; button: string }
    ready: { title: string; body: string }
  }
  about: {
    title: string
    body: string
    kicker: string
    mission: { title: string; body: string }
    whoWeServe: { title: string; body: string }
    offer: { title: string; body: string }
    focus: { title: string; body: string }
    service: { title: string; body: string }
    guides: { title: string; body: string }
    leadership: { title: string; body: string }
  }
  johrei: {
    title: string
    intro: string
    kicker: string
    vision: { title: string; body: string }
    whatIs: {
      title: string;
      body: string;
      experience: { title: string; body: string }
      effect: { title: string; body: string }
      goal: { title: string; body: string }
    }
    path: { title: string; body: string }
    extra: {
      title: string
      origin: { title: string; body: string }
      concept: { title: string; body: string }
      mission: { title: string; quote: string; author: string }
      practice: { title: string; body: string }
      benefits: { title: string; items: string[] }
    }
  }
  meishuSama: {
    title: string
    intro: string
    points: string[]
    learnMore: string
    legacy: {
      title: string
      intro: string
      milestones: { title: string; body: string }[]
      legacyTitle: string
      legacyPoints: string[]
    }
  }
  paradise: { title: string; intro: string; points: string[] }
  firstVisit: {
    title: string
    intro: string
    kicker: string
    steps: { title: string; body: string }[]
    tips: { title: string; items: string[] }
    etiquette: { title: string; items: string[] }
    online: { title: string; body: string }
  }
  locations: {
    title: string
    intro: string
    filters: { province: string; city: string; type: string; clear: string; search: string }
    types: { center: string; group: string; comingSoon: string }
    detail: { contact: string; schedule: string; directions: string; contactCta: string }
    empty: string
  }
  events: { title: string; empty: string }
  resourcesPage: { title: string; intro: string; categories: string }
  testimonials: { title: string; intro: string }
  contact: {
    title: string
    intro: string
    options: { general: string; visit: string; learn: string }
  }
  usa: {
    units: {
      title: string
      intro: string
      cardCta: string
      contactAssociation: string
      labels: {
        leaders: string
        contact: string
        phone: string
        email: string
      }
      units: {
        name: string
        address?: string
        phone: string
        leaders?: string
        contact?: string
        email: string
        note?: string
      }[]
    }
    contact: {
      title: string
      intro: string
      labels: {
        email: string
        phone: string
        prayer: string
        donate: string
      }
      prayerText: string
      donateText: string
      activitiesCta: string
      note: string
    }
  }
  donate: {
    title: string
    intro: string
    placeholder: string
    stripeTitle: string
    interacTitle: string
    interacStep1: string
    interacStep2: string
    formTitle: string
    formIntro: string
    fields: {
      name: string
      email: string
      amount: string
      date: string
      fund: string
      group: string
      note: string
    }
    funds: string[]
    groups: {
      toronto: string
      montreal: string
      vancouver: string
      calgary: string
      ottawa: string
      other: string
    }
  }
  guidelines: { title: string; motto: string; titleFr: string; mottoFr: string; placeholderEn: string; placeholderFr: string }
  notFound: string
}

export const translations: Record<string, TranslationContent> = {
  en: {
    brand: 'World Messianic Church of America / Miroku Association USA',
    tagline: 'Discover Johrei and a path of gratitude',
    nav: {
      home: 'Home',
      about: 'About',
      aboutJohrei: 'Johrei',
      meishuSama: 'Meishu-Sama',
      paradise: 'Paradise on Earth',
      firstVisit: 'First Visit',
      locations: 'Locations',
      events: 'Events',
      resources: 'Resources',
      testimonials: 'Testimonials',
      contact: 'Contact',
      usaUnits: 'USA Units',
      usaContact: 'USA Contact',
      donate: 'Donate',
      guidelines: 'Guidelines 2026',
    },
    actions: {
      donate: 'Donate',
      learnMore: 'Learn more',
      findCenter: 'Locations',
      firstVisit: 'First Visit',
      contact: 'Contact us',
      viewAll: 'View all',
      back: 'Back',
      recordDonation: 'Record my donation',
    },
    home: {
      heroTitle: 'Welcome to',
      heroIntro: 'Creating a World of Health, Prosperity, and Peace Through the Power of Johrei.',
      heroKicker: 'World Messianic Church of America / Miroku Association USA',
      heroSubtitle: 'World Messianic Church of America / Miroku Association USA',
      heroButtons: { findCenter: 'Visit a Center', firstVisit: 'Explore USA Units' },
      stats: [
        { label: 'Locations', value: 'USA-wide' },
        { label: 'Always free', value: 'Open to All' },
        { label: 'Experience', value: 'Grounded' },
        { label: 'Duration', value: '20–30m' },
      ],
      visitTitle: 'Begin Your Journey',
      visitSteps: [
        { title: 'A Warm Welcome', body: "Our centers are open sanctuaries where you'll be greeted with sincerity." },
        { title: 'Receive Johrei', body: "Experience 20 minutes of spiritual purification through divine light." },
        { title: 'The Path of Beauty', body: "Explore our gardens and art, designed to uplift the human spirit." },
        { title: 'Connect & Share', body: 'Join a community dedicated to serving others and building peace.' },
      ],
      johreiKicker: 'Core Practice',
      johreiCta: 'Experience Johrei',
      whatIsJohrei: {
        title: 'Johrei',
        body: 'Johrei is a transmission of Divine Light that dissolves spiritual clouds and elevates the soul. It purifies the spiritual body, which in turn removes impurities from the blood (the materialized spirit).',
      },
      vision: {
        kicker: 'The Three Pillars',
        title: 'Truth, Virtue, and Beauty',
        body: 'The foundation of spiritual refinement and global harmony.',
        cards: [
          { title: 'Truth (Shin)', body: 'Understanding spiritual and cosmic laws, including the Law of Cause and Effect. Through study, we develop Chie (wisdom) to perceive the divine plan.', tone: 'bg-warm-amber-50' },
          { title: 'Virtue (Zen)', body: 'Practicing righteousness and Makoto (sincerity). Living the Daijo way by prioritizing the happiness of all humanity and becoming appreciated by others.', tone: 'bg-rose-50' },
          { title: 'Beauty (Bi)', body: 'Spiritual refinement through art and nature. Beauty elevates consciousness and is essential for a heavenly life.', tone: 'bg-violet-50' },
        ],
      },
      newcomers: {
        title: 'New to Johrei?',
        body: 'A simple path to learn, receive Johrei, and feel at home.',
        cards: [
          {
            title: 'What is Johrei?',
            body: 'A spiritual practice of channeling divine light with gratitude and respect.',
            cta: 'Deep Dive into Johrei',
            to: '/johrei',
          },
          {
            title: 'What to expect',
            body: 'A calm, welcoming visit. Sessions are usually 20–30 minutes.',
            cta: 'First Visit',
            to: '/first-visit',
          },
          {
            title: 'Experience Johrei',
            body: 'Find our main center or regional groups near you.',
            cta: 'View Locations',
            to: '/locations',
          },
        ],
      },
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Is there a cost to receive Johrei?',
          a: 'No. Johrei is offered freely to everyone. We are supported by voluntary donations from those who wish to contribute.',
        },
        {
          q: 'Do I need to be a member of any organization?',
          a: 'Not at all. Our centers are open to people of all faiths, spiritual paths, or none at all.',
        },
        {
          q: 'What should I wear to a center?',
          a: 'Casual, modest clothing is appropriate. We want you to feel comfortable and at peace.',
        },
        {
          q: 'How often can I receive Johrei?',
          a: 'You can receive Johrei as often as you like. Many visitors start with weekly sessions.',
        },
      ],
      contactTitle: 'Get in touch',
      contactBody: 'We are happy to answer questions or help you plan a visit.',
      centers: {
        title: 'USA Units',
        body: 'Toronto, Montreal, Ottawa, and Vancouver: clear paths to local centers and groups.',
        link: 'View units in USA',
      },
      resources: {
        title: 'USA Contact',
        body: 'Reach the national office and access bilingual support for visits, prayer requests, and activities.',
        link: 'Go to USA contact',
      },
      guideline: {
        title: '2026 Guideline',
        body: 'Our shared focus for the coming year. Simple, clear direction to serve with gratitude.',
        button: 'Read the guideline',
      },
      ready: {
        title: 'You are welcome to visit and experience Johrei.',
        body: 'Find your nearest unit in USA or contact the association directly.',
      },
    },
    about: {
      title: 'About the World Messianic Church',
      body: 'World Messianic Church of America / Miroku Association USA is dedicated to the establishment of Paradise on Earth through spiritual purification, service, and beauty.',
      kicker: 'About',
      mission: {
        title: 'Mission',
        body: 'Acting as a "Midwife to World Civilization" to birth a new era of true happiness and revealed truth.',
      },
      whoWeServe: {
        title: 'Who We Serve',
        body: 'We welcome all people seeking spiritual growth, health, and harmony.',
      },
      offer: {
        title: 'What We Do',
        body: 'We share Johrei, study spiritual principles, and cultivate beauty through art and nature.',
      },
      focus: {
        title: 'Founder',
        body: 'Mokichi Okada (1882–1955), a visionary who revealed the transition from the "Age of Night" to the "Daylight Age."',
      },
      service: {
        title: 'Core Practice',
        body: 'Johrei purifies the spiritual body and supports the purification of blood as the materialized form of spirit.',
      },
      guides: {
        title: 'Core Principles',
        body: 'Truth (Shin), Virtue (Zen), and Beauty (Bi).',
      },
      leadership: {
        title: 'Participation',
        body: 'As a registered Canadian charity, we are committed to transparency, accountability, and service.',
      },
    },
    johrei: {
      title: 'Johrei: Spiritual Science of Divine Light',
      intro:
        'Johrei is a transmission of Divine Light that dissolves spiritual clouds and elevates the soul.',
      kicker: 'Core Practice',
      vision: {
        title: 'The Spiritual Precedes the Physical',
        body: 'Johrei purifies the spiritual body first. As spiritual clouds dissolve, impurities are removed from the blood, understood as the materialized form of spirit. This process restores natural health and raises human consciousness.',
      },
      whatIs: {
        title: 'Definition',
        body: 'A transmission of Divine Light to dissolve spiritual clouds and elevate the soul.',
        experience: {
          title: 'Spiritual Purification',
          body: 'Johrei targets the spiritual origin of suffering, bringing clarity and inner balance through Divine Light.',
        },
        effect: {
          title: 'Relationship Between Spirit and Blood',
          body: 'As the spirit is purified, blood impurities are naturally resolved. This is the spiritual-physical mechanism at the center of Johrei teaching.',
        },
        goal: {
          title: 'Elevation of Consciousness',
          body: 'Johrei supports the awakening of the soul and helps each person align with health, prosperity, and peace.',
        },
      },
      path: {
        title: 'A Practice for Everyone',
        body: 'Johrei is offered to all, freely. Through ongoing purification and service, people participate in the construction of Paradise on Earth.',
      },
      extra: {
        title: 'More About Johrei',
        origin: {
          title: 'Origin',
          body: 'The principle of Johrei is the irradiation of a mysterious invisible light that emanates from the human body. This light is a form of spiritual energy, and its main component is the fire element. As the Daylight World approaches, the fire element increases in the Spiritual World, whose source is the Sun.',
        },
        concept: {
          title: 'Concept',
          body: 'Johrei is a method of channeling spiritual energy (Divine Light) for purification of the spirit, capable of transforming spiritual and material disharmony into harmony.',
        },
        mission: {
          title: 'Mission',
          quote:
            'Although Johrei in our religion may appear to aim at curing illnesses, that is not all. It has a much greater meaning... it is a method of creating happiness.',
          author: 'Meishu-Sama',
        },
        practice: {
          title: 'How Johrei Works',
          body: 'A qualified member ministers Johrei as a channel of Divine Light through the laying on of hands. Johrei Light acts on the spirit and reflects in the body, bringing spiritual, mental, and physical well-being.',
        },
        benefits: {
          title: 'Benefits',
          items: [
            'Awakens awareness of the Creator.',
            'Elevates intelligence and personality.',
            'Strengthens people to face life’s challenges.',
            'Expands the aura, offering protection from misfortune.',
            'Promotes physical and spiritual health.',
            'Helps people perceive abundance and opportunities more clearly.',
            'Encourages serenity and peace.',
            'Strengthens gratitude and altruism.',
          ],
        },
      },
    },
    meishuSama: {
      title: 'Meishu-sama: Founder and Visionary',
      intro: 'Mokichi Okada (1882-1955), known as Meishu-sama, received divine revelations concerning humanity\'s transition from the "Age of Night" to the "Daylight Age."',
      points: [
        'He taught that spiritual reality precedes physical reality and that purification is the path to true health.',
        'He described his mission as acting as a "Midwife to World Civilization," guiding humanity into a new era.',
        'His teachings unite Truth, Virtue, and Beauty as practical principles for daily life and social transformation.',
        'Through Johrei, art, and nature, he envisioned a world of health, prosperity, and peace.',
      ],
      learnMore: 'Learn more about his life and legacy',
      legacy: {
        title: 'Meishu-sama: Life and Legacy',
        intro: 'A deeper look at how Mokichi Okada’s life, mission, and teachings continue to shape spiritual practice today.',
        milestones: [
          {
            title: '1882: Early Life and Search for Truth',
            body: 'Born in 1882 as Mokichi Okada, he pursued a lifelong search for truth and the spiritual laws that govern human happiness.',
          },
          {
            title: '1935: Founding Mission',
            body: 'In 1935, he formally began a movement dedicated to building Paradise on Earth through spiritual purification, gratitude, and service.',
          },
          {
            title: 'Teaching Through Practice',
            body: 'He taught that Johrei, appreciation of beauty, and alignment with divine will transform both individual life and society.',
          },
          {
            title: '1955 and Beyond',
            body: 'After his passing in 1955, his teachings continued to spread internationally, inspiring communities committed to health, prosperity, and peace.',
          },
        ],
        legacyTitle: 'Enduring Legacy',
        legacyPoints: [
          'Johrei as a practical path of spiritual purification.',
          'Truth, Virtue, and Beauty as living principles.',
          'Gratitude and altruistic service as daily discipline.',
          'A global vision of Paradise on Earth.',
        ],
      },
    },
    paradise: { title: 'Paradise on Earth', intro: 'A tangible state of peace and health realized through individual transformation.', points: ['Acts of gratitude', 'Community service', 'Inner harmony'] },
    firstVisit: {
      title: 'Your First Visit',
      intro:
        'We welcome you to our sanctuaries. Here is a practical guide to your first experience.',
      kicker: 'What to Expect',
      steps: [
        {
          title: 'The Welcome',
          body: 'When you arrive, a member will greet you and provide a brief orientation.',
        },
        {
          title: 'The Session',
          body: 'You will sit comfortably while receiving Divine Light for 20 minutes.',
        },
        {
          title: 'The Reflection',
          body: 'Take a moment to relax and share your initial impressions if you wish.',
        },
      ],
      tips: {
        title: 'Practical Tips',
        items: [
          'Comfortable, modest attire is recommended.',
          'Sessions are completely free.',
          'No appointment needed for most center locations.',
          'Open to all religious and spiritual backgrounds.',
        ],
      },
      etiquette: {
        title: 'Sanctuary Etiquette',
        items: [
          'Please silence electronic devices.',
          'Maintain a soft and respectful volume.',
          'Feel free to ask questions at any time.',
          'Photography is permitted in designated areas only.',
        ],
      },
      online: {
        title: 'Request a Session',
        body: 'If you cannot visit a center, contact us to find a local gathering group near you.',
      },
    },
    locations: {
      title: 'Locations',
      intro: 'Find a center or group near you.',
      filters: {
        province: 'Province',
        city: 'City',
        type: 'Type',
        clear: 'Clear filters',
        search: 'Search',
      },
      types: { center: 'Center', group: 'Group', comingSoon: 'Coming soon' },
      detail: {
        contact: 'Contact',
        schedule: 'Schedule',
        directions: 'View on map',
        contactCta: 'Contact us',
      },
      empty: 'No locations match your filters yet. Try clearing them or check back soon.',
    },
    events: {
      title: 'Events',
      empty: 'No upcoming events yet. Check back soon.',
    },
    resourcesPage: {
      title: 'Resources',
      intro: 'Short guides to help you learn, prepare for a visit, and deepen your practice.',
      categories: 'Categories',
    },
    testimonials: {
      title: 'Testimonials',
      intro: 'Experiences shared by community members. Summaries are paraphrased with source links.',
    },
    contact: {
      title: 'Contact',
      intro: 'We are happy to answer questions, help you plan a visit, or connect you with a local group.',
      options: {
        general: 'General inquiries: info@miroku.us',
        visit: 'Schedule or first visit questions: +1 (305) 308-8830',
        learn: 'Learn more about Johrei: see Resources or email us.',
      },
    },
    usa: {
      units: {
        title: 'Units in USA',
        intro: 'Find local Johrei centers and groups across USA. Contact the national office for schedules and meeting locations.',
        cardCta: 'Contact the association',
        contactAssociation: 'Contact the association',
        labels: {
          leaders: 'Leaders',
          contact: 'Contact',
          phone: 'Phone',
          email: 'Email',
        },
        units: [
          {
            name: 'Toronto Center',
            address: '3416 Dundas Street West, Suite 209, Toronto, ON M6S 2S1',
            phone: '+1 (305) 308-8830',
            leaders: 'Rev. Guilherme de Souza; Rev. Ana De Sousa',
            email: 'info@miroku.us',
          },
          {
            name: 'Ottawa Group',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
            note: 'No public street address listed - contact for meeting locations and schedules.',
          },
          {
            name: 'Montreal Group',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
          {
            name: 'Vancouver Group',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
        ],
      },
      contact: {
        title: 'Contact World Messianic Church of America / Miroku Association USA',
        intro: 'Reach the national office or local centres using the details below.',
        labels: {
          email: 'Email',
          phone: 'Phone',
          prayer: 'Online prayer / request form',
          donate: 'Donate',
        },
        prayerText: 'Submit a prayer request',
        donateText: 'Gratitude Donation (PayPal)',
        activitiesCta: 'See activities & services',
        note: 'Confirm hours, local addresses and event schedules with the local centre before publishing.',
      },
    },
    donate: {
      title: 'Support Our Mission',
      intro: 'Your contribution supports our activities and the sharing of Johrei across USA. We appreciate your participation.',
      placeholder: 'We are currently setting up secure online giving. Please contact our Toronto center for participation inquiries.',
      stripeTitle: 'Donate by Card / Wallet (Stripe)',
      interacTitle: 'Donate by Interac e-Transfer',
      interacStep1: 'Send Interac e-Transfer to: info@miroku.us',
      interacStep2: 'Fill out the "Interac Donation Confirmation" form to record your donation',
      formTitle: 'Donation Confirmation',
      formIntro: 'Thank you for your support. Please record the details of your e-Transfer to help us with our monthly participation reporting.',
      fields: {
        name: 'Full Name',
        email: 'Email Address',
        amount: 'Amount Sent',
        date: 'Date Sent',
        fund: 'Donation Type / Fund',
        group: 'Group / Center',
        note: 'Note / Message'
      },
      funds: [
        'Gratitude',
        'Enshrinement (Sorei Saishi)',
        'Book',
        'Focal Point',
        'Ohikari Box, Chains, Liturgical items',
        'Fundraising',
        'Membership Course',
        'Pilgrimage',
        'Sacred Objects',
        'Seminar',
        'Center Renovation',
        'Sangetsu Donations',
        'Ikebana classes',
        'Sangetsu Workshop'
      ],
      groups: {
        toronto: 'Toronto',
        montreal: 'Montreal',
        vancouver: 'Vancouver',
        calgary: 'Calgary',
        ottawa: 'Ottawa',
        other: 'Other'
      }
    },
    guidelines: {
      title: 'Guidelines for 2026',
      motto:
        '“Helping others dedicate themselves to the construction of Paradise on Earth, through our practices of faith, is the path to our salvation.”',
      titleFr: 'Directives 2026',
      mottoFr:
        'Aider les personnes à s’engager dans la construction du Paradis Terrestre, à travers les pratiques messianiques, constituent la voie de notre salvation',
      placeholderEn: 'Full guideline details will be added here.',
      placeholderFr: 'Les détails complets seront ajoutés ici.',
    },
    notFound: 'Content not found.',
  },
  es: {
    brand: 'World Messianic Church of America / Miroku Association USA',
    tagline: 'Descubre el Johrei y un camino de gratitud',
    nav: {
      home: 'Inicio',
      about: 'Nosotros',
      aboutJohrei: 'Johrei',
      meishuSama: 'Meishu-Sama',
      paradise: 'Paraíso Terrenal',
      firstVisit: 'Primera visita',
      locations: 'Centros',
      events: 'Eventos',
      resources: 'Recursos',
      testimonials: 'Testimonios',
      contact: 'Contacto',
      usaUnits: 'Unidades en EE.UU.',
      usaContact: 'Contacto EE.UU.',
      donate: 'Donar',
      guidelines: 'Directrices 2026',
    },
    actions: {
      donate: 'Donar',
      learnMore: 'Saber más',
      findCenter: 'Centros',
      firstVisit: 'Primera visita',
      contact: 'Contáctanos',
      viewAll: 'Ver todo',
      back: 'Volver',
      recordDonation: 'Registrar mi donación',
    },
    home: {
      heroTitle: 'Bienvenidos a',
      heroIntro: 'Construyendo un mundo de salud, prosperidad y paz a través del poder del Johrei.',
      heroKicker: 'World Messianic Church of America / Miroku Association USA',
      heroSubtitle: 'World Messianic Church of America / Miroku Association USA',
      heroButtons: { findCenter: 'Visitar un centro', firstVisit: 'Explorar unidades EE.UU.' },
      stats: [
        { label: 'Ubicaciones', value: 'En todo EE.UU.' },
        { label: 'Siempre gratuito', value: 'Abierto a todos' },
        { label: 'Experiencia', value: 'Fundamentada' },
        { label: 'Duración', value: '20–30 min' },
      ],
      visitTitle: 'Comienza tu camino',
      visitSteps: [
        { title: 'Una cálida bienvenida', body: 'Nuestros centros son santuarios abiertos donde serás recibido con sinceridad.' },
        { title: 'Recibe el Johrei', body: 'Experimenta 20 minutos de purificación espiritual a través de la luz divina.' },
        { title: 'El camino de la belleza', body: 'Explora nuestros jardines y el arte, concebidos para elevar el espíritu humano.' },
        { title: 'Conecta y comparte', body: 'Únete a una comunidad dedicada a servir a los demás y construir la paz.' },
      ],
      johreiKicker: 'Práctica central',
      johreiCta: 'Experimenta el Johrei',
      whatIsJohrei: {
        title: 'Johrei',
        body: 'El Johrei es una transmisión de Luz Divina que disuelve las nubes espirituales y eleva el alma. Purifica el cuerpo espiritual, lo que a su vez elimina las impurezas de la sangre (el espíritu materializado).',
      },
      vision: {
        kicker: 'Los tres pilares',
        title: 'Verdad, Virtud y Belleza',
        body: 'El fundamento del refinamiento espiritual y la armonía mundial.',
        cards: [
          { title: 'Verdad (Shin)', body: 'Comprender las leyes espirituales y cósmicas, incluyendo la Ley de Causa y Efecto. A través del estudio, desarrollamos la Chie (sabiduría) para percibir el plan divino.', tone: 'bg-warm-amber-50' },
          { title: 'Virtud (Zen)', body: 'Practicar la rectitud y el Makoto (sinceridad). Vivir el camino Daijo priorizando la felicidad de toda la humanidad y convirtiéndonos en personas apreciadas por los demás.', tone: 'bg-rose-50' },
          { title: 'Belleza (Bi)', body: 'Refinamiento espiritual a través del arte y la naturaleza. La belleza eleva la conciencia y es esencial para una vida celestial.', tone: 'bg-violet-50' },
        ],
      },
      newcomers: {
        title: '¿Nuevo en el Johrei?',
        body: 'Un camino sencillo para aprender, recibir el Johrei y sentirte en casa.',
        cards: [
          {
            title: '¿Qué es el Johrei?',
            body: 'Una práctica espiritual que canaliza la luz divina con gratitud y respeto.',
            cta: 'Conoce más sobre el Johrei',
            to: '/johrei',
          },
          {
            title: '¿Qué esperar?',
            body: 'Una visita tranquila y acogedora. Las sesiones suelen durar entre 20 y 30 minutos.',
            cta: 'Primera visita',
            to: '/first-visit',
          },
          {
            title: 'Experimenta el Johrei',
            body: 'Encuentra nuestro centro principal o grupos regionales cerca de ti.',
            cta: 'Ver ubicaciones',
            to: '/locations',
          },
        ],
      },
      faqTitle: 'Preguntas frecuentes',
      faqs: [
        {
          q: '¿Tiene algún costo recibir el Johrei?',
          a: 'No. El Johrei se ofrece gratuitamente a todos. Nos sostenemos con donaciones voluntarias de quienes deseen contribuir.',
        },
        {
          q: '¿Necesito ser miembro de alguna organización?',
          a: 'En absoluto. Nuestros centros están abiertos a personas de todas las tradiciones espirituales o ninguna.',
        },
        {
          q: '¿Qué debo vestir para visitar un centro?',
          a: 'Ropa cómoda y sencilla es lo apropiado. Queremos que te sientas cómodo y en paz.',
        },
        {
          q: '¿Con qué frecuencia puedo recibir el Johrei?',
          a: 'Puedes recibirlo con la frecuencia que desees. Muchos visitantes comienzan con sesiones semanales.',
        },
      ],
      contactTitle: 'Comunícate con nosotros',
      contactBody: 'Estamos felices de responder preguntas o ayudarte a planificar una visita.',
      centers: {
        title: 'Unidades en EE.UU.',
        body: 'Acceso claro a los centros y grupos locales en todo el país.',
        link: 'Ver unidades en EE.UU.',
      },
      resources: {
        title: 'Contacto EE.UU.',
        body: 'Comunícate con la oficina nacional y accede a apoyo bilingüe para visitas, solicitudes de oración y actividades.',
        link: 'Ir al contacto EE.UU.',
      },
      guideline: {
        title: 'Directriz 2026',
        body: 'Nuestro enfoque compartido para el año que viene. Una guía sencilla y clara para servir con gratitud.',
        button: 'Leer la directriz',
      },
      ready: {
        title: 'Estás bienvenido a visitar y experimentar el Johrei.',
        body: 'Encuentra tu unidad más cercana en EE.UU. o comunícate directamente con la asociación.',
      },
    },
    about: {
      title: 'Acerca de la Iglesia Mesiánica Universal',
      body: 'La World Messianic Church of America / Miroku Association USA está dedicada al establecimiento del Paraíso en la Tierra mediante la purificación espiritual, el servicio y la belleza.',
      kicker: 'Quiénes somos',
      mission: {
        title: 'Misión',
        body: 'Actuar como "Partera de la Civilización Mundial" para dar inicio a una nueva era de verdadera felicidad y verdad revelada.',
      },
      whoWeServe: {
        title: 'A quién servimos',
        body: 'Damos la bienvenida a todas las personas que buscan crecimiento espiritual, salud y armonía.',
      },
      offer: {
        title: 'Lo que hacemos',
        body: 'Compartimos el Johrei, estudiamos principios espirituales y cultivamos la belleza a través del arte y la naturaleza.',
      },
      focus: {
        title: 'Fundador',
        body: 'Mokichi Okada (1882–1955), un visionario que reveló la transición de la "Era de la Noche" a la "Era de la Luz".',
      },
      service: {
        title: 'Práctica central',
        body: 'El Johrei purifica el cuerpo espiritual y apoya la purificación de la sangre como forma materializada del espíritu.',
      },
      guides: {
        title: 'Principios fundamentales',
        body: 'Verdad (Shin), Virtud (Zen) y Belleza (Bi).',
      },
      leadership: {
        title: 'Participación',
        body: 'Como organización sin fines de lucro registrada, estamos comprometidos con la transparencia, la responsabilidad y el servicio.',
      },
    },
    johrei: {
      title: 'Johrei: Ciencia espiritual de la Luz Divina',
      intro: 'El Johrei es una transmisión de Luz Divina que disuelve las nubes espirituales y eleva el alma.',
      kicker: 'Práctica central',
      vision: {
        title: 'Lo espiritual precede a lo físico',
        body: 'El Johrei purifica primero el cuerpo espiritual. A medida que las nubes espirituales se disuelven, las impurezas son eliminadas de la sangre, entendida como la forma materializada del espíritu. Este proceso restaura la salud natural y eleva la conciencia humana.',
      },
      whatIs: {
        title: 'Definición',
        body: 'Una transmisión de Luz Divina para disolver las nubes espirituales y elevar el alma.',
        experience: {
          title: 'Purificación espiritual',
          body: 'El Johrei actúa sobre el origen espiritual del sufrimiento, aportando claridad y equilibrio interior a través de la Luz Divina.',
        },
        effect: {
          title: 'Relación entre espíritu y sangre',
          body: 'A medida que el espíritu se purifica, las impurezas de la sangre se resuelven naturalmente. Este es el mecanismo espiritual-físico en el centro de la enseñanza del Johrei.',
        },
        goal: {
          title: 'Elevación de la conciencia',
          body: 'El Johrei apoya el despertar del alma y ayuda a cada persona a alinearse con la salud, la prosperidad y la paz.',
        },
      },
      path: {
        title: 'Una práctica para todos',
        body: 'El Johrei se ofrece a todos, sin costo alguno. A través de la purificación continua y el servicio, las personas participan en la construcción del Paraíso en la Tierra.',
      },
      extra: {
        title: 'Más sobre el Johrei',
        origin: {
          title: 'Origen',
          body: 'El principio del Johrei es la irradiación de una misteriosa luz invisible que emana del cuerpo humano. Esta luz es una forma de energía espiritual cuyo componente principal es el elemento fuego. A medida que se acerca la Era de la Luz, el elemento fuego aumenta en el Mundo Espiritual, cuya fuente es el Sol.',
        },
        concept: {
          title: 'Concepto',
          body: 'El Johrei es un método para canalizar energía espiritual (Luz Divina) con el fin de purificar el espíritu, capaz de transformar la desarmonía espiritual y material en armonía.',
        },
        mission: {
          title: 'Misión',
          quote: 'Aunque el Johrei de nuestra religión pueda parecer orientado a curar enfermedades, eso no es todo. Tiene un significado mucho más profundo... es un método para crear la felicidad.',
          author: 'Meishu-Sama',
        },
        practice: {
          title: 'Cómo funciona el Johrei',
          body: 'Un miembro calificado administra el Johrei como canal de la Luz Divina mediante la imposición de manos. La Luz del Johrei actúa sobre el espíritu y se refleja en el cuerpo, aportando bienestar espiritual, mental y físico.',
        },
        benefits: {
          title: 'Beneficios',
          items: [
            'Despierta la conciencia de la existencia del Creador.',
            'Eleva la inteligencia y la personalidad.',
            'Fortalece a las personas para enfrentar los desafíos de la vida.',
            'Amplía el aura, ofreciendo protección frente a las adversidades.',
            'Promueve la salud física y espiritual.',
            'Ayuda a percibir con mayor claridad la abundancia y las oportunidades.',
            'Fomenta la serenidad y la paz interior.',
            'Fortalece la gratitud y el altruismo.',
          ],
        },
      },
    },
    meishuSama: {
      title: 'Meishu-sama: Fundador y visionario',
      intro: 'Mokichi Okada (1882-1955), conocido como Meishu-sama, recibió revelaciones divinas acerca de la transición de la humanidad de la "Era de la Noche" a la "Era de la Luz".',
      points: [
        'Enseñó que la realidad espiritual precede a la realidad física y que la purificación es el camino hacia la verdadera salud.',
        'Describió su misión como la de una "Partera de la Civilización Mundial", guiando a la humanidad hacia una nueva era.',
        'Sus enseñanzas unen la Verdad, la Virtud y la Belleza como principios prácticos para la vida cotidiana y la transformación social.',
        'A través del Johrei, el arte y la naturaleza, vislumbró un mundo de salud, prosperidad y paz.',
      ],
      learnMore: 'Conoce más sobre su vida y legado',
      legacy: {
        title: 'Meishu-sama: Vida y legado',
        intro: 'Una mirada más profunda sobre cómo la vida, la misión y las enseñanzas de Mokichi Okada continúan guiando la práctica espiritual hoy.',
        milestones: [
          {
            title: '1882: Primeros años y búsqueda de la verdad',
            body: 'Nacido en 1882 como Mokichi Okada, dedicó toda su vida a la búsqueda de la verdad y de las leyes espirituales que rigen la felicidad humana.',
          },
          {
            title: '1935: Misión fundadora',
            body: 'En 1935, inició formalmente un movimiento dedicado a construir el Paraíso en la Tierra mediante la purificación espiritual, la gratitud y el servicio.',
          },
          {
            title: 'Enseñar a través de la práctica',
            body: 'Enseñó que el Johrei, la apreciación de la belleza y el alineamiento con la voluntad divina transforman tanto la vida individual como la sociedad.',
          },
          {
            title: '1955 y más allá',
            body: 'Tras su partida en 1955, sus enseñanzas continuaron difundiéndose internacionalmente, inspirando comunidades comprometidas con la salud, la prosperidad y la paz.',
          },
        ],
        legacyTitle: 'Legado perenne',
        legacyPoints: [
          'El Johrei como camino práctico de purificación espiritual.',
          'La Verdad, la Virtud y la Belleza como principios vivos.',
          'La gratitud y el servicio altruista como disciplina cotidiana.',
          'Una visión global del Paraíso en la Tierra.',
        ],
      },
    },
    paradise: {
      title: 'Paraíso en la Tierra',
      intro: 'Un estado tangible de paz y salud que se realiza a través de la transformación individual.',
      points: ['Actos de gratitud', 'Servicio comunitario', 'Armonía interior'],
    },
    firstVisit: {
      title: 'Tu primera visita',
      intro: 'Te damos la bienvenida a nuestros santuarios. Aquí tienes una guía práctica para tu primera experiencia.',
      kicker: 'Qué esperar',
      steps: [
        {
          title: 'La bienvenida',
          body: 'Al llegar, un miembro te recibirá y te brindará una breve orientación.',
        },
        {
          title: 'La sesión',
          body: 'Te sentarás cómodamente mientras recibes la Luz Divina durante 20 minutos.',
        },
        {
          title: 'La reflexión',
          body: 'Tómate un momento para relajarte y compartir tus primeras impresiones si lo deseas.',
        },
      ],
      tips: {
        title: 'Consejos prácticos',
        items: [
          'Se recomienda vestimenta cómoda y sencilla.',
          'Las sesiones son completamente gratuitas.',
          'No se requiere cita previa en la mayoría de los centros.',
          'Abierto a todas las tradiciones religiosas y espirituales.',
        ],
      },
      etiquette: {
        title: 'Etiqueta en el santuario',
        items: [
          'Por favor, silencia tus dispositivos electrónicos.',
          'Mantén un volumen de voz suave y respetuoso.',
          'Siéntete libre de hacer preguntas en cualquier momento.',
          'La fotografía está permitida únicamente en las áreas designadas.',
        ],
      },
      online: {
        title: 'Solicita una sesión',
        body: 'Si no puedes visitar un centro, contáctanos para encontrar un grupo local cercano a ti.',
      },
    },
    locations: {
      title: 'Ubicaciones',
      intro: 'Encuentra un centro o grupo cerca de ti.',
      filters: {
        province: 'Provincia',
        city: 'Ciudad',
        type: 'Tipo',
        clear: 'Borrar filtros',
        search: 'Buscar',
      },
      types: { center: 'Centro', group: 'Grupo', comingSoon: 'Próximamente' },
      detail: {
        contact: 'Contacto',
        schedule: 'Horario',
        directions: 'Ver en el mapa',
        contactCta: 'Contáctanos',
      },
      empty: 'Ninguna ubicación coincide con tus filtros. Intenta borrarlos o vuelve pronto.',
    },
    events: {
      title: 'Eventos',
      empty: 'No hay próximos eventos por el momento. Vuelve pronto.',
    },
    resourcesPage: {
      title: 'Recursos',
      intro: 'Guías breves para aprender, prepararte para una visita y profundizar en tu práctica.',
      categories: 'Categorías',
    },
    testimonials: {
      title: 'Testimonios',
      intro: 'Experiencias compartidas por miembros de la comunidad. Los resúmenes están parafraseados con enlaces a las fuentes.',
    },
    contact: {
      title: 'Contacto',
      intro: 'Estamos felices de responder tus preguntas, ayudarte a planificar una visita o conectarte con un grupo local.',
      options: {
        general: 'Consultas generales: info@miroku.us',
        visit: 'Horarios o preguntas sobre primera visita: +1 (305) 308-8830',
        learn: 'Conoce más sobre el Johrei: visita Recursos o escríbenos.',
      },
    },
    usa: {
      units: {
        title: 'Unidades en EE.UU.',
        intro: 'Encuentra centros y grupos de Johrei en todo EE.UU. Comunícate con la oficina nacional para conocer horarios y lugares de reunión.',
        cardCta: 'Contactar a la asociación',
        contactAssociation: 'Contactar a la asociación',
        labels: {
          leaders: 'Responsables',
          contact: 'Contacto',
          phone: 'Teléfono',
          email: 'Correo electrónico',
        },
        units: [
          {
            name: 'Centro de Toronto',
            address: '3416 Dundas Street West, Suite 209, Toronto, ON M6S 2S1',
            phone: '+1 (305) 308-8830',
            leaders: 'Rev. Guilherme de Souza; Rev. Ana De Sousa',
            email: 'info@miroku.us',
          },
          {
            name: 'Grupo de Ottawa',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
            note: 'No hay dirección pública — comunícate con nosotros para conocer los lugares de reunión y los horarios.',
          },
          {
            name: 'Grupo de Montreal',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
          {
            name: 'Grupo de Vancouver',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
        ],
      },
      contact: {
        title: 'Contactar a la World Messianic Church of America / Miroku Association USA',
        intro: 'Comunícate con la oficina nacional o los centros locales usando la información a continuación.',
        labels: {
          email: 'Correo electrónico',
          phone: 'Teléfono',
          prayer: 'Oración en línea / formulario de solicitud',
          donate: 'Donar',
        },
        prayerText: 'Enviar una solicitud de oración',
        donateText: 'Donación de gratitud (PayPal)',
        activitiesCta: 'Ver actividades y servicios',
        note: 'Confirma los horarios, direcciones locales y calendarios de eventos con el centro local antes de publicar.',
      },
    },
    donate: {
      title: 'Apoya nuestra misión',
      intro: 'Tu contribución apoya nuestras actividades y la difusión del Johrei en todo EE.UU. Agradecemos tu participación.',
      placeholder: 'Actualmente estamos configurando donaciones seguras en línea. Por favor, comunícate con nuestro centro de Toronto para consultas.',
      stripeTitle: 'Donar con tarjeta / billetera digital (Stripe)',
      interacTitle: 'Donar por transferencia Interac',
      interacStep1: 'Envía una transferencia Interac a: info@miroku.us',
      interacStep2: 'Completa el formulario de "Confirmación de donación Interac" para registrar tu donación',
      formTitle: 'Confirmación de donación',
      formIntro: 'Gracias por tu apoyo. Por favor, registra los detalles de tu transferencia para ayudarnos con nuestros informes mensuales.',
      fields: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        amount: 'Monto enviado',
        date: 'Fecha de envío',
        fund: 'Tipo de donación / Fondo',
        group: 'Grupo / Centro',
        note: 'Nota / Mensaje',
      },
      funds: [
        'Gratitud',
        'Consagración (Sorei Saishi)',
        'Libro',
        'Punto focal',
        'Caja Ohikari, cadenas, artículos litúrgicos',
        'Recaudación de fondos',
        'Curso de membresía',
        'Peregrinación',
        'Objetos sagrados',
        'Seminario',
        'Renovación del centro',
        'Donaciones Sangetsu',
        'Clases de Ikebana',
        'Taller Sangetsu',
      ],
      groups: {
        toronto: 'Toronto',
        montreal: 'Montreal',
        vancouver: 'Vancouver',
        calgary: 'Calgary',
        ottawa: 'Ottawa',
        other: 'Otro',
      },
    },
    guidelines: {
      title: 'Directrices 2026',
      motto: '"Ayudar a otros a dedicarse a la construcción del Paraíso en la Tierra, a través de nuestras prácticas de fe, es el camino de nuestra salvación."',
      titleFr: 'Directrices 2026',
      mottoFr: '"Ayudar a otros a dedicarse a la construcción del Paraíso en la Tierra, a través de nuestras prácticas de fe, es el camino de nuestra salvación."',
      placeholderEn: 'Full guideline details will be added here.',
      placeholderFr: 'Los detalles completos de las directrices se añadirán aquí.',
    },
    notFound: 'Contenido no encontrado.',
  },
  pt: {
    brand: 'World Messianic Church of America / Miroku Association USA',
    tagline: 'Descubra o Johrei e um caminho de gratidão',
    nav: {
      home: 'Início',
      about: 'Sobre',
      aboutJohrei: 'Johrei',
      meishuSama: 'Meishu-Sama',
      paradise: 'Paraíso na Terra',
      firstVisit: 'Primeira visita',
      locations: 'Centros',
      events: 'Eventos',
      resources: 'Recursos',
      testimonials: 'Testemunhos',
      contact: 'Contato',
      usaUnits: 'Unidades nos EUA',
      usaContact: 'Contato EUA',
      donate: 'Doar',
      guidelines: 'Diretrizes 2026',
    },
    actions: {
      donate: 'Doar',
      learnMore: 'Saiba mais',
      findCenter: 'Centros',
      firstVisit: 'Primeira visita',
      contact: 'Fale conosco',
      viewAll: 'Ver todos',
      back: 'Voltar',
      recordDonation: 'Registrar minha doação',
    },
    home: {
      heroTitle: 'Bem-vindos à',
      heroIntro: 'Construindo um mundo de saúde, prosperidade e paz através do poder do Johrei.',
      heroKicker: 'World Messianic Church of America / Miroku Association USA',
      heroSubtitle: 'World Messianic Church of America / Miroku Association USA',
      heroButtons: { findCenter: 'Visitar um centro', firstVisit: 'Explorar unidades EUA' },
      stats: [
        { label: 'Localizações', value: 'Em todo EUA' },
        { label: 'Sempre gratuito', value: 'Aberto a todos' },
        { label: 'Experiência', value: 'Fundamentada' },
        { label: 'Duração', value: '20–30 min' },
      ],
      visitTitle: 'Comece sua jornada',
      visitSteps: [
        { title: 'Uma calorosa boas-vindas', body: 'Nossos centros são santuários abertos onde você será recebido com sinceridade.' },
        { title: 'Receba o Johrei', body: 'Experiencie 20 minutos de purificação espiritual através da luz divina.' },
        { title: 'O caminho da beleza', body: 'Explore nossos jardins e obras de arte, concebidos para elevar o espírito humano.' },
        { title: 'Conecte e compartilhe', body: 'Faça parte de uma comunidade dedicada a servir ao próximo e construir a paz.' },
      ],
      johreiKicker: 'Prática central',
      johreiCta: 'Experiencie o Johrei',
      whatIsJohrei: {
        title: 'Johrei',
        body: 'O Johrei é uma transmissão de Luz Divina que dissolve as nuvens espirituais e eleva a alma. Ele purifica o corpo espiritual, o que por sua vez remove as impurezas do sangue (o espírito materializado).',
      },
      vision: {
        kicker: 'Os três pilares',
        title: 'Verdade, Virtude e Beleza',
        body: 'O fundamento do refinamento espiritual e da harmonia mundial.',
        cards: [
          { title: 'Verdade (Shin)', body: 'Compreender as leis espirituais e cósmicas, incluindo a Lei de Causa e Efeito. Por meio do estudo, desenvolvemos a Chie (sabedoria) para perceber o plano divino.', tone: 'bg-warm-amber-50' },
          { title: 'Virtude (Zen)', body: 'Praticar a retidão e o Makoto (sinceridade). Viver o caminho Daijo, priorizando a felicidade de toda a humanidade e nos tornando pessoas apreciadas pelos outros.', tone: 'bg-rose-50' },
          { title: 'Beleza (Bi)', body: 'Refinamento espiritual por meio da arte e da natureza. A beleza eleva a consciência e é essencial para uma vida celestial.', tone: 'bg-violet-50' },
        ],
      },
      newcomers: {
        title: 'Novo no Johrei?',
        body: 'Um caminho simples para aprender, receber o Johrei e se sentir em casa.',
        cards: [
          {
            title: 'O que é o Johrei?',
            body: 'Uma prática espiritual de canalização da luz divina com gratidão e respeito.',
            cta: 'Conheça mais sobre o Johrei',
            to: '/johrei',
          },
          {
            title: 'O que esperar',
            body: 'Uma visita tranquila e acolhedora. As sessões costumam durar entre 20 e 30 minutos.',
            cta: 'Primeira visita',
            to: '/first-visit',
          },
          {
            title: 'Experiencie o Johrei',
            body: 'Encontre nosso centro principal ou grupos regionais perto de você.',
            cta: 'Ver localizações',
            to: '/locations',
          },
        ],
      },
      faqTitle: 'Perguntas frequentes',
      faqs: [
        {
          q: 'Receber o Johrei tem algum custo?',
          a: 'Não. O Johrei é oferecido gratuitamente a todos. Nos sustentamos com doações voluntárias de quem deseja contribuir.',
        },
        {
          q: 'Preciso ser membro de alguma organização?',
          a: 'De forma alguma. Nossos centros são abertos a pessoas de todas as tradições espirituais ou nenhuma.',
        },
        {
          q: 'O que devo vestir para visitar um centro?',
          a: 'Roupas confortáveis e discretas são o mais indicado. Queremos que você se sinta à vontade e em paz.',
        },
        {
          q: 'Com que frequência posso receber o Johrei?',
          a: 'Você pode recebê-lo com a frequência que desejar. Muitos visitantes começam com sessões semanais.',
        },
      ],
      contactTitle: 'Entre em contato',
      contactBody: 'Ficamos felizes em responder perguntas ou ajudá-lo a planejar uma visita.',
      centers: {
        title: 'Unidades nos EUA',
        body: 'Acesso claro aos centros e grupos locais em todo o país.',
        link: 'Ver unidades nos EUA',
      },
      resources: {
        title: 'Contato EUA',
        body: 'Fale com o escritório nacional e acesse suporte bilíngue para visitas, pedidos de oração e atividades.',
        link: 'Ir ao contato EUA',
      },
      guideline: {
        title: 'Diretriz 2026',
        body: 'Nosso foco compartilhado para o próximo ano. Uma orientação simples e clara para servir com gratidão.',
        button: 'Ler a diretriz',
      },
      ready: {
        title: 'Você é bem-vindo para visitar e experenciar o Johrei.',
        body: 'Encontre a unidade mais próxima nos EUA ou entre em contato diretamente com a associação.',
      },
    },
    about: {
      title: 'Sobre a Igreja Messiânica Mundial',
      body: 'A World Messianic Church of America / Miroku Association USA é dedicada ao estabelecimento do Paraíso na Terra por meio da purificação espiritual, do serviço e da beleza.',
      kicker: 'Sobre nós',
      mission: {
        title: 'Missão',
        body: 'Atuar como "Parteira da Civilização Mundial" para inaugurar uma nova era de verdadeira felicidade e verdade revelada.',
      },
      whoWeServe: {
        title: 'A quem servimos',
        body: 'Damos boas-vindas a todas as pessoas que buscam crescimento espiritual, saúde e harmonia.',
      },
      offer: {
        title: 'O que fazemos',
        body: 'Compartilhamos o Johrei, estudamos princípios espirituais e cultivamos a beleza por meio da arte e da natureza.',
      },
      focus: {
        title: 'Fundador',
        body: 'Mokichi Okada (1882–1955), um visionário que revelou a transição da "Era da Noite" para a "Era da Luz".',
      },
      service: {
        title: 'Prática central',
        body: 'O Johrei purifica o corpo espiritual e apoia a purificação do sangue como forma materializada do espírito.',
      },
      guides: {
        title: 'Princípios fundamentais',
        body: 'Verdade (Shin), Virtude (Zen) e Beleza (Bi).',
      },
      leadership: {
        title: 'Participação',
        body: 'Como organização sem fins lucrativos registrada, estamos comprometidos com a transparência, a responsabilidade e o serviço.',
      },
    },
    johrei: {
      title: 'Johrei: Ciência espiritual da Luz Divina',
      intro: 'O Johrei é uma transmissão de Luz Divina que dissolve as nuvens espirituais e eleva a alma.',
      kicker: 'Prática central',
      vision: {
        title: 'O espiritual precede o físico',
        body: 'O Johrei purifica primeiro o corpo espiritual. À medida que as nuvens espirituais se dissolvem, as impurezas são removidas do sangue, compreendido como a forma materializada do espírito. Esse processo restaura a saúde natural e eleva a consciência humana.',
      },
      whatIs: {
        title: 'Definição',
        body: 'Uma transmissão de Luz Divina para dissolver as nuvens espirituais e elevar a alma.',
        experience: {
          title: 'Purificação espiritual',
          body: 'O Johrei atua sobre a origem espiritual do sofrimento, trazendo clareza e equilíbrio interior por meio da Luz Divina.',
        },
        effect: {
          title: 'Relação entre espírito e sangue',
          body: 'À medida que o espírito se purifica, as impurezas do sangue se resolvem naturalmente. Esse é o mecanismo espiritual-físico central no ensinamento do Johrei.',
        },
        goal: {
          title: 'Elevação da consciência',
          body: 'O Johrei apoia o despertar da alma e ajuda cada pessoa a se alinhar com saúde, prosperidade e paz.',
        },
      },
      path: {
        title: 'Uma prática para todos',
        body: 'O Johrei é oferecido a todos, gratuitamente. Por meio da purificação contínua e do serviço, as pessoas participam da construção do Paraíso na Terra.',
      },
      extra: {
        title: 'Mais sobre o Johrei',
        origin: {
          title: 'Origem',
          body: 'O princípio do Johrei é a irradiação de uma misteriosa luz invisível que emana do corpo humano. Essa luz é uma forma de energia espiritual cujo componente principal é o elemento fogo. À medida que a Era da Luz se aproxima, o elemento fogo aumenta no Mundo Espiritual, cuja fonte é o Sol.',
        },
        concept: {
          title: 'Conceito',
          body: 'O Johrei é um método de canalização da energia espiritual (Luz Divina) para a purificação do espírito, capaz de transformar a desarmonia espiritual e material em harmonia.',
        },
        mission: {
          title: 'Missão',
          quote: 'Embora o Johrei em nossa religião possa parecer ter como objetivo a cura de doenças, isso não é tudo. Ele tem um significado muito maior... é um método para criar a felicidade.',
          author: 'Meishu-Sama',
        },
        practice: {
          title: 'Como o Johrei funciona',
          body: 'Um membro qualificado ministra o Johrei como canal da Luz Divina por meio da imposição de mãos. A Luz do Johrei age sobre o espírito e se reflete no corpo, trazendo bem-estar espiritual, mental e físico.',
        },
        benefits: {
          title: 'Benefícios',
          items: [
            'Desperta a consciência da existência do Criador.',
            'Eleva a inteligência e a personalidade.',
            'Fortalece as pessoas para enfrentar os desafios da vida.',
            'Expande a aura, oferecendo proteção contra adversidades.',
            'Promove a saúde física e espiritual.',
            'Ajuda a perceber a abundância e as oportunidades com mais clareza.',
            'Estimula a serenidade e a paz interior.',
            'Fortalece a gratidão e o altruísmo.',
          ],
        },
      },
    },
    meishuSama: {
      title: 'Meishu-sama: Fundador e visionário',
      intro: 'Mokichi Okada (1882-1955), conhecido como Meishu-sama, recebeu revelações divinas sobre a transição da humanidade da "Era da Noite" para a "Era da Luz".',
      points: [
        'Ensinou que a realidade espiritual precede a realidade física e que a purificação é o caminho para a verdadeira saúde.',
        'Descreveu sua missão como a de uma "Parteira da Civilização Mundial", guiando a humanidade para uma nova era.',
        'Seus ensinamentos unem Verdade, Virtude e Beleza como princípios práticos para a vida cotidiana e a transformação social.',
        'Por meio do Johrei, da arte e da natureza, ele vislumbrou um mundo de saúde, prosperidade e paz.',
      ],
      learnMore: 'Saiba mais sobre sua vida e legado',
      legacy: {
        title: 'Meishu-sama: Vida e legado',
        intro: 'Um olhar mais aprofundado sobre como a vida, a missão e os ensinamentos de Mokichi Okada continuam a orientar a prática espiritual hoje.',
        milestones: [
          {
            title: '1882: Primeiros anos e busca pela verdade',
            body: 'Nascido em 1882 como Mokichi Okada, dedicou toda a sua vida à busca da verdade e das leis espirituais que regem a felicidade humana.',
          },
          {
            title: '1935: Missão fundadora',
            body: 'Em 1935, deu início formalmente a um movimento dedicado à construção do Paraíso na Terra por meio da purificação espiritual, da gratidão e do serviço.',
          },
          {
            title: 'Ensinando pela prática',
            body: 'Ensinou que o Johrei, a apreciação da beleza e o alinhamento com a vontade divina transformam tanto a vida individual quanto a sociedade.',
          },
          {
            title: '1955 e além',
            body: 'Após sua partida em 1955, seus ensinamentos continuaram a se difundir internacionalmente, inspirando comunidades comprometidas com a saúde, a prosperidade e a paz.',
          },
        ],
        legacyTitle: 'Legado perene',
        legacyPoints: [
          'O Johrei como caminho prático de purificação espiritual.',
          'Verdade, Virtude e Beleza como princípios vividos.',
          'A gratidão e o serviço altruísta como disciplina cotidiana.',
          'Uma visão global do Paraíso na Terra.',
        ],
      },
    },
    paradise: {
      title: 'Paraíso na Terra',
      intro: 'Um estado tangível de paz e saúde realizado por meio da transformação individual.',
      points: ['Atos de gratidão', 'Serviço comunitário', 'Harmonia interior'],
    },
    firstVisit: {
      title: 'Sua primeira visita',
      intro: 'Damos boas-vindas a você em nossos santuários. Aqui está um guia prático para a sua primeira experiência.',
      kicker: 'O que esperar',
      steps: [
        {
          title: 'A boas-vindas',
          body: 'Ao chegar, um membro irá recebê-lo e fornecer uma breve orientação.',
        },
        {
          title: 'A sessão',
          body: 'Você ficará sentado confortavelmente enquanto recebe a Luz Divina por 20 minutos.',
        },
        {
          title: 'A reflexão',
          body: 'Reserve um momento para relaxar e compartilhar suas primeiras impressões, se desejar.',
        },
      ],
      tips: {
        title: 'Dicas práticas',
        items: [
          'Recomenda-se roupas confortáveis e discretas.',
          'As sessões são totalmente gratuitas.',
          'Não é necessário agendamento na maioria dos centros.',
          'Aberto a todas as tradições religiosas e espirituais.',
        ],
      },
      etiquette: {
        title: 'Etiqueta no santuário',
        items: [
          'Por favor, silencie seus dispositivos eletrônicos.',
          'Mantenha um volume suave e respeitoso.',
          'Sinta-se à vontade para fazer perguntas a qualquer momento.',
          'A fotografia é permitida apenas nas áreas designadas.',
        ],
      },
      online: {
        title: 'Solicite uma sessão',
        body: 'Se não puder visitar um centro, entre em contato para encontrar um grupo local próximo a você.',
      },
    },
    locations: {
      title: 'Localizações',
      intro: 'Encontre um centro ou grupo perto de você.',
      filters: {
        province: 'Província',
        city: 'Cidade',
        type: 'Tipo',
        clear: 'Limpar filtros',
        search: 'Buscar',
      },
      types: { center: 'Centro', group: 'Grupo', comingSoon: 'Em breve' },
      detail: {
        contact: 'Contato',
        schedule: 'Horário',
        directions: 'Ver no mapa',
        contactCta: 'Fale conosco',
      },
      empty: 'Nenhuma localização corresponde aos seus filtros. Tente limpá-los ou volte em breve.',
    },
    events: {
      title: 'Eventos',
      empty: 'Nenhum evento próximo no momento. Volte em breve.',
    },
    resourcesPage: {
      title: 'Recursos',
      intro: 'Guias breves para aprender, se preparar para uma visita e aprofundar sua prática.',
      categories: 'Categorias',
    },
    testimonials: {
      title: 'Testemunhos',
      intro: 'Experiências compartilhadas por membros da comunidade. Os resumos são parafraseados com links para as fontes.',
    },
    contact: {
      title: 'Contato',
      intro: 'Estamos felizes em responder suas perguntas, ajudá-lo a planejar uma visita ou conectá-lo a um grupo local.',
      options: {
        general: 'Dúvidas gerais: info@miroku.us',
        visit: 'Agendamento ou dúvidas sobre a primeira visita: +1 (305) 308-8830',
        learn: 'Saiba mais sobre o Johrei: veja Recursos ou escreva para nós.',
      },
    },
    usa: {
      units: {
        title: 'Unidades nos EUA',
        intro: 'Encontre centros e grupos de Johrei em todo os EUA. Entre em contato com o escritório nacional para conhecer horários e locais de reunião.',
        cardCta: 'Contatar a associação',
        contactAssociation: 'Contatar a associação',
        labels: {
          leaders: 'Responsáveis',
          contact: 'Contato',
          phone: 'Telefone',
          email: 'E-mail',
        },
        units: [
          {
            name: 'Centro de Toronto',
            address: '3416 Dundas Street West, Suite 209, Toronto, ON M6S 2S1',
            phone: '+1 (305) 308-8830',
            leaders: 'Rev. Guilherme de Souza; Rev. Ana De Sousa',
            email: 'info@miroku.us',
          },
          {
            name: 'Grupo de Ottawa',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
            note: 'Sem endereço público — entre em contato para saber os locais de reunião e os horários.',
          },
          {
            name: 'Grupo de Montreal',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
          {
            name: 'Grupo de Vancouver',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
        ],
      },
      contact: {
        title: 'Contatar a World Messianic Church of America / Miroku Association USA',
        intro: 'Entre em contato com o escritório nacional ou os centros locais usando as informações abaixo.',
        labels: {
          email: 'E-mail',
          phone: 'Telefone',
          prayer: 'Oração online / formulário de solicitação',
          donate: 'Doar',
        },
        prayerText: 'Enviar um pedido de oração',
        donateText: 'Doação de gratidão (PayPal)',
        activitiesCta: 'Ver atividades e serviços',
        note: 'Confirme horários, endereços locais e calendários de eventos com o centro local antes de publicar.',
      },
    },
    donate: {
      title: 'Apoie nossa missão',
      intro: 'Sua contribuição apoia nossas atividades e a difusão do Johrei em todo os EUA. Agradecemos sua participação.',
      placeholder: 'Estamos configurando doações online seguras. Por favor, entre em contato com nosso centro de Toronto para mais informações.',
      stripeTitle: 'Doar com cartão / carteira digital (Stripe)',
      interacTitle: 'Doar por transferência Interac',
      interacStep1: 'Envie uma transferência Interac para: info@miroku.us',
      interacStep2: 'Preencha o formulário de "Confirmação de doação Interac" para registrar sua doação',
      formTitle: 'Confirmação de doação',
      formIntro: 'Obrigado pelo seu apoio. Por favor, registre os detalhes da sua transferência para nos ajudar em nossos relatórios mensais.',
      fields: {
        name: 'Nome completo',
        email: 'E-mail',
        amount: 'Valor enviado',
        date: 'Data de envio',
        fund: 'Tipo de doação / Fundo',
        group: 'Grupo / Centro',
        note: 'Observação / Mensagem',
      },
      funds: [
        'Gratidão',
        'Consagração (Sorei Saishi)',
        'Livro',
        'Ponto focal',
        'Caixa Ohikari, correntes, itens litúrgicos',
        'Arrecadação de fundos',
        'Curso de associados',
        'Peregrinação',
        'Objetos sagrados',
        'Seminário',
        'Renovação do centro',
        'Doações Sangetsu',
        'Aulas de Ikebana',
        'Workshop Sangetsu',
      ],
      groups: {
        toronto: 'Toronto',
        montreal: 'Montreal',
        vancouver: 'Vancouver',
        calgary: 'Calgary',
        ottawa: 'Ottawa',
        other: 'Outro',
      },
    },
    guidelines: {
      title: 'Diretrizes 2026',
      motto: '"Ajudar outras pessoas a se dedicarem à construção do Paraíso Terrestre, por meio das práticas de fé, é o caminho para a nossa salvação."',
      titleFr: 'Diretrizes 2026',
      mottoFr: '"Ajudar outras pessoas a se dedicarem à construção do Paraíso Terrestre, por meio das práticas de fé, é o caminho para a nossa salvação."',
      placeholderEn: 'Full guideline details will be added here.',
      placeholderFr: 'Os detalhes completos das diretrizes serão adicionados aqui.',
    },
    notFound: 'Conteúdo não encontrado.',
  },
}
