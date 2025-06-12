import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';


if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const allSections =  {
"DEUTSCH":[
  {
    title: "Allgemeine Informationen",
    icon: "info",
    subsections: [
      {
        title: "Anbieter",
        content:
          "Q-Ready\n[Die Firmenadresse]\ncontact.qready@gmail.com",
      },
      {
        title: "Gegenstand der App",
        content:
          "Manuelles und KI-basiertes Erstellen von Quizzen. Außerdem können öffentliche Module kopiert werden.",
      },
      {
        title: "Funktionen & Nutzung",
        content:
          "Gratis: Manuelles Erstellen, Energie-System, Module kopieren.\n\nKostenpflichtig: Chips kaufen zur Energieaufladung.",
      },
    ],
  },
  {
    title: "Nutzung & Rechte",
    icon: "shield",
    subsections: [
      {
        title: "Für wen gelten die AGB?",
        content: "Für alle registrierten Nutzer:innen der App.",
      },
      {
        title: "Registrierung",
        content:
          "Erfolgt per E-Mail-Anbieter. Angabe des Bildungsbereichs optional, dient zur Modulpersonalisierung.",
      },
      {
        title: "Nutzungsrechte",
        content:
          "Private Module sind nur für den Nutzer sichtbar.\nÖffentliche Module können kopiert werden.",
      },
      {
        title: "Verbotene Nutzung",
        content:
          "Kein Reverse Engineering, automatisierte Erstellung oder Kopieren von UI-Elementen.",
      },
    ],
  },
  {
    title: "Preise & Käufe",
    icon: "credit-card",
    subsections: [
      {
        title: "Kosten",
        content:
          "Die App ist grundsätzlich kostenlos. Es gibt optionale In-App-Käufe (Chips).",
      },
      {
        title: "Zahlungen",
        content:
          "Zahlung über Google Pay und Apple Pay. Chips können gegen Energie getauscht werden.",
      },
      {
        title: "Widerruf",
        content:
          "Kein Rückgaberecht für bereits verbrauchte Energie. Kein Abo-Modell im Einsatz.",
      },
      {
        title: "Zahlungsverzug",
        content:
          "Bei Zahlungsproblemen kann der Account bis zur Klärung gesperrt werden.",
      },
    ],
  },
  {
    title: "Verfügbarkeit & Support",
    icon: "wifi",
    subsections: [
      {
        title: "Bereitstellung",
        content:
          "Keine garantierte Mindestverfügbarkeit. Ziel ist jedoch dauerhafte Verfügbarkeit.",
      },
      {
        title: "Support & Updates",
        content:
          "Support via Mail oder Kontaktformular. Regelmäßige Updates geplant.",
      },
      {
        title: "Haftung",
        content:
          "Keine Haftung für Datenverlust oder App-Abstürze. Exportfunktion für Datensicherung vorhanden.",
      },
    ],
  },
  {
    title: "Datenschutz",
    icon: "lock",
    subsections: [
      {
        title: "Erhobene Daten",
        content:
          "Registrierungsdaten, Lernverhalten, genutzte Features, letzte Anmeldung, Herkunftsland, Sprache etc.",
      },
      {
        title: "Verwendungszwecke",
        content:
          "Personalisierung, Funktionsgewährleistung und Weiterentwicklung der Plattform.",
      },
      {
        title: "Rechte der Nutzer:innen",
        content:
          "Accountlöschung möglich. Datenexport verfügbar.",
      },
    ],
  },
  {
    title: "Rechtliches",
    icon: "gavel",
    subsections: [
      {
        title: "Geltendes Recht",
        content:
          "Es gilt deutsches Recht. Gerichtsstand ist der Sitz des Unternehmens.",
      },
      {
        title: "AGB-Änderungen",
        content:
          "Änderungen werden per App oder E-Mail bekanntgegeben.",
      },
      {
        title: "Salvatorische Klausel",
        content:
          "Sollten einzelne Bestimmungen unwirksam sein, bleibt der Rest der AGB gültig.",
      },
    ],
  },
  {
    title: "Mehrsprachigkeit",
    icon: "globe",
    subsections: [
      {
        title: "Rechtlich gültige Sprache",
        content:
          "Im Zweifel gilt die deutsche Fassung.",
      },
      {
        title: "Sprachliche Benachrichtigungen",
        content:
          "AGB-Änderungen werden in allen unterstützten App-Sprachen angezeigt.",
      },
    ],
  },
  {
    title: "Besonderheiten",
    icon: "star",
    subsections: [
      {
        title: "Community-Funktionen",
        content:
          "Module können kopiert, erstellt und gemeldet werden.",
      },
      {
        title: "KI-Funktionen",
        content:
          "KI wird verwendet, wenn der Nutzer dies explizit auswählt (z. B. 'Mit KI erstellen').",
      },
    ],
  },
],
"ENGLISH": [
  {
    "title": "General Information",
    "icon": "info",
    "subsections": [
      {
        "title": "Provider",
        "content": "Q-Ready\n[Company Address]\ncontact.qready@gmail.com"
      },
      {
        "title": "Purpose of the App",
        "content": "Manual and AI-based quiz creation. Public modules can also be copied."
      },
      {
        "title": "Features & Usage",
        "content": "Free: Manual quiz creation, energy system, copying of modules.\n\nPaid: Buy chips to recharge energy."
      }
    ]
  },
  {
    "title": "Usage & Rights",
    "icon": "shield",
    "subsections": [
      {
        "title": "Who do the Terms apply to?",
        "content": "To all registered users of the app."
      },
      {
        "title": "Registration",
        "content": "Via email provider. Providing an educational background is optional and used to personalize modules."
      },
      {
        "title": "Usage Rights",
        "content": "Private modules are only visible to the user.\nPublic modules can be copied."
      },
      {
        "title": "Prohibited Usage",
        "content": "No reverse engineering, automated creation, or copying of UI elements."
      }
    ]
  },
  {
    "title": "Pricing & Purchases",
    "icon": "credit-card",
    "subsections": [
      {
        "title": "Costs",
        "content": "The app is generally free. Optional in-app purchases (chips) are available."
      },
      {
        "title": "Payments",
        "content": "Payment via Google Pay and Apple Pay. Chips can be exchanged for energy."
      },
      {
        "title": "Withdrawal",
        "content": "No right of return for used energy. No subscription model is used."
      },
      {
        "title": "Payment Default",
        "content": "In case of payment issues, the account may be suspended until resolved."
      }
    ]
  },
  {
    "title": "Availability & Support",
    "icon": "wifi",
    "subsections": [
      {
        "title": "Provision",
        "content": "No guaranteed minimum availability, but the aim is permanent availability."
      },
      {
        "title": "Support & Updates",
        "content": "Support via email or contact form. Regular updates are planned."
      },
      {
        "title": "Liability",
        "content": "No liability for data loss or app crashes. An export function is available for data backup."
      }
    ]
  },
  {
    "title": "Data Protection",
    "icon": "lock",
    "subsections": [
      {
        "title": "Collected Data",
        "content": "Registration data, learning behavior, used features, last login, country of origin, language, etc."
      },
      {
        "title": "Purposes of Use",
        "content": "Personalization, functionality, and further development of the platform."
      },
      {
        "title": "User Rights",
        "content": "Account deletion possible. Data export available."
      }
    ]
  },
  {
    "title": "Legal",
    "icon": "gavel",
    "subsections": [
      {
        "title": "Applicable Law",
        "content": "German law applies. Jurisdiction is the company's registered office."
      },
      {
        "title": "Changes to the Terms",
        "content": "Changes will be announced via the app or email."
      },
      {
        "title": "Severability Clause",
        "content": "If individual provisions are invalid, the remainder of the terms shall remain valid."
      }
    ]
  },
  {
    "title": "Multilingualism",
    "icon": "globe",
    "subsections": [
      {
        "title": "Legally Binding Language",
        "content": "In case of doubt, the German version prevails."
      },
      {
        "title": "Language Notifications",
        "content": "Changes to the terms are shown in all supported app languages."
      }
    ]
  },
  {
    "title": "Special Features",
    "icon": "star",
    "subsections": [
      {
        "title": "Community Features",
        "content": "Modules can be created, copied, and reported."
      },
      {
        "title": "AI Features",
        "content": "AI is used only when explicitly selected by the user (e.g., 'Create with AI')."
      }
    ]
  }
],
"SPANISH": [
  {
    "title": "Información general",
    "icon": "info",
    "subsections": [
      {
        "title": "Proveedor",
        "content": "Q-Ready\n[Dirección de la empresa]\ncontact.qready@gmail.com"
      },
      {
        "title": "Objeto de la aplicación",
        "content": "Creación de cuestionarios manuales y con inteligencia artificial. También se pueden copiar módulos públicos."
      },
      {
        "title": "Funciones y uso",
        "content": "Gratis: Creación manual, sistema de energía, copiar módulos.\n\nDe pago: Comprar fichas para recargar energía."
      }
    ]
  },
  {
    "title": "Uso y derechos",
    "icon": "shield",
    "subsections": [
      {
        "title": "¿A quién se aplican los Términos?",
        "content": "A todos los usuarios registrados de la aplicación."
      },
      {
        "title": "Registro",
        "content": "A través de un proveedor de correo electrónico. Indicar el ámbito educativo es opcional y se utiliza para personalizar los módulos."
      },
      {
        "title": "Derechos de uso",
        "content": "Los módulos privados solo son visibles para el usuario.\nLos módulos públicos pueden ser copiados."
      },
      {
        "title": "Uso prohibido",
        "content": "Prohibido realizar ingeniería inversa, creación automatizada o copiar elementos de la interfaz."
      }
    ]
  },
  {
    "title": "Precios y compras",
    "icon": "credit-card",
    "subsections": [
      {
        "title": "Costos",
        "content": "La aplicación es gratuita en general. Existen compras opcionales dentro de la app (fichas)."
      },
      {
        "title": "Pagos",
        "content": "Pago mediante Google Pay y Apple Pay. Las fichas pueden canjearse por energía."
      },
      {
        "title": "Desistimiento",
        "content": "No hay derecho a devolución para la energía ya consumida. No se utiliza modelo de suscripción."
      },
      {
        "title": "Mora de pago",
        "content": "En caso de problemas de pago, la cuenta puede ser suspendida hasta que se resuelva."
      }
    ]
  },
  {
    "title": "Disponibilidad y soporte",
    "icon": "wifi",
    "subsections": [
      {
        "title": "Disponibilidad",
        "content": "No se garantiza una disponibilidad mínima, pero se busca ofrecer un servicio permanente."
      },
      {
        "title": "Soporte y actualizaciones",
        "content": "Soporte por correo electrónico o formulario de contacto. Se planean actualizaciones periódicas."
      },
      {
        "title": "Responsabilidad",
        "content": "No se asume responsabilidad por pérdida de datos o fallos de la aplicación. Se ofrece función de exportación para respaldo de datos."
      }
    ]
  },
  {
    "title": "Protección de datos",
    "icon": "lock",
    "subsections": [
      {
        "title": "Datos recogidos",
        "content": "Datos de registro, comportamiento de aprendizaje, funciones utilizadas, último acceso, país de origen, idioma, etc."
      },
      {
        "title": "Fines de uso",
        "content": "Personalización, funcionamiento y desarrollo de la plataforma."
      },
      {
        "title": "Derechos del usuario",
        "content": "Es posible eliminar la cuenta. Disponible exportación de datos."
      }
    ]
  },
  {
    "title": "Aspectos legales",
    "icon": "gavel",
    "subsections": [
      {
        "title": "Legislación aplicable",
        "content": "Se aplica la legislación alemana. El fuero corresponde al domicilio social de la empresa."
      },
      {
        "title": "Cambios en los Términos",
        "content": "Los cambios se notificarán a través de la aplicación o por correo electrónico."
      },
      {
        "title": "Cláusula de salvedad",
        "content": "Si alguna cláusula resulta inválida, el resto de los Términos seguirá siendo válido."
      }
    ]
  },
  {
    "title": "Multilingüismo",
    "icon": "globe",
    "subsections": [
      {
        "title": "Idioma legalmente vinculante",
        "content": "En caso de duda, prevalece la versión en alemán."
      },
      {
        "title": "Notificaciones por idioma",
        "content": "Los cambios en los Términos se mostrarán en todos los idiomas compatibles de la app."
      }
    ]
  },
  {
    "title": "Características especiales",
    "icon": "star",
    "subsections": [
      {
        "title": "Funciones comunitarias",
        "content": "Los módulos pueden crearse, copiarse y denunciarse."
      },
      {
        "title": "Funciones de IA",
        "content": "La IA se utiliza solo cuando el usuario la selecciona explícitamente (por ejemplo, 'Crear con IA')."
      }
    ]
  }
]




}


const Policys = () => {
  const { language } = useGlobalContext()  
  const correctLanguage = language ? language == "SPANISH" ? "SPANISH" :  "ENGLISH" : "DEUTSCH";
  const sections = allSections[correctLanguage] || allSections["DEUTSCH"];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedSubIndex, setExpandedSubIndex] = useState<{ [key: number]: number | null }>({});

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
    if (expandedIndex === index) {
      setExpandedSubIndex((prev) => ({ ...prev, [index]: null }));
    }
  };

  const toggleSubSection = (sectionIndex: number, subIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSubIndex((prev) => ({
      ...prev,
      [sectionIndex]: prev[sectionIndex] === subIndex ? null : subIndex,
    }));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#0c111d',
        flexGrow: 1,
      }}

    >
      <View className="w-full flex-row items-center justify-between pt-4 mb-4">
        <TouchableOpacity className='mr-2' onPress={() => router.push("/profil")}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          {correctLanguage == "DEUTSCH" ? "Richtlinien & Informationen" : correctLanguage == "SPANISH" ? "Políticas e Información" : "Policies & Information" }
        </Text>
        <View style={{ width: 20 }} />
      </View>
      <View style={{ width: '100%', maxWidth: 700, height: '100%' }}>
        {sections.map((section, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              style={{
                backgroundColor: '#1e293b',
                padding: 14,
                borderRadius: !(expandedIndex === index) ? 12 : null,
                borderTopLeftRadius: expandedIndex === index ? 12 : null,
                borderTopRightRadius: expandedIndex === index ? 12 : null,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Icon name={section.icon} size={20} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '600',
                  marginLeft: 10,
                }}
              >
                {section.title}
              </Text>
            </TouchableOpacity>

            {expandedIndex === index && (
              <View
                style={{
                  backgroundColor: '#334155',
                  padding: 14,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                {section.subsections.map((sub, subIndex) => (
                  <View key={subIndex} style={{ marginBottom: 10 }}>
                    <TouchableOpacity
                      onPress={() => toggleSubSection(index, subIndex)}
                      style={{
                        backgroundColor: '#475569',
                        padding: 10,
                        borderRadius:
                          expandedSubIndex[index] === subIndex ? 0 : 8,
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: 18,
                        }}
                      >
                        {sub.title}
                      </Text>
                    </TouchableOpacity>

                    {expandedSubIndex[index] === subIndex && (
                      <View
                        style={{
                          backgroundColor: '#647488',
                          padding: 10,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                        }}
                      >
                        <Text style={{ color: 'white', fontSize:15, fontWeight: '500' }}>{sub.content}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Policys;
