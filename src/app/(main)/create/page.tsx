'use client';

// Disable static generation for this page (uses localStorage/client-only features)
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Send,
  Image as ImageIcon,
  X,
  Clock,
  Info,
  Loader2,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { apiPost, apiGet } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { NsfwLevel, Mood, AdviceMode, ExpiryOption, Community } from '@/types';

interface CreatePostForm {
  title: string;
  content: string;
  nsfwLevel: NsfwLevel;
  mood?: Mood;
  adviceMode: AdviceMode;
  expiryOption: ExpiryOption;
  authorAlias?: string;
}

// Tag type from API
interface TagOption {
  id: string;
  slug: string;
  name: string;
  nameHindi?: string;
  namePunjabi?: string;
  description?: string;
  color?: string;
}

const moods: { id: Mood; emoji: string; label: string }[] = [
  { id: 'horny', emoji: '🔥', label: 'Horny' },
  { id: 'lonely', emoji: '😔', label: 'Lonely' },
  { id: 'guilty', emoji: '😣', label: 'Guilty' },
  { id: 'curious', emoji: '🤔', label: 'Curious' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
];

const expiryOptions: { id: ExpiryOption; label: string }[] = [
  { id: 'never', label: 'Never expires' },
  { id: '24h', label: '24 hours' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
];

export default function CreatePost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, _hasHydrated, openAuthModal } = useAuthStore();
  const isHindiLang = user?.language === 'hindi';
  const isPunjabiLang = user?.language === 'punjabi';

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<TagOption[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostForm>({
    defaultValues: {
      nsfwLevel: 'normal',
      adviceMode: 'just-sharing',
      expiryOption: 'never',
    },
  });

  const content = watch('content');

  // Redirect if not authenticated (after hydration)
  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      openAuthModal(() => {
        // After successful login, stay on create page
      });
      router.push('/');
    }
  }, [_hasHydrated, isAuthenticated, openAuthModal, router]);

  // Fetch communities and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch communities
        const commResponse = await apiGet<{ communities: Community[] }>('/communities');
        setCommunities(commResponse.communities);

        // Check if there's a preselected community from URL params
        const communityId = searchParams.get('communityId');
        if (communityId) {
          setSelectedCommunity(communityId);
        }
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      }

      try {
        // Fetch available tags
        const tagsResponse = await apiGet<{ tags: TagOption[] }>('/feed/tags');
        setAvailableTags(tagsResponse.tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        // Fallback to default tags if API fails
        setAvailableTags([
          { id: 'sexual-confession', slug: 'sexual-confession', name: 'Sexual Confession', nameHindi: 'यौन कन्फेशन', namePunjabi: 'ਜਿਨਸੀ ਇਕਰਾਰ' },
          { id: 'fantasy-kinks', slug: 'fantasy-kinks', name: 'Fantasy / Kinks', nameHindi: 'फैंटसी / किंक्स', namePunjabi: 'ਫੈਂਟਸੀ' },
          { id: 'relationship-affair', slug: 'relationship-affair', name: 'Relationship', nameHindi: 'रिश्ता / अफेयर', namePunjabi: 'ਰਿਸ਼ਤਾ' },
          { id: 'guilt-regret', slug: 'guilt-regret', name: 'Guilt / Regret', nameHindi: 'अपराध बोध / पछतावा', namePunjabi: 'ਦੋਸ਼ / ਪਛਤਾਵਾ' },
          { id: 'cheating', slug: 'cheating', name: 'Cheating', nameHindi: 'धोखा', namePunjabi: 'ਧੋਖਾ' },
          { id: 'one-night-story', slug: 'one-night-story', name: 'One Night Story', nameHindi: 'एक रात की कहानी', namePunjabi: 'ਇੱਕ ਰਾਤ ਦੀ ਕਹਾਣੀ' },
          { id: 'adult-advice', slug: 'adult-advice', name: 'Adult Advice', nameHindi: 'वयस्क सलाह', namePunjabi: 'ਬਾਲਗ ਸਲਾਹ' },
          { id: 'dark-thoughts', slug: 'dark-thoughts', name: 'Dark Thoughts', nameHindi: 'गहरे विचार', namePunjabi: 'ਹਨੇਰੇ ਵਿਚਾਰ' },
          { id: 'curiosity-question', slug: 'curiosity-question', name: 'Curiosity / Question', nameHindi: 'जिज्ञासा / सवाल', namePunjabi: 'ਉਤਸੁਕਤਾ / ਸਵਾਲ' },
        ]);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const toggleTag = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug)
        ? prev.filter((t) => t !== tagSlug)
        : prev.length < 3
        ? [...prev, tagSlug]
        : prev
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreatePostForm) => {
    if (selectedTags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      // Append each tag individually with [] notation for array parsing
      selectedTags.forEach((tag) => {
        formData.append('tags[]', tag);
      });
      formData.append('nsfwLevel', data.nsfwLevel);
      formData.append('adviceMode', data.adviceMode);
      formData.append('expiryOption', data.expiryOption);

      if (data.mood) {
        formData.append('mood', data.mood);
      }

      if (data.authorAlias) {
        formData.append('authorAlias', data.authorAlias);
      }

      if (selectedCommunity) {
        formData.append('communityId', selectedCommunity);
      }

      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await apiPost<{ post: { id: string } }>('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Confession posted!');
      // Small delay to ensure any state updates complete before navigation
      setTimeout(() => {
        router.replace(`/post/${response.post.id}`);
      }, 100);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while hydrating or checking auth
  if (!_hasHydrated) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary-400" size={40} />
      </div>
    );
  }

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isHindiLang ? 'अपनी कहानी साझा करें' : isPunjabiLang ? 'ਆਪਣੀ ਕਹਾਣੀ ਸਾਂਝੀ ਕਰੋ' : 'Share Your Confession'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Community Selection */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
            <Users size={16} />
            {isHindiLang ? 'समुदाय' : isPunjabiLang ? 'ਭਾਈਚਾਰਾ' : 'Community'} (Optional)
          </label>
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="input"
          >
            <option value="">
              {isHindiLang ? 'सामान्य (कोई समुदाय नहीं)' : isPunjabiLang ? 'ਆਮ (ਕੋਈ ਭਾਈਚਾਰਾ ਨਹੀਂ)' : 'General (No Community)'}
            </option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.icon} {community.name}
              </option>
            ))}
          </select>
          <p className="text-dark-500 text-xs mt-1">
            {isHindiLang
              ? 'अपनी पोस्ट को किसी विशेष समुदाय में डालें'
              : isPunjabiLang
              ? 'ਆਪਣੀ ਪੋਸਟ ਨੂੰ ਕਿਸੇ ਵਿਸ਼ੇਸ਼ ਭਾਈਚਾਰੇ ਵਿੱਚ ਪਾਓ'
              : 'Post to a specific community or keep it general'}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'शीर्षक' : isPunjabiLang ? 'ਸਿਰਲੇਖ' : 'Title'} *
          </label>
          <input
            type="text"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'At least 3 characters' },
              maxLength: { value: 200, message: 'Maximum 200 characters' },
            })}
            className="input"
            placeholder={
              isHindiLang
                ? 'अपने कन्फेशन को एक शीर्षक दें...'
                : isPunjabiLang
                ? 'ਆਪਣੇ ਇਕਰਾਰ ਨੂੰ ਸਿਰਲੇਖ ਦਿਓ...'
                : 'Give your confession a title...'
            }
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'आपका कन्फेशन' : isPunjabiLang ? 'ਤੁਹਾਡਾ ਇਕਰਾਰ' : 'Your Confession'} *
          </label>
          <textarea
            {...register('content', {
              required: 'Content is required',
              minLength: { value: 10, message: 'At least 10 characters' },
              maxLength: { value: 10000, message: 'Maximum 10000 characters' },
            })}
            className="input min-h-[200px] resize-y"
            placeholder={
              isHindiLang
                ? 'अपनी कहानी यहाँ लिखें...'
                : isPunjabiLang
                ? 'ਆਪਣੀ ਕਹਾਣੀ ਇੱਥੇ ਲਿਖੋ...'
                : 'Write your confession here...'
            }
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-red-400 text-sm">{errors.content.message}</p>
            )}
            <p className="text-dark-500 text-sm ml-auto">
              {content?.length || 0} / 10000
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'टैग (1-3 चुनें)' : isPunjabiLang ? 'ਟੈਗ (1-3 ਚੁਣੋ)' : 'Tags (Select 1-3)'} *
          </label>
          {tagsLoading ? (
            <div className="flex items-center gap-2 text-dark-400">
              <Loader2 className="animate-spin" size={16} />
              <span>Loading tags...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm transition-all',
                    selectedTags.includes(tag.slug)
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  )}
                >
                  {isHindiLang && tag.nameHindi ? tag.nameHindi : isPunjabiLang && tag.namePunjabi ? tag.namePunjabi : tag.name}
                </button>
              ))}
            </div>
          )}
          {selectedTags.length === 0 && !tagsLoading && (
            <p className="text-dark-500 text-sm mt-1">Select at least one tag</p>
          )}
        </div>

        {/* Images - Hidden for cleaner UI, functionality preserved */}
        <div className="hidden">
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'चित्र (वैकल्पिक)' : isPunjabiLang ? 'ਤਸਵੀਰਾਂ (ਵਿਕਲਪਿਕ)' : 'Images (Optional)'}
          </label>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-dark-900/80 p-1 rounded-full hover:bg-dark-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < 4 && (
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-dark-700 rounded-lg cursor-pointer hover:border-dark-600 transition-colors">
              <ImageIcon size={20} className="text-dark-400" />
              <span className="text-dark-400">
                {isHindiLang ? 'चित्र अपलोड करें' : isPunjabiLang ? 'ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ' : 'Upload images'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
          <p className="text-dark-500 text-xs mt-1">Max 4 images, 5MB each</p>
        </div>

        {/* NSFW Level */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            NSFW Level
          </label>
          <div className="flex gap-3">
            {(['normal', 'explicit', 'extreme'] as NsfwLevel[]).map((level) => (
              <label
                key={level}
                className={clsx(
                  'flex-1 text-center py-2 px-3 rounded-lg border cursor-pointer transition-all',
                  watch('nsfwLevel') === level
                    ? 'border-primary-500 bg-primary-600/10 text-primary-300'
                    : 'border-dark-700 hover:border-dark-600'
                )}
              >
                <input
                  type="radio"
                  value={level}
                  {...register('nsfwLevel')}
                  className="sr-only"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'आपका मूड' : isPunjabiLang ? 'ਤੁਹਾਡਾ ਮੂਡ' : 'Your Mood'} (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <label
                key={mood.id}
                title={mood.label}
                className={clsx(
                  'flex items-center justify-center gap-1 px-2 py-2 sm:px-3 rounded-lg border cursor-pointer transition-all min-w-[44px]',
                  watch('mood') === mood.id
                    ? 'border-primary-500 bg-primary-600/10'
                    : 'border-dark-700 hover:border-dark-600'
                )}
              >
                <input
                  type="radio"
                  value={mood.id}
                  {...register('mood')}
                  className="sr-only"
                />
                <span className="text-lg">{mood.emoji}</span>
                <span className="hidden sm:inline text-sm">{mood.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advice Mode */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'क्या आप सलाह चाहते हैं?' : isPunjabiLang ? 'ਕੀ ਤੁਸੀਂ ਸਲਾਹ ਚਾਹੁੰਦੇ ਹੋ?' : 'Do you want advice?'}
          </label>
          <div className="flex gap-3">
            <label
              className={clsx(
                'flex-1 py-2 px-3 rounded-lg border cursor-pointer transition-all text-center',
                watch('adviceMode') === 'just-sharing'
                  ? 'border-primary-500 bg-primary-600/10 text-primary-300'
                  : 'border-dark-700 hover:border-dark-600'
              )}
            >
              <input
                type="radio"
                value="just-sharing"
                {...register('adviceMode')}
                className="sr-only"
              />
              <span>{isHindiLang ? 'बस साझा कर रहा हूं' : isPunjabiLang ? 'ਬੱਸ ਸਾਂਝਾ ਕਰ ਰਿਹਾ ਹਾਂ' : 'Just sharing'}</span>
            </label>
            <label
              className={clsx(
                'flex-1 py-2 px-3 rounded-lg border cursor-pointer transition-all text-center',
                watch('adviceMode') === 'want-advice'
                  ? 'border-primary-500 bg-primary-600/10 text-primary-300'
                  : 'border-dark-700 hover:border-dark-600'
              )}
            >
              <input
                type="radio"
                value="want-advice"
                {...register('adviceMode')}
                className="sr-only"
              />
              <span>{isHindiLang ? 'सलाह चाहिए' : isPunjabiLang ? 'ਸਲਾਹ ਚਾਹੀਦੀ ਹੈ' : 'Want advice'}</span>
            </label>
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
            <Clock size={16} />
            {isHindiLang ? 'पोस्ट की समय सीमा' : isPunjabiLang ? 'ਪੋਸਟ ਦੀ ਮਿਆਦ' : 'Post Expiry'}
          </label>
          <select className="input" {...register('expiryOption')}>
            {expiryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alias */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            {isHindiLang ? 'इस पोस्ट के लिए उपनाम' : isPunjabiLang ? 'ਇਸ ਪੋਸਟ ਲਈ ਉਪਨਾਮ' : 'Alias for this post'} (Optional)
          </label>
          <input
            type="text"
            {...register('authorAlias')}
            placeholder={isHindiLang ? 'इस पोस्ट के लिए अलग नाम' : isPunjabiLang ? 'ਇਸ ਪੋਸਟ ਲਈ ਵੱਖਰਾ ਨਾਮ' : 'Different name for this post'}
            className="input"
            maxLength={20}
          />
          <p className="text-dark-500 text-xs mt-1 flex items-center gap-1">
            <Info size={12} />
            Leave empty to use your username
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedTags.length === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Send size={18} />
                {isHindiLang ? 'पोस्ट करें' : isPunjabiLang ? 'ਪੋਸਟ ਕਰੋ' : 'Post Confession'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
