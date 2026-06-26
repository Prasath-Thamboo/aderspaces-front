export const PRINTER_TO_INKS: Record<string, string[]> = {
  "epson-ecotank-et-2850": ["pack-bouteilles-encre-epson-ecotank-103"],
  "hp-laserjet-pro-m404dn": ["cartouches-hp-305xl"],
  "canon-pixma-ts8350a": [],
  "brother-hl-l3220cw": [],
}

export const INK_TO_PRINTERS: Record<string, string[]> = {
  "cartouches-hp-305xl": ["hp-laserjet-pro-m404dn"],
  "pack-bouteilles-encre-epson-ecotank-103": ["epson-ecotank-et-2850"],
}

export function getCompatibleInks(printerHandle: string): string[] {
  return PRINTER_TO_INKS[printerHandle] ?? []
}

export function getCompatiblePrinters(inkHandle: string): string[] {
  return INK_TO_PRINTERS[inkHandle] ?? []
}
