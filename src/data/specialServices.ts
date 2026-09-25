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
      'Special Services prayer forms for Miroku Association USA / World Messianic Church of America in English, Portuguese, and Spanish.',
    thankYou: 'Your prayer form is ready. Please complete sending it in your email or sharing application; the website did not submit it automatically.',
    donate: 'Donate',
    back: 'Back to Special Services',
    openForm: 'Open form',
  },
  pt: {
    title: 'Cultos Especiais',
    intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
    description:
      'Formulários de oração dos Cultos Especiais da Miroku Association USA / World Messianic Church of America em inglês, português e espanhol.',
    thankYou: 'Seu formulário de oração está pronto. Conclua o envio no seu aplicativo de e-mail ou compartilhamento; o site não o enviou automaticamente.',
    donate: 'Doar',
    back: 'Voltar para Cultos Especiais',
    openForm: 'Abrir formulário',
  },
  es: {
    title: 'Ceremonias Especiales',
    intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
    description:
      'Formularios de oración de Ceremonias Especiales de Miroku Association USA / World Messianic Church of America en inglés, portugués y español.',
    thankYou: 'Su formulario de oración está listo. Complete el envío en su aplicación de correo o de uso compartido; el sitio web no lo envió automáticamente.',
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
    recipientLabel: string
    recipientEmailLabel: string
    fullName: string
    date: string
    print: string
    send: string
    sending: string
    selectCenterError: string
    nameError: string
    pdfError: string
    helper: string
    downloadInstructions: string
    downloadPdf: string
    copyCenterEmail: string
    emailCopied: string
    emailCopyFailed: string
    sharePdf: string
    shareComplete: string
    shareCanceled: string
    shareUnavailable: string
    extraNamesNote: string
    extraWritingNote: string
  }
> = {
  en: {
    centerLabel: 'Where would you like to send this form?',
    centerPlaceholder: 'Choose the receiving Johrei Center',
    recipientLabel: 'Form recipient',
    recipientEmailLabel: 'Email',
    fullName: 'Full name',
    date: 'Date',
    print: 'Print form',
    send: 'Prepare form to share',
    sending: 'Preparing PDF...',
    selectCenterError: 'Please choose where you would like to send this form.',
    nameError: 'Please enter your full name.',
    pdfError: 'Could not prepare the PDF. Please try again.',
    helper: 'Prepare your PDF, then select Share PDF to choose Mail, Messages, or another available app. Choose the recipient and finish sending there. Sharing options depend on your device. You can also download the PDF.',
    downloadInstructions: 'Your PDF {filename} is ready. Select Share PDF, then choose an app. For email, select Copy center email before sharing, then paste {recipient} into the To field. For Messages, choose the intended contact. Nothing has been sent yet.',
    downloadPdf: 'Download PDF',
    sharePdf: 'Share PDF',
    copyCenterEmail: 'Copy center email',
    emailCopied: 'Copied {recipient}. Select Share PDF, choose your email app, then paste the address into the To field.',
    emailCopyFailed: 'Could not copy automatically. Select and copy this address: {recipient}.',
    shareComplete: 'The PDF was handed to your chosen app. Complete sending there; the website cannot confirm delivery.',
    shareCanceled: 'The sharing dialog closed without completing the handoff. Your PDF is still ready: try Share PDF again or download the PDF below.',
    shareUnavailable: 'File sharing is unavailable or could not open on this device. Download the PDF to attach manually.',
    extraNamesNote: 'This page has space for 24 names. For more, prepare another form and attach each form when you send your request.',
    extraWritingNote: 'For more writing space, prepare another form. Print each form, or download the PDFs and attach them all to one message.',
  },
  pt: {
    centerLabel: 'Para onde você deseja enviar este formulário?',
    centerPlaceholder: 'Escolha o Centro Johrei destinatário',
    recipientLabel: 'Destinatário do formulário',
    recipientEmailLabel: 'E-mail',
    fullName: 'Nome completo',
    date: 'Data',
    print: 'Imprimir formulário',
    send: 'Preparar formulário para compartilhar',
    sending: 'Preparando PDF...',
    selectCenterError: 'Escolha para onde deseja enviar este formulário.',
    nameError: 'Digite seu nome completo.',
    pdfError: 'Não foi possível preparar o PDF. Tente novamente.',
    helper: 'Prepare seu PDF e selecione Compartilhar PDF para escolher Mail, Mensagens ou outro aplicativo disponível. Escolha o destinatário e conclua o envio no aplicativo. As opções dependem do dispositivo. Você também pode baixar o PDF.',
    downloadInstructions: 'Seu PDF {filename} está pronto. Selecione Compartilhar PDF e escolha um aplicativo. Para e-mail, selecione Copiar e-mail do centro antes de compartilhar e cole {recipient} no campo Para. Para Mensagens, escolha o contato desejado. Nada foi enviado ainda.',
    downloadPdf: 'Baixar PDF',
    sharePdf: 'Compartilhar PDF',
    copyCenterEmail: 'Copiar e-mail do centro',
    emailCopied: 'E-mail copiado: {recipient}. Selecione Compartilhar PDF, escolha seu aplicativo de e-mail e cole o endereço no campo Para.',
    emailCopyFailed: 'Não foi possível copiar automaticamente. Selecione e copie este endereço: {recipient}.',
    shareComplete: 'O PDF foi transferido para o aplicativo escolhido. Conclua o envio nele; o site não pode confirmar a entrega.',
    shareCanceled: 'A janela de compartilhamento foi fechada sem concluir a transferência. Seu PDF continua pronto: tente Compartilhar PDF novamente ou baixe o PDF abaixo.',
    shareUnavailable: 'O compartilhamento de arquivos não está disponível ou não abriu neste dispositivo. Baixe o PDF para anexar manualmente.',
    extraNamesNote: 'Esta página tem espaço para 24 nomes. Para incluir mais, prepare outro formulário e anexe todos ao enviar sua solicitação.',
    extraWritingNote: 'Para ter mais espaço para escrever, prepare outro formulário. Imprima cada formulário ou baixe os PDFs e anexe todos em uma única mensagem.',
  },
  es: {
    centerLabel: '¿A dónde desea enviar este formulario?',
    centerPlaceholder: 'Elija el Centro Johrei destinatario',
    recipientLabel: 'Destinatario del formulario',
    recipientEmailLabel: 'Correo electrónico',
    fullName: 'Nombre completo',
    date: 'Fecha',
    print: 'Imprimir formulario',
    send: 'Preparar formulario para compartir',
    sending: 'Preparando PDF...',
    selectCenterError: 'Elija a dónde desea enviar este formulario.',
    nameError: 'Ingrese su nombre completo.',
    pdfError: 'No se pudo preparar el PDF. Inténtelo de nuevo.',
    helper: 'Prepare su PDF y seleccione Compartir PDF para elegir Mail, Mensajes u otra aplicación disponible. Elija el destinatario y complete el envío allí. Las opciones dependen del dispositivo. También puede descargar el PDF.',
    downloadInstructions: 'Su PDF {filename} está listo. Seleccione Compartir PDF y elija una aplicación. Para correo, seleccione Copiar correo del centro antes de compartir y pegue {recipient} en el campo Para. Para Mensajes, elija el contacto deseado. No se ha enviado nada todavía.',
    downloadPdf: 'Descargar PDF',
    sharePdf: 'Compartir PDF',
    copyCenterEmail: 'Copiar correo del centro',
    emailCopied: 'Correo copiado: {recipient}. Seleccione Compartir PDF, elija su aplicación de correo y pegue la dirección en el campo Para.',
    emailCopyFailed: 'No se pudo copiar automáticamente. Seleccione y copie esta dirección: {recipient}.',
    shareComplete: 'El PDF se transfirió a la aplicación elegida. Complete el envío allí; el sitio no puede confirmar la entrega.',
    shareCanceled: 'Se cerró la ventana sin completar la transferencia. Su PDF sigue listo: intente Compartir PDF de nuevo o descargue el PDF abajo.',
    shareUnavailable: 'Compartir archivos no está disponible o no pudo abrirse en este dispositivo. Descargue el PDF para adjuntarlo manualmente.',
    extraNamesNote: 'Esta página tiene espacio para 24 nombres. Si necesita más, prepare otro formulario y adjunte todos al enviar su solicitud.',
    extraWritingNote: 'Si necesita más espacio para escribir, prepare otro formulario. Imprima cada uno o descargue los PDF y adjúntelos todos en un mismo mensaje.',
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
        section1Lines: 17,
        section2:
          'With a sincere heart, I renew my commitment to dedicate myself even more to the Divine Plan for the construction of Paradise on Earth, striving especially in the following practices:',
        section2Lines: 15,
      },
      pt: {
        title: 'Culto do Paraíso Terrestre',
        intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
        cardTitle: 'Culto do Paraíso Terrestre',
        quote: 'O Paraíso Terrestre é um mundo onde a Verdade, o Bem e o Belo se manifestam plenamente.',
        section1:
          'Supremo Deus, Criador e Doador de Toda a Vida, receba, por favor, minha profunda gratidão por todas as mudanças e transformações que se manifestaram em meu coração, no meu lar e em minha vida, tais como:',
        section1Lines: 17,
        section2:
          'Com sincero sentimento, renovo meu compromisso de dedicar-me ainda mais ao Plano Divino para a construção do Paraíso Terrestre, esforçando-me especialmente nas seguintes práticas:',
        section2Lines: 15,
      },
      es: {
        title: 'Ceremonia de Celebración del Paraíso en la Tierra',
        intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
        cardTitle: 'Ceremonia de Celebración del Paraíso en la Tierra',
        quote:
          'El Paraíso en la Tierra es un mundo donde la Verdad, el Bien y la Belleza se manifiestan plenamente.',
        section1:
          'Dios Supremo, Creador y Dador de Toda Vida, por favor recibe la expresión de mi más profunda gratitud por todos los cambios y transformaciones que se han manifestado en mi corazón, en mi hogar y en mi vida, tales como:',
        section1Lines: 17,
        section2:
          'Con un corazón sincero, renuevo mi compromiso de dedicarme aún más al Plan Divino para la construcción del Paraíso en la Tierra, esforzándome especialmente en las siguientes prácticas:',
        section2Lines: 15,
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
        section1Lines: 17,
        section2:
          "For this coming year, I'd like to commit myself to be in service to the Divine Plan as an instrument of Meishu-sama by putting into practice the following:",
        section2Lines: 15,
      },
      pt: {
        title: 'Culto Comemorativo do Natalício de Meishu-sama',
        intro: 'Selecione um culto abaixo para acessar o formulário de oração.',
        cardTitle: 'Culto Comemorativo do Natalício de Meishu-sama',
        quote:
          'É nobre o ser humano que sente gratidão pelas bênçãos recebidas e consegue conservá-las em seu coração.',
        section1:
          'Deus, Criador e Doador de Toda a Vida, por favor, receba minha gratidão por todas as bênçãos e proteção que tenho recebido, tais como:',
        section1Lines: 17,
        section2:
          'Para este próximo Ano Novo, desejo comprometer-me a servir ao Plano Divino como instrumento de Meishu-sama, colocando em prática o seguinte:',
        section2Lines: 15,
      },
      es: {
        title: 'Ceremonia de Celebración del Natalicio de Meishu-sama',
        intro: 'Seleccione una ceremonia a continuación para acceder al formulario de oración.',
        cardTitle: 'Ceremonia de Celebración del Natalicio de Meishu-sama',
        quote:
          'Noble es el ser humano que siente gratitud por las bendiciones recibidas y puede conservarlas en su corazón.',
        section1:
          'Dios, Creador y Dador de Toda Vida, por favor recibe mi gratitud por todas las bendiciones y protección que he recibido, tales como:',
        section1Lines: 17,
        section2:
          'Para este próximo año, deseo comprometerme a servir al Plan Divino como instrumento de Meishu-sama, poniendo en práctica lo siguiente:',
        section2Lines: 15,
      },
    },
  },
]

export function getSpecialService(slug: string | undefined) {
  return specialServices.find((service) => service.slug === slug)
}
