import React, { useEffect } from "react";

type AdBannerProps = {
  // Props for customizing the ad banner
};

const AdBanner: React.FC<AdBannerProps> = (props) => {
  useEffect(() => {
    try {
      if (window) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  // test
  return (
    <ins
      data-ad-client="ca-pub-1959896930486958"
      data-ad-slot="3200526485"
      data-full-width-responsive="true"
      className="adsbygoogle adbanner-customize adsbygoogle block bg-white"
      {...props}
    />
  );
};

export default AdBanner;
