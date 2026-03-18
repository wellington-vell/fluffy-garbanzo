export const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const adjustBrightness = (hex: string, percent: number) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.max(0, g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.max(0, b + (255 - b) * (percent / 100)));

    return rgbToHex(r, g, b);
};

export function addAlphaColor(colorHex: string, value: number): string {
    const hex = colorHex.replace('#', '');
    var rgb = hex.substring(0, 6);
    var alpha = value.toString(16).padStart(2, '0');

    return '#' + rgb + alpha;
}