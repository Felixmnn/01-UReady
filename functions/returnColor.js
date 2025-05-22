export function returnColor(color, moduleColor) {
  let lowerCaseColor = color ? color.toLowerCase() : moduleColor?.toLowerCase();
  
  if (lowerCaseColor === "red") {
    return "#FF4D4D";
  } else if (lowerCaseColor === "orange") {
    return "#FF884D";
  } else if (lowerCaseColor === "yellow") {
    return "#FFD700";
  } else if (lowerCaseColor === "emerald") {
    return "#2ECC71";
  } else if (lowerCaseColor === "cyan") {
    return "#17D4FC";
  } else if (lowerCaseColor === "blue") {
    return "#1E90FF";
  } else if (lowerCaseColor === "purple") {
    return "#A64DFF";
  } else if (lowerCaseColor === "pink") {
    return "#FF4DA6";
  } else if (lowerCaseColor === "green") {
    return "#4DFF4D";
  }
}

export function returnColorButton(color, moduleColor) {
  let lowerCaseColor = color ? color.toLowerCase() : moduleColor.toLowerCase();
  
  if (lowerCaseColor === "red") {
    return "#FF4D4D";
  } else if (lowerCaseColor === "orange") {
    return "#FF884D";
  } else if (lowerCaseColor === "yellow") {
    return "#FFD700";
  } else if (lowerCaseColor === "emerald") {
    return "#2ECC71";
  } else if (lowerCaseColor === "cyan") {
    return "#17D4FC";
  } else if (lowerCaseColor === "blue") {
    return "#1E90FF";
  } else if (lowerCaseColor === "purple") {
    return "#A64DFF";
  } else if (lowerCaseColor === "pink") {
    return "#FF4DA6";
  } else if (lowerCaseColor === "green") {
    return "#4DFF4D";
  }
}

export function returnColorButtonShadow(color, moduleColor) {

  let lowerCaseColor = color ? color.toLowerCase() : moduleColor.toLowerCase();
  
  if (lowerCaseColor === "red") {
    return "#800000";
  } else if (lowerCaseColor === "orange") {
    return "#803300";
  } else if (lowerCaseColor === "yellow") {
    return "#806600";
  } else if (lowerCaseColor === "emerald") {
    return "#006644";
  } else if (lowerCaseColor === "cyan") {
    return "#006666";
  } else if (lowerCaseColor === "blue") {
    return "#0056B3";
  } else if (lowerCaseColor === "purple") {
    return "#400080";
  } else if (lowerCaseColor === "pink") {
    return "#800040";
  } else if (lowerCaseColor === "green") {
    return "#004D00";
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


