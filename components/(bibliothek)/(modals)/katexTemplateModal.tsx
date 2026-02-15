import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import KaTeXExample from "@/components/(home)/katext";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");
type Props = {
  visible: boolean;
  onClose: () => void;
};

const FORMULA_TEMPLATES = {
  Math: [

  // Grundlagen
  "\\sqrt{x}",
  "\\frac{a}{b}",
  "x^n",
  "a_n",
  "\\left( x + y \\right)^2",

  // Analysis
  "\\int_a^b f(x) \\, dx",
  "\\int f(x) \\, dx",
  "\\sum_{n=1}^{\\infty} x_n",
  "\\prod_{n=1}^{k} a_n",
  "\\lim_{x \\to 0}",
  "\\lim_{n \\to \\infty}",
  "\\frac{d}{dx} f(x)",
  "\\partial_x f",
  "\\frac{\\partial f}{\\partial x}",
  "f'(x)",
  "f''(x)",
  "\\nabla f",
  "\\int u \\; dv = uv - \\int v \\; du",
  "\\frac{d}{dx} f(g(x)) = f'(g(x))g'(x)",
  "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}",
  "\\ln(1+x) = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{x^n}{n}",

  // Gleichungen
  "ax^2 + bx + c = 0",
  "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  "\\begin{cases} x+y=1 \\\\ x-y=3 \\end{cases}",

  // Lineare Algebra
  "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  "\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}",
  "\\det(A)",
  "A^{-1}",
  "A^T",
  "\\vec{v}",
  "\\lVert v \\rVert",
  "\\langle u, v \\rangle",
  "\\|A\\|_2",
  "\\text{rank}(A)",
  "\\text{span}\{v_1,\\dots,v_k\}",

  // Geometrie
  "x^2 + y^2 = z^2",
  "A = \\pi r^2",
  "U = 2\\pi r",
  "V = \\frac{4}{3}\\pi r^3",
  "\\angle ABC",
  "\\triangle ABC",

  // Trigonometrie
  "\\sin x",
  "\\cos x",
  "\\tan x",
  "\\sin^2 x + \\cos^2 x = 1",
  "\\arcsin x",
  "\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b",
  "\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b",

  // Logarithmen & Exponential
  "\\log x",
  "\\ln x",
  "e^x",
  "a^{\\log_a x}",
  "\\log_a x = \\frac{\\ln x}{\\ln a}",

  // Wahrscheinlichkeit / Kombinatorik
  "\\binom{n}{k}",
  "n!",
  "P(A)",
  "P(A \\mid B)",
  "E(X)",
  "\\mathrm{Var}(X)",
  "\\Pr(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}",
  "\\Pr(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
  "\\Pr(X=k) = (1-p)^{k-1}p",

  // Mengenlehre
  "A \\cup B",
  "A \\cap B",
  "A \\subseteq B",
  "x \\in A",
  "\\emptyset",
  "A \\setminus B",
  "A^c",

  // Zahlmengen
  "\\mathbb{N}",
  "\\mathbb{Z}",
  "\\mathbb{Q}",
  "\\mathbb{R}",
  "\\mathbb{C}",

  // Reihen & Folgen
  "a_n",
  "\\sum_{k=0}^{n} k",
  "\\sum_{n=0}^{\\infty} r^n",
  "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
  "S_n = \\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",

  // Komplexe Zahlen
  "z = a + bi",
  "|z|",
  "\\overline{z}",
  "e^{i\\pi} + 1 = 0"

]
,
  Physics: [

  // Mechanik – Grundlagen
  "E = mc^2",
  "F = ma",
  "p = mv",
  "\\frac{1}{2}mv^2",
  "W = F s",
  "P = \\frac{W}{t}",
  "a = \\frac{\\Delta v}{\\Delta t}",

  // Bewegung & Kinematik
  "v = \\frac{s}{t}",
  "s = v_0 t + \\frac{1}{2} a t^2",
  "v^2 = v_0^2 + 2as",
  "\\omega = \\frac{2\\pi}{T}",
  "v = \\omega r",

  // Gravitation
  "F = G \\frac{m_1 m_2}{r^2}",
  "E_{pot} = mgh",

  // Impuls & Stöße
  "p = mv",
  "\\Delta p = F \\Delta t",
  "m_1 v_1 + m_2 v_2 = \\text{const}",

  // Kreisbewegung
  "F_z = \\frac{mv^2}{r}",
  "a_z = \\frac{v^2}{r}",

  // Schwingungen & Wellen
  "T = 2\\pi \\sqrt{\\frac{m}{k}}",
  "f = \\frac{1}{T}",
  "v = \\lambda f",
  "y(t) = A \\sin(\\omega t)",

  // Elektrizität – Grundlagen
  "Q = It",
  "U = RI",
  "P = UI",
  "R = \\rho \\frac{l}{A}",
  "C = \\varepsilon_0 \\frac{A}{d}",

  // Elektrische Felder
  "\\vec{F} = q \\vec{E}",
  "E = \\frac{F}{q}",
  "E = \\frac{U}{d}",

  // Kapazität
  "C = \\frac{Q}{U}",
  "E = \\frac{1}{2} C U^2",

  // Magnetismus
  "F = q v B",
  "\\Phi = B A",
  "U_{ind} = - \\frac{d\\Phi}{dt}",
  "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})",

  // Maxwell / Feldnotation (KaTeX-safe)
  "\\nabla \\cdot \\vec{E}",
  "\\nabla \\times \\vec{B}",
  "\\nabla \\cdot \\vec{B} = 0",
  "\\nabla \\times \\vec{E} = - \\frac{\\partial \\vec{B}}{\\partial t}",

  // Optik
  "\\frac{1}{f} = \\frac{1}{g} + \\frac{1}{b}",
  "n = \\frac{c}{v}",
  "\\sin(\\alpha) = \\frac{n_2}{n_1}",
  "m = \\frac{\\text{Bildhöhe}}{\\text{Gegenstandshöhe}} = \\frac{b}{g}",

  // Thermodynamik
  "pV = nRT",
  "\\Delta E = Q + W",
  "\\eta = \\frac{W}{Q}",
  "\\Delta U = Q - W",
  "c = \\frac{Q}{m\\Delta T}",

  // Quantenphysik
  "\\Delta E = h \\nu",
  "E = h f",
  "\\psi(x,t)",
  "\\lambda = \\frac{h}{p}",
  "E_n = - \\frac{13.6\\,\\text{eV}}{n^2}",

  // Relativität (zusätzlich)
  "\\gamma = \\frac{1}{\\sqrt{1-v^2/c^2}}"

],

  Chemistry: [

  // Grundlegende Reaktionsgleichungen
  "2H_2 + O_2 \\rightarrow 2H_2O",
  "C + O_2 \\rightarrow CO_2",
  "N_2 + 3H_2 \\rightarrow 2NH_3",
  "2Na + Cl_2 \\rightarrow 2NaCl",

  // Mit Zustandsangaben
  "H_2O_{(l)} \\rightarrow H_2O_{(g)}",
  "NaCl_{(s)} \\rightarrow Na^+_{(aq)} + Cl^-_{(aq)}",

  // Ionen & Ladungen
  "Na^+",
  "Cl^-",
  "Ca^{2+}",
  "SO_4^{2-}",
  "NH_4^+",
  "Fe^{3+}",

  // Säuren & Basen
  "HCl + NaOH \\rightarrow NaCl + H_2O",
  "H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O",

  // Redox (halbgleichungen)
  "Zn \\rightarrow Zn^{2+} + 2e^-",
  "Cu^{2+} + 2e^- \\rightarrow Cu",

  // Gleichgewicht
  "N_2 + 3H_2 \\rightleftharpoons 2NH_3",
  "CH_3COOH \\rightleftharpoons CH_3COO^- + H^+",

  // Organische Grundformeln
  "CH_4",
  "C_2H_6",
  "C_2H_4",
  "C_2H_2",
  "C_6H_{12}O_6",

  // Strukturähnliche Schreibweise (linear)
  "CH_3-CH_2-OH",
  "CH_3-COOH",
  "H_2N-CH_2-COOH",

  // Konzentration & Chemie-Mathe
  "c = \\frac{n}{V}",
  "n = \\frac{m}{M}",
  "pH = -\\log [H^+]",

  // Energie / Thermochemie
  "\\Delta H < 0",
  "\\Delta G = \\Delta H - T\\Delta S",

  // Reaktionsgeschwindigkeit
  "v = k \\cdot [A]^n",
  // Weitere Beispiele
  "K_{eq} = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
  "\\Delta S = \\int \\frac{\\delta Q}{T}",
  "\\Delta H = \\sum H_{Produkte} - \\sum H_{Edukte}",
  "r = -\\frac{d[A]}{dt} = k[A]^m[B]^n",
  "pK_a = -\\log K_a",
  "pOH = -\\log [OH^-]",
  "pH + pOH = 14",
],

  ComputerScience: [
    "O(n \\log n)",
    "P(A|B)",
    "\\arg\\min_x f(x)",
    "\\lambda x . x",
    "T(n) = 2T(n/2) + n",
    "H(X) = -\\sum p \\log p",
    "\\mathcal{O}(\\log n)",
    "\\Theta(n)",
    "\\Omega(n \\log n)",
    "O(2^n)",
    "O(n!)",
    "f(n) = \\\mathcal{O}(g(n))",
    "T(n) = a\\,T(n/b) + f(n)",
    "T(n) = T(n-1) + O(1)",
    "F(n) = F(n-1) + F(n-2)",
    "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}",
    "P(A,B) = P(A|B)P(B)",
    "\\mathbb{E}[X]",
    "\\operatorname{Var}(X) = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2",
    "I(X;Y) = \\sum_{x,y} p(x,y) \\log \\frac{p(x,y)}{p(x)p(y)}",
    "D_{\\mathrm{KL}}(P\\|Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}",
    "H(P,Q) = -\\sum_x P(x) \\log Q(x)",
    "H(X|Y) = -\\sum_{x,y} p(x,y) \\log p(x|y)",
    "I(X;Y) = H(X) + H(Y) - H(X,Y)",
    "\\arg\\max_x\\ f(x)",
    "(\\lambda x.\\ f(x))\\ y \\to f(y)",
    "P \\subseteq NP",
    "P \\stackrel{?}{=} NP",
    "|E| \\le \\binom{|V|}{2}"
  ],
  Tables: [

  // Basis Tabelle mit Linien
  "\\begin{array}{c|c} x & y \\\\ \\hline 1 & 2 \\\\ 2 & 4 \\end{array}",

  // Mehrspaltige Tabelle
  "\\begin{array}{ccc} a & b & c \\\\ d & e & f \\end{array}",

  // Mit Ausrichtung links / rechts / zentriert
  "\\begin{array}{lcr} links & mitte & rechts \\\\ a & b & c \\end{array}",

  // Große Tabelle
  "\\begin{array}{cccc} a & b & c & d \\\\ 1 & 2 & 3 & 4 \\\\ 5 & 6 & 7 & 8 \\end{array}",

  // Stückweise Definition (piecewise)
  "\\begin{cases} x^2 & x>0 \\\\ -x & x \\le 0 \\end{cases}",

  // Gleichungssystem
  "\\begin{cases} x + y = 3 \\\\ 2x - y = 0 \\end{cases}",

  // Augmentierte Matrix (LGS)
  "\\left[\\begin{array}{cc|c} 1 & 2 & 5 \\\\ 3 & 4 & 6 \\end{array}\\right]",

  // Standard Matrix
  "\\begin{matrix} a & b \\\\ c & d \\end{matrix}",

  // Matrix mit runden Klammern
  "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",

  // Matrix mit eckigen Klammern
  "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",

  // Determinanten-Matrix
  "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",

  // Doppelte Determinante
  "\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}",

  // Mehrzeilige Ausrichtung
  "\\begin{aligned} a+b &= c \\\\ d+e &= f \\end{aligned}",

  // Zentrierte Gleichungen untereinander
  "\\begin{gathered} a=b+c \\\\ d=e+f \\end{gathered}",

  // Block mit Text & Mathe
  "\\begin{array}{c} \\text{oben} \\\\ x^2+y^2 \\end{array}",

  // Spaltenweise Vektordarstellung
  "\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}",

  // Zeilenvektor
  "\\begin{bmatrix} x & y & z \\end{bmatrix}"
    ,

    "\\begin{array}{c|cccccccc}Sch\\ddot{u}ler & A & B & C & D & E & F & G & H \\\\ \\hline Punkte & 12 & 9 & 15 & 7 & 11 & 6 & 14 & 10\\end{array}",

    "\\begin{array}{c|c|c} \\text{Produkt} & \\text{Preis} & \\text{Menge} \\\\ \\hline Apfel & 0.5€ & 10 \\\\ Banane & 0.3€ & 20 \\\\ Orange & 0.4€ & 15 \\end{array}"
  ],

  Symbols: [
  // Vergleich & Relationen
  "=",
  "\\neq",
  "\\approx",
  "\\sim",
  "\\equiv",
  "\\leq",
  "\\geq",
  "\\ll",
  "\\gg",
  "\\propto",

  // Logik
  "\\land",
  "\\lor",
  "\\neg",
  "\\Rightarrow",
  "\\Leftarrow",
  "\\Leftrightarrow",
  "\\implies",
  "\\iff",

  // Mengen & Zugehörigkeit
  "\\in",
  "\\notin",
  "\\subset",
  "\\subseteq",
  "\\supset",
  "\\cup",
  "\\cap",
  "\\setminus",
  "\\emptyset",

  // Standardpfeile
  "\\to",
  "\\leftarrow",
  "\\rightarrow",
  "\\leftrightarrow",
  "\\mapsto",
  "\\longrightarrow",
  "\\Longrightarrow",

  // Vektoren & Richtungen
  "\\uparrow",
  "\\downarrow",
  "\\Updownarrow",
  "\\Rightarrow",
  "\\Leftarrow",

  // Operator-Symbole
  "\\pm",
  "\\mp",
  "\\times",
  "\\div",
  "\\cdot",
  "\\ast",
  "\\star",

  // Spezialzeichen
  "\\infty",
  "\\partial",
  "\\nabla",
  "\\angle",
  "\\triangle"
]
} as const;

type Category = keyof typeof FORMULA_TEMPLATES;

export default function KatexTemplateModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const categories = useMemo<Category[]>(
    () => Object.keys(FORMULA_TEMPLATES) as Category[],
    []
  );
  const [active, setActive] = useState<Category>(categories[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const copyFormula = async (latex: string) => {
    await Clipboard.setStringAsync(latex);
    setCopied(latex);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Overlay */}
      <View className="flex-1 justify-end bg-black/70">
        {/* Sheet */}
        <View
          style={{ height: height * 0.85 }}
          className="bg-zinc-900 rounded-t-3xl pt-5"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text className="text-xl font-bold text-zinc-100">
              {t("katexTemplate.title")}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700"
            >
              <Text className="text-zinc-300 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View
          className="flex-row flex-wrap mx-4"
          >
            {categories.map((cat) => {
              const activeTab = active === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActive(cat)}
                  className={`px-4 h-[24px] mb-2 items-center justify-center rounded-full mr-2 border ${
                    activeTab
                      ? "bg-blue-600 border-blue-500"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      activeTab ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {t(`katexTemplate.categories.${cat}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Formula List */}
          <FlatList
            data={FORMULA_TEMPLATES[active]}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            initialNumToRender={8}
            windowSize={7}
            maxToRenderPerBatch={8}
            removeClippedSubviews
            renderItem={({ item: latex }) => {
              const isCopied = copied === latex;

              return (
                <TouchableOpacity
                  onPress={() => copyFormula(latex)}
                  activeOpacity={0.85}
                  className={`rounded-2xl p-4 mb-3 border ${
                    isCopied
                      ? "bg-green-900 border-green-700"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <View className="mb-2">
                    <KaTeXExample formula={latex} fontSize={25} />
                  </View>

                  <Text className="text-xs text-zinc-500 font-mono">
                    {latex}
                  </Text>

                  {isCopied && (
                    <Text className="text-green-400 font-bold text-xs mt-1">
                      {t("katexTemplate.copied")} ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />

        </View>
      </View>
    </Modal>
  );
}
