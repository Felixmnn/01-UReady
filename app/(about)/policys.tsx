import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const sections = [
  {
    title: 'Datenschutz',
    icon: 'shield-alt',
    subsections: [
    {
      title: 'Einleitung & Geltungsbereich',
      content: `Wir erheben Daten, um dir das bestmögliche Nutzererlebnis zu bieten. Im Folgenden erläutern wir, welche Daten wir wann, wo und wie erheben, mit wem wir diese teilen und warum es für dich vorteilhaft ist, diese Daten zu teilen.
Die App Q-Ready sowie die Web App Q-Ready fallen unter diese Datenschutzerklärung.`,
    },
    {
      title: 'Erhobene Daten',
      content: `- Zeitpunkt des Einloggens, um Streaks und Energie zu verfolgen
- Status der Fragen in Modulen (wird beim Löschen des Moduls ebenfalls gelöscht)
- Indirekt: Module, Fragen, Notizen und Dateien, die du erstellt hast
- Gekaufte Shop-Items`,
    },
    {
      title: 'Daten, die du selbst eingibst',
      content: `- Name, E-Mail, Passwort zur Registrierung
- Sprache, Wohnland
- Je nach Bildungsform:
  - Universität: Name, Fächer, angestrebter Abschluss
  - Schule: Region, Schulform, Stufe, Fächer
  - Ausbildung: Ausbildungskategorie, Fach
  - Sonstiges: Fächer
- Darkmode/Lightmode-Einstellung
- Erstellte Module, Fragen und Kontaktanfragen`,
    },
    {
      title: 'Cookies',
      content: `Wir verwenden Cookies, um deine Anmeldedaten auf deinem Gerät zu speichern, damit du dein Passwort nicht bei jedem Login neu eingeben musst.`,
    },
    {
      title: 'Zweck der Datenerhebung',
      content: `Wir erheben diese Daten, um die Funktion der App zu ermöglichen. Deine Bildungsziele helfen uns, passende neue Module vorzuschlagen. Die Zuordnung deiner erstellten Daten sichert die korrekte Nutzererfahrung.`,
    },
    {
      title: 'Rechtsgrundlage',
      content: `Die Rechtsgrundlage ist in der Regel deine Einwilligung, der Vertrag oder ein berechtigtes Interesse.`,
    },
    {
      title: 'Verwendung von Drittanbietern',
      content: `- OpenAI zur Unterstützung bei der Erstellung von Fragen
- Appwrite für sichere und schnelle Datenverwaltung`,
    },
    {
      title: 'Datenweitergabe & Empfänger',
      content: `- Werden Daten an Dritte weitergegeben? Nein.
- Datenübertragung in Länder: Deutschland.`,
    },
    {
      title: 'Speicherdauer',
      content: `Wir speichern deine Daten, bis du sie löscht. Du kannst deine Daten über die entsprechenden Funktionen oder durch Löschen deines Accounts entfernen.`,
    },
    {
      title: 'Deine Rechte als Nutzer:in',
      content: `Du kannst deine erstellten Daten jederzeit löschen. Bitte beachte, dass kopierte Daten anderer Nutzer davon ausgenommen sind.`,
    },
    {
      title: 'Sicherheit',
      content: `Appwrite sorgt für Datensicherung und Zugriffsbeschränkungen.`,
    },
    {
      title: 'Änderungen dieser Datenschutzerklärung',
      content: `Änderungen werden per E-Mail mitgeteilt.`,
    },
    {
      title: 'Kontakt & Verantwortlicher',
      content: `Hier stehen Name, Adresse und E-Mail des Verantwortlichen sowie ggf. des Datenschutzbeauftragten.`,
    },
  ],
  },
  {
    title: 'Nutzungsbedingungen',
    icon: 'file-alt',
    subsections:[
  {
    title: "Geltungsbereich",
    content: "Diese Nutzungsbedingungen gelten für die Nutzung der Study Smarter App (im Folgenden „App“ genannt) sowie aller damit verbundenen Dienste und Webseiten. Mit der Nutzung erklärst du dich mit diesen Bedingungen einverstanden."
  },
  {
    title: "Vertragsgegenstand",
    content: "Die App bietet dir Funktionen zur Unterstützung beim Lernen, wie z.B. das Erstellen und Verwalten von Lernmaterialien, interaktive Übungsaufgaben, Fortschrittsanalysen und weitere Lernhilfen."
  },
  {
    title: "Registrierung und Nutzerkonto",
    content: `- Um die App nutzen zu können, musst du dich registrieren und ein Nutzerkonto anlegen.  
- Du bist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen.  
- Du bist für die Sicherheit deines Kontos verantwortlich und darfst deine Zugangsdaten nicht an Dritte weitergeben.`
  },
  {
    title: "Nutzung der App",
    content: `- Du verpflichtest dich, die App ausschließlich für legale Zwecke und in Übereinstimmung mit diesen Nutzungsbedingungen zu verwenden.  
- Du darfst keine Inhalte hochladen oder verbreiten, die rechtswidrig, beleidigend, diskriminierend oder anstößig sind.  
- Es ist untersagt, die App für kommerzielle Zwecke ohne vorherige schriftliche Zustimmung zu nutzen.`
  },
  {
    title: "Leistungen des Anbieters",
    content: `- Wir bemühen uns, die App rund um die Uhr verfügbar zu halten. Eine ununterbrochene Verfügbarkeit kann jedoch nicht garantiert werden.  
- Wir behalten uns das Recht vor, die Funktionen der App jederzeit zu ändern, zu erweitern oder einzuschränken.`
  },
  {
    title: "Geistiges Eigentum",
    content: `- Alle Inhalte der App, einschließlich Texte, Grafiken, Software und Marken, sind urheberrechtlich geschützt und dürfen ohne unsere ausdrückliche Zustimmung nicht verwendet werden.  
- Nutzer behalten an eigenen erstellten Inhalten die Rechte, räumen uns jedoch ein einfaches, weltweites Nutzungsrecht zur Bereitstellung der App ein.`
  },
  {
    title: "Haftung",
    content: `- Wir haften nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen.  
- Für Datenverluste empfehlen wir regelmäßige Sicherungen.  
- Die App wird ohne Garantie auf Fehlerfreiheit und Verfügbarkeit bereitgestellt.`
  },
  {
    title: "Datenschutz",
    content: "Informationen zur Verarbeitung deiner personenbezogenen Daten findest du in unserer Datenschutzerklärung. Mit der Nutzung stimmst du der Verarbeitung deiner Daten gemäß der Datenschutzerklärung zu."
  },
  {
    title: "Kündigung und Sperrung",
    content: `- Du kannst dein Nutzerkonto jederzeit selbst löschen.  
- Wir behalten uns das Recht vor, Nutzerkonten bei Verstößen gegen diese Nutzungsbedingungen zu sperren oder zu löschen.`
  },
  {
    title: "Änderungen der Nutzungsbedingungen",
    content: `- Wir können diese Nutzungsbedingungen jederzeit ändern.  
- Über Änderungen wirst du rechtzeitig informiert. Deine weitere Nutzung gilt als Zustimmung.`
  },
  {
    title: "Anwendbares Recht und Gerichtsstand",
    content: `- Es gilt deutsches Recht.  
- Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis ist, soweit zulässig, unser Geschäftssitz.`
  },
  {
    title: "Kontakt",
    content: "Bei Fragen kannst du uns unter [E-Mail-Adresse] erreichen."
  }
]
  },
  {
    title: 'Impressum',
    icon: 'info-circle',
    subsections:[
  {
    title: "Anbieter / Verantwortlicher",
    content: `Max Mustermann  
Musterstraße 1  
12345 Musterstadt  
Deutschland`
  },
  {
    title: "Kontakt",
    content: `Telefon: +49 123 456789  
E-Mail: kontakt@mustermann.de  
Website: https://www.mustermann.de`
  },
  {
    title: "Handelsregister",
    content: `Eingetragen im Handelsregister: Musterstadt  
Handelsregisternummer: HRB 123456`
  },
  {
    title: "Umsatzsteuer-ID",
    content: `Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE123456789`
  },
  {
    title: "Aufsichtsbehörde",
    content: `Bezeichnung und Anschrift der zuständigen Aufsichtsbehörde, falls erforderlich`
  },
  {
    title: "Haftungshinweis",
    content: `Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.`
  },
  {
    title: "Verantwortlicher für den Inhalt nach § 55 Abs. 2 RStV",
    content: `Max Mustermann  
Musterstraße 1  
12345 Musterstadt`
  }
]
  },
  {
    title: 'Cookies',
    icon: 'cookie',
    subsections: [
  {
    title: "Was sind Cookies?",
    content: `Cookies sind kleine Textdateien, die auf deinem Endgerät gespeichert werden, wenn du unsere App oder Webseite nutzt. Sie helfen uns, die Nutzererfahrung zu verbessern und bestimmte Funktionen zu ermöglichen.`
  },
  {
    title: "Welche Cookies verwenden wir?",
    content: `Wir verwenden sowohl notwendige Cookies, die für die Grundfunktionen der App erforderlich sind, als auch funktionale Cookies, um dir ein besseres Nutzererlebnis zu bieten.`
  },
  {
    title: "Cookies von Drittanbietern",
    content: `Unsere App nutzt Dienste von Drittanbietern, die ebenfalls Cookies setzen können. Im Folgenden findest du Informationen zu den wichtigsten Drittanbietern:`
  },
  {
    title: "Appwrite",
    content: `Appwrite wird für die sichere Speicherung und Verwaltung deiner Daten genutzt. Appwrite setzt Cookies, um Authentifizierungsprozesse zu gewährleisten und die Sicherheit deiner Daten zu schützen. Diese Cookies sind essenziell für den Betrieb der App.`
  },
  {
    title: "Wie kannst du Cookies verwalten?",
    content: `Du kannst die Speicherung von Cookies in den Einstellungen deines Geräts oder Browsers kontrollieren und teilweise auch deaktivieren. Bitte beachte jedoch, dass dadurch wesentliche Funktionen der App eingeschränkt werden.`
  },
  {
    title: "Änderungen dieser Cookie-Richtlinie",
    content: `Wir behalten uns vor, diese Cookie-Richtlinie anzupassen. Änderungen werden wir in der App bekannt geben.`
  }
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
