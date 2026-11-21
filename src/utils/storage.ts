import { DEFAULT_INSTITUTE_DATA, WHATSAPP_NUMBER } from '../data/defaultData';
import { InstituteData } from '../types';

const STORAGE_KEY = 'jit_institute_data_v2';
const LEGACY_STORAGE_KEY = 'jit_institute_data_v1';

export function loadInstituteData(): InstituteData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Carry forward any custom hero photo, gallery uploads, or enquiries from v1
      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as Partial<InstituteData>;
          const migrated: InstituteData = {
            ...DEFAULT_INSTITUTE_DATA,
            heroImageUrl:
              typeof legacy.heroImageUrl === 'string' && legacy.heroImageUrl.trim()
                ? legacy.heroImageUrl
                : DEFAULT_INSTITUTE_DATA.heroImageUrl,
            gallery:
              Array.isArray(legacy.gallery) && legacy.gallery.length > 0
                ? legacy.gallery
                : DEFAULT_INSTITUTE_DATA.gallery,
            enquiries: Array.isArray(legacy.enquiries) ? legacy.enquiries : [],
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        } catch {
          return DEFAULT_INSTITUTE_DATA;
        }
      }
      return DEFAULT_INSTITUTE_DATA;
    }

    const parsed = JSON.parse(raw) as Partial<InstituteData>;
    return {
      heroImageUrl:
        typeof parsed.heroImageUrl === 'string' && parsed.heroImageUrl.trim()
          ? parsed.heroImageUrl
          : DEFAULT_INSTITUTE_DATA.heroImageUrl,
      courses: Array.isArray(parsed.courses) ? parsed.courses : DEFAULT_INSTITUTE_DATA.courses,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_INSTITUTE_DATA.gallery,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_INSTITUTE_DATA.reviews,
      notices: Array.isArray(parsed.notices) ? parsed.notices : DEFAULT_INSTITUTE_DATA.notices,
      certificates: Array.isArray(parsed.certificates)
        ? parsed.certificates
        : DEFAULT_INSTITUTE_DATA.certificates,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : DEFAULT_INSTITUTE_DATA.enquiries,
    };
  } catch {
    return DEFAULT_INSTITUTE_DATA;
  }
}

export function saveInstituteData(data: InstituteData): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function resetInstituteData(): InstituteData {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage removal errors
  }
  return DEFAULT_INSTITUTE_DATA;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Compresses an uploaded image file to a clean JPEG Data URL so it stores reliably
 * inside localStorage without exceeding typical 5MB quota limits.
 */
export function compressImageFile(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Invalid image data.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetWidth = Math.max(1, Math.round(img.width * scale));
        const targetHeight = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
