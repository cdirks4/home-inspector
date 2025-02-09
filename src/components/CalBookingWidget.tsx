"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalBookingWidgetProps {
  calLink: string;
}

export function CalBookingWidget({ calLink }: CalBookingWidgetProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
        namespace: "guest-booking",
        config: {
          hideBranding: true,
          disableAuthorization: true,
          enableEmailInput: true,
          bookerUrl: "/book-inspection",
          uiType: "inline",
        }
      });
    })();
  }, []);

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100vh", minHeight: "600px" }}
      config={{
        hideEventTypeDetails: false,
        layout: "month_view",
        disableAuthorization: true,
        uiType: "inline",
        bookerUrl: "/book-inspection",
        name: "Guest",
        email: "",
      }}
    />
  );
}
