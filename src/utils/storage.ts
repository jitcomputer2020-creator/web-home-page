import { DEFAULT_INSTITUTE_DATA } from '../data/defaultData';
import { InstituteData } from '../types';

const STORAGE_KEY = 'jit_institute_data_v4';

export function loadInstituteData(): InstituteData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_INSTITUTE_DATA;
    }
    const parsed = JSON.parse(raw) as Partial<InstituteData>;
    return normalizeData(parsed);
  } catch {
    return DEFAULT_INSTITUTE_DATA;
  }
}

export function normalizeData(parsed: Partial<InstituteData>): InstituteData {
  return {
    branding: {
      customLogoUrl: parsed.branding?.customLogoUrl ?? DEFAULT_INSTITUTE_DATA.branding.customLogoUrl,
      instituteName:
        parsed.branding?.instituteName?.trim() || DEFAULT_INSTITUTE_DATA.branding.instituteName,
      instituteSubtitle:
        parsed.branding?.instituteSubtitle?.trim() ||
        DEFAULT_INSTITUTE_DATA.branding.instituteSubtitle,
    },
    hero: {
      headline: parsed.hero?.headline?.trim() || DEFAULT_INSTITUTE_DATA.hero.headline,
      subheadline: parsed.hero?.subheadline?.trim() || DEFAULT_INSTITUTE_DATA.hero.subheadline,
      primaryCtaText:
        parsed.hero?.primaryCtaText?.trim() || DEFAULT_INSTITUTE_DATA.hero.primaryCtaText,
      secondaryCtaText:
        parsed.hero?.secondaryCtaText?.trim() || DEFAULT_INSTITUTE_DATA.hero.secondaryCtaText,
      trustItems:
        Array.isArray(parsed.hero?.trustItems) && parsed.hero.trustItems.length > 0
          ? parsed.hero.trustItems
          : DEFAULT_INSTITUTE_DATA.hero.trustItems,
      mediaType: parsed.hero?.mediaType === 'video' ? 'video' : 'image',
      heroImageUrl: parsed.hero?.heroImageUrl?.trim() || DEFAULT_INSTITUTE_DATA.hero.heroImageUrl,
      heroVideoUrl: parsed.hero?.heroVideoUrl?.trim() || DEFAULT_INSTITUTE_DATA.hero.heroVideoUrl,
      mediaCaption: parsed.hero?.mediaCaption?.trim() || DEFAULT_INSTITUTE_DATA.hero.mediaCaption,
    },
    features: Array.isArray(parsed.features) ? parsed.features : DEFAULT_INSTITUTE_DATA.features,
    contact: {
      phone: parsed.contact?.phone?.trim() || DEFAULT_INSTITUTE_DATA.contact.phone,
      whatsappNumber:
        parsed.contact?.whatsappNumber?.trim() ||
        parsed.contact?.phone?.trim() ||
        DEFAULT_INSTITUTE_DATA.contact.whatsappNumber,
      email: parsed.contact?.email?.trim() || DEFAULT_INSTITUTE_DATA.contact.email,
      address: parsed.contact?.address?.trim() || DEFAULT_INSTITUTE_DATA.contact.address,
      timings: parsed.contact?.timings?.trim() || DEFAULT_INSTITUTE_DATA.contact.timings,
      facebookUrl: parsed.contact?.facebookUrl?.trim() || DEFAULT_INSTITUTE_DATA.contact.facebookUrl,
      instagramUrl:
        parsed.contact?.instagramUrl?.trim() || DEFAULT_INSTITUTE_DATA.contact.instagramUrl,
      youtubeUrl: parsed.contact?.youtubeUrl?.trim() || DEFAULT_INSTITUTE_DATA.contact.youtubeUrl,
    },
    courses: Array.isArray(parsed.courses) ? parsed.courses : DEFAULT_INSTITUTE_DATA.courses,
    gallery: Array.isArray(parsed.gallery)
      ? parsed.gallery.map((g) => ({
          id: g.id,
          mediaType: g.mediaType === 'video' ? 'video' : 'image',
          mediaUrl: g.mediaUrl || '',
          caption: g.caption || '',
          category: g.category || 'Classroom',
          addedAt: g.addedAt || new Date().toISOString().slice(0, 10),
        }))
      : DEFAULT_INSTITUTE_DATA.gallery,
    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_INSTITUTE_DATA.reviews,
    notices: Array.isArray(parsed.notices) ? parsed.notices : DEFAULT_INSTITUTE_DATA.notices,
    customSections: Array.isArray(parsed.customSections)
      ? parsed.customSections
      : DEFAULT_INSTITUTE_DATA.customSections,
    certificates: Array.isArray(parsed.certificates)
      ? parsed.certificates
      : DEFAULT_INSTITUTE_DATA.certificates,
    enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : DEFAULT_INSTITUTE_DATA.enquiries,
  };
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

export function buildStructuredInquiryMessage(params: {
  name: string;
  phone: string;
  course: string;
  message?: string;
}): string {
  const note = params.message?.trim() || 'Please share course fees and batch timings.';
  return [
    'Hello JIT Computer Training Institute, I would like to inquire/apply:',
    `- Name: ${params.name}`,
    `- Phone: ${params.phone}`,
    `- Course: ${params.course}`,
    `- Message: ${note}`,
  ].join('\n');
}

/**
 * Extracts YouTube video ID from watch, youtu.be, shorts, or embed URLs.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function getYouTubeThumbnailUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
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

export function readVideoFileAsDataUrl(file: File, maxBytes = 3 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(
        new Error(
          'Video file exceeds 3 MB browser storage limit. Use a YouTube link or direct MP4 URL instead.'
        )
      );
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the video file.'));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Invalid video file data.'));
      }
    };
    reader.readAsDataURL(file);
  });
}

export function validateImportedData(rawJson: string): InstituteData | null {
  try {
    const parsed = JSON.parse(rawJson) as Partial<InstituteData>;
    if (!parsed || typeof parsed !== 'object') return null;
    return normalizeData(parsed);
  } catch {
    return null;
  }
}
