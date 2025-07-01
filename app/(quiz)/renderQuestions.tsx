import { View, Text, ScrollView, FlatList, Image } from 'react-native'
import React from 'react'
import { BlockMath } from 'react-katex';


const renderQuestions = () => {
const varLatex = "\\begin{array}{l|r} \\text{Partei / Variable} & \\text{Wert} \\\\ \\hline CDU / \\hat{y}_i & 6.096 \\\\ CDU / \\hat{y}_i & 0.563 \\\\ CDU / \\bar{y} & 0.046 \\\\ SPD / \\hat{y}_i & 4.473 \\\\ SPD / \\hat{y}_i & 7.578 \\\\ SPD / \\bar{y} & 1.060 \\\\ SPD / y_i & 2.045 \\\\ SPD / \\hat{y}_i & 0.227 \\\\ SPD / \\bar{y} & 0.048 \\\\ SPD / y_i & 0.517 \\\\ SPD / y_i & 0.833 \\\\ SPD / y_i & 1.997 \\\\ GRÜNE /  & 4.547 \\\\ GRÜNE /  & 0.986 \\\\ GRÜNE /  & 2.997 \\\\ GRÜNE /  & 3.983 \\\\ LINKE /  & 2.680 \\\\ LINKE /  & 2.853 \\\\ LINKE /  & 1.570 \\\\ LINKE /  & 1.283 \\\\ CSU /  & 6.452 \\\\ AfD /  & 6.911 \\\\ AfD /  & 0.919 \\\\ AfD /  & 1.378 \\\\ AfD /  & 0.252 \\\\ AfD /  & 1.539 \\\\ AfD /  & 0.667 \\\\ AfD /  & 2.917 \\\\ \\end{array}";

const exampleQuestions = 
[
{
    "question": "Welche der folgenden Aussagen über unabhängige Variablen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "In der Datenanalyse werden Kontrollvariablen verwendet, um Scheinkorrelationen zwischen der abhängigen und den unabhängigen Variablen auszuschließen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Statistisch gesprochen sind unabhängige Variablen und Kontrollvariablen identisch.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei der Datenanalyse besteht das theoretische Interesse am Zusammenhang zwischen den unabhängigen Variablen und den Kontrollvariablen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei der Datenanalyse besteht das theoretische Interesse am Zusammenhang zwischen den unabhängigen Variablen und der abhängigen Variable.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0,1, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über standardisierte Regressionskoeffizienten treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Standardisierte Regressionskoeffizienten hängen von der Messdimension der abhängigen Variablen ab.",
        "latex": "",
        "image": null
      },
      {
        "title": "Standardisierte Regressionskoeffizienten hängen von der Messdimension der unabhängigen Variablen ab.",
        "latex": "",
        "image": null
      },
      {
        "title": "Standardisierte Regressionskoeffizienten werden berechnet, um Effektstärken vergleichen zu können.",
        "latex": "",
        "image": null
      },
      {
        "title": "Unstandardisierte Regressionskoeffizienten sind inhaltlich schwerer zu interpretieren als standardisierte Regressionskoeffizienten.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [2]
  },
  {
    "question": "Welche der folgenden Aussagen über die Anwendungsvoraussetzungen einer linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Es sollte ein möglichst hoher statistischer Zusammenhang zwischen den unabhängigen Variablen bestehen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Varianz der Residuen sollte möglichst unabhängig von den Vorhersagewerten der Regression sein.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Residuen einer Regression sollten möglichst normalverteilt sein.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Residuen einer Regression sollten möglichst nicht miteinander korrelieren.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über die Regressionsdiagnostik treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Mit der Regressionsdiagnostik werden die Anwendungsvoraussetzungen der linearen Regression geprüft.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Regressionsdiagnostik wird vor der Regressionsanalyse durchgeführt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Es können Maßnahmen zur Verbesserung der Anwendungsvoraussetzungen der linearen Regression getroffen werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Regressionsdiagnostik stützt sich zu weiten Teilen auf statistische Maßzahlen.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 2]
  },
  {
    "question": "Welche der folgenden Aussagen über die Linearität in der multiplen linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Die Regressionsanalyse setzt einen linearen Zusammenhang zwischen den unabhängigen Variablen und der abhängigen Variable voraus.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Linearität kann mit Streudiagrammen der abhängigen und der unabhängigen Variablen überprüft werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei einer multiplen linearen Regression können die Drittvariablen einen Einfluss auf die Form des Zusammenhangs zwischen einer unabhängigen und der abhängigen Variable haben.",
        "latex": "",
        "image": null
      },
      {
        "title": "Um die Form des Zusammenhangs zwischen einer unabhängigen und der abhängigen Variable in einer multiplen linearen Regression zu prüfen, kann der Effekt der Drittvariablen aus beiden Variablen herausgerechnet werden.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 1, 2, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über die Multikollinearität in der multiplen linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Zur Prüfung der Multikollinearität kann eine Korrelationsmatrix verwendet werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Mithilfe der Toleranz wird der Varianzanteil der abhängigen Variable berechnet, der durch die Drittvariablen erklärt werden kann.",
        "latex": "",
        "image": null
      },
      {
        "title": "Je höher der Toleranzwert, desto höher die Multikollinearität.",
        "latex": "",
        "image": null
      },
      {
        "title": "Eine Möglichkeit zum Umgang mit Multikollinearität besteht in der Zusammenfassung der betroffenen Variablen zu einem Index.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über Interaktionen in der multiplen linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei einer Interaktion wird der Effekt einer unabhängigen Variable auf die abhängige Variable durch eine weitere abhängige Variable beeinflusst.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei einer Interaktion werden die zu interagierenden Variablen multipliziert und als weiterer Regressionsterm in die Regressionsgleichung aufgenommen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei einer Interaktion wird in der Regel nur der multiplizierte Term in die Regressionsgleichung aufgenommen, nicht die beiden Haupteffekte.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Regressionskoeffizienten von interagierten Variablen sind keine konditionalen, sondern partielle Regressionseffekte.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1]
  },
  {
    "question": "Welche der folgenden Aussagen über Mittelwertzentrierungen und Interaktionen in der multiplen linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Die Multikollinearität in Regressionsmodellen mit Interaktionstermen nimmt im Regelfall ab.",
        "latex": "",
        "image": null
      },
      {
        "title": "Durch eine Mittelwertzentrierung der interagierten Variablen nach Berechnung der Interaktion kann die Multikollinearität häufig verringert werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Haupteffekte von mittelwertzentrierten, interagierten Variablen geben die Effektstärke an, wenn die jeweils andere Variable eine durchschnittliche Ausprägung aufweist.",
        "latex": "",
        "image": null
      },
      {
        "title": "Zur Mittelwertzentrierung werden Variablen durch ihre Standardabweichung geteilt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [ 2]
  },
  {
    "question": "Welche der folgenden Aussagen über Semipartialkorrelationen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Semipartialkorrelationen beschreiben die Korrelation zwischen einer um den Effekt von Drittvariablen bereinigten unabhängigen Variable und einer um den Effekt von Drittvariablen bereinigten abhängigen Variable im Kontext einer multiplen linearen Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Semipartialkorrelationen beschreiben die Korrelation zwischen einer um den Effekt von Drittvariablen bereinigten abhängigen Variable und einer um den Effekt von Drittvariablen nicht bereinigten unabhängigen Variable im Kontext einer multiplen linearen Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Semipartialkorrelationen können im Kontext von multiplen linearen Regressionen berechnet werden, um den eigenständigen Erklärungsbeitrag einer unabhängigen Variable zu untersuchen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Semipartialkorrelationen können im Kontext von multiplen linearen Regressionen berechnet werden, um den gemeinsamen Erklärungsbeitrag der unabhängigen Variablen zu untersuchen.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [2]
  },
  {
    "question": "Welche der folgenden Aussagen über den F-Test einer multiplen linearen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Mithilfe eines F-Tests wird überprüft, ob die Erklärungsleistung eines Regressionsmodells in der Stichprobe von 0 verschieden ist.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Teststatistik des F-Tests folgt einer 2-Verteilung.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Teststatistik des F-Tests folgt einer t-Verteilung.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Freiheitsgrade eines F-Tests hängen von der Zahl der Modellparameter ab.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [3]
  },
  {
    "question": "Welche der folgenden Aussagen über den korrigierten Determinationskoeffizienten treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Der korrigierte Determinationskoeffizient wird auf Grundlage der erklärten Varianz eines Regressionsmodells berechnet.",
        "latex": "",
        "image": null
      },
      {
        "title": "Je mehr unabhängige Variablen in ein Regressionsmodell aufgenommen werden, desto geringer fällt r² aus.",
        "latex": "",
        "image": null
      },
      {
        "title": "Je mehr abhängige Variablen in ein Regressionsmodell aufgenommen werden, desto geringer fällt r² aus.",
        "latex": "",
        "image": null
      },
      {
        "title": "Der korrigierte Determinationskoeffizient hängt von der Zahl der Modellparameter ab.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über den t-Test eines Regressionskoeffizienten trifft zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Mit einem einseitigen t-Test wird untersucht, ob ein Regressionsparameter in der Grundgesamtheit von 0 verschieden ist.",
        "latex": "",
        "image": null
      },
      {
        "title": "Mit einem zweiseitigen t-Test wird untersucht, ob ein Regressionsparameter in der Grundgesamtheit von 0 verschieden ist.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Teststatistik des t-Tests wird berechnet, indem der Wert des Regressionskoeffizienten durch den zugehörigen Standardfehler geteilt wird.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Rückweisungswerte des t-Tests hängen von der Zahl der Parameter im Regressionsmodell ab.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2,3]
  },
  {
    "question": "Welche der folgenden Aussagen über Konfidenzintervalle von Regressionskoeffizienten treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Wenn das Konfidenzintervall eines Regressionskoeffizienten den Wert 0 umfasst, dann kann mit einer gewissen Irrtumswahrscheinlichkeit die Nullhypothese zurückgewiesen werden, dass der wahre Parameterwert gleich 0 ist.",
        "latex": "",
        "image": null
      },
      {
        "title": "Je höher die angesetzte Irrtumswahrscheinlichkeit, desto breiter sind die Konfidenzintervalle.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Regressionsparameter sind erwartungstreue Punktschätzer der Regressionsparameter in der Grundgesamtheit.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Regressionsparameter sind erwartungstreue Intervallschätzer der Regressionsparameter in der Grundgesamtheit.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [2]
  },{
    "question": "Welche der folgenden Aussagen über Variablentransformationen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Zähldaten werden häufig logarithmiert.",
        "latex": "",
        "image": null
      },
      {
        "title": "Unabhängige Variablen in einer Regressionsanalyse sollten nicht transformiert werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Abhängige Variablen in einer Regressionsanalyse sollten nicht transformiert werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Variablen können transformiert werden, um die Anwendungsvoraussetzungen der Regressionsanalyse zu gewährleisten.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Für welche Arten von abhängigen Variablen werden logistische Regressionen verwendet?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Metrische Variablen",
        "latex": "",
        "image": null
      },
      {
        "title": "Dichotome Variablen",
        "latex": "",
        "image": null
      },
      {
        "title": "Zählvariablen",
        "latex": "",
        "image": null
      },
      {
        "title": "Unabhängige Variablen",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1]
  },
  {
    "question": "Warum werden logistische Regressionen statt linearer Regressionen für dichotome Variablen verwendet?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Weil es mathematisch nicht möglich ist, eine lineare Regression für dichotome Variablen zu berechnen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Weil logistische Regressionsmodelle eine bessere Varianzaufklärung für dichotome Variablen ermöglichen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Weil lineare Regressionen unzulässige Werte für dichotome Variablen vorhersagen können.",
        "latex": "",
        "image": null
      },
      {
        "title": "Weil dichotome Variablen die Modellannahmen von linearen Regressionen verletzen.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [2, 3]
  },
  {
    "question": "Welche der folgenden Variablen können mit einer logistischen Regression analysiert werden?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Wahlbeteiligung (Ja, Nein)",
        "latex": "",
        "image": null
      },
      {
        "title": "Wahlentscheidung (CDU/CSU, SPD, Grüne, FDP, Die Linke, AfD, Andere Partei)",
        "latex": "",
        "image": null
      },
      {
        "title": "Links-Rechts-Selbsteinstufung auf einer 11-stufigen Skala",
        "latex": "",
        "image": null
      },
      {
        "title": "Politisches Interesse (Niedrig, Hoch)",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über logistische Regressionen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Die abhängige Variable einer logistischen Regression ist die Wahrscheinlichkeit, dass Y den Wert 1 annimmt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Der Wertebereich der Wahrscheinlichkeit, dass Y den Wert 1 annimmt, liegt zwischen 0 und 1.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Wahrscheinlichkeit, dass Y den Wert 1 annimmt, wird auch Logit genannt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die logistische Regression ist ein Beispiel einer nicht-linearen Regression.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },{
    "question": "Welche der folgenden Aussagen über die Koeffizienten einer logistischen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Logitkoeffizienten geben die Veränderung der logarithmierten Odds an, wenn die unabhängige Variable um einen Skalenpunkt ansteigt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Effektkoeffizienten geben die Veränderung der logarithmierten Odds an, wenn die unabhängige Variable um einen Skalenpunkt ansteigt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Logitkoeffizienten geben die multiplikative Veränderung der Odds an, wenn die unabhängige Variable um einen Skalenpunkt ansteigt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Effektkoeffizienten geben die multiplikative Veränderung der Odds an, wenn die unabhängige Variable um einen Skalenpunkt ansteigt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über die Koeffizienten einer logistischen Regression treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Ein negativer Logitkoeffizient bedeutet, dass P(Y = 1) abnimmt, wenn der Wert der unabhängigen Variable zunimmt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Ein negativer Effektkoeffizient bedeutet, dass P(Y = 1) abnimmt, wenn der Wert der unabhängigen Variable zunimmt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Ein Logitkoeffizient von 1 bedeutet, dass P(Y = 1) zunimmt, wenn der Wert der unabhängigen Variable zunimmt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Ein Effektkoeffizient von 1 bedeutet, dass P(Y = 1) zunimmt, wenn der Wert der unabhängigen Variable zunimmt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 2]
  },
  {
    "question": "Welche der folgenden Aussagen über Maximum Likelihood treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Mithilfe von Maximum Likelihood können die Koeffizienten von Regressionsmodellen bestimmt werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Likelihoods von zwei Modellen auf Basis der gleichen Stichprobe können verglichen werden, um das besser an die Stichprobe angepasste Modell auszuwählen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Likelihoods sind von der Größe der Stichprobe unabhängig.",
        "latex": "",
        "image": null
      },
      {
        "title": "Die Devianz entspricht der doppelten negativen Log-Likelihood.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 1, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über die Modellanpassung von logistischen Regressionen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Mithilfe von R² kann die Varianzaufklärung in der abhängigen Variable durch eine logistische Regression bestimmt werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Für die logistische Regression gibt es mehrere Pseudo-R²-Werte.",
        "latex": "",
        "image": null
      },
      {
        "title": "Pseudo-R²-Werte werden durch einen Vergleich der Likelihood des Vollmodells mit der Likelihood des Nullmodells bestimmt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Das Nullmodell zur Berechnung eines Pseudo-R²-Werts sollte im Idealfall zehn oder weniger Parameter beinhalten.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2]
  },
  {
    "question": "Welche der folgenden Aussagen über Likelihood Ratio-Tests treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Der Likelihood Ratio-Test dient zur Prüfung der statistischen Signifikanz einzelner Parameterwerte.",
        "latex": "",
        "image": null
      },
      {
        "title": "Mithilfe eines Likelihood Ratio-Tests kann untersucht werden, ob die Likelihood einer logistischen Regression signifikant besser an die Daten angepasst ist als das Nullmodell.",
        "latex": "",
        "image": null
      },
      {
        "title": "Der Likelihood Ratio-Test ist \\( \\chi^2 \\)-verteilt, wobei die Freiheitsgrade der Differenz der Parameterzahl zwischen dem Voll- und dem Nullmodell entsprechen.",
        "latex": "",
        "image": null
      },
      {
        "title": "Der Likelihood Ratio-Test unterstellt eine Irrtumswahrscheinlichkeit von fünf Prozent.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2]
  },
  {
    "question": "Welche der folgenden Variablen eignen sich als abhängige Variable für eine multinomiale logistische Regression?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Wahlentscheidung (CDU/CSU, SPD, Grüne, FDP, Die Linke, AfD, Andere Partei)",
        "latex": "",
        "image": null
      },
      {
        "title": "Länge der Parteimitgliedschaft (in Jahren)",
        "latex": "",
        "image": null
      },
      {
        "title": "Kategorisiertes Haushaltsnettoeinkommen (0–2.000 €, 2.000–4.000 €, 4.000–6.000 €, über 6.000 €)",
        "latex": "",
        "image": null
      },
      {
        "title": "Politisches Wissen (Niedrig, Mittel, Hoch)",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 2, 3]
  },
  {
    "question": "Welche der folgenden Variablen eignen sich als abhängige Variable für eine konditionale logistische Regression?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Wahlentscheidung (CDU/CSU, SPD, Grüne, FDP, Die Linke, AfD, Andere Partei)",
        "latex": "",
        "image": null
      },
      {
        "title": "Länge der Parteimitgliedschaft (in Jahren)",
        "latex": "",
        "image": null
      },
      {
        "title": "Kategorisiertes Haushaltsnettoeinkommen (0–2.000 €, 2.000–4.000 €, 4.000–6.000 €, über 6.000 €)",
        "latex": "",
        "image": null
      },
      {
        "title": "Politisches Wissen (Niedrig, Mittel, Hoch)",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 2 , 3]
  },
  {
    "question": "Welche der folgenden Variablen eignen sich als abhängige Variable für eine ordinale logistische Regression?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Wahlentscheidung (CDU/CSU, SPD, Grüne, FDP, Die Linke, AfD, Andere Partei)",
        "latex": "",
        "image": null
      },
      {
        "title": "Länge der Parteimitgliedschaft (in Jahren)",
        "latex": "",
        "image": null
      },
      {
        "title": "Kategorisiertes Haushaltsnettoeinkommen (0–2.000 €, 2.000–4.000 €, 4.000–6.000 €, über 6.000 €)",
        "latex": "",
        "image": null
      },
      {
        "title": "Politisches Wissen (Niedrig, Mittel, Hoch)",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 2, 3]
  },
  {
    "question": "Welche der folgenden Aussagen über Regressionsmodelle für polytome abhängige Variablen treffen zu?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei einer multinomialen logistischen Regression werden J + 1 Gleichungen für die J Ausprägungen der unabhängigen Variable spezifiziert.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei einer konditionalen logistischen Regression werden J − 1 Gleichungen für die J Ausprägungen der unabhängigen Variable spezifiziert.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei einer multinomialen logistischen Regression können zusätzlich zu individuellen Variablen auch alternativenspezifische Variablen berücksichtigt werden.",
        "latex": "",
        "image": null
      },
      {
        "title": "Alternativenspezifische Variablen bei einer konditionalen logistischen Regression können so spezifiziert werden, dass entweder ein generischer Parameter für alle Ausprägungen der abhängigen Variable geschätzt wird oder unterschiedliche Parameter für die verschiedenen Ausprägungen der abhängigen Variable geschätzt werden.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [ 3]
  },
  {
    "question": "Welche der Aussagen über das folgende Regressionsmodell mit einer individuellen unabhängigen Variable treffen zu?",
    "questionLatex": "P(Y = j \\mid X)= \\frac{e^{\\beta_{j,0} + \\beta_{j,1}X}}{1 + \\sum_{j=1}^{J-1} e^{\\beta_{j,0} + \\beta_{j,1}X}} \\ \\  für \\ j = 1,2, J - 1 \\\\ \\quad P(Y = J \\mid X) = \\frac{1}{1 + \\sum_{j=1}^{J-1} e^{\\beta_{j,0} + \\beta_{j,1}X}}",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei dem Modell handelt es sich um eine multinomiale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell handelt es sich um eine konditionale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Für jede Ausprägung der alternativenspezifischen Variable wird ein unterschiedlicher Parameter geschätzt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Es werden mehrere Parameter für die individuelle Variable geschätzt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der Aussagen über das folgende Regressionsmodell mit einer individuellen unabhängigen Variable treffen zu?",
    "questionLatex": "P(Y=1\\mid X)=\\frac{e^{\\beta_{1,0} + \\beta_{1,1}X}}{1 + e^{\\beta_{1,0} + \\beta_{1,1}X} + e^{\\beta_{2,0} + \\beta_{2,1}X}} \\\\ \\quad P(Y=2\\mid X)=\\frac{e^{\\beta_{2,0} + \\beta_{2,1}X}}{1 + e^{\\beta_{1,0} + \\beta_{1,1}X} + e^{\\beta_{2,0} + \\beta_{2,1}X}} \\\\ \\quad P(Y=3\\mid X)=\\frac{1}{1 + e^{\\beta_{1,0} + \\beta_{1,1}X} + e^{\\beta_{2,0} + \\beta_{2,1}X}}",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei dem Modell handelt es sich um eine multinomiale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell handelt es sich um eine konditionale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Für jede Ausprägung der alternativenspezifischen Variable wird ein unterschiedlicher Parameter geschätzt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Es werden mehrere Parameter für die individuelle Variable geschätzt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0, 3]
  },
  {
    "question": "Welche der Aussagen über das folgende Regressionsmodell mit einer alternativenspezifischen unabhängigen Variable treffen zu?",
    "questionLatex": "P(Y = j \\mid X_j) = \\frac{e^{\\beta_1 X_j}}{\\sum_{r=1}^{J} e^{\\beta_1 X_r}}",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei dem Modell handelt es sich um eine multinomiale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell handelt es sich um eine konditionale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell werden keine Konstanten geschätzt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell wird ein generischer Effekt für die alternativenspezifischen unabhängigen Variablen geschätzt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2, 3]
  },{
    "question": "Welche der Aussagen über das folgende Regressionsmodell mit einer alternativenspezifischen unabhängigen Variable treffen zu?",
    "questionLatex": "P(Y = 1 \\mid X_j) = \\frac{e^{\\beta_1 X_1}}{e^{\\beta_1 X_1} + e^{\\beta_1 X_2} + e^{\\beta_1 X_3}} \\\\ \\quad P(Y = 2 \\mid X_j) = \\frac{e^{\\beta_1 X_2}}{e^{\\beta_1 X_1} + e^{\\beta_1 X_2} + e^{\\beta_1 X_3}} \\\\ \\quad P(Y = 3 \\mid X_j) = \\frac{e^{\\beta_1 X_3}}{e^{\\beta_1 X_1} + e^{\\beta_1 X_2} + e^{\\beta_1 X_3}}",
    "questionUrl": "",
    "answers": [
      {
        "title": "Bei dem Modell handelt es sich um eine multinomiale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell handelt es sich um eine konditionale logistische Regression.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell werden keine Konstanten geschätzt.",
        "latex": "",
        "image": null
      },
      {
        "title": "Bei dem Modell wird ein generischer Effekt für die alternativenspezifischen unabhängigen Variablen geschätzt.",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [1, 2, 3]
  },
  {
    "question": "Wie viele Parameter werden in dem Modell aus Aufgabe 31 insgesamt geschätzt?",
    "questionLatex": "",
    "questionUrl": "",
    "answers": [
      {
        "title": "1",
        "latex": "",
        "image": null
      },
      {
        "title": "3",
        "latex": "",
        "image": null
      },
      {
        "title": "4",
        "latex": "",
        "image": null
      },
      {
        "title": "12",
        "latex": "",
        "image": null
      }
    ],
    "answerIndex": [0]
  },{
    "question": " Ihnen liegen die folgenden Ergebnisse von zwei Regressionsmodellen vor, bei der die Links-Rechts-Position (Y) von 168 westeuropäischen Parteien durch ihre wirtschaftspo litische (Xw), gesellschaftspolitische (Xg) und umweltpolitische (Xu) Position erklärt wird. Alle vier Variablen haben eine Skala von 0 bis 10, wobei hohe Werte jeweils der konserva tiven Position entsprechen. Geben Sie die Regressionsgleichung für Modell 1 an. Ersetzen Sie die Koeffizienten der Regressionsgleichung durch die passenden Parameterwerte aus der Tabelle.",
    "questionLatex": " \\begin{array}{c:c:c}  & Modell \\ 1 & Modell \\ 2 \\\\ \\hline Wirtschaftspolitik & 0.701 &  0.648 \\\\  Gesellschaftspolitik &  0.379 &  0.328 \\\\  Umweltpolitik &   &   0.133 \\\\  Konstante & 0.522  &   0.289 \\\\ \\hline r^2 & 0.868  &   0.872 \\\\  n & 168  & 168 \\end{array}", 
    "questionUrl": "",
    "answers": [
      {
        "title": "",
        "latex": "y_i = 0.522 + 0.701 x_{w,i} + 0.379 x_{g,i} + e_i",
        "image": null
      },
     
  {
    "title": "",
    "latex": "y_i = 0.701\\, x_{w,i} + 0.379\\, x_{g,i} + e_i",
    "image": null
  },
  {
    "title": "",
    "latex": "y_i = 0.522 + 0.701\\, x_{w,i} + 0.379\\, x_{g,i} + 0.133\\, x_{u,i} + e_i",
    "image": null
  }
    ],
    "answerIndex": [0]
  },
  {
    "question": "Welche der folgenden Aussagen über die Regressionsmodelle aus Aufgabe 33 treffen zu?",
    "questionLatex": " \\begin{array}{c:c:c}  & Modell \\ 1 & Modell \\ 2 \\\\ \\hline Wirtschaftspolitik & 0.701 &  0.648 \\\\  Gesellschaftspolitik &  0.379 &  0.328 \\\\  Umweltpolitik &   &   0.133 \\\\  Konstante & 0.522  &   0.289 \\\\ \\hline r^2 & 0.868  &   0.872 \\\\  n & 168  & 168 \\end{array}", 
    "questionUrl": "",
    "answers": [
        {
            "title": "86.8 Prozent der Varianz in der Links-Rechts-Position der Parteien können durch die wirtschafts- und gesellschaftspolitische Position erklärt werden.",
            "latex": "",
            "image": null
        },
        {
            "title": "Die umweltpolitische Position der Parteien erklärt 13.3 Prozent der Varianz in der abhängigen Variable.",
            "latex": "",   
            "image": null
        },
        {
            "title": "Modell 2 erklärt vier Prozent der Varianz in der abhängigen Variable zusätzlich im Vergleich zu Modell 1.",
            "latex": "",
            "image": null
        },
        {
            "title": "Die umweltpolitische Position leistet einen erheblichen Beitrag zur Varianzaufklärung in der abhängigen Variable.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [0]
  },
  {
    "question": " Ihnen liegt der folgende Quotient der Regressionskoeffizienten aus Modell 1 in Aufgabe 33 vor: bw/bg = 1.976. Wie ist dieser Wert zu interpretieren",
    "questionLatex": " \\begin{array}{c:c:c}  & Modell \\ 1 & Modell \\ 2 \\\\ \\hline Wirtschaftspolitik & 0.701 &  0.648 \\\\  Gesellschaftspolitik &  0.379 &  0.328 \\\\  Umweltpolitik &   &   0.133 \\\\  Konstante & 0.522  &   0.289 \\\\ \\hline r^2 & 0.868  &   0.872 \\\\  n & 168  & 168 \\end{array}", 
    "questionUrl": "",
    "answers": [
        {
            "title": " Die wirtschaftspolitische Position der Parteien erklärt etwa doppelt so viel Varianz in der abhängigen Variable wie die gesellschaftspolitische Position.",
            "latex": "",
            "image": null
        },
        {
            "title": "Die gesellschaftspolitische Position der Parteien erklärt etwa doppelt so viel Varianz in der abhängigen Variable wie die wirtschaftspolitische Position.",
            "latex": "",   
            "image": null
        },
        {
            "title": "Die wirtschaftspolitische Position hat einen etwa doppelt so starken Effekt auf die Links-Rechts-Position der Parteien wie die gesellschaftspolitische Position.",
            "latex": "",
            "image": null
        },
        {
            "title": "Die gesellschaftspolitische Position hat einen etwa doppelt so starken Effekt auf die Links-Rechts-Position der Parteien wie die wirtschaftspolitische Position.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [2]
  },
  {
    "question": " Sie berechnen den Erklärungsbeitrag der einzelnen Variablen aus Modell 2 in Aufgabe 33, indem Sie drei Modelle jeweils ohne eine der drei unabhängigen Variablen berechnen und die Differenz in der Erklärungsleistung der Modelle mit der Erklärungsleistung von Modell 2 vergleichen. Welche der folgenden Aussagen über das Ergebnis treffen zu?",
    "questionLatex": "\\begin{array}{l|c|c|c} & \\text{Vollmodell} & \\text{Modell ohne Variable} & \\Delta \\\\ \\hline \\text{Wirtschaftspolitik } (X_w) & 0.872 & 0.697 & 0.175 \\\\ \\text{Gesellschaftspolitik } (X_g) & 0.872 & 0.823 & 0.049 \\\\ \\text{Umweltpolitik } (X_u) & 0.872 & 0.868 & 0.004 \\end{array}",
    "questionUrl": "",
    "answers": [
        {
            "title": "Von den drei Variablen weist die wirtschaftspolitische Position den größten eigenständigen Erklärungsbeitrag auf.",
            "latex": "",
            "image": null
        },
        {
            "title": " Die Überlappung der drei Variablen beträgt 0.644.",
            "latex": "",   
            "image": null
        },
        {
            "title": " Die Überlappung der drei Variablen beträgt 0.772.",
            "latex": "",
            "image": null
        },
        {
            "title": " Die Überlappung der drei Variablen entspricht der Summe der drei-Werte.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [0,1]
  },{
    "question": "",
    "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860e7650004f07de45b/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGU3ZjE1NWRjNjg5NmEwMDEiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGU3NjUwMDA0ZjA3ZGU0NWIiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc2IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk1N2UrMTh9._dc-1IcrqlBgV75XBOLcJzAUKgKEsQsNHOVukmLoQnw",
    "answers": [
        {
            "title": "Linearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Multikollinearität",
            "latex": "",   
            "image": null
        },
        {
            "title": "Varianzhomogenität",
            "latex": "",
            "image": null
        },
        {
            "title": " NormalverteilungderResiduen",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [0]
  },{
    "question": "Wenn wir von Linearität ausgehen, können was wäre dann die Interpreation der Diagramme?",
    "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860e7650004f07de45b/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGU3ZjE1NWRjNjg5NmEwMDEiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGU3NjUwMDA0ZjA3ZGU0NWIiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc2IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk1N2UrMTh9._dc-1IcrqlBgV75XBOLcJzAUKgKEsQsNHOVukmLoQnw",
    "answers": [
        {
            "title": "WennmandenEffektderDrittvariablennichtberücksichtigt, istvoneinerVerletzungderLinearitätsannahmeauszugehen",
            "latex": "",
            "image": null
        },
        {
            "title": " WennmandenEffektderDrittvariablenberücksichtigt, istvoneinerVerletzung derLinearitätsannahmeauszugehen.",
            "latex": "",   
            "image": null
        },
        {
            "title": "WennmandenEffektderDrittvariablennichtberücksichtigt, istnichtvon einerVerletzungderLinearitätsannahmeauszugehen.",
            "latex": "",
            "image": null
        },
        {
            "title": "WennmandenEffektderDrittvariablenberücksichtigt, istnichtvoneinerVerletzungderLinearitätsannahmeauszugehen.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [2]
  },{
    "question": "Welchesder folgendenRegressionsmodellewürdenSieverwenden, umdenEffektder Drittvariablenaus Modell2 in Aufgabe 33 ausderwirtschaftspolitischen Variableheraus zurechnen(w=Wirtschaftspolitik,g=Gesellschaftspolitik,u=Umweltpolitik)?",
    "questionLatex": " \\begin{array}{c:c:c}  & Modell \\ 1 & Modell \\ 2 \\\\ \\hline Wirtschaftspolitik & 0.701 &  0.648 \\\\  Gesellschaftspolitik &  0.379 &  0.328 \\\\  Umweltpolitik &   &   0.133 \\\\  Konstante & 0.522  &   0.289 \\\\ \\hline r^2 & 0.868  &   0.872 \\\\  n & 168  & 168 \\end{array}", 
    "questionUrl": "",
    "answers": [
        {
            "title": "",
            "latex": "y_i = b_0 + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        },
        {
            "title": "",
            "latex": "x_{w,i} = b_0 + b_g x_{g,i} + b_u x_{u,i} + e_i",   
            "image": null
        },
        {
            "title": "",
            "latex": "y_i = b_0 + b_w x_{w,i} + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        },
        {
            "title": "",
            "latex": "x_{w,i} = b_0 + b_y y_i + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        }
    ],
    "answerIndex": [1]
  },{
    "question": " IhnenliegendiefolgendenStreudiagrammederumdenEffektderDrittvariablenbereinigtenunabhängigenundabhängigenVariablenausModell2inAufgabe33vor.Welche derfolgendenRegressionsannahmenkönnenmitdiesenAbbildungenüberprüftwerden?",
    "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860ee96001139410ec5/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGVlOWNiNmI1MDVkY2Y4OWIiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGVlOTYwMDExMzk0MTBlYzUiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc3IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk2ZSsxOH0.bt92-v5uMEMib27lwQ9obeT5CiRRk4ha5V6BSgBqNBQ",
    "answers": [
        {
            "title": "Linearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Multikollinearität",
            "latex": "",   
            "image": null
        },
        {
            "title": "Varianzhomogenität",
            "latex": "",
            "image": null
        },
        {
            "title": " NormalverteilungderResiduen",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [0]
  },{
    "question": "Was ist Ihre Interpretation der Ergebnisse?",
    "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860ee96001139410ec5/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGVlOWNiNmI1MDVkY2Y4OWIiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGVlOTYwMDExMzk0MTBlYzUiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc3IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk2ZSsxOH0.bt92-v5uMEMib27lwQ9obeT5CiRRk4ha5V6BSgBqNBQ",
    "answers": [
        {
            "title": "Wenn man den Effekt der Drittvariablen nicht berücksichtigt, ist von einer Verletzung der Linearitätsannahme auszugehen.",
            "latex": "",
            "image": null
        },
        {
            "title": "Wenn man den Effekt der Drittvariablen berücksichtigt, ist von einer Verletzung der Linearitätsannahme auszugehen.",
            "latex": "",   
            "image": null
        },
        {
            "title": " Wenn man den Effekt der Drittvariablen nicht berücksichtigt, ist nicht von einer Verletzung der Linearitätsannahme auszugehen.",
            "latex": "",
            "image": null
        },
        {
            "title": " Wenn man den Effekt der Drittvariablen berücksichtigt, ist nicht von einer Verletzung der Linearitätsannahme auszugehen.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [3]
  },{
    "question": " Ihnen liegt die folgende Korrelationsmatrix der Variablen aus Aufgabe 33 vor. Tragen Sie die fehlenden Werte in die Tabelle in",
    "questionLatex": "\\begin{array}{l|c|c|c} & \\text{Wirtschaft } (X_w) & \\text{Gesellschaft } (X_g) & \\text{Umwelt } (X_u) \\\\ \\hline \\text{Wirtschaftspolitik } (X_w) & \\text{Wert 1} & \\text{Wert 2} & \\text{Wert 3} \\\\ \\text{Gesellschaftspolitik } (X_g) & 0.563 & \\text{Wert 4} & \\text{Wert 5} \\\\ \\text{Umweltpolitik } (X_u) & 0.734 & 0.735 & \\text{Wert 6} \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": "",
            "latex": "\\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 1 & 1.000 \\\\ 2 & 0.563 \\\\ 3 & 0.734 \\end{array} \\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 4 & 1.000 \\\\ 5 & 0.735 \\\\ 6 & 1.000 \\end{array}",
            "image": null
        },
        {
            "title": "",
            "latex": "\\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 1 & 1.000 \\\\ 2 & 0.563 \\\\ 3 & 0.734 \\end{array} \\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 4 & 1.000 \\\\ 5 & 0.735 \\\\ 6 & 1.000 \\end{array}",
            "image": null
        },
        {
            "title": "",
            "latex": "\\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 1 & 1.000 \\\\ 2 & 0.563 \\\\ 3 & 0.734 \\end{array} \\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 4 & 1.000 \\\\ 5 & 0.735 \\\\ 6 & 1.000 \\end{array}",
            "image": null
        },
        {
            "title": "",
            "latex": "\\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 1 & 1.000 \\\\ 2 & 0.563 \\\\ 3 & 0.734 \\end{array} \\begin{array}{c|c}  \\text{Wert} & \\text{Zahl} \\\\ \\hline 4 & 1.000 \\\\ 5 & 0.735 \\\\ 6 & 1.000 \\end{array}",
            "image": null
        }
    ],
    "answerIndex": [0]
  },{
    "question": " Welche der folgenden Regressionsannahmen können mit der Tabelle überprüft werden?",
     "questionLatex": "\\begin{array}{l|c|c|c} & \\text{Wirtschaft } (X_w) & \\text{Gesellschaft } (X_g) & \\text{Umwelt } (X_u) \\\\ \\hline \\text{Wirtschaftspolitik } (X_w) & 1.000 & 0.563 & 0.734 \\\\ \\text{Gesellschaftspolitik } (X_g) & 0.563 & 1.000 & 0.735 \\\\ \\text{Umweltpolitik } (X_u) & 0.734 & 0.735 & 1.000 \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": "Linearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Multikollinearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Varianzhomogenität",
            "latex": "",
            "image": null
        },
        {
            "title": "Normalverteilung der Residuen",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [1]
  },{
    "question": "Was ist Ihre Interpretation der Ergebnisse?",
     "questionLatex": "\\begin{array}{l|c|c|c} & \\text{Wirtschaft } (X_w) & \\text{Gesellschaft } (X_g) & \\text{Umwelt } (X_u) \\\\ \\hline \\text{Wirtschaftspolitik } (X_w) & 1.000 & 0.563 & 0.734 \\\\ \\text{Gesellschaftspolitik } (X_g) & 0.563 & 1.000 & 0.735 \\\\ \\text{Umweltpolitik } (X_u) & 0.734 & 0.735 & 1.000 \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": "Es besteht eine mittelstarke bis starke Korrelation zwischen den drei unabhängigen Variablen und der abhängigen Variable.",
            "latex": "",
            "image": null
        },
        {
            "title": "Es besteht eine mittelstarke bis starke Korrelation der drei unabhängigen Variablen untereinander.",
            "latex": "",
            "image": null
        },
        {
            "title": " In einer bivariaten Regression mit Xw als abhängiger Variable und Xg als unabhängiger Variable erklärt die gesellschaftspolitische Position 56.3 Prozent der Varianz in der wirtschaftspolitischen Position.",
            "latex": "",
            "image": null
        },
        {
            "title": " In einer bivariaten Regression mit Xw als abhängiger Variable und Xg als unabhängiger Variable erklärt die gesellschaftspolitische Position 31.7 Prozentder Varianz in der wirtschaftspolitischen Position.",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [1,3]
  },{
    "question": " Ihnen liegen die folgenden Toleranzwerte der Variablen aus Aufgabe 33 vor. Welches der folgenden Regressionsmodelle müssen Sie berechnen, um den Toleranzwert der Variable Wirtschaftspolitik zu erhalten (w = Wirtschaftspolitik, g = Gesellschaftspolitik, u = Umdweltpolitik)?",
  "questionLatex": "\\begin{array}{l|c} \\text{Variable} & \\text{Toleranz} \\\\ \\hline \\text{Wirtschaft } (X_w) & 0.461 \\\\ \\text{Gesellschaft } (X_g) & 0.459 \\\\ \\text{Umwelt } (X_u) & 0.310 \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": "",
    "latex": "y_i = b_0 + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        },
        {
            "title": "",
    "latex": "x_{w,i} = b_0 + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        },
        {
            "title": "",
    "latex": "y_i = b_0 + b_w x_{w,i} + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        },
        {
            "title": "",
    "latex": "x_{w,i} = b_0 + b_y y_i + b_g x_{g,i} + b_u x_{u,i} + e_i",
            "image": null
        }
    ],
    "answerIndex": [1]
  },{
    "question": " Welche der folgenden Regressionsannahmen können mit den Toleranzwerten aus Aufgabe 47 überprüft werden?",
  "questionLatex": "\\begin{array}{l|c} \\text{Variable} & \\text{Toleranz} \\\\ \\hline \\text{Wirtschaft } (X_w) & 0.461 \\\\ \\text{Gesellschaft } (X_g) & 0.459 \\\\ \\text{Umwelt } (X_u) & 0.310 \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": "Linearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Multikollinearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Varianzhomogenität",
            "latex": "",
            "image": null
        },
        {
            "title": "Normalverteilung der Residuen",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [1]
  },{
    "question": "Was ist Ihre Interpretation der Ergebnisse aus Aufgabe 47?",
  "questionLatex": "\\begin{array}{l|c} \\text{Variable} & \\text{Toleranz} \\\\ \\hline \\text{Wirtschaft } (X_w) & 0.461 \\\\ \\text{Gesellschaft } (X_g) & 0.459 \\\\ \\text{Umwelt } (X_u) & 0.310 \\end{array}",
    "questionUrl": "",  
    "answers": [
        {
            "title": " 53.9 Prozent der Varianz in der wirtschaftspolitischen Positionen der Parteien kann durch ihre gesellschafts- und umweltpolitische Position erklärt werden.",
            "latex": "",
            "image": null
        },
        {
            "title": " 46.1 Prozent der Varianz in der wirtschaftspolitischen Positionen der Parteien kann durch ihre gesellschafts- und umweltpolitische Position erklärt werden.",
            "latex": "",
            "image": null
        },
        {
            "title": "Die gefundenen Toleranzwerte deuten auf eine Verletzung der Multikollinearitätsannahme hin.",
            "latex": "",
            "image": null
        },
        {
            "title": " Die gefundenen Toleranzwerte deuten auf eine Verletzung der Varianzhomogenitätsannahme hin",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [0]
  },{
    "question": "ImfolgendenStreudiagrammsinddieVorhersagewerteunddieResiduendesModells2 ausAufgabe33abgebildet.WelchederfolgendenRegressionsannahmenkönnenmitdieserAbbildungüberprüftwerden?",
  "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860fc880025b17e3708/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGZjOGUzODI0MzljYzU3ZDgiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGZjODgwMDI1YjE3ZTM3MDgiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc5IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk2M2UrMTh9.XYbOoiWyXCgHktIHgorKfYO7yFc-SjCC85bu8yMRNWM",
    "answers": [   
    {
            "title": "Linearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Multikollinearität",
            "latex": "",
            "image": null
        },
        {
            "title": "Varianzhomogenität",
            "latex": "",
            "image": null
        },
        {
            "title": "Normalverteilung der Residuen",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [2]
  },{
    "question": "WasistIhreInterpretationderErgebnisseausAufgabe50?",
  "questionLatex": "",
    "questionUrl": "https://fra.cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/6860fc880025b17e3708/view?project=67a9b50700084eaa4e04&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjg2MGZjOGUzODI0MzljYzU3ZDgiLCJyZXNvdXJjZUlkIjoiNjdkYzExZTAwMDAwM2FlNzYwMjM6Njg2MGZjODgwMDI1YjE3ZTM3MDgiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY1MjcxOjc5IiwiZXhwIjo5LjIyMzM3MjAzODYwNTk2M2UrMTh9.XYbOoiWyXCgHktIHgorKfYO7yFc-SjCC85bu8yMRNWM",
    "answers": [   
    {
            "title": "DieAnnahmederVarianzhomogenitätistoffensichtlichverletzt.",
            "latex": "",
            "image": null
        },
        {
            "title": " DieAnnahmederHomoskedastizitätistoffensichtlichverletzt.",
            "latex": "",
            "image": null
        },
        {
            "title": " DieAnnahmederMultikollinearitätistoffensichtlichverletzt.",
            "latex": "",
            "image": null
        },
        {
            "title": "KeinederdreiAussagentreffenzu",
            "latex": "",
            "image": null
        }
    ],
    "answerIndex": [3]
  },{
  "question": "Wie lautet der vorhergesagte Wert \\( y_i \\) für eine Partei mit den Werten 6 auf der wirtschafts- und gesellschaftspolitischen Dimension gemäß folgendem Regressionsmodell?",
  "questionLatex": "y_i = 0{,}071 + 0{,}805 x_{w,i} + 0{,}553 x_{g,i} - 0{,}033 (x_{w,i} \\cdot x_{g,i})",
  "questionUrl": "",
  "answers": [
    {
      "title": "",
      "latex": "y_i = 5{,}940",
      "image": null
    },
    {
      "title": "",
      "latex": "y_i = 6{,}370",
      "image": null
    },
    {
      "title": "",
      "latex": "y_i = 7{,}031",
      "image": null
    },
    {
      "title": "",
      "latex": "y_i = 6{,}601",
      "image": null
    }
  ],
  "answerIndex": [2]
},{
  "question": "Welche Aussagen über das Regressionsmodell mit Interaktionsterm treffen zu?",
  "questionLatex": "y_i = 0{,}071 + 0{,}805 x_{w,i} + 0{,}553 x_{g,i} - 0{,}033 (x_{w,i} \\cdot x_{g,i}) \\quad \\text{mit } R^2 = 0{,}872",
  "questionUrl": "",
  "answers": [
    {
      "title": "A",
      "latex": "Der Interaktionsterm erhöht die Erklärungsleistung des Modells signifikant.",
      "image": null
    },
    {
      "title": "B",
      "latex": "Der Interaktionsterm kann zu einem Multikollinearitätsproblem führen.",
      "image": null
    },
    {
      "title": "C",
      "latex": "Ein Anstieg von x_{w,i} um 1 erhöht y_i um genau 0{,}805 Skalenpunkte.",
      "image": null
    },
    {
      "title": "D",
      "latex": "Keine der Aussagen trifft zu.",
      "image": null
    }
  ],
  "answerIndex": [1]
},{
  "question": " Um mit dem Multikollinearitätsproblem in Modell 3 aus Aufgabe 52 umzugehen, wurden die Variablen zentriert. Welche der folgenden Aussagen über die Ergebnisse treffen zu?",
  "questionLatex": "\\begin{array}{l|cc|cc} & \\text{Modell 4} & & \\text{Modell 5} & \\\\ & b_j & T_j & b_j & T_j \\\\ \\hline \\text{Wirtschaftspolitik (zentriert)} & 0.701 & 0.683 & 0.688 & 0.664 \\\\ \\text{Gesellschaftspolitik (zentriert)} & 0.379 & 0.683 & 0.409 & 0.598 \\\\ \\text{Wirtschaftsp. (zentriert) $\\times$ Gesellschaftsp. (zentriert)} &  &  & 0.033 & 0.872 \\\\ \\text{Konstante} & 4.976 &  & 5.089 &  \\\\ \\hline r^2 & 0.868 &  & 0.872 & \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": " Die Erklärungsleistung des Regressionsmodells ist durch die Zentrierung derVariablen gesteigert worden.",
      "latex": "",
      "image": null
    },
    {
      "title": " Das Multikollinearitätsproblem besteht auch nach der Zentrierung der Variablen.",
      "latex": "",
      "image": null
    },
    {
      "title": "Der Interaktionsterm deutet einen negativen Effekt der wirtschaftspolitischen Position der Parteien auf ihre Links-Rechts-Position an.",
      "latex": "",
      "image": null
    },
    {
      "title": " Keine der Aussagen trifft zu.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [3]
},{
  "question": "Geben Sie die Rückweisungswerte für zweiseitige t-Tests der Koeffizienten aus Aufgabe 57 an. Geben Sie die Rückweisungswerte für Irrtumswahrscheinlichkeiten von 1%, 5% und 10% an.",
  "questionLatex": "\\begin{array}{lccc} & \\beta & \\sigma & t \\\\ \\hline \\text{Wirtschaftspolitik} & 0.648 & 0.043 & 15.070^{***} \\\\ \\text{Gesellschaftspolitik} & 0.328 & 0.042 & 7.810^{***} \\\\ \\text{Umweltpolitik} & 0.133 & 0.062 & 2.145^{**} \\\\ \\text{Konstante} & 0.289 & 0.186 & 1.554 \\\\ \\hline n & {104} \\\\ r^2 & {0.872} \\\\ r^2_{\\text{korr}} & {0.868} \\\\ F & {227.083} \\\\ \\hline {^{***}p < 0{,}01,\\ ^{**}p < 0{,}05,\\ ^{*}p < 0{,}1} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "A",
      "latex": "{t_{99}} = \\pm 2.626,\\ {t_{95}} = \\pm 1.984,\\ {t_{90}} = \\pm 1.660",
      "image": null
    },
    {
      "title": "B",
      "latex": "{t_{99}} = \\pm 2.450,\\ {t_{95}} = \\pm 1.920,\\ {t_{90}} = \\pm 1.600",
      "image": null
    },
    {
      "title": "C",
      "latex": "{t_{99}} = \\pm 2.700,\\ {t_{95}} = \\pm 2.000,\\ {t_{90}} = \\pm 1.710",
      "image": null
    },
    {
      "title": "D",
      "latex": "{t_{99}} = \\pm 2.500,\\ {t_{95}} = \\pm 1.850,\\ {t_{90}} = \\pm 1.550",
      "image": null
    }
  ],
  "answerIndex": [0]
},{
  "question": "Welche der folgenden Aussagen über die Regressionskoeffizienten aus Aufgabe 57 treffenzu?",
    "questionLatex": "\\begin{array}{lccc} & \\beta & \\sigma & t \\\\ \\hline \\text{Wirtschaftspolitik} & 0.648 & 0.043 & 15.070^{***} \\\\ \\text{Gesellschaftspolitik} & 0.328 & 0.042 & 7.810^{***} \\\\ \\text{Umweltpolitik} & 0.133 & 0.062 & 2.145^{**} \\\\ \\text{Konstante} & 0.289 & 0.186 & 1.554 \\\\ \\hline n & {104} \\\\ r^2 & {0.872} \\\\ r^2_{\\text{korr}} & {0.868} \\\\ F & {227.083} \\\\ \\hline {^{***}p < 0{,}01,\\ ^{**}p < 0{,}05,\\ ^{*}p < 0{,}1} \\end{array}",
"questionUrl": "",
  "answers": [
    {
      "title": "Bei einer Irrtumswahrscheinlichkeit von 10% sind die drei Koeffizienten für die wirtschaftspolitische, die gesellschaftspolitische und die umweltpolitische Position der Parteien in der Grundgesamtheit von 0 verschieden.",
      "latex": "",
      "image": null
    },
    {
      "title": " Bei einer Irrtumswahrscheinlichkeit von 5% sind die drei Koeffizienten für die wirtschaftspolitische, die gesellschaftspolitische und die umweltpolitische Position der Parteien in der Grundgesamtheit von 0 verschieden.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einer Irrtumswahrscheinlichkeit von 1% sind die drei Koeffizienten für die wirtschaftspolitische, die gesellschaftspolitische und die umweltpolitische Position der Parteien in der Grundgesamtheit von 0 verschieden.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einer Irrtumswahrscheinlichkeit von 10% ist die Konstante in der Grundge samtheit von 0 verschieden.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0,1]
},{
  "question": "Welche der folgenden Aussagen über den F-Test aus Aufgabe 57 treffen zu?",
    "questionLatex": "\\begin{array}{lccc} & \\beta & \\sigma & t \\\\ \\hline \\text{Wirtschaftspolitik} & 0.648 & 0.043 & 15.070^{***} \\\\ \\text{Gesellschaftspolitik} & 0.328 & 0.042 & 7.810^{***} \\\\ \\text{Umweltpolitik} & 0.133 & 0.062 & 2.145^{**} \\\\ \\text{Konstante} & 0.289 & 0.186 & 1.554 \\\\ \\hline n & {104} \\\\ r^2 & {0.872} \\\\ r^2_{\\text{korr}} & {0.868} \\\\ F & {227.083} \\\\ \\hline {^{***}p < 0{,}01,\\ ^{**}p < 0{,}05,\\ ^{*}p < 0{,}1} \\end{array}",
"questionUrl": "",
  "answers": [
    {
      "title": " Für den F-Test wird ein einseitiger Hypothesentest durchgeführt.",
      "latex": "",
      "image": null
    },
    {
      "title": "Für den F-Test wird ein zweiseitiger Hypothesentest durchgeführt.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einer Irrtumswahrscheinlichkeit von 10% kann die Nullhypothese zurück gewiesen werden, dass die Erklärungsleistung des Regressionsmodells in der Grundgesamtheit gleich 0 ist.",
      "latex": "",
      "image": null
    },
    {
      "title": " Bei einer Irrtumswahrscheinlichkeit von 10% kann die Nullhypothese zurück gewiesen werden, dass alle Modellparameter in der Grundgesamtheit gleich 0 sind.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0,2,3]
},{
  "question": " Ihnen liegt das folgende Regressionsmodell vor. Die abhängige Variable ist das arithmetische Mittel der Zustimmung zu der folgenden Aussage: “Die Welt ist so unübersichtlichgeworden, dass man gar nicht weiß, wie es weitergehen soll.” (1 Trifft überhaupt nichtzu– 5 Trifft voll und ganz zu). Das arithmetische Mittel wurde für 75 Alterskategorienzwischen 16 und 90 berechnet. Die unabhängige Variable des Regressionsmodells ist dasdurch 100 geteilte Alter. Die zugehörigen Standardfehler sind in Klammern angegeben. InModell 2 wurde zusätzlich das quadrierte Alter einbezogen. Welche der folgenden Regressionsgleichungen beschreibt Modell 2?",
  "questionLatex": "\\begin{array}{l|cc} & \\text{Modell 1} & \\text{Modell 2} \\\\ \\hline \\text{Alter / 100} & 0.840^{***}  & -2.924^{***} \\\\  &(0.109) & (0.414)  \\\\ \\text{Alter / 100 (quadriert)} & & 3.550^{***} \\\\ & & (0.384) \\\\ \\text{Konstante} & 2.573^{***} & 3.404^{***} \\\\ &(0.063) & (0.099) \\\\ \\hline n & 75 & 75 \\\\ r^2 & 0.448 & 0.747 \\\\ r^2_{\\text{korr}} & 0.440 & 0.740 \\\\ F & 59.129^{***} & 106.509^{***} \\\\ \\end{array}",
"questionUrl": "",
  "answers": [
    {
      "title": "",
    "latex": "\\hat{y}_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}_i",
      "image": null
    },
    {
      "title": "",
    "latex": "\\hat{y}_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}^2_i",
      "image": null
    },
    {
      "title": "",
    "latex": "\\hat{y}_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}_i + \\beta_2 \\cdot \\text{alter}^2_i",
      "image": null
    },
    {
      "title": "",
    "latex": "y_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}_i + \\beta_2 \\cdot \\text{alter}^2_i + \\varepsilon_i",
      "image": null
    }
  ],
  "answerIndex": [2,3]
},{
  "question": " Welche der folgenden Aussagen über die Regressionsmodelle aus Aufgabe 63 treffen zu?",
  "questionLatex": "\\begin{array}{l|cc} & \\text{Modell 1} & \\text{Modell 2} \\\\ \\hline \\text{Alter / 100} & 0.840^{***}  & -2.924^{***} \\\\  &(0.109) & (0.414)  \\\\ \\text{Alter / 100 (quadriert)} & & 3.550^{***} \\\\ & & (0.384) \\\\ \\text{Konstante} & 2.573^{***} & 3.404^{***} \\\\ &(0.063) & (0.099) \\\\ \\hline n & 75 & 75 \\\\ r^2 & 0.448 & 0.747 \\\\ r^2_{\\text{korr}} & 0.440 & 0.740 \\\\ F & 59.129^{***} & 106.509^{***} \\\\ \\end{array}",
"questionUrl": "",
  "answers": [
    {
      "title": "Die erklärte Varianz von Modell 2 ist rund 1.8 mal höher als die erklärte Varianz von Modell 1 (106.509/59.129 = 1.801)",
    "latex": "",
      "image": null
    },
    {
      "title": "Modell 1 erklärt rund 59 Prozent der Varianz in der abhängigen Variable.",
    "latex": "",
      "image": null
    },
    {
      "title": "Die erklärte Varianz wird durch die quadrierte unabhängige Variable sichtlich erhöht.",
    "latex": "",
      "image": null
    },
    {
      "title": " Modell 2 weist eindeutig auf einen linearen Zusammenhang zwischen dem Alter und der abhängigen Variable hin.",
    "latex": "",
      "image": null
    }
  ],
  "answerIndex": [2]
},{
  "question": "Treffen Sie auf Basis von Modell 1 eine Vorhersage für die mittlere Zustimmung von 16-jährigen und 80-jährigen Respondenten. Die unabhängige Variable (Alter) wurde durch 100 geteilt.",
  "questionLatex": "\\hat{y}_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}_i,\\quad \\beta_0 = 2.573,\\quad \\beta_1 = 0.840",
  "questionUrl": "",
  "answers": [
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 2.707, \\quad \\hat{y}_{80} = 3.245",
    "image": null
  },
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 3.027, \\quad \\hat{y}_{80} = 3.337",
    "image": null
  },
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 3.245, \\quad \\hat{y}_{80} = 2.707",
    "image": null
  },
  {
    "title": "Es können keine Vorhersagen getroffen werden, da kein Interaktionsterm enthalten ist.",
    "latex": "",
    "image": null
  }
],

  "answerIndex": [0]
},{
  "question": "Treffen Sie auf Basis von Modell 2 eine Vorhersage für die mittlere Zustimmung von 16-jährigen und 80-jährigen Respondenten. Die unabhängige Variable (Alter) wurde durch 100 geteilt.",
  "questionLatex": "\\hat{y}_i = \\beta_0 + \\beta_1 \\cdot \\text{alter}_i + \\beta_2 \\cdot \\text{alter}^2_i,\\quad \\beta_0 = 3.404,\\quad \\beta_1 = -2.924,\\quad \\beta_2 = 3.550",
  "questionUrl": "",
 "answers": [
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 2.707, \\quad \\hat{y}_{80} = 3.245",
    "image": null
  },
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 3.027, \\quad \\hat{y}_{80} = 3.337",
    "image": null
  },
  {
    "title": "",
    "latex": "\\hat{y}_{16} = 3.337, \\quad \\hat{y}_{80} = 3.027",
    "image": null
  },
  {
    "title": "Die Vorhersagewerte sind identisch mit denen aus Modell 1.",
    "latex": "",
    "image": null
  }
],
  "answerIndex": [1]
},{
  "question": " Ihnen liegt das folgende Ergebnis einer logistischen Regression vor. Abhängige Variable ist die Antwort einer Stichprobe von Bundestagskandidaten auf die Frage, ob innerparteiliche Entscheidungen zu hierarchisch fallen (1 = Ja, 0 = Nein). Erklärende Variablen sind die Parteizugehörigkeit, der Amtsinhaberstatus (1 = Ja, 0 = Nein) sowie die logarithmierte Länge der Parteimitgliedschaft. Referenzkategorie der Parteimitgliedschaft ist CDU/CSU. Tragen Sie die fehlenden Werte in die Tabelle ein.",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & var_2 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & var_3 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & var_1 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
  {
    "title": "",
    "latex": "var_1 = -4.123; \\quad var_2 = 0.443; \\quad var_3 = -6.646",
    "image": null
  },
  {
    "title": "",
    "latex": "var_1 = -3.912; \\quad var_2 = 0.512; \\quad var_3 = -5.839",
    "image": null
  },
  {
    "title": "",
    "latex": "var_1 = -4.456; \\quad var_2 = 0.390; \\quad var_3 = -6.210",
    "image": null
  },
  {
    "title": "",
    "latex": "var_1 = -3.678; \\quad var_2 = 0.470; \\quad var_3 = -6.900",
    "image": null
  }
],

  "answerIndex": [0]
},{
  "question": "Welche der folgenden Gleichungen beschreibt das logistische Regressionsmodell korrekt?",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "",
      "latex": "P(y = 1) = \\frac{e^{\\beta_0 + \\beta_{\\text{spd}} x_{\\text{spd},i} + \\beta_{\\text{gr\\\"une}} x_{\\text{gr\\\"une},i} + \\beta_{\\text{fdp}} x_{\\text{fdp},i} + \\beta_{\\text{linke}} x_{\\text{linke},i} + \\beta_{\\text{afd}} x_{\\text{afd},i} + \\beta_{\\text{amt}} x_{\\text{amt},i} + \\beta_{\\text{l\\\"ange}} x_{\\text{l\\\"ange},i}}}{1 + e^{\\beta_0 + \\beta_{\\text{spd}} x_{\\text{spd},i} + \\beta_{\\text{gr\\\"une}} x_{\\text{gr\\\"une},i} + \\beta_{\\text{fdp}} x_{\\text{fdp},i} + \\beta_{\\text{linke}} x_{\\text{linke},i} + \\beta_{\\text{afd}} x_{\\text{afd},i} + \\beta_{\\text{amt}} x_{\\text{amt},i} + \\beta_{\\text{l\\\"ange}} x_{\\text{l\\\"ange},i}}}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\ln\\left(\\frac{P(y=1)}{1 - P(y=1)}\\right) = \\beta_0 + \\beta_{\\text{spd}} x_{\\text{spd},i} + \\beta_{\\text{gr\\\"une}} x_{\\text{gr\\\"une},i} + \\beta_{\\text{fdp}} x_{\\text{fdp},i} + \\beta_{\\text{linke}} x_{\\text{linke},i} + \\beta_{\\text{afd}} x_{\\text{afd},i} + \\beta_{\\text{amt}} x_{\\text{amt},i} + \\beta_{\\text{l\\\"ange}} x_{\\text{l\\\"ange},i}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\frac{P(y=1)}{P(y=0)} = e^{\\beta_0 + \\beta_{\\text{spd}} x_{\\text{spd},i} + \\beta_{\\text{gr\\\"une}} x_{\\text{gr\\\"une},i} + \\beta_{\\text{fdp}} x_{\\text{fdp},i} + \\beta_{\\text{linke}} x_{\\text{linke},i} + \\beta_{\\text{afd}} x_{\\text{afd},i} + \\beta_{\\text{amt}} x_{\\text{amt},i} + \\beta_{\\text{l\\\"ange}} x_{\\text{l\\\"ange},i}}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\ln(P(y=1)) = \\beta_0 + \\beta_{\\text{spd}} x_{\\text{spd},i} + \\ldots",
      "image": null
    }
  ],
  "answerIndex": [0,1,2,3]
},{
  "question": "Welche der folgenden Aussagen über den SPD-Koeffizienten im logistischen Regressionsmodell treffen zu?",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "SPD-Kandidaten nehmen ihre Partei weniger hierarchisch wahr als die Kandidaten der anderen Parteien.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem Signifikanzniveau von 1% wird die Nullhypothese beibehalten, dass der SPD-Koeffizient gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem Signifikanzniveau von 1% wird die Nullhypothese beibehalten, dass der SPD-Koeffizient größer als null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "SPD-Kandidaten nehmen ihre Partei weniger hierarchisch wahr als CDU-Kandidaten.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [3]
},{
  "question": "Welche der folgenden Aussagen über den Grünen-Koeffizienten im logistischen Regressionsmodell treffen zu?",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "Bei einem Signifikanzniveau von 1% wird die Nullhypothese zurückgewiesen, dass der Grünen-Koeffizient gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem Signifikanzniveau von 5% wird die Nullhypothese zurückgewiesen, dass der Grünen-Koeffizient gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem Signifikanzniveau von 10% wird die Nullhypothese zurückgewiesen, dass der Grünen-Koeffizient gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Eine Aussage über die Nullhypothese kann nicht getroffen werden.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0, 1, 2]
},{
  "question": "Welche der folgenden Aussagen über den Koeffizienten für die Länge der Parteimitgliedschaft im logistischen Regressionsmodell treffen zu? Der geschätzte Koeffizient beträgt \\( -0.272 \\), mit einem Standardfehler von \\( 0.148 \\) und einem z-Wert von \\( -1.835 \\).",
  "questionLatex": "",
  "questionUrl": "",
  "answers": [
    {
      "title": "Je länger Kandidaten Mitglied ihrer Partei sind, desto hierarchischer nehmen sie ihre Partei wahr.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem fünfprozentigen Signifikanzniveau wird die Nullhypothese zurückgewiesen, dass der Effekt der Länge der Parteimitgliedschaft gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Bei einem zehnprozentigen Signifikanzniveau wird die Nullhypothese zurückgewiesen, dass der Effekt der Länge der Parteimitgliedschaft gleich null ist.",
      "latex": "",
      "image": null
    },
    {
      "title": "Der Effektkoeffizient für die Länge der Parteimitgliedschaft ist größer als 0.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [2,3]
},{
  "question": "Im ursprünglichen logistischen Regressionsmodell wurde der Amtsinhaberstatus so kodiert: 1 = Amtsinhaber, 0 = Nicht-Amtsinhaber. Angenommen, die Kodierung würde umgekehrt: 1 = Nicht-Amtsinhaber, 0 = Amtsinhaber. Welche der folgenden Aussagen trifft zu? Der ursprüngliche Regressionskoeffizient beträgt \\( -0.721 \\).",
  "questionLatex": "",
  "questionUrl": "",
  "answers": [
    {
      "title": "Der Regressionskoeffizient bleibt gleich.",
      "latex": "",
      "image": null
    },
    {
      "title": "Der Regressionskoeffizient bleibt gleich bei umgekehrtem Vorzeichen.",
      "latex": "",
      "image": null
    },
    {
      "title": "Vorhersagen über den Koeffizienten sind nicht möglich.",
      "latex": "",
      "image": null
    },
    {
      "title": "Die genannte Umkodierung ist nicht möglich.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [1]
},{
  "question": "Wie lautet der Logitkoeffizient der SPD im folgenden logistischen Regressionsmodell? Die Referenzkategorie ist CDU/CSU.",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "-1.906",
      "latex": "",
      "image": null
    },
    {
      "title": "1.906",
      "latex": "",
      "image": null
    },
    {
      "title": "-0.721",
      "latex": "",
      "image": null
    },
    {
      "title": "0.103",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0]
},{
  "question": "Wie groß ist der Effektkoeffizient (Odds Ratio) der FDP im logistischen Regressionsmodell, gegeben ist ein Logitkoeffizient von \\( -2.275 \\)?",
 "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "0.103",
      "latex": "",
      "image": null
    },
    {
      "title": "-2.275",
      "latex": "",
      "image": null
    },
    {
      "title": "2.275",
      "latex": "",
      "image": null
    },
    {
      "title": "10.3",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0]
},{
  "question": "Welche der folgenden Gleichungen über den Effektkoeffizienten der FDP im logistischen Regressionsmodell treffen zu? Der Logitkoeffizient der FDP beträgt \\( \\beta = -2.275 \\) und der Effektkoeffizient \\( e^{-2.275} \\approx 0.103 \\).",
  "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "",
      "latex": "\\ln\\left(\\frac{P(y=1 \\mid \\text{fdp}=1)}{P(y=0 \\mid \\text{fdp}=1)}\\right) = \\ln\\left(\\frac{P(y=1 \\mid \\text{fdp}=0)}{P(y=0 \\mid \\text{fdp}=0)}\\right) + \\beta_{\\text{fdp}}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\frac{P(y=1 \\mid \\text{fdp}=1)}{P(y=0 \\mid \\text{fdp}=1)} = \\frac{P(y=1 \\mid \\text{fdp}=0)}{P(y=0 \\mid \\text{fdp}=0)} \\cdot e^{\\beta_{\\text{fdp}}}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\ln\\left(\\frac{P(y=0 \\mid \\text{fdp}=0)}{P(y=1 \\mid \\text{fdp}=0)}\\right) = e^{\\beta_{\\text{fdp}}}",
      "image": null
    },
    {
      "title": "",
      "latex": "\\frac{P(y=1 \\mid \\text{fdp}=1)}{P(y=0 \\mid \\text{fdp}=1)} = \\frac{P(y=1 \\mid \\text{fdp}=0)}{P(y=0 \\mid \\text{fdp}=0)} \\cdot e^{-\\beta_{\\text{fdp}}}",
      "image": null
    }
  ],
  "answerIndex": [3]
},
{
  "question": "Wie lautet das zugehörige Nullmodell (d.h. Modell ohne erklärende Variablen) zur logistischen Regression?",
  "questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{SPD} & -1.906 & 0.290 & -6.570 \\\\ \\text{Gr\\\"une} & -3.099 & 0.443 & -6.996 \\\\ \\text{FDP} & -2.275 & 0.342 & -6.652 \\\\ \\text{Die Linke} & -1.700 & 0.314 & -5.415 \\\\ \\text{AfD} & -4.099 & 0.561 & -7.307 \\\\ \\text{Amtsinhaber} & -0.721 & 0.338 & -2.132 \\\\ \\text{L\\\"ange Parteimitgliedschaft (log)} & -0.272 & 0.148 & -1.835 \\\\ \\text{Konstante} & 1.241 & 0.421 & 2.949 \\\\ \\hline n &  & {670} \\\\ \\text{Log-Likelihood} & &{-318.225} \\end{array}",
  "questionUrl": "",
  "answers": [
  {
    "title": "",
    "latex": "\\displaystyle P(y = 1) = \\frac{e^{\\beta_0}}{1 + e^{\\beta_0}}",
    "image": null
  },
  {
    "title": "",
    "latex": "\\displaystyle P(y = 1) = \\frac{e^{\\beta_0 + \\beta_1 x_i}}{1 + e^{\\beta_0 + \\beta_1 x_i}}",
    "image": null
  },
  {
    "title": "",
    "latex": "\\displaystyle P(y = 0) = \\frac{1}{1 + e^{\\beta_0}}",
    "image": null
  },
  {
    "title": "",
    "latex": "\\displaystyle P(y = 0) = \\frac{1}{1 + e^{\\beta_0 + \\beta_1 x_i}}",
    "image": null
  }
],

  "answerIndex": [1]
}
,{
  "question": "Ihnen liegt das folgende Ergebnis einer logistischen Regression mit den Prädiktoren Parteizugehörigkeit (Referenzkategorie: CDU/CSU) und Konstante vor. Der Log-Likelihood-Wert des Modells beträgt -323.872. Wie lautet die Devianz dieses Modells?",
  "questionLatex": "\\text{Devianz} = -2 \\times \\text{Log-Likelihood} = -2 \\times (-323.872)",
  "questionUrl": "",
  "answers": [
    {
      "title": "323.872",
      "latex": "",
      "image": null
    },
    {
      "title": "647.744",
      "latex": "",
      "image": null
    },
    {
      "title": "0.498",
      "latex": "",
      "image": null
    },
    {
      "title": "161.936",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [1]
},{
  "question": "Zwei logistische Regressionsmodelle wurden berechnet. Modell A (aus Aufgabe 67) hat einen Log-Likelihood von -318.225. Modell B (aus Aufgabe 84) hat einen Log-Likelihood von -323.872. Wie lautet die Teststatistik des Likelihood Ratio-Tests zur Modellvergleiche?",
  "questionLatex": "D = -2 \\cdot (\\text{Log-Likelihood}_B - \\text{Log-Likelihood}_A) = -2 \\cdot (-323.872 + 318.225)",
  "questionUrl": "",
  "answers": [
    {
      "title": "5.647",
      "latex": "",
      "image": null
    },
    {
      "title": "11.294",
      "latex": "",
      "image": null
    },
    {
      "title": "2.402",
      "latex": "",
      "image": null
    },
    {
      "title": "14.018",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [1]
},{
  "question": "Ihnen liegt folgende Liste der zehn deutschen Bundestagspräsidentinnen und -präsidenten seit 1972 vor. Berechnen Sie die Log-Likelihood eines logistischen Regressionsmodells",
   "questionLatex": "\\begin{array}{l|l|l|c|c} \\text{Präsident/in} & \\text{Amtszeit} & \\text{Partei} & y~(\\text{Frau}) & x~(\\text{SPD}) \\\\ \\hline \\text{A. Renger} & 1972\\text{--}1976 & SPD & 1 & 1 \\\\ \\text{K. Carstens} & 1976\\text{--}1979 & CDU & 0 & 0 \\\\ \\text{R. St\\\"ucklen} & 1979\\text{--}1983 & CSU & 0 & 0 \\\\ \\text{R. Barzel} & 1983\\text{--}1984 & CDU & 0 & 0 \\\\ \\text{P. Jenninger} & 1984\\text{--}1988 & CDU & 0 & 0 \\\\ \\text{R. S\\\"ussmuth} & 1988\\text{--}1998 & CDU & 1 & 0 \\\\ \\text{W. Thierse} & 1998\\text{--}2005 & SPD & 0 & 1 \\\\ \\text{N. Lammert} & 2005\\text{--}2017 & CDU & 0 & 0 \\\\ \\text{W. Sch\\\"auble} & 2017\\text{--}2021 & CDU & 0 & 0 \\\\ \\text{B. Bas} & 2021\\text{--} & SPD & 1 & 1 \\\\ \\end{array}",
   "questionUrl": "",
  "answers": [
    {
      "title": "-4.968",
      "latex": "",
      "image": null
    },
    {
      "title": "-6.143",
      "latex": "",
      "image": null
    },
    {
      "title": "-3.721",
      "latex": "",
      "image": null
    },
    {
      "title": "-5.345",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [0]
},{
  "question": "Berechnen Sie die Log-Likelihood für das logistische Regressionsmodell mit den Parametern \\( \\beta_0 = 2 \\) und \\( \\beta_1 = 2.5 \\) anhand der folgenden Daten:",

  "questionLatex": "\\begin{array}{l|l|l|c|c} \\text{Präsident/in} & \\text{Amtszeit} & \\text{Partei} & y~(\\text{Frau}) & x~(\\text{SPD}) \\\\ \\hline \\text{A. Renger} & 1972\\text{--}1976 & SPD & 1 & 1 \\\\ \\text{K. Carstens} & 1976\\text{--}1979 & CDU & 0 & 0 \\\\ \\text{R. St\\\"ucklen} & 1979\\text{--}1983 & CSU & 0 & 0 \\\\ \\text{R. Barzel} & 1983\\text{--}1984 & CDU & 0 & 0 \\\\ \\text{P. Jenninger} & 1984\\text{--}1988 & CDU & 0 & 0 \\\\ \\text{R. S\\\"ussmuth} & 1988\\text{--}1998 & CDU & 1 & 0 \\\\ \\text{W. Thierse} & 1998\\text{--}2005 & SPD & 0 & 1 \\\\ \\text{N. Lammert} & 2005\\text{--}2017 & CDU & 0 & 0 \\\\ \\text{W. Sch\\\"auble} & 2017\\text{--}2021 & CDU & 0 & 0 \\\\ \\text{B. Bas} & 2021\\text{--} & SPD & 1 & 1 \\\\ \\end{array} \\\\[12pt\\] \\text{Formel:} \\quad \\log L = \\sum_{i=1}^{10} \\left[ y_i \\log\\left( P(y_i=1) \\right) + (1 - y_i) \\log\\left( 1 - P(y_i=1) \\right) \\right], \\\\ \\text{wobei} \\quad P(y_i=1) = \\frac{e^{\\beta_0 + \\beta_1 x_i}}{1 + e^{\\beta_0 + \\beta_1 x_i}}.",

  "questionUrl": "",

  "answers": [
    { "title": "-4.811", "latex": "", "image": null },
    { "title": "-5.020", "latex": "", "image": null },
    { "title": "-3.984", "latex": "", "image": null },
    { "title": "-6.142", "latex": "", "image": null }
  ],

  "answerIndex": [0]
},
{
  "question": "Welche der folgenden Aussagen über die Log-Likelihoods aus Aufgabe 88 (-4.968) und Aufgabe 89 (-4.811) treffen zu?",
   "questionLatex": "\\begin{array}{l|l|l|c|c} \\text{Präsident/in} & \\text{Amtszeit} & \\text{Partei} & y~(\\text{Frau}) & x~(\\text{SPD}) \\\\ \\hline \\text{A. Renger} & 1972\\text{--}1976 & SPD & 1 & 1 \\\\ \\text{K. Carstens} & 1976\\text{--}1979 & CDU & 0 & 0 \\\\ \\text{R. St\\\"ucklen} & 1979\\text{--}1983 & CSU & 0 & 0 \\\\ \\text{R. Barzel} & 1983\\text{--}1984 & CDU & 0 & 0 \\\\ \\text{P. Jenninger} & 1984\\text{--}1988 & CDU & 0 & 0 \\\\ \\text{R. S\\\"ussmuth} & 1988\\text{--}1998 & CDU & 1 & 0 \\\\ \\text{W. Thierse} & 1998\\text{--}2005 & SPD & 0 & 1 \\\\ \\text{N. Lammert} & 2005\\text{--}2017 & CDU & 0 & 0 \\\\ \\text{W. Sch\\\"auble} & 2017\\text{--}2021 & CDU & 0 & 0 \\\\ \\text{B. Bas} & 2021\\text{--} & SPD & 1 & 1 \\\\ \\end{array}",
  "questionUrl": "",
  "answers": [
    {
      "title": "Das Modell mit den Parametern aus Aufgabe 88 passt besser zu den Daten als das Modell aus Aufgabe 89.",
      "latex": "",
      "image": null
    },
    {
      "title": "Das Modell mit den Parametern aus Aufgabe 89 passt besser zu den Daten als das Modell aus Aufgabe 88.",
      "latex": "",
      "image": null
    },
    {
      "title": "Beide Modelle passen gleich gut zu den Daten.",
      "latex": "",
      "image": null
    },
    {
      "title": "Die Log-Likelihood-Werte können nicht verglichen werden.",
      "latex": "",
      "image": null
    }
  ],
  "answerIndex": [1]
},{
  "question": "Wie viele Parameter wurden für das Modell geschätzt?",
"questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{Laschet} & -0.879 & 0.076 & -11.566 \\\\ \\text{Laschet, Ost} & -0.540 & 0.121 & -4.463 \\\\ \\text{Laschet, Weiblich} & -0.140 & 0.105 & -1.333 \\\\ \\text{Baerbock} & -0.870 & 0.074 & -11.757 \\\\ \\text{Baerbock, Ost} & -0.269 & 0.106 & -2.538 \\\\ \\text{Baerbock, Weiblich} & -0.129 & 0.097 & -1.330 \\\\ \\hline n & \\ & {2{,}577} \\\\ \\text{Log-Likelihood} & \\ & {-2{,}502} \\\\ \\text{Log-Likelihood}_0 & \\ & {-2{,}516} \\end{array} \\\\ P(Y=\\text{Laschet})= \\frac{e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}}}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}} \\\\ P(Y=\\text{Baerbock})= \\frac{e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}} \\\\ P(Y=\\text{Scholz})= \\frac{1}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}}",
"questionUrl": "",
  "answers": [
    { "title": "2", "latex": "", "image": null },
    { "title": "3", "latex": "", "image": null },
    { "title": "6", "latex": "", "image": null },
    { "title": "24", "latex": "", "image": null }
  ],
  "answerIndex": [2]
},{
  "question": "Welche der folgenden Aussagen über das Modell treffen zu?",
"questionLatex": "\\begin{array}{l|ccc} & \\beta_j & \\sigma_{\\beta_j} & z \\\\ \\hline \\text{Laschet} & -0.879 & 0.076 & -11.566 \\\\ \\text{Laschet, Ost} & -0.540 & 0.121 & -4.463 \\\\ \\text{Laschet, Weiblich} & -0.140 & 0.105 & -1.333 \\\\ \\text{Baerbock} & -0.870 & 0.074 & -11.757 \\\\ \\text{Baerbock, Ost} & -0.269 & 0.106 & -2.538 \\\\ \\text{Baerbock, Weiblich} & -0.129 & 0.097 & -1.330 \\\\ \\hline n & \\ & {2{,}577} \\\\ \\text{Log-Likelihood} & \\ & {-2{,}502} \\\\ \\text{Log-Likelihood}_0 & \\ & {-2{,}516} \\end{array} \\\\ P(Y=\\text{Laschet})= \\frac{e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}}}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}} \\\\ P(Y=\\text{Baerbock})= \\frac{e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}} \\\\ P(Y=\\text{Scholz})= \\frac{1}{1 + e^{\\beta_{0,\\text{Laschet}} + \\beta_{\\text{Ost,Laschet}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Laschet}} x_{\\text{Weiblich},i}} + e^{\\beta_{0,\\text{Baerbock}} + \\beta_{\\text{Ost,Baerbock}} x_{\\text{Ost},i} + \\beta_{\\text{Weiblich,Baerbock}} x_{\\text{Weiblich},i}}}",
 "questionUrl": "",
  "answers": [
    { "title": "Im Vergleich zur Referenzkategorie Annalena Baerbock hat eine ostdeutsche Herkunft in der Stichprobe einen negativen Effekt auf die Wahrscheinlichkeit, Armin Laschet als Kanzler zu präferieren.", "latex": "", "image": null },
    { "title": "Im Vergleich zu Westdeutschen nennen Ostdeutsche in der Stichprobe Armin Laschet weniger wahrscheinlich als ihre Kanzlerpräferenz im Vergleich zu Olaf Scholz.", "latex": "", "image": null },
    { "title": "Olaf Scholz hat in der Stichprobe eine höhere Grundwahrscheinlichkeit als Kanzlerpräferenz angegeben zu werden im Vergleich zu den beiden anderen Kandidaten.", "latex": "", "image": null },
    { "title": "Männer haben in der Stichprobe eine höhere Wahrscheinlichkeit als Frauen, Annalena Baerbock statt Olaf Scholz als ihre Kanzlerpräferenz anzugeben.", "latex": "", "image": null }
  ],
  "answerIndex": [1, 2]
}
]
   
/*
//Tabellen aus Statisik 1
//Frage 28 
"\\begin{array}{l|ccccccc} \\text{Maßzahl} & \\text{LINKE} & \\text{GRÜNE} & \\text{SPD} & \\text{FDP} & \\text{CDU} & \\text{CSU} & \\text{AfD} \\\\ \\hline \\text{Arithm. Mittel} & 1.854 & 3.976 & 4.350 & 6.290 & 6.542 & 7.194 & 9.859 \\\\ \\text{Median} & 1 & 4 & 4 & 6 & 6 & 7 & 11 \\\\ \\text{Modus} & 1 & 4 & 5 & 6 & 6 & 8 & 11 \\\\ \\text{25\\%-Quantil} & 1 & 3 & 3 & 5 & 6 & 6 & 10 \\\\ \\text{75\\%-Quantil} & 2 & 5 & 5 & 7 & 8 & 9 & 11 \\\\ \\text{Varianz} & 2.258 & 3.192 & 2.584 & 3.137 & 3.407 & 4.044 & 5.337 \\\\ \\text{Standardabw.} & 1.503 & 1.787 & 1.608 & 1.771 & 1.846 & 2.011 & 2.310 \\\\ \\end{array}";
//Frage 
// 32 
"\\begin{array}{l|cccccccc} \\text{Demokratiezufriedenheit} & \\text{Union} & \\text{SPD} & \\text{FDP} & \\text{Grüne} & \\text{Linke} & \\text{AfD} & \\text{Andere} & \\text{Summe} \\\\ \\hline \\text{(Sehr) zufrieden} & 438 & 456 & 177 & 403 & 63 & 15 & 46 & 1{,}598 \\\\ \\text{Teils/teils} & 183 & 275 & 141 & 174 & 79 & 61 & 58 & 971 \\\\ \\text{(Sehr) unzufrieden} & 38 & 67 & 70 & 49 & 61 & 166 & 53 & 504 \\\\ \\ \\sum & 659 & 798 & 388 & 626 & 203 & 242 & 157 & 3{,}073 \\\\ \\end{array}";
//Frage 53 
"\\begin{array}{l|cc} \\text{Wahlkampf unfair} & \\text{AfD: Ja} & \\text{AfD: Nein} \\\\ \\hline \\text{Ja} & 100 & 258 \\\\ \\text{Nein} & 104 & 2{,}219 \\\\ \\end{array}";
//Frage 
// 54 
// 
"\\begin{array}{l|cc|cc} & \\  {\\text{Hohes Interesse}} & \\ & {\\text{Niedriges Interesse}} \\\\ \\text{Wahlkampf unfair} & \\text{AfD: Ja} & \\text{AfD: Nein} & \\text{AfD: Ja} & \\text{AfD: Nein} \\\\ \\hline \\text{Ja} & 57 & 112 & 43 & 146 \\\\ \\text{Nein} & 42 & 1{,}035 & 62 & 1{,}184 \\\\ \\end{array}"
//Frage 75 
// 
"\\begin{array}{c|l|l|c|c} i & \\text{Zweitstimme} & \\text{Geschlecht} & \\text{CDU} & \\text{CDU/Weiblich} \\\\ \\hline 1 & \\text{CDU} & \\text{Männlich} & 1 & 0 \\\\ 2 & \\text{SPD} & \\text{Weiblich} & 0 & 0 \\\\ 3 & \\text{CDU} & \\text{Weiblich} & 1 & 1 \\\\ 4 & \\text{GRÜNE} & \\text{Männlich} & 0 & 0 \\\\ 5 & \\text{CDU} & \\text{Weiblich} & 1 & 1 \\\\ \\end{array}";
//Frage 76
 "\\begin{array}{cl|rrrr} j & \\text{Bezeichnung} & x_j & f_j & p_j & p_{j,\\text{cum}} \\\\ \\hline 1 & \\text{Trifft überhaupt nicht zu} & 137 & 0.027 & 0.027 & 0.027 \\\\ 2 & \\text{Trifft eher nicht zu} & 826 & 0.165 & 0.192 & 0.192 \\\\ 3 & \\text{Teils/teils} & 1776 & 0.355 & 0.547 & 0.547 \\\\ 4 & \\text{Trifft eher zu} & 1598 & 0.319 & 0.867 & 0.867 \\\\ 5 & \\text{Trifft voll und ganz zu} & 666 & 0.133 & 1.000 & 1.000 \\\\ \\hline \\sum & & 5003 & & & \\\\ \\end{array}";
//Frage 78 "\\begin{array}{c|l|r|r|r} j & \\text{Kandidierender} & f_j & p_j & \\ln(p_j) \\\\ \\hline 1 & \\text{Armin Laschet} & 539 & 0.110 & 2.205 \\\\ 2 & \\text{Olaf Scholz} & 1659 & 0.339 & 1.081 \\\\ 3 & \\text{Annalena Baerbock} & 682 & 0.140 & 1.970 \\\\ 4 & \\text{Keine(n) dieser Kandidierenden} & 2008 & 0.411 & 0.890 \\\\ \\end{array}";
//Frage 80
 "\\begin{array}{l|r|r|r} \\text{Kanzlerpräferenz} & \\text{Männlich} & \\text{Weiblich} & \\sum \\\\ \\hline Armin\\ Laschet & 297 & 239 & 536 \\\\ Olaf\\ Scholz & 846 & 799 & 1645 \\\\ Annalena\\ Baerbock & 332 & 343 & 675 \\\\ Keine(n)\\ dieser\\ Kandidierenden & 1056 & 934 & 1990 \\\\ \\hline \\sum & 2531 & 2315 & 4846 \\\\ \\end{array}";
//Frage 81 
// 
"\\begin{array}{l|r|r|r} \\text{Kanzlerpräferenz} & \\text{Männlich} & \\text{Weiblich} & \\sum \\\\ \\hline Armin\\ Laschet & 0.117 & 0.103 & 0.111 \\\\ Olaf\\ Scholz & 0.334 & 0.345 & 0.339 \\\\ Annalena\\ Baerbock & 0.131 & 0.148 & 0.139 \\\\ Keine(n)\\ dieser\\ Kandidierenden & 0.417 & 0.403 & 0.411 \\\\ \\hline \\sum & 1.000 & 1.000 & 1.000 \\\\ \\end{array}";
//Frage 82 "\\begin{array}{l|r|r|r} \\text{Kanzlerpräferenz} & \\text{Männlich} & \\text{Weiblich} & \\sum \\\\ \\hline Armin\\ Laschet & 279946 & 256054 & 536 \\\\ Olaf\\ Scholz & 859161 & 785839 & 1645 \\\\ Annalena\\ Baerbock & 352543 & 322457 & 675 \\\\ Keine(n)\\ dieser\\ Kandidierenden & 1039350 & 950650 & 1990 \\\\ \\hline \\sum & 2531000 & 2315000 & 4846 \\\\ \\end{array}";
//Frage 86
 "\\begin{array}{l|cc} \\text{Beurteilung der wirtschaftlichen Lage} & \\text{Gut} & \\text{Schlecht} \\\\ \\hline \\text{AfD-Wahl Ja} & 42 & 198 \\\\ \\text{AfD-Wahl Nein} & 1623 & 1202 \\end{array}"
//Frage 88  "\\begin{array}{l|cc} \\text{Partei} & \\text{Wirtschaft} & \\text{Umwelt} \\\\ \\hline \\text{CDU} & 5{,}900 & 6{,}050 \\\\ \\text{SPD} & 3{,}710 & 7{,}900 \\\\ \\text{FDP} & 3{,}810 & 1{,}290 \\\\ \\text{GRÜNE} & 6{,}380 & 7{,}000 \\\\ \\text{LINKE} & 4{,}700 & 7{,}530 \\\\ \\text{CSU} & 1{,}550 & 4{,}250 \\\\ \\text{AfD} & 6{,}200 & 8{,}450 \\\\ \\hline \\bar{x}_1 / \\bar{x}_2 & 5{,}141 & 4{,}547 \\\\ \\text{Var}(x_1) / \\text{Var}(x_2) & 2{,}132 & 5{,}533 \\\\ s_{x_1} / s_{x_2} & 4{,}488 & 2{,}118 \\end{array}"
//Frage 94  "\\begin{array}{l|cccccc} \\text{Partei} & \\hat{y}_i & \\bar{y} & y_i & \\hat{y}_i - \\bar{y} & y_i - \\hat{y}_i & y_i - \\bar{y} \\\\ \\hline \\text{CDU} & 6{,}096 & 0{,}563 &  & 0{,}046 &  &  \\\\ \\text{SPD} & 4{,}473 & 1{,}060 &  & 0{,}227 &  &  \\\\ \\text{FDP} & 7{,}578 & 2{,}045 &  & 0{,}048 &  &  \\\\ \\text{GRÜNE} & 4{,}547 & 0{,}986 & 2{,}997 & 3{,}983 &  &  \\\\ \\text{LINKE} & 2{,}680 & 2{,}853 & 1{,}570 & 1{,}283 &  &  \\\\ \\text{CSU} & 6{,}452 &  &  &  &  &  \\\\ \\text{AfD} & 6{,}911 & 0{,}919 & 1{,}378 & 0{,}252 & 1{,}539 & 0{,}667 & 2{,}917 \\end{array}"

//Frage 95"\\begin{array}{l|c} \\text{Partei} & e_i \\\\ \\hline \\text{CDU} & 0{,}046 \\\\ \\text{SPD} & 0{,}227 \\\\ \\text{FDP} & 0{,}048 \\\\ \\text{GRÜNE} & 2{,}997 \\\\ \\text{LINKE} & 1{,}570 \\\\ \\text{CSU} &  \\\\ \\text{AfD} & 0{,}252 \\\\ \\text{AfD (zweite Zeile?)} & 1{,}539 \\end{array}"

//Frage 97"\\begin{array}{l|ccc} \\text{Partei} & \\text{Migration (X)} & \\text{EU-Asyl (Y)} & \\text{EU-Kompetenzen (Z)} \\\\ \\hline \\text{CDU} & 6{,}000 & 4{,}778 & 6{,}286 \\\\ \\text{SPD} & 4{,}150 & 5{,}500 & 6{,}524 \\\\ \\text{FDP} & 5{,}950 & 4{,}722 & 5{,}762 \\\\ \\text{GRÜNE} & 1{,}700 & 5{,}944 & 6{,}762 \\\\ \\text{LINKE} & 2{,}700 & 5{,}067 & 4{,}714 \\\\ \\text{CSU} & 7{,}700 & 3{,}556 & 5{,}684 \\\\ \\text{AfD} & 9{,}900 & 1{,}167 & 1{,}905 \\\\ \\hline \\text{Arithmetisches Mittel} & 5{,}443 & 4{,}391 & 5{,}377 \\\\ \\text{Varianz} & 6{,}962 & 2{,}207 & 2{,}400 \\\\ \\text{Standardabweichung} & 2{,}639 & 1{,}486 & 1{,}549 \\end{array}"

//Frage 104"\\begin{array}{l|cc} \\text{Partei} & e_{iZ_X} & e_{iZ_Y} \\\\ \\hline \\text{CDU} & 1{,}581 & 0{,}392 \\\\ \\text{SPD} & 0{,}000 & 0{,}000 \\\\ \\text{FDP} & 0{,}941 & 0{,}126 \\\\ \\text{GRÜNE} & 2{,}182 & 0{,}001 \\\\ \\text{LINKE} & 3{,}490 & 0{,}366 \\\\ \\text{CSU} & 2{,}603 & 1{,}244 \\\\ \\text{AfD} & 0{,}544 & 1{,}098 \\\\ \\hline \\bar{e}_{iZ_X} / \\bar{e}_{iZ_Y} & 0{,}000 & 3{,}914 \\\\ \\text{Var}(e_{iZ_X}) / \\text{Var}(e_{iZ_Y}) & 1{,}978 & 0{,}000 \\\\ s_{e_{iZ_X}} / s_{e_{iZ_Y}} & 0{,}446 & 0{,}668 \\end{array}"

//Frage 121"\\begin{array}{l|cc} & \\text{Ost} & \\text{West} \\\\ \\hline \\bar{x} & 4{,}543 & 3{,}723 \\\\ \\hat{x} & 3{,}021 & 2{,}706 \\\\ n & 1{,}659 & 3{,}355 \\end{array}"

//Frage 141"\\begin{array}{l|cc} & \\text{Grüne} & \\text{Andere} \\\\ \\hline \\bar{x} & 6{,}517 & 5{,}353 \\\\ \\hat{x} & 2{,}344 & 2{,}654 \\\\ n & 772 & 4{,}140 \\end{array}"

//Frage 149"\\begin{array}{l|cccccc} \\text{Demokratiezufriedenheit} & \\text{Union} & \\text{SPD} & \\text{FDP} & \\text{Grüne} & \\text{Linke} & \\text{AfD} \\\\ \\hline \\text{(Sehr) zufrieden} & 438 & 183 & 38 & 456 & 275 & 67 \\\\ \\text{Teils/teils} & 177 & 141 & 70 & 403 & 174 & 49 \\\\ \\text{(Sehr) unzufrieden} & 63 & 79 & 61 & 15 & 61 & 166 \\end{array}"



*/






return (
    <FlatList
  data={exampleQuestions}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ backgroundColor: '#6b7280' }} // Tailwind-Klasse 'bg-gray-500'
  renderItem={({ item,index }) => (
    <View style={{ margin: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{index+1}. {item.question}</Text>
      {item.questionLatex ?<View style={{ backgroundColor: '#ef4444' }}> <BlockMath math={item.questionLatex} /> </View>: null}
      {item.questionUrl ? (
        <View className='bg-gray-500'>
          <Image
            source={{ uri: item.questionUrl }}
            style={{ width: '100%', height: 200, marginVertical: 10, borderRadius: 5 }}
            resizeMode="contain"
          />
        </View>
      ) : null}
      {item.answers.map((answer, answerIndex) => (
        <View key={answerIndex} style={{ 
            marginVertical: 5,
            backgroundColor: item.answerIndex.includes(answerIndex) ? '#34d399' :null, // Tailwind 'bg-green-500' or 'bg-gray-200'
             }}>
          <Text>{answer.title}</Text>
          {answer.latex ? (
            <View style={{ 
              backgroundColor: item.answerIndex.includes(answerIndex) ? '#34d399' :"gray",
               }}> {/* Tailwind 'bg-red-500' */}
              <BlockMath math={answer.latex} />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  )}
/>
  )
}

export default renderQuestions