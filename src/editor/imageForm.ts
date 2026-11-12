import { DEFAULT_ICON_VALUE, ICON_VALUES } from '../const';
import { HaFormData } from './haTypes';
import { localize } from '../localize/localize';

/*
 * Indicator image selection shared by the indicator settings and its dynamic style:
 * a type select (built-in shapes, an mdi icon or an image URL) with an icon picker or URL field for the last two.
 * Form fields: indicator (the type), indicator_icon and indicator_url.
 */

export const IMAGE_TYPE_MDI = 'mdi';
export const IMAGE_TYPE_URL = 'url';
const IMAGE_TYPES = [...ICON_VALUES, IMAGE_TYPE_MDI, IMAGE_TYPE_URL];

// Type of a stored image; chosenType keeps a picked type while its icon/URL field is still empty
export function imageType(image: string | undefined, chosenType?: string): string {
  if (!image) return chosenType || DEFAULT_ICON_VALUE;
  if (image.startsWith('mdi:')) return IMAGE_TYPE_MDI;
  if ((ICON_VALUES as readonly string[]).includes(image)) return image;
  return IMAGE_TYPE_URL;
}

export function imageSchema(type: string) {
  return [
    { name: 'indicator', required: true, selector: { select: { mode: 'dropdown', options: IMAGE_TYPES.map((value) => ({ label: localize(`editor.sensor_config.indicator_types.${value}`), value })) } } },
    ...(type === IMAGE_TYPE_MDI ? [{ name: 'indicator_icon', selector: { icon: {} } }] : []),
    ...(type === IMAGE_TYPE_URL ? [{ name: 'indicator_url', selector: { text: { type: 'url' } } }] : []),
  ];
}

export function imageData(image: string | undefined, type: string): HaFormData {
  return {
    indicator: type,
    indicator_icon: type === IMAGE_TYPE_MDI ? image || '' : '',
    indicator_url: type === IMAGE_TYPE_URL ? image || '' : '',
  };
}

// The image from the form values; undefined while the icon/URL of the chosen type is empty
export function imageFromData(data: HaFormData): string | undefined {
  const byType: Record<string, string | undefined> = { [IMAGE_TYPE_MDI]: data.indicator_icon, [IMAGE_TYPE_URL]: data.indicator_url };
  return (data.indicator in byType ? byType[data.indicator] : data.indicator) || undefined;
}
