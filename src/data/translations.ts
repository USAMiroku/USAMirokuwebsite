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
    tagline: 'Découvrez le Johrei et un chemin de gratitude',
    nav: {
      home: 'Accueil',
      about: 'À propos',
      aboutJohrei: 'Johrei',
      meishuSama: 'Meishu-Sama',
      paradise: 'Paradis terrestre',
      firstVisit: 'Première visite',
      locations: 'Centres',
      events: 'Événements',
      resources: 'Ressources',
      testimonials: 'Témoignages',
      contact: 'Contact',
      usaUnits: 'Unités USA',
      usaContact: 'Contact USA',
      donate: 'Don',
      guidelines: 'Directives 2026',
    },
    actions: {
      donate: 'Faire un don',
      learnMore: 'En savoir plus',
      findCenter: 'Centres',
      firstVisit: 'Première visite',
      contact: 'Nous joindre',
      viewAll: 'Voir tout',
      back: 'Retour',
      recordDonation: 'Enregistrer mon don'
    },
    home: {
      heroTitle: 'Bienvenue à',
      heroIntro: 'Créer un monde de santé, de prospérité et de paix grâce au pouvoir du Johrei.',
      heroKicker: 'World Messianic Church of America / Miroku Association USA',
      heroSubtitle: 'World Messianic Church of America / Miroku Association USA',
      heroButtons: { findCenter: 'Visiter un centre', firstVisit: 'Explorer les unités du USA' },
      stats: [
        { label: 'Lieux', value: '11' },
        { label: 'Toujours gratuit', value: 'Gratuit' },
        { label: 'Nouveaux bienvenus', value: 'Ouvert' },
        { label: 'Minutes', value: '20–30' },
      ],
      visitTitle: 'Commencez votre voyage',
      visitSteps: [
        { title: 'Accueil chaleureux', body: 'Un membre vous accueille pour vous mettre à l’aise.' },
        { title: 'Brève introduction', body: 'Nous expliquons le Johrei et répondons à vos questions.' },
        { title: 'Recevoir le Johrei', body: 'Asseyez-vous et recevez la lumière divine (10–20 minutes).' },
        { title: 'Partager & apprendre', body: 'Partagez votre expérience et posez vos questions.' },
      ],
      johreiKicker: 'Pratique centrale',
      johreiCta: 'Vivre le Johrei',
      whatIsJohrei: {
        title: 'Johrei',
        body: 'Le Johrei est une transmission de Lumière Divine qui dissout les nuages spirituels et élève l’âme. Il purifie le corps spirituel, ce qui élimine les impuretés du sang (la matérialisation de l’esprit).',
      },
      vision: {
        kicker: 'Les Trois Piliers',
        title: 'Vérité, Vertu et Beauté',
        body: 'Le fondement de l’affinement spirituel et de l’harmonie mondiale.',
        cards: [
          { title: 'Vérité (Shin)', body: 'Comprendre les lois spirituelles et cosmiques, y compris la loi de cause à effet. Par l’étude, nous développons la Chie (sagesse) pour percevoir le plan divin.', tone: 'bg-warm-amber-50' },
          { title: 'Vertu (Zen)', body: 'Pratiquer la droiture et le Makoto (sincérité). Vivre selon la voie Daijo, en priorisant le bonheur de toute l’humanité et en devenant une personne appréciée par les autres.', tone: 'bg-rose-50' },
          { title: 'Beauté (Bi)', body: 'Affinement spirituel par l’art et la nature. La beauté élève la conscience et est essentielle à une vie céleste.', tone: 'bg-violet-50' },
        ],
      },
      newcomers: {
        title: 'Nouveau au Johrei ?',
        body: 'Un chemin simple pour apprendre, recevoir le Johrei et se sentir accueilli.',
        cards: [
          {
            title: 'Qu’est-ce que le Johrei ?',
            body: 'Une pratique spirituelle qui canalise la lumière divine avec gratitude et respect.',
            cta: 'Plongée profonde dans le Johrei',
            to: '/johrei',
          },
          {
            title: 'À quoi s’attendre',
            body: 'Une visite calme et accueillante. Une séance dure souvent 20 à 30 minutes.',
            cta: 'Première visite',
            to: '/first-visit',
          },
          {
            title: 'Expérimenter le Johrei',
            body: 'Trouvez notre centre principal ou nos groupes régionaux près de chez vous.',
            cta: 'Voir les centres',
            to: '/locations',
          },
        ],
      },
      faqTitle: 'Questions fréquentes',
      faqs: [
        {
          q: 'Le Johrei est-il gratuit ?',
          a: 'Oui. Le Johrei est offert gratuitement. Les dons sont volontaires.',
        },
        {
          q: 'Dois-je être membre ?',
          a: 'Non. Tout le monde est bienvenu pour recevoir le Johrei et poser des questions.',
        },
        {
          q: 'Combien de temps dure la visite ?',
          a: 'Une séance dure généralement 20 à 30 minutes, selon vos besoins.',
        },
        {
          q: 'Que dois-je apporter ?',
          a: 'Simplement vous-même. Une tenue confortable et sobre est recommandée.',
        },
      ],
      contactTitle: 'Nous joindre',
      contactBody: 'Nous répondons avec plaisir aux questions et aidons à planifier une visite.',
      centers: {
        title: 'Unités du USA',
        body: 'Toronto, Montréal, Ottawa et Vancouver : des accès clairs aux centres et groupes locaux.',
        link: 'Voir les unités au USA',
      },
      resources: {
        title: 'Contact USA',
        body: 'Joignez le bureau national et obtenez un accompagnement bilingue pour les visites, demandes de prière et activités.',
        link: 'Aller au contact USA',
      },
      guideline: {
        title: 'Directive 2026',
        body: 'Notre orientation partagée pour l’année à venir. Simple et claire, pour servir avec gratitude.',
        button: 'Lire la directive',
      },
      ready: {
        title: 'Vous êtes les bienvenus pour visiter et vivre le Johrei.',
        body: 'Trouvez l’unité la plus proche au USA ou contactez directement l’association.',
      },
    },
    about: {
      title: 'À propos de l’World Messianic Church of America / Miroku Association USA',
      body: 'L’World Messianic Church of America / Miroku Association USA se consacre à l’établissement du Paradis sur Terre par la purification spirituelle, le service et la beauté.',
      kicker: 'À propos',
      mission: {
        title: 'Mission',
        body: 'Agir comme une « sage-femme de la civilisation mondiale » pour faire naître une nouvelle ère de vrai bonheur et de vérité révélée.',
      },
      whoWeServe: {
        title: 'Qui nous servons',
        body: 'Nous accueillons toutes les personnes en recherche de croissance spirituelle, de santé et d’harmonie.',
      },
      offer: {
        title: 'Ce que nous faisons',
        body: 'Nous partageons le Johrei, étudions les principes spirituels et cultivons la beauté par l’art et la nature.',
      },
      focus: {
        title: 'Fondateur',
        body: 'Mokichi Okada (1882–1955), visionnaire ayant révélé la transition de l’« Âge de la Nuit » vers l’« Âge de la Lumière ».',
      },
      service: {
        title: 'Pratique centrale',
        body: 'Le Johrei purifie le corps spirituel et soutient la purification du sang, forme matérialisée de l’esprit.',
      },
      guides: {
        title: 'Principes directeurs',
        body: 'Vérité (Shin), Vertu (Zen) et Beauté (Bi).',
      },
      leadership: {
        title: 'Intendance',
        body: 'En tant qu’organisme de bienfaisance enregistré au USA, nous servons avec transparence, responsabilité et dévouement.',
      },
    },
    johrei: {
      title: 'Johrei : Science spirituelle de la Lumière Divine',
      intro:
        'Le Johrei est une transmission de Lumière Divine qui dissout les nuages spirituels et élève l’âme.',
      kicker: 'Pratique centrale',
      vision: {
        title: 'Le spirituel précède le physique',
        body: 'Le Johrei purifie d’abord le corps spirituel. À mesure que les nuages spirituels se dissolvent, les impuretés sont éliminées du sang, compris comme la matérialisation de l’esprit. Ce processus restaure la santé naturelle et élève la conscience humaine.',
      },
      whatIs: {
        title: 'Définition',
        body: 'Une transmission de Lumière Divine pour dissoudre les nuages spirituels et élever l’âme.',
        experience: {
          title: 'Purification spirituelle',
          body: 'Le Johrei agit sur l’origine spirituelle de la souffrance et apporte clarté intérieure et équilibre.',
        },
        effect: {
          title: 'Relation entre esprit et sang',
          body: 'À mesure que l’esprit se purifie, les impuretés du sang se résolvent naturellement. Ce mécanisme spirituel-physique est au centre de l’enseignement du Johrei.',
        },
        goal: {
          title: 'Élévation de la conscience',
          body: 'Le Johrei soutient l’éveil de l’âme et aide chacun à s’aligner sur la santé, la prospérité et la paix.',
        },
      },
      path: {
        title: 'Une pratique pour tous',
        body: 'Le Johrei est offert gratuitement à tous. Par la purification continue et le service, chacun participe à la construction du Paradis sur Terre.',
      },
      extra: {
        title: 'En savoir plus sur le Johrei',
        origin: {
          title: 'Origine',
          body: 'Le principe du Johrei est l’irradiation d’une mystérieuse lumière invisible émanant du corps humain. Cette lumière est une forme d’énergie spirituelle, dont le composant principal est l’élément feu. À mesure que l’Âge de la Lumière approche, l’élément feu augmente dans le Monde Spirituel, dont la source est le Soleil.',
        },
        concept: {
          title: 'Concept',
          body: 'Le Johrei est une méthode de canalisation de l’énergie spirituelle (Lumière Divine), visant la purification de l’esprit, capable de transformer la dysharmonie spirituelle et matérielle en harmonie.',
        },
        mission: {
          title: 'Mission',
          quote:
            'Bien qu’il puisse sembler que le Johrei de notre religion ait pour objectif la guérison des maladies, ce n’est pas seulement cela. Il a une signification bien plus grande... c’est une méthode pour créer le bonheur.',
          author: 'Meishu-Sama',
        },
        practice: {
          title: 'Comment le Johrei agit',
          body: 'Le membre qualifié pour offrir le Johrei, en tant que canal de la Lumière Divine, transmet l’énergie spirituelle à son prochain par l’imposition des mains. La lumière du Johrei agit sur l’esprit et se reflète dans le corps, apportant un bien-être spirituel, mental et physique.',
        },
        benefits: {
          title: 'Bénéfices',
          items: [
            'Éveille l’être humain à l’existence du Créateur.',
            'Élève l’intelligence et la personnalité.',
            'Renforce pour traverser les défis de la vie.',
            'Élargit l’aura et protège des infortunes.',
            'Favorise la santé physique et spirituelle.',
            'Permet de mieux percevoir l’abondance et les opportunités.',
            'Rend plus serein et pacifique.',
            'Renforce la gratitude et l’altruisme.',
          ],
        },
      },
    },
    meishuSama: {
      title: 'Meishu-sama : Fondateur et visionnaire',
      intro:
        'Mokichi Okada (1882-1955), connu comme Meishu-sama, a reçu des révélations divines concernant la transition de l’humanité de l’« Âge de la Nuit » vers l’« Âge de la Lumière ».',
      points: [
        'Il a enseigné que la réalité spirituelle précède la réalité physique et que la purification est la voie vers la vraie santé.',
        'Il décrivait sa mission comme celle d’une « sage-femme de la civilisation mondiale », guidant l’humanité vers une nouvelle ère.',
        'Ses enseignements unissent Vérité, Vertu et Beauté comme principes pratiques pour la vie quotidienne et la transformation sociale.',
        'Par le Johrei, l’art et la nature, il a envisagé un monde de santé, de prospérité et de paix.',
      ],
      learnMore: 'En savoir plus sur sa vie et son héritage',
      legacy: {
        title: 'Meishu-sama : Vie et héritage',
        intro: 'Un regard plus approfondi sur la manière dont la vie, la mission et les enseignements de Mokichi Okada continuent de guider la pratique spirituelle aujourd’hui.',
        milestones: [
          {
            title: '1882 : Jeunesse et quête de vérité',
            body: 'Né en 1882 sous le nom de Mokichi Okada, il a poursuivi toute sa vie une quête de vérité et des lois spirituelles qui régissent le bonheur humain.',
          },
          {
            title: '1935 : Mission fondatrice',
            body: 'En 1935, il a formellement lancé un mouvement dédié à la construction du Paradis sur Terre par la purification spirituelle, la gratitude et le service.',
          },
          {
            title: 'Enseigner par la pratique',
            body: 'Il a enseigné que le Johrei, l’appréciation de la beauté et l’alignement avec la volonté divine transforment à la fois la vie individuelle et la société.',
          },
          {
            title: '1955 et au-delà',
            body: 'Après son départ en 1955, ses enseignements se sont diffusés à l’international, inspirant des communautés engagées pour la santé, la prospérité et la paix.',
          },
        ],
        legacyTitle: 'Héritage vivant',
        legacyPoints: [
          'Le Johrei comme voie pratique de purification spirituelle.',
          'Vérité, Vertu et Beauté comme principes vécus.',
          'La gratitude et le service altruiste comme discipline quotidienne.',
          'Une vision mondiale du Paradis sur Terre.',
        ],
      },
    },
    paradise: {
      title: 'Paradis Terrestre',
      intro:
        'Une vision d’un monde où vérité, bonté et beauté fleurissent ensemble. Chaque geste de gratitude et de service rapproche ce paradis.',
      points: [
        'Commencer par de petits gestes quotidiens d’appréciation.',
        'Partager le Johrei et la bienveillance autour de soi.',
        'Créer de la beauté à la maison et dans les espaces partagés.',
      ],
    },
    firstVisit: {
      title: 'Votre première visite',
      intro:
        'Nous vous accueillons chaleureusement. Voici à quoi vous attendre et comment être à l’aise lors de votre première expérience de Johrei.',
      kicker: 'Première visite',
      steps: [
        {
          title: 'Arriver et se poser',
          body: 'Nous vous accueillons et vous aidons à être à l’aise.',
        },
        {
          title: 'Recevoir le Johrei',
          body: 'Vous êtes assis confortablement pour recevoir la lumière divine.',
        },
        {
          title: 'Partager et apprendre',
          body: 'Posez vos questions et découvrez la pratique.',
        },
      ],
      tips: {
        title: 'Guide pratique',
        items: [
          'Portez des vêtements confortables et sobres.',
          'Une séance dure généralement 20 à 30 minutes.',
          'Sans rendez-vous là où indiqué; rendez-vous recommandé pour les groupes.',
          'Le Johrei se reçoit assis; posez vos questions librement.',
        ],
      },
      etiquette: {
        title: 'Étiquette',
        items: [
          'Arrivez quelques minutes en avance pour vous poser.',
          'Mettez votre téléphone en silencieux; gardez une ambiance calme.',
          'Les dons sont volontaires et jamais exigés.',
          'Vous pouvez observer d’abord si vous préférez.',
        ],
      },
      online: {
        title: 'En ligne ou sur demande',
        body: 'Si vous ne pouvez pas venir en personne, nous pouvons vous guider ou vous relier à un groupe local. Contactez-nous pour trouver la meilleure option.',
      },
    },
    locations: {
      title: 'Lieux',
      intro: 'Trouvez un centre ou un groupe près de chez vous.',
      filters: {
        province: 'Province',
        city: 'Ville',
        type: 'Type',
        clear: 'Réinitialiser',
        search: 'Chercher',
      },
      types: { center: 'Centre', group: 'Groupe', comingSoon: 'Bientôt' },
      detail: {
        contact: 'Contact',
        schedule: 'Horaire',
        directions: 'Voir sur la carte',
        contactCta: 'Nous contacter',
      },
      empty: 'Aucun lieu ne correspond encore. Essayez sans filtre ou revenez bientôt.',
    },
    events: {
      title: 'Événements',
      empty: 'Aucun événement à venir pour le moment.',
    },
    resourcesPage: {
      title: 'Ressources',
      intro:
        'Des guides courts pour apprendre, préparer une visite et approfondir la pratique.',
      categories: 'Catégories',
    },
    testimonials: {
      title: 'Témoignages',
      intro: 'Expériences partagées par la communauté. Résumés paraphrasés avec liens sources.',
    },
    contact: {
      title: 'Contact',
      intro:
        'Nous répondons avec plaisir à vos questions, pour préparer une visite ou vous relier à un groupe local.',
      options: {
        general: 'Questions générales : info@miroku.us',
        visit: 'Planifier ou premières questions : +1 (305) 308-8830',
        learn: 'En savoir plus sur le Johrei : voyez Ressources ou écrivez-nous.',
      },
    },
    usa: {
      units: {
        title: 'Unités au USA',
        intro: 'Trouvez les centres et groupes de Johrei au USA. Contactez le bureau national pour les horaires et lieux de rencontre.',
        cardCta: 'Contacter l’association',
        contactAssociation: 'Contacter l’association',
        labels: {
          leaders: 'Responsables',
          contact: 'Contact',
          phone: 'Téléphone',
          email: 'Courriel',
        },
        units: [
          {
            name: 'Centre de Toronto',
            address: '3416 Dundas Street West, Suite 209, Toronto, ON M6S 2S1',
            phone: '+1 (305) 308-8830',
            leaders: 'Rev. Guilherme de Souza; Rev. Ana De Sousa',
            email: 'info@miroku.us',
          },
          {
            name: 'Groupe d’Ottawa',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
            note: 'Aucune adresse publique - contactez-nous pour les lieux de rencontre et les horaires.',
          },
          {
            name: 'Groupe de Montréal',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
          {
            name: 'Groupe de Vancouver',
            phone: '+1 (305) 308-8830',
            contact: 'Rev. Guilherme de Souza',
            email: 'info@miroku.us',
          },
        ],
      },
      contact: {
        title: 'Contacter l’World Messianic Church of America / Miroku Association USA',
        intro: 'Joignez le bureau national ou les centres locaux à l’aide des coordonnées ci-dessous.',
        labels: {
          email: 'Courriel',
          phone: 'Téléphone',
          prayer: 'Prière en ligne / formulaire de demande',
          donate: 'Don',
        },
        prayerText: 'Soumettre une demande de prière',
        donateText: 'Don de gratitude (PayPal)',
        activitiesCta: 'Voir les activités et services',
        note: 'Confirmez les horaires, adresses locales et calendriers d’événements avec le centre local avant publication.',
      },
    },
    donate: {
      title: 'Soutenez Notre Mission',
      intro: 'Votre contribution soutient nos activités et le partage du Johrei à travers le USA. Nous apprécions votre intendance.',
      placeholder: 'Nous mettons actuellement en place des dons en ligne sécurisés. Veuillez contacter notre centre de Toronto pour toute demande d’intendance.',
      stripeTitle: 'Donate by Card / Wallet (Stripe)',
      interacTitle: 'Donner par Virement Interac',
      interacStep1: 'Envoyez un virement Interac à : info@miroku.us',
      interacStep2: 'Remplissez le formulaire de "Confirmation de don Interac" pour enregistrer votre don',
      formTitle: 'Confirmation de Don',
      formIntro: 'Merci pour votre soutien. Veuillez enregistrer les détails de votre virement pour nous aider dans nos rapports mensuels d’intendance.',
      fields: {
        name: 'Nom complet',
        email: 'Adresse courriel',
        amount: 'Montant envoyé',
        date: 'Date d’envoi',
        fund: 'Type de don / Fonds',
        group: 'Groupe / Centre',
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
        montreal: 'Montréal',
        vancouver: 'Vancouver',
        calgary: 'Calgary',
        ottawa: 'Ottawa',
        other: 'Autre'
      }
    },
    guidelines: {
      title: 'Directives 2026',
      motto:
        'Aider les personnes à s’engager dans la construction du Paradis Terrestre, à travers les pratiques messianiques, constituent la voie de notre salvation',
      titleFr: 'Directives 2026',
      mottoFr:
        'Aider les personnes à s’engager dans la construction du Paradis Terrestre, à travers les pratiques messianiques, constituent la voie de notre salvation',
      placeholderEn: 'Full guideline details will be added here.',
      placeholderFr: 'Les détails complets seront ajoutés ici.',
    },
    notFound: 'Contenu introuvable.',
  },
}

if (translations.es) {
  translations.es.nav = {
    ...translations.es.nav,
    home: 'Inicio',
    about: 'Nosotros',
    locations: 'Centros',
    events: 'Eventos',
    resources: 'Recursos',
    testimonials: 'Testimonios',
    contact: 'Contacto',
    donate: 'Donar',
    guidelines: 'Directrices 2026',
  }

  translations.es.actions = {
    ...translations.es.actions,
    donate: 'Donar',
    learnMore: 'Saber mas',
    findCenter: 'Centros',
    firstVisit: 'Primera visita',
    contact: 'Contactar',
    viewAll: 'Ver todo',
    back: 'Volver',
    recordDonation: 'Registrar mi donacion',
  }

  translations.es.donate.fields = {
    ...translations.es.donate.fields,
    name: 'Nombre completo',
    email: 'Correo electronico',
    amount: 'Monto',
    date: 'Fecha',
    fund: 'Tipo de donacion',
    group: 'Centro',
    note: 'Mensaje',
  }
}

const ptTranslation = JSON.parse(JSON.stringify(translations.en)) as TranslationContent

ptTranslation.nav = {
  ...ptTranslation.nav,
  home: 'Inicio',
  about: 'Sobre',
  locations: 'Centros',
  events: 'Eventos',
  resources: 'Recursos',
  testimonials: 'Testemunhos',
  contact: 'Contato',
  donate: 'Doar',
  guidelines: 'Diretrizes 2026',
}

ptTranslation.actions = {
  ...ptTranslation.actions,
  donate: 'Doar',
  learnMore: 'Saiba mais',
  findCenter: 'Centros',
  firstVisit: 'Primeira visita',
  contact: 'Contato',
  viewAll: 'Ver todos',
  back: 'Voltar',
  recordDonation: 'Registrar minha doacao',
}

ptTranslation.donate.fields = {
  ...ptTranslation.donate.fields,
  name: 'Nome completo',
  email: 'Email',
  amount: 'Valor',
  date: 'Data',
  fund: 'Tipo de doacao',
  group: 'Centro',
  note: 'Mensagem',
}

translations.pt = ptTranslation
