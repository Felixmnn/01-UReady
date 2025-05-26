export function returnColor(color, moduleColor) {
  const colorMap = {
    red: "#FF4D4D",
    orange: "#FF884D",
    yellow: "#FFD700",
    emerald: "#2ECC71",
    cyan: "#17D4FC",
    blue: "#1E90FF",
    purple: "#A64DFF",
    pink: "#FF4DA6",
    green: "#4DFF4D"
  };
  if (colorMap[color]) {
    return colorMap[color];
  }
}

export function returnColorButton(color, moduleColor) {
  const colorMap = {
    red: "#FF4D4D",
    orange: "#FF884D",
    yellow: "#FFD700",
    emerald: "#2ECC71",
    cyan: "#17D4FC",
    blue: "#1E90FF",
    purple: "#A64DFF",
    pink: "#FF4DA6",
    green: "#4DFF4D"
  };
  if (colorMap[color]) {
    return colorMap[color];
  }
}

export function returnColorButtonShadow(color, moduleColor) {
  const colorMap = {
    red: "#FF4D4D",
    orange: "#FF884D",
    yellow: "#FFD700",
    emerald: "#2ECC71",
    cyan: "#17D4FC",
    blue: "#1E90FF",
    purple: "#A64DFF",
    pink: "#FF4DA6",
    green: "#4DFF4D"
  };
  if (colorMap[color]) {
    return colorMap[color];
  }
}

export function returnShadowComponents(color){

  const colorMap = {
    red: '#DC2626',
    blue: '#2563EB',
    green: '#059669',
    yellow: '#CA8A04',
    orange: '#C2410C',
    purple: '#7C3AED',
    pink: '#DB2777',
    emerald: '#059669',
    cyan: '#0891B2',
  };

  return colorMap[color] || '#1F2937'; 
};


