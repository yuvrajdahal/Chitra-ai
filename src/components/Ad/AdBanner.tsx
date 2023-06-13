import React, { useEffect } from "react";

type AdBannerProps = {
  // Props for customizing the ad banner
};

const AdBanner: React.FC<AdBannerProps> = (props) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);
  // test
  return (
    <ins
      className="adsbygoogle adbanner-customize block h-[200px] w-[200px] bg-white"
      data-ad-client={"ca-pub-1959896930486958"}
      style={{
        display: "block",
        overflow: "hidden",
      }}
      {...props}
    />
  );
};

export default AdBanner;
