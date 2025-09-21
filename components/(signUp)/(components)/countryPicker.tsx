import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Ionicons } from "@expo/vector-icons";

// Beispiel-Länderliste (ISO-3166)
const COUNTRY_LIST = [
    { id: "1", name: "Deutschland", code: "DE" },
    { id: "2", name: "Österreich", code: "AT" },
    { id: "3", name: "Schweiz", code: "CH" },
    { id: "4", name: "USA", code: "US" },
    { id: "5", name: "Indien", code: "IN" },
    { id: "6", name: "Frankreich", code: "FR" },
    { id: "7", name: "Spanien", code: "ES" },
    { id: "8", name: "Italien", code: "IT" },
    { id: "9", name: "Kanada", code: "CA" },
    { id: "10", name: "Australien", code: "AU" },
    { id: "11", name: "Vereinigtes Königreich", code: "GB" },
    { id: "12", name: "Niederlande", code: "NL" },
    { id: "13", name: "Belgien", code: "BE" },
    { id: "14", name: "Schweden", code: "SE" },
    { id: "15", name: "Norwegen", code: "NO" },
    { id: "16", name: "Dänemark", code: "DK" },
    { id: "17", name: "Finnland", code: "FI" },
    { id: "18", name: "Irland", code: "IE" },
    { id: "19", name: "Portugal", code: "PT" },
    { id: "20", name: "Neuseeland", code: "NZ" },
    { id: "21", name: "Brasilien", code: "BR" },
    { id: "22", name: "Mexiko", code: "MX" },
    { id: "23", name: "Argentinien", code: "AR" },
    { id: "24", name: "Südafrika", code: "ZA" },
    { id: "25", name: "Japan", code: "JP" },
    { id: "26", name: "Südkorea", code: "KR" },
    { id: "27", name: "China", code: "CN" },
    { id: "28", name: "Russland", code: "RU" },
    { id: "29", name: "Türkei", code: "TR" },
    { id: "30", name: "Polen", code: "PL" },
    { id: "31", name: "Griechenland", code: "GR" },
    { id: "32", name: "Tschechien", code: "CZ" },
    { id: "33", name: "Ungarn", code: "HU" },
    { id: "34", name: "Rumänien", code: "RO" },
    { id: "35", name: "Bulgarien", code: "BG" },
    { id: "36", name: "Kroatien", code: "HR" },
    { id: "37", name: "Serbien", code: "RS" },
    { id: "38", name: "Slowakei", code: "SK" },
    { id: "39", name: "Slowenien", code: "SI" },
    { id: "40", name: "Litauen", code: "LT" },
    { id: "41", name: "Lettland", code: "LV" },
    { id: "42", name: "Estland", code: "EE" },
    { id: "43", name: "Zypern", code: "CY" },
    { id: "44", name: "Malta", code: "MT" },
    { id: "45", name: "Island", code: "IS" },
    { id: "46", name: "Luxemburg", code: "LU" },
    { id: "47", name: "Monaco", code: "MC" },
    { id: "48", name: "Andorra", code: "AD" },
    { id: "49", name: "Liechtenstein", code: "LI" },
    { id: "50", name: "San Marino", code: "SM" },
    { id: "51", name: "Vereinigte Arabische Emirate", code: "AE" },
    { id: "52", name: "Saudi-Arabien", code: "SA" },
    { id: "53", name: "China", code: "CN" },
    { id: "54", name: "Indonesien", code: "ID" },
    { id: "55", name: "Philippinen", code: "PH" },
    { id: "56", name: "Thailand", code: "TH" },
    { id: "57", name: "Vietnam", code: "VN" },
    { id: "58", name: "Malaysia", code: "MY" },
    { id: "59", name: "Singapur", code: "SG" },
    { id: "60", name: "Neuseeland", code: "NZ" },
    { id: "61", name: "Ägypten", code: "EG" },
    { id: "62", name: "Marokko", code: "MA" },
    { id: "63", name: "Nigeria", code: "NG" },
    { id: "64", name: "Kenya", code: "KE" },
    { id: "65", name: "Ghana", code: "GH" },
    { id: "66", name: "Tansania", code: "TZ" },
    { id: "67", name: "Uganda", code: "UG" },
    { id: "68", name: "Algerien", code: "DZ" },
    { id: "69", name: "Tunesien", code: "TN" },
    { id: "70", name: "Libyen", code: "LY" },
    { id: "71", name: "Sudan", code: "SD" },
    { id: "72", name: "Ethiopien", code: "ET" },
    { id: "73", name: "Kamerun", code: "CM" },
    { id: "74", name: "Elfenbeinküste", code: "CI" },
    { id: "75", name: "Senegal", code: "SN" },
    { id: "76", name: "Madagaskar", code: "MG" },
    { id: "77", name: "Kuba", code: "CU" },
    { id: "78", name: "Dominikanische Republik", code: "DO" },
    { id: "79", name: "Puerto Rico", code: "PR" },
    { id: "80", name: "Jamaika", code: "JM" },
    { id: "81", name: "Haiti", code: "HT" },
    { id: "82", name: "Costa Rica", code: "CR" },
    { id: "83", name: "Panama", code: "PA" },
    { id: "84", name: "Guatemala", code: "GT" },
    { id: "85", name: "Honduras", code: "HN" },
    { id: "86", name: "El Salvador", code: "SV" },
    { id: "87", name: "Nicaragua", code: "NI" },
    { id: "88", name: "Bolivien", code: "BO" },
    { id: "89", name: "Paraguay", code: "PY" },
    { id: "90", name: "Uruguay", code: "UY" },
    { id: "91", name: "Chile", code: "CL" },
    { id: "92", name: "Kolumbien", code: "CO" },
    { id: "93", name: "Peru", code: "PE" },
    { id: "94", name: "Venezuela", code: "VE" },
    { id: "95", name: "Ecuador", code: "EC" },
    { id: "96", name: "Bolivien", code: "BO" },
    { id: "97", name: "Katar", code: "QA" },
    { id: "98", name: "Kuwait", code: "KW" },
    { id: "99", name: "Bahrain", code: "BH" },  
    { id: "100", name: "Oman", code: "OM" },
    { id: "101", name: "Jordanien", code: "JO" },
    { id: "102", name: "Libanon", code: "LB" },
    { id: "103", name: "Syrien", code: "SY" },
    { id: "104", name: "Irak", code: "IQ" },
    { id: "105", name: "Iran", code: "IR" },
    { id: "106", name: "Afghanistan", code: "AF" },
    { id: "107", name: "Pakistan", code: "PK" },
    { id: "108", name: "Bangladesch", code: "BD" },
    { id: "109", name: "Sri Lanka", code: "LK" },
    { id: "110", name: "Nepal", code: "NP" },
    { id: "111", name: "Mongolei", code: "MN" },
    { id: "112", name: "Nordkorea", code: "KP" },
    { id: "113", name: "Myanmar", code: "MM" },
    { id: "114", name: "Kambodscha", code: "KH" },
    { id: "115", name: "Laos", code: "LA" },
    { id: "116", name: "Brunei", code: "BN" },
    { id: "117", name: "Malediven", code: "MV" },
    { id: "118", name: "Bhutan", code: "BT" },
    { id: "119", name: "Seychellen", code: "SC" },
    { id: "120", name: "Mauritius", code: "MU" },
    { id: "121", name: "Fidschi", code: "FJ" },
    { id: "122", name: "Tonga", code: "TO" },
    { id: "123", name: "Samoa", code: "WS" },
    { id: "124", name: "Vanuatu", code: "VU" },
    { id: "125", name: "Papua-Neuguinea", code: "PG" },
    { id: "126", name: "Salomonen", code: "SB" },
    { id: "127", name: "Kiribati", code: "KI" },
    { id: "128", name: "Tuvalu", code: "TV" },
    { id: "129", name: "Nauru", code: "NR" },
    { id: "130", name: "Marshallinseln", code: "MH" },
    { id: "131", name: "Palau", code: "PW" },
    { id: "132", name: "Mikronesien", code: "FM" },
    { id: "133", name: "Antigua und Barbuda", code: "AG" },
    { id: "134", name: "Bahamas", code: "BS" },
    { id: "135", name: "Barbados", code: "BB" },
    { id: "136", name: "Dominica", code: "DM" },
    { id: "137", name: "Grenada", code: "GD" },
    { id: "138", name: "St. Kitts und Nevis", code: "KN" },
    { id: "139", name: "St. Lucia", code: "LC" },
    { id: "140", name: "St. Vincent und die Grenadinen", code: "VC" },
    { id: "141", name: "Trinidad und Tobago", code: "TT" },
    { id: "142", name: "Suriname", code: "SR" },
    { id: "143", name: "Guyana", code: "GY" },
    { id: "144", name: "Französisch-Guayana", code: "GF" },
    { id: "145", name: "Aruba", code: "AW" },
    { id: "146", name: "Curaçao", code: "CW" },
    { id: "147", name: "Bonaire", code: "BQ" },
    { id: "148", name: "Sint Maarten", code: "SX" },
    { id: "149", name: "Saba", code: "BQ" },
];

const FAVORITE_COUNTRIES = ["DE", "US", "CH"];

const CountryPicker = ({ onSelect }) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_LIST[0]);
  const [searchText, setSearchText] = useState("");

  const favoriteCountries = COUNTRY_LIST.filter(c => FAVORITE_COUNTRIES.includes(c.code));
  const otherCountries = COUNTRY_LIST.filter(c => !FAVORITE_COUNTRIES.includes(c.code));

  const filteredCountries = [...favoriteCountries, ...otherCountries].filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsActive(false);
    onSelect && onSelect(country);
  };

  return (
    <View className="relative z-10"
        style={{
            width: 208,
        }}
    >
      <TouchableOpacity
        onPress={() => setIsActive(!isActive)}
        className="flex-row bg-gray-900 border-gray-800 border rounded-lg py-2 px-3 items-center justify-between"
      >
        <View className="flex-row items-center">
            <CountryFlag isoCode={selectedCountry.code} size={18} style={{ width: 30, height: 18 }} />
            <Text className="text-gray-300 font-semibold text-center mx-2 mt-[1px] mt-1">
            {selectedCountry.name}
            </Text>
        </View>
        <Ionicons
          name={!isActive ? "caret-down" : "caret-up"}
          size={20}
          color="#4B5563"
        />
      </TouchableOpacity>

      {isActive && (
        <View className=" left-0 w-52 max-h-72 bg-gray-900 border-gray-800 border rounded-lg p-2 shadow-lg z-20"
        style={{
            maxHeight: 150
        }}
        
        >
          <TextInput
            placeholder="Land suchen..."
            value={searchText}
            onChangeText={setSearchText}
            className="bg-gray-800 text-gray-200 rounded p-2 mb-2"
            placeholderTextColor="#9CA3AF"
          />

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="flex-row items-center p-2 rounded-lg my-1 hover:bg-gray-700"
              >
                <CountryFlag isoCode={item.code} size={18} style={{ width: 30, height: 18 }} />
                <Text className="text-gray-300 font-semibold ml-2 mt-[1px]">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default CountryPicker;
