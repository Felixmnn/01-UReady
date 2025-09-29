export function returnTextSize (zoomIn: string) {
  switch (zoomIn) {
    case "ZOOM_IN_1":
        return 18;
    case "ZOOM_IN_2":
        return 20;
    case "ZOOM_IN_3":
        return 22;
    case "ZOOM_OUT_1":
        return 12;
    case "ZOOM_OUT_2":
        return 10;
    case "ZOOM_OUT_3":
        return 8;
    default:
        return 16;
  }
}

export function returnHeight (height: string) {
  switch (height) {
    case "HEIGHT_SMALL":
        return 80;
    case "HEIGHT_MEDIUM":
        return 120;
    case "HEIGHT_LARGE":
        return 160;
    default:
        return 80;
  }
}

export function extractHeightFromLatex(latexWithHeightAndZoom: string) {
  const heightOptions = ["HEIGHT_NEUTRAL", "HEIGHT_SMALL", "HEIGHT_MEDIUM", "HEIGHT_LARGE"] as const;
  for (const option of heightOptions) {
    if (latexWithHeightAndZoom.includes(option)) {
      return option;
    }
  }
  return "HEIGHT_NEUTRAL"; // Default value if no height option is found
}

export function extractZoomFromLatex(latexWithHeightAndZoom: string) {
  const zoomOptions = ["ZOOM_IN_1", "ZOOM_IN_2", "ZOOM_IN_3", "ZOOM_NEUTRAL", "ZOOM_OUT_1", "ZOOM_OUT_2", "ZOOM_OUT_3"] as const;
  for (const option of zoomOptions) {
    if (latexWithHeightAndZoom.includes(option)) {
      return option;
    }
  }
  return "ZOOM_NEUTRAL"; // Default value if no zoom option is found
}

export function getHeight (latexWithHeightAndZoom: string) {
    const height = extractHeightFromLatex(latexWithHeightAndZoom);
    return returnHeight(height);
}

export function getZoom (latexWithHeightAndZoom: string) {
    const zoom = extractZoomFromLatex(latexWithHeightAndZoom);
    return returnTextSize(zoom);
}