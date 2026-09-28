export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Autorisation CORS pour le navigateur
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Seulement POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Méthode non autorisée"
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {
      const data = await request.json();

      const {
        idDestinataire,
        titre,
        message,
        lienUrl,
        soundFile
      } = data;

      if (!idDestinataire || !titre || !message) {
        return new Response(
          JSON.stringify({
            error: "Données de notification manquantes"
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      const payload = {
        app_id: "31639645-a285-43ec-9366-175f51dff21c",

        include_aliases: {
          external_id: [idDestinataire]
        },

        target_channel: "push",

        headings: {
          fr: titre,
          en: titre
        },

        contents: {
          fr: message,
          en: message
        }
      };

      if (lienUrl) {
        payload.url = lienUrl;
      }

      if (soundFile) {
        payload.android_sound = soundFile;
        payload.ios_sound = soundFile + ".wav";
      }

      const oneSignalResponse = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json; charset=utf-8",

            // 🔐 La clé vient de Cloudflare Secret
            "Authorization": "Basic " + env.ONESIGNAL_REST_API_KEY
          },

          body: JSON.stringify(payload)
        }
      );

      const resultText = await oneSignalResponse.text();

      return new Response(resultText, {
        status: oneSignalResponse.status,

        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: "Erreur interne du Worker"
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};