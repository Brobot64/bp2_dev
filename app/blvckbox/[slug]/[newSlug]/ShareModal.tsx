import React, { useState } from 'react';
import styles from './ShareModal.module.css';
import { TwitterShareButton, LinkedinShareButton, TwitterIcon, LinkedinIcon } from 'react-share';
import { AiOutlineCopy } from 'react-icons/ai';
import Notification from '../../../../components/notification/page';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title: string;
  desc: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title, desc }) => {
  const [showNotification, setShowNotification] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${url}`;

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowNotification(true);
      });
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {showNotification && (
        <Notification message="Link copied to clipboard!" onClose={handleCloseNotification} />
      )}
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">×</button>
          <h2>Share this post</h2>
          <div className={styles.shareButtons}>
            <TwitterShareButton url={shareUrl} title={title} className={styles.shareButton}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title} summary={desc} className={styles.shareButton}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
          <button className={styles.copyButton} onClick={handleCopyLink}>
            <AiOutlineCopy size={24} /> Copy Link
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
