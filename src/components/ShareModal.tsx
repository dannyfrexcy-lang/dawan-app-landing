import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  creatorName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, videoId, creatorName }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}?video=${videoId}`;

  const shareOptions = [
    {
      id: 'copy',
      name: 'Copy Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '𝕏',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=Check out this video from ${creatorName} on Dhawan&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'f',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Check out this video from ${creatorName} on Dhawan: ${shareUrl}`)}`,
          '_blank'
        );
      },
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Video from ${creatorName}`)}`,
          '_blank'
        );
      },
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🤖',
      action: () => {
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Video from ${creatorName}`)}`,
          '_blank'
        );
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share This Video
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-input rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Share Options Grid */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-input hover:bg-border transition-colors group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{option.icon}</div>
              <span className="text-xs font-medium text-foreground text-center">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Link Copy Section */}
        <div className="px-6 pb-6 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground mb-2">Direct Link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-input text-foreground text-sm px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
