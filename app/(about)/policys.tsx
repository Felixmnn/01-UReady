import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const sections = [
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
];


const Policys = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedSubIndex, setExpandedSubIndex] = useState<{ [key: number]: number | null }>({});

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
    // Wenn ein Hauptabschnitt geschlossen wird, alle Unterabschnitte schließen
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
      <View className="w-full flex-row items-center justify-between p-4 mb-4">
        <TouchableOpacity onPress={() => router.push("/profil")}>
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
          Richtlinien & Informationen
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
