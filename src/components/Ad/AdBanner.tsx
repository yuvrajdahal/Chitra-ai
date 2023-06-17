import React, { useEffect, useState } from "react";

type AdBannerProps = {
  // Props for customizing the ad banner
};

const AdBanner: React.FC<AdBannerProps> = (props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      if (mounted) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (!mounted) {
    return null; // return this null to avoid hydration errors
  }
  return (
    <ins
      data-ad-slot="3200526485"
      data-full-width-responsive="true"
      className="adsbygoogle adbanner-customize adsbygoogle block bg-white"
      {...props}
    />
  );
};

export default AdBanner;
