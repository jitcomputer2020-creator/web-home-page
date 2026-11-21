import { DEFAULT_INSTITUTE_DATA } from '../data/defaultData';
import { InstituteData } from '../types';

const STORAGE_KEY = 'jit_institute_data_v3';

export function loadInstituteData(): InstituteData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_INSTITUTE_DATA;
    }
    const parsed = JSON.parse(raw) as Partial<InstituteData>;
    return {
      hero: {
        headline: parsed.hero?.headline?.trim() || DEFAULT_INSTITUTE_DATA.hero.headline,
        subheadline: parsed.hero?.subheadline?.trim() || DEFAULT_INSTITUTE_DATA.hero.subheadline,
        heroImageUrl:
          parsed.hero?.heroImageUrl?.trim() || DEFAULT_INSTITUTE_DATA.hero.heroImageUrl,
      },
      contact: {
        phone: parsed.contact?.phone?.trim() || DEFAULT_INSTITUTE_DATA.contact.phone,
        email: parsed.contact?.email?.trim() || DEFAULT_INSTITUTE_DATA.contact.email,
        address: parsed.contact?.address?.trim() || DEFAULT_INSTITUTE_DATA.contact.address,
        timings: parsed.contact?.timings?.trim() || DEFAULT_INSTITUTE_DATA.contact.timings,
      },
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
  } catch {
    // Ignore storage removal errors
  }
  return DEFAULT_INSTITUTE_DATA;
}

export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits || '918961260151';
}

export function buildWhatsAppUrl(message: string, phone = '8961260151'): string {
  const waNumber = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

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

export function validateImportedData(rawJson: string): InstituteData | null {
  try {
    const parsed = JSON.parse(rawJson) as Partial<InstituteData>;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      hero: {
        headline: parsed.hero?.headline?.trim() || DEFAULT_INSTITUTE_DATA.hero.headline,
        subheadline: parsed.hero?.subheadline?.trim() || DEFAULT_INSTITUTE_DATA.hero.subheadline,
        heroImageUrl:
          parsed.hero?.heroImageUrl?.trim() || DEFAULT_INSTITUTE_DATA.hero.heroImageUrl,
      },
      contact: {
        phone: parsed.contact?.phone?.trim() || DEFAULT_INSTITUTE_DATA.contact.phone,
        email: parsed.contact?.email?.trim() || DEFAULT_INSTITUTE_DATA.contact.email,
        address: parsed.contact?.address?.trim() || DEFAULT_INSTITUTE_DATA.contact.address,
        timings: parsed.contact?.timings?.trim() || DEFAULT_INSTITUTE_DATA.contact.timings,
      },
      courses: Array.isArray(parsed.courses) ? parsed.courses : DEFAULT_INSTITUTE_DATA.courses,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_INSTITUTE_DATA.gallery,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_INSTITUTE_DATA.reviews,
      notices: Array.isArray(parsed.notices) ? parsed.notices : DEFAULT_INSTITUTE_DATA.notices,
      certificates: Array.isArray(parsed.certificates)
        ? parsed.certificates
        : DEFAULT_INSTITUTE_DATA.certificates,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
  } catch {
    return null;
  }
}
