'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Camera,
  Instagram,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  Users,
  Award,
  MapPin,
  Star,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import type {
  TeamMember,
  TeamMemberBadge,
  TeamMemberSocialLink,
  TeamGridSectionContent,
  CTAButton,
} from '@/types/inline-editor';

// ============================================================================
// Constants
// ============================================================================

const SOCIAL_PLATFORMS: { value: TeamMemberSocialLink['platform']; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
];

const BADGE_CATEGORIES: { value: TeamMemberBadge['category']; label: string }[] = [
  { value: 'venue', label: 'Venue' },
  { value: 'performance', label: 'Performance' },
  { value: 'certification', label: 'Certification' },
  { value: 'specialty', label: 'Specialty' },
];

function getSocialIcon(platform: string) {
  switch (platform) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'linkedin': return <Linkedin className="w-4 h-4" />;
    case 'twitter': return <Twitter className="w-4 h-4" />;
    case 'website': return <Globe className="w-4 h-4" />;
    default: return <ExternalLink className="w-4 h-4" />;
  }
}

function getBadgeCategoryIcon(category: string) {
  switch (category) {
    case 'venue': return <MapPin className="w-3 h-3" />;
    case 'performance': return <Star className="w-3 h-3" />;
    case 'certification': return <BadgeCheck className="w-3 h-3" />;
    case 'specialty': return <Sparkles className="w-3 h-3" />;
    default: return <Award className="w-3 h-3" />;
  }
}

// ============================================================================
// Types
// ============================================================================

interface EditableTeamGridProps {
  contentKeyPrefix: string;
  heading?: string;
  subheading?: string;
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  showRecruitmentCTA?: boolean;
  recruitmentHeading?: string;
  recruitmentDescription?: string;
  recruitmentButton?: CTAButton;
}

// ============================================================================
// Team Member Card (View Mode - Baseball Card with Flip)
// ============================================================================

function TeamMemberCard({
  member,
  isFlipped,
  isLocked,
  onFlip,
  onLock,
  onUnlock,
  onUnflip,
}: {
  member: TeamMember;
  isFlipped: boolean;
  isLocked: boolean;
  onFlip: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onUnflip: () => void;
}) {
  const handleClick = useCallback(() => {
    if (isLocked) {
      onUnlock();
    } else if (isFlipped) {
      onLock();
    } else {
      onFlip();
      onLock();
    }
  }, [isFlipped, isLocked, onFlip, onLock, onUnlock]);

  const handleMouseEnter = useCallback(() => {
    if (!isLocked) onFlip();
  }, [isLocked, onFlip]);

  const handleMouseLeave = useCallback(() => {
    if (!isLocked) onUnflip();
  }, [isLocked, onUnflip]);

  return (
    <div
      className={`group/card relative cursor-pointer ${isFlipped ? 'z-10' : 'z-0'}`}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Container - 3:4 aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* FRONT FACE */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden border border-white/10"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent z-10" />

            {/* Photo */}
            {member.photo?.src ? (
              <img
                src={member.photo.src}
                alt={member.photo.alt || member.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: `center ${member.photo.positionY ?? 20}%` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
                <Users className="w-16 h-16 text-[#333]" />
              </div>
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Name, Role, Specialties */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="text-lg font-display font-bold text-white leading-tight">
                {member.name}
              </h3>
              <p className="text-sm text-[#C9A227] font-medium mt-0.5">
                {member.role}
              </p>
              {member.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {member.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/10 text-white/80 backdrop-blur-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Click hint */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-white/60 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
              Click to keep open
            </div>
          </div>

          {/* BACK FACE */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden border border-[#C9A227]/30 bg-[#0D0D0D]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent z-10" />

            <div className="absolute inset-0 p-5 flex flex-col overflow-y-auto">
              {/* Name header */}
              <div className="mb-3">
                <h3 className="text-base font-display font-bold text-white">
                  {member.name}
                </h3>
                <p className="text-xs text-[#C9A227] font-medium">{member.role}</p>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-shrink-0">
                {member.bio}
              </p>

              {/* Badges */}
              {member.badges.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {member.badges.map((badge) => (
                      <span
                        key={badge.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-full bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30"
                      >
                        {getBadgeCategoryIcon(badge.category)}
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Social Links */}
              {member.socialLinks.length > 0 && (
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  {member.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors"
                      title={link.label || link.platform}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hover glow */}
      <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_20px_rgba(201,162,39,0.15)]" />
    </div>
  );
}

// ============================================================================
// Recruitment CTA Card
// ============================================================================

function RecruitmentCard({
  heading,
  description,
  button,
}: {
  heading?: string;
  description?: string;
  button?: CTAButton;
}) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
      <div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#C9A227]/40 bg-[#C9A227]/5 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-3 rounded-full bg-[#C9A227]/10 mb-4">
          <Plus className="w-8 h-8 text-[#C9A227]" />
        </div>
        <h3 className="text-lg font-display font-bold text-white mb-2">
          {heading || 'Join Our Team'}
        </h3>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          {description || 'We\'re always looking for talented media professionals.'}
        </p>
        {button && (
          <a
            href={button.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] text-black font-semibold text-sm rounded-lg hover:bg-[#D4AF37] transition-colors"
          >
            {button.text}
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Team Member Editor Modal
// ============================================================================

interface TeamMemberEditorProps {
  member: TeamMember;
  onSave: (updated: TeamMember) => void;
  onClose: () => void;
}

function TeamMemberEditor({ member, onSave, onClose }: TeamMemberEditorProps) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [bio, setBio] = useState(member.bio);
  const [photoSrc, setPhotoSrc] = useState(member.photo?.src || '');
  const [specialties, setSpecialties] = useState<string[]>(member.specialties);
  const [badges, setBadges] = useState<TeamMemberBadge[]>(member.badges);
  const [socialLinks, setSocialLinks] = useState<TeamMemberSocialLink[]>(member.socialLinks);
  const [profilePageHref, setProfilePageHref] = useState(member.profilePageHref || '');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Specialty input
  const [newSpecialty, setNewSpecialty] = useState('');
  // Badge inputs
  const [newBadgeLabel, setNewBadgeLabel] = useState('');
  const [newBadgeCategory, setNewBadgeCategory] = useState<TeamMemberBadge['category']>('specialty');
  // Social link inputs
  const [newLinkPlatform, setNewLinkPlatform] = useState<TeamMemberSocialLink['platform']>('instagram');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleSave = useCallback(() => {
    const updated: TeamMember = {
      ...member,
      name,
      role,
      bio,
      photo: photoSrc ? { src: photoSrc, alt: name } : undefined,
      specialties,
      badges,
      socialLinks,
      profilePageHref: profilePageHref || undefined,
    };
    onSave(updated);
  }, [member, name, role, bio, photoSrc, specialties, badges, socialLinks, profilePageHref, onSave]);

  const handleMediaSelect = useCallback((results: MediaPickerResult[]) => {
    if (results.length > 0) {
      setPhotoSrc(results[0].publicUrl);
    }
    setShowMediaPicker(false);
  }, []);

  const addSpecialty = useCallback(() => {
    const trimmed = newSpecialty.trim();
    if (trimmed && specialties.length < 5 && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setNewSpecialty('');
    }
  }, [newSpecialty, specialties]);

  const removeSpecialty = useCallback((index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  }, [specialties]);

  const addBadge = useCallback(() => {
    const trimmed = newBadgeLabel.trim();
    if (trimmed) {
      const newBadge: TeamMemberBadge = {
        id: `badge-${Date.now()}`,
        label: trimmed,
        category: newBadgeCategory,
      };
      setBadges([...badges, newBadge]);
      setNewBadgeLabel('');
    }
  }, [newBadgeLabel, newBadgeCategory, badges]);

  const removeBadge = useCallback((id: string) => {
    setBadges(badges.filter((b) => b.id !== id));
  }, [badges]);

  const addSocialLink = useCallback(() => {
    const trimmed = newLinkUrl.trim();
    if (trimmed) {
      setSocialLinks([...socialLinks, { platform: newLinkPlatform, url: trimmed }]);
      setNewLinkUrl('');
    }
  }, [newLinkUrl, newLinkPlatform, socialLinks]);

  const removeSocialLink = useCallback((index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  }, [socialLinks]);

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-white">
              Edit Team Member
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Photo */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Photo</label>
              {photoSrc ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-[#333]">
                    <img src={photoSrc} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowMediaPicker(true)}
                      className="px-3 py-1.5 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => setPhotoSrc('')}
                      className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:border-[#C9A227] transition-colors text-sm"
                >
                  <Camera className="w-4 h-4" />
                  Choose Photo
                </button>
              )}
              <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                options={{ allowedTypes: ['image'] }}
              />
            </div>

            {/* Name + Role row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Name <span className="text-gray-600">({name.length}/60)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 60))}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  placeholder="Full name..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Role <span className="text-gray-600">({role.length}/80)</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value.slice(0, 80))}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  placeholder="Role or title..."
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Bio <span className="text-gray-600">({bio.length}/500)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                rows={3}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
                placeholder="Brief bio..."
              />
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Specialties <span className="text-gray-600">({specialties.length}/5)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded-full"
                  >
                    {spec}
                    <button onClick={() => removeSpecialty(i)} className="hover:text-red-400 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {specialties.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                    placeholder="Add specialty..."
                  />
                  <button
                    onClick={addSpecialty}
                    className="px-3 py-1.5 bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Badges */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Badges</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded-full"
                  >
                    {getBadgeCategoryIcon(badge.category)}
                    {badge.label}
                    <button onClick={() => removeBadge(badge.id)} className="hover:text-red-400 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newBadgeCategory}
                  onChange={(e) => setNewBadgeCategory(e.target.value as TeamMemberBadge['category'])}
                  className="px-2 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A227]"
                >
                  {BADGE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newBadgeLabel}
                  onChange={(e) => setNewBadgeLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                  className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  placeholder="Badge label..."
                />
                <button
                  onClick={addBadge}
                  className="px-3 py-1.5 bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Social Links</label>
              <div className="space-y-1.5 mb-2">
                {socialLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-sm">
                    <span className="text-gray-400">{getSocialIcon(link.platform)}</span>
                    <span className="text-white flex-1 truncate">{link.url}</span>
                    <button onClick={() => removeSocialLink(i)} className="text-gray-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newLinkPlatform}
                  onChange={(e) => setNewLinkPlatform(e.target.value as TeamMemberSocialLink['platform'])}
                  className="px-2 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A227]"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                  className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  placeholder="https://..."
                />
                <button
                  onClick={addSocialLink}
                  className="px-3 py-1.5 bg-[#2A2A2A] text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Profile Page Href */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profile Page URL (optional)</label>
              <input
                type="text"
                value={profilePageHref}
                onChange={(e) => setProfilePageHref(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors text-sm"
                placeholder="/team/member-name"
              />
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-3 border-t border-[#333] pt-4 mt-5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#D4AF37] transition-colors"
            >
              Save Member
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

// ============================================================================
// Edit Mode Card Overlay
// ============================================================================

function EditModeCardOverlay({
  member,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  member: TeamMember;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
      <div className="absolute inset-0 rounded-xl border border-[#333] bg-[#111] overflow-hidden group/edit-card">
        {/* Photo preview */}
        {member.photo?.src ? (
          <img
            src={member.photo.src}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ objectPosition: `center ${member.photo.positionY ?? 20}%` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-12 h-12 text-[#333]" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/50" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <p className="text-sm font-semibold text-white truncate">{member.name}</p>
          <p className="text-xs text-gray-400 truncate">{member.role}</p>
        </div>

        {/* Edit overlay on hover */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/edit-card:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
          <button
            onClick={onEdit}
            className="p-2 bg-[#C9A227] text-black rounded-lg hover:bg-[#D4AF37] transition-colors"
            title="Edit member"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {index > 0 && (
            <button
              onClick={onMoveUp}
              className="p-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#333] transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {index < total - 1 && (
            <button
              onClick={onMoveDown}
              className="p-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#333] transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 bg-red-900/80 text-white rounded-lg hover:bg-red-800 transition-colors"
            title="Delete member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Column Count Selector
// ============================================================================

function ColumnSelector({
  columns,
  onChange,
}: {
  columns: 2 | 3 | 4;
  onChange: (c: 2 | 3 | 4) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">Columns:</span>
      {([2, 3, 4] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            columns === c
              ? 'bg-[#C9A227] text-black'
              : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function EditableTeamGrid({
  contentKeyPrefix,
  heading,
  subheading,
  members,
  columns = 3,
  showRecruitmentCTA,
  recruitmentHeading,
  recruitmentDescription,
  recruitmentButton,
}: EditableTeamGridProps) {
  const { isEditMode, canEdit } = useEditMode();
  const { updateSection } = useContent();
  const sectionId = contentKeyPrefix.split(':')[1];

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);

  const updateMembers = useCallback(
    (newMembers: TeamMember[]) => {
      updateSection(sectionId, { members: newMembers } as Partial<TeamGridSectionContent>);
    },
    [sectionId, updateSection]
  );

  const handleSaveMember = useCallback(
    (updated: TeamMember) => {
      const newMembers = members.map((m) => (m.id === updated.id ? updated : m));
      updateMembers(newMembers);
      setEditingMember(null);
    },
    [members, updateMembers]
  );

  const handleDeleteMember = useCallback(
    (id: string) => {
      updateMembers(members.filter((m) => m.id !== id));
    },
    [members, updateMembers]
  );

  const handleAddMember = useCallback(() => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: 'New Member',
      role: 'Role',
      bio: 'Add a bio for this team member.',
      specialties: [],
      badges: [],
      socialLinks: [],
      order: members.length,
    };
    updateMembers([...members, newMember]);
    setEditingMember(newMember);
  }, [members, updateMembers]);

  const handleMoveMember = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newMembers = [...members];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= newMembers.length) return;
      [newMembers[index], newMembers[swapIndex]] = [newMembers[swapIndex], newMembers[index]];
      // Update order fields
      newMembers.forEach((m, i) => (m.order = i));
      updateMembers(newMembers);
    },
    [members, updateMembers]
  );

  const handleColumnsChange = useCallback(
    (c: 2 | 3 | 4) => {
      updateSection(sectionId, { columns: c } as Partial<TeamGridSectionContent>);
    },
    [sectionId, updateSection]
  );

  const handleToggleRecruitment = useCallback(() => {
    updateSection(sectionId, {
      showRecruitmentCTA: !showRecruitmentCTA,
      recruitmentHeading: recruitmentHeading || 'Join Our Team',
      recruitmentDescription: recruitmentDescription || 'We\'re always looking for talented media professionals to join our certified operator network.',
      recruitmentButton: recruitmentButton || { text: 'Apply Now', href: '/contact', variant: 'primary' as const },
    } as Partial<TeamGridSectionContent>);
  }, [sectionId, updateSection, showRecruitmentCTA, recruitmentHeading, recruitmentDescription, recruitmentButton]);

  // Grid columns CSS
  const gridColClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  // ---- Edit Mode ----
  if (canEdit && isEditMode) {
    return (
      <div>
        {/* Section label badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-full">
            Team Grid
          </span>
          <ColumnSelector columns={columns} onChange={handleColumnsChange} />
        </div>

        {/* Heading */}
        <EditableText
          contentKey={`${contentKeyPrefix}:heading`}
          as="h2"
          className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
        >
          {heading || 'Our Team'}
        </EditableText>

        {/* Subheading */}
        <EditableText
          contentKey={`${contentKeyPrefix}:subheading`}
          as="p"
          className="text-lg text-gray-400 mb-6 max-w-2xl"
        >
          {subheading || ''}
        </EditableText>

        {/* Members grid */}
        <div className={`grid ${gridColClass} gap-4`}>
          {members.map((member, index) => (
            <EditModeCardOverlay
              key={member.id}
              member={member}
              index={index}
              total={members.length}
              onEdit={() => setEditingMember(member)}
              onDelete={() => handleDeleteMember(member.id)}
              onMoveUp={() => handleMoveMember(index, 'up')}
              onMoveDown={() => handleMoveMember(index, 'down')}
            />
          ))}

          {/* Add Member button */}
          <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
            <button
              onClick={handleAddMember}
              className="absolute inset-0 rounded-xl border-2 border-dashed border-[#333] hover:border-[#C9A227] bg-[#0A0A0A] hover:bg-[#C9A227]/5 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-500" />
              <span className="text-sm text-gray-500">Add Member</span>
            </button>
          </div>
        </div>

        {/* Recruitment CTA toggle */}
        <div className="mt-6 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!showRecruitmentCTA}
              onChange={handleToggleRecruitment}
              className="accent-[#C9A227] w-4 h-4"
            />
            <span className="text-sm text-gray-400">Show Recruitment CTA Card</span>
          </label>
        </div>

        {showRecruitmentCTA && (
          <div className="mt-3 p-4 bg-[#111] border border-[#333] rounded-lg space-y-3">
            <EditableText
              contentKey={`${contentKeyPrefix}:recruitmentHeading`}
              as="h3"
              className="text-lg font-display font-bold text-white"
            >
              {recruitmentHeading || 'Join Our Team'}
            </EditableText>
            <EditableText
              contentKey={`${contentKeyPrefix}:recruitmentDescription`}
              as="p"
              className="text-sm text-gray-400"
            >
              {recruitmentDescription || ''}
            </EditableText>
          </div>
        )}

        {/* Editor modal */}
        {editingMember && (
          <TeamMemberEditor
            member={editingMember}
            onSave={handleSaveMember}
            onClose={() => setEditingMember(null)}
          />
        )}
      </div>
    );
  }

  // ---- View Mode ----
  return (
    <div>
      {/* Heading */}
      {heading && (
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Team Grid */}
      <div className={`grid ${gridColClass} gap-6`}>
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            isFlipped={flippedId === member.id}
            isLocked={lockedId === member.id}
            onFlip={() => setFlippedId(member.id)}
            onUnflip={() => { if (flippedId === member.id) setFlippedId(null); }}
            onLock={() => { setLockedId(member.id); setFlippedId(member.id); }}
            onUnlock={() => { setLockedId(null); setFlippedId(null); }}
          />
        ))}

        {/* Recruitment CTA Card */}
        {showRecruitmentCTA && (
          <RecruitmentCard
            heading={recruitmentHeading}
            description={recruitmentDescription}
            button={recruitmentButton}
          />
        )}
      </div>
    </div>
  );
}
