import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/token`
    );
    const tokenData = await tokenResponse.json();

    // Call the external API to fetch client data
    const response = await fetch(
      "https://selfservice.radixpension.com/wildfly/pensionserver-web/rest/partnerservice/get-personal-details-byphone",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    // console.log(response);

    if (response.body === null) {
      return NextResponse.json({ message: "No User Found" }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
