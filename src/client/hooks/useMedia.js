import { useEffect, useState } from 'react';

import * as media from '../utils/media';

const useMedia = () => {
  const [isDesktopUp, setIsDesktopUp] = useState(media.isDesktopUp());
  const [isTabletLandscapeUp, setIsTabletLandscapeUp] = useState(media.isTabletLandscapeUp());
  const [isDesktopLargeUp, setIsDesktopLargeUp] = useState(media.isDesktopLargeUp());
  const [isDesktopBigUp, setIsDesktopBigUp] = useState(media.isDesktopBigUp());

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopUp(media.isDesktopUp());
      setIsTabletLandscapeUp(media.isTabletLandscapeUp());
      setIsDesktopLargeUp(media.isDesktopLargeUp());
      setIsDesktopBigUp(media.isDesktopBigUp());
    };

    // For resizing header
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener(handleResize);
    };
  }, []);

  return { isDesktopUp, isTabletLandscapeUp, isDesktopLargeUp, isDesktopBigUp };
};

export default useMedia;
