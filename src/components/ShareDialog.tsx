import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  treeId: string;
  treeName: string;
}

const ShareDialog = ({ open, onClose, treeId, treeName }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/tree/${treeId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Посмотри мое дерево навыков: ${treeName}`;
    let url = '';

    switch (platform) {
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'vk':
        url = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поделиться деревом навыков</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button size="sm" onClick={handleCopy}>
              <Icon name={copied ? 'Check' : 'Copy'} size={16} />
            </Button>
          </div>

          {copied && (
            <p className="text-sm text-green-600 text-center">Ссылка скопирована!</p>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Поделиться в соцсетях:</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleShare('telegram')}
              >
                <Icon name="Send" size={18} className="mr-2" />
                Telegram
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleShare('vk')}
              >
                <Icon name="Share2" size={18} className="mr-2" />
                VK
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleShare('whatsapp')}
              >
                <Icon name="MessageCircle" size={18} className="mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
