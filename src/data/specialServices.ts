import type { Language } from './translations'

export type SpecialServiceSlug = 'paradise-on-earth' | 'annual-ancestors' | 'meishu-sama-birthday'

export type SpecialServiceCenter = {
  name: string
  email: string
}

export type SpecialServiceCopy = {
  title: string
  intro: string
  cardTitle: string
  quote?: string
  section1?: string
  section1Lines?: number
  section2?: string
  section2Lines?: number
  prayerText?: string
  tableHeaders?: {
    name: string
    relationship: string
  }
}

export type SpecialServiceDefinition = {
  slug: SpecialServiceSlug
  apiServiceName: string
  pdfFilename: string
  copy: Record<Language, SpecialServiceCopy>
}

export const specialServiceCenters: SpecialServiceCenter[] = [
  { name: 'National Headquarters', email: 'headquarters@miroku.us' },
  { name: 'Boston, MA', email: 'boston@miroku.us' },
  { name: 'Los Angeles, CA', email: 'losangeles@miroku.us' },
  { name: 'Miami, FL', email: 'miami@miroku.us' },
  { name: 'New York, NY', email: 'newyork@miroku.us' },
  { name: 'Orlando, FL', email: 'orlando@miroku.us' },
]

export const specialServicesLandingCopy: Record<
  Language,
  {
    title: string
    intro: string
    description: string
    thankYou: string
    donate: string
    back: string
    openForm: string
  }
> = {
  en: {
    title: 'Special Services',
    intro: 'Please select a service below to access the prayer form.',
    description:
      'Special Services prayer forms for World Messianic Church of America / Miroku Association USA in English, Portuguese, and Spanish.',
    thankYou: 'Your prayer form has been submitted. Thank you.',
    donate: 'Donate',
    back: 'Back to Special Services',
    openForm: 'Open form',
  },
  pt: {
    title: 'Cultos Especiais',
    intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
    description:
      'Formulários de oração dos Cultos Especiais da World Messianic Church of America / Miroku Association USA em inglês, português e espanhol.',
    thankYou: 'Seu formulário de oração foi enviado. Obrigado.',
    donate: 'Doar',
    back: 'Voltar para Cultos Especiais',
    openForm: 'Abrir formulário',
  },
  es: {
    title: 'Ceremonias Especiales',
    intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
    description:
      'Formularios de oración de Ceremonias Especiales de World Messianic Church of America / Miroku Association USA en inglés, portugués y español.',
    thankYou: 'Su formulario de oración ha sido enviado. Gracias.',
    donate: 'Donar',
    back: 'Volver a Ceremonias Especiales',
    openForm: 'Abrir formulario',
  },
}

export const specialServiceFormUiCopy: Record<
  Language,
  {
    centerLabel: string
    centerPlaceholder: string
    fullName: string
    date: string
    print: string
    send: string
    sending: string
    selectCenterError: string
    nameError: string
    pdfError: string
    submitError: string
    helper: string
  }
> = {
  en: {
    centerLabel: 'Select your Johrei Center:',
    centerPlaceholder: 'Choose a Johrei Center',
    fullName: 'Full name',
    date: 'Date',
    print: 'Print form',
    send: 'Send form',
    sending: 'Sending...',
    selectCenterError: 'Please select your Johrei Center.',
    nameError: 'Please enter your full name.',
    pdfError: 'Could not prepare the PDF. Please try again.',
    submitError: 'Could not send the form. Please try again.',
    helper: 'Print or send this completed form to your Johrei Center.',
  },
  pt: {
    centerLabel: 'Selecione seu Centro Johrei:',
    centerPlaceholder: 'Escolha um Centro Johrei',
    fullName: 'Nome completo',
    date: 'Data',
    print: 'Imprimir formulário',
    send: 'Enviar formulário',
    sending: 'Enviando...',
    selectCenterError: 'Selecione seu Centro Johrei.',
    nameError: 'Digite seu nome completo.',
    pdfError: 'Não foi possível preparar o PDF. Tente novamente.',
    submitError: 'Não foi possível enviar o formulário. Tente novamente.',
    helper: 'Imprima ou envie este formulário preenchido para seu Centro Johrei.',
  },
  es: {
    centerLabel: 'Seleccione su Centro Johrei:',
    centerPlaceholder: 'Elija un Centro Johrei',
    fullName: 'Nombre completo',
    date: 'Fecha',
    print: 'Imprimir formulario',
    send: 'Enviar formulario',
    sending: 'Enviando...',
    selectCenterError: 'Seleccione su Centro Johrei.',
    nameError: 'Ingrese su nombre completo.',
    pdfError: 'No se pudo preparar el PDF. Inténtelo de nuevo.',
    submitError: 'No se pudo enviar el formulario. Inténtelo de nuevo.',
    helper: 'Imprima o envíe este formulario completo a su Centro Johrei.',
  },
}

export const specialServices: SpecialServiceDefinition[] = [
  {
    slug: 'paradise-on-earth',
    apiServiceName: 'Paradise on Earth Service',
    pdfFilename: 'paradise-on-earth-form.pdf',
    copy: {
      en: {
        title: 'Paradise on Earth Service',
        intro: 'Please select a service below to access the prayer form.',
        cardTitle: 'Paradise on Earth Service',
        quote: 'Paradise on Earth is a world where truth, virtue and beauty are being manifested in perfect form.',
        section1:
          'Supreme God, Creator and Giver of All Life, please accept the expression of my deepest gratitude for all the changes and transformations that have been manifested in my heart, in my home, and in my life, such as:',
        section1Lines: 14,
        section2:
          'With a sincere heart, I renew my commitment to dedicate myself even more to the Divine Plan for the construction of Paradise on Earth, striving especially in the following practices:',
        section2Lines: 12,
      },
      pt: {
        title: 'Culto do Paraíso Terrestre',
        intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
        cardTitle: 'Culto do Paraíso Terrestre',
        quote: 'O Paraíso Terrestre é um mundo onde a Verdade, o Bem e o Belo se manifestam plenamente.',
        section1:
          'Supremo Deus, Criador e Doador de Toda a Vida, receba, por favor, minha profunda gratidão por todas as mudanças e transformações que se manifestaram em meu coração, no meu lar e em minha vida, tais como:',
        section1Lines: 14,
        section2:
          'Com sincero sentimento, renovo meu compromisso de dedicar-me ainda mais ao Plano Divino para a construção do Paraíso Terrestre, esforçando-me especialmente nas seguintes práticas:',
        section2Lines: 12,
      },
      es: {
        title: 'Ceremonia de Celebración del Paraíso en la Tierra',
        intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
        cardTitle: 'Ceremonia de Celebración del Paraíso en la Tierra',
        quote:
          'El Paraíso en la Tierra es un mundo donde la Verdad, el Bien y la Belleza se manifiestan plenamente.',
        section1:
          'Dios Supremo, Creador y Dador de Toda Vida, por favor recibe la expresión de mi más profunda gratitud por todos los cambios y transformaciones que se han manifestado en mi corazón, en mi hogar y en mi vida, tales como:',
        section1Lines: 14,
        section2:
          'Con un corazón sincero, renuevo mi compromiso de dedicarme aún más al Plan Divino para la construcción del Paraíso en la Tierra, esforzándome especialmente en las siguientes prácticas:',
        section2Lines: 12,
      },
    },
  },
  {
    slug: 'annual-ancestors',
    apiServiceName: 'Annual Ancestors Service',
    pdfFilename: 'annual-ancestors-form.pdf',
    copy: {
      en: {
        title: 'Annual Ancestors Service',
        intro: 'Please select a service below to access the prayer form.',
        cardTitle: 'Annual Ancestors Service',
        prayerText:
          'Great God of Light, I would like to thank you for the love, light, comfort and protection You have given my loved ones who have entered the spiritual realm. Please continue to bless these souls with everlasting happiness.',
        tableHeaders: { name: 'NAME', relationship: 'RELATIONSHIP' },
      },
      pt: {
        title: 'Culto Anual dos Antepassados',
        intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
        cardTitle: 'Culto Anual dos Antepassados',
        prayerText:
          'Grande Deus da Luz, gostaria de agradecer pelo amor, pela luz, pelo conforto e pela proteção que o Senhor tem concedido aos meus entes queridos que ingressaram no mundo espiritual. Por favor, continue abençoando estas almas com felicidade eterna.',
        tableHeaders: { name: 'NOME', relationship: 'GRAU DE PARENTESCO / RELAÇÃO' },
      },
      es: {
        title: 'Ceremonia Anual de los Antepasados',
        intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
        cardTitle: 'Ceremonia Anual de los Antepasados',
        prayerText:
          'Gran Dios de la Luz, quisiera agradecerte por el amor, la luz, el consuelo y la protección que has concedido a mis seres queridos que han ingresado al mundo espiritual. Por favor, continúa bendiciendo a estas almas con felicidad eterna.',
        tableHeaders: { name: 'NOMBRE', relationship: 'RELACIÓN' },
      },
    },
  },
  {
    slug: 'meishu-sama-birthday',
    apiServiceName: 'Meishu-sama Birthday Celebration Service',
    pdfFilename: 'meishu-sama-birthday-form.pdf',
    copy: {
      en: {
        title: "Meishu-sama's Birthday Celebration Service",
        intro: 'Please select a service below to access the prayer form.',
        cardTitle: "Meishu-sama's Birthday Celebration Service",
        quote:
          'Noble is the human being who feels gratitude for the blessings received and can keep them in their heart.',
        section1:
          'God, Creator and Giver of All Life, please receive my gratitude for all the blessings and protection I have received such as:',
        section1Lines: 14,
        section2:
          "For this coming year, I'd like to commit myself to be in service to the Divine Plan as an instrument of Meishu-sama by putting into practice the following:",
        section2Lines: 12,
      },
      pt: {
        title: 'Culto Comemorativo do Natalício de Meishu-sama',
        intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
        cardTitle: 'Culto Comemorativo do Natalício de Meishu-sama',
        quote:
          'É nobre o ser humano que sente gratidão pelas bênçãos recebidas e consegue conservá-las em seu coração.',
        section1:
          'Deus, Criador e Doador de Toda a Vida, por favor, receba minha gratidão por todas as bênçãos e proteção que tenho recebido, tais como:',
        section1Lines: 14,
        section2:
          'Para este próximo Ano Novo, desejo comprometer-me a servir ao Plano Divino como instrumento de Meishu-sama, colocando em prática o seguinte:',
        section2Lines: 12,
      },
      es: {
        title: 'Ceremonia de Celebración del Natalicio de Meishu-sama',
        intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
        cardTitle: 'Ceremonia de Celebración del Natalicio de Meishu-sama',
        quote:
          'Noble es el ser humano que siente gratitud por las bendiciones recibidas y puede conservarlas en su corazón.',
        section1:
          'Dios, Creador y Dador de Toda Vida, por favor recibe mi gratitud por todas las bendiciones y protección que he recibido, tales como:',
        section1Lines: 14,
        section2:
          'Para este próximo año, deseo comprometerme a servir al Plan Divino como instrumento de Meishu-sama, poniendo en práctica lo siguiente:',
        section2Lines: 12,
      },
    },
  },
]

export function getSpecialService(slug: string | undefined) {
  return specialServices.find((service) => service.slug === slug)
}
